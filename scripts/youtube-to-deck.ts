/**
 * Script to fetch a YouTube transcript and automatically generate slides using Gemini.
 * Generates imagery and parses video visually using yt-dlp unless --transcript-only is passed.
 * 
 * Usage: 
 * pnpm tsx scripts/youtube-to-deck.ts <YOUTUBE_URL_OR_ID> [DECK_SLUG] [NUM_SLIDES] [--transcript-only]
 */

import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenAI } from '@google/genai';
import { logAiUsage } from '../src/lib/ai-telemetry';
import { DEFAULT_MODEL, IMAGE_MODEL } from '../src/lib/gemini';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import { config } from 'dotenv';
import path from 'path';

// Load local environment variables for API keys
config({ path: '.env.local' });

const API = "http://localhost:4000/api/decks/slides";

function extractVideoId(urlOrId: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = urlOrId.match(regExp);
  return (match && match[2].length === 11) ? match[2] : urlOrId;
}

async function fetchAllSlides(deck: string) {
  const res = await fetch(`${API}?deck=${deck}`);
  if (!res.ok) throw new Error("Failed to fetch slides: " + await res.text());
  return await res.json();
}

async function upsertSlide(deck: string, slide_order: number, frontmatter: any, mdx_content: string) {
  const payload = {
    deck_slug: deck,
    slide_order,
    frontmatter,
    mdx_content
  };
  const res = await fetch(API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to upsert slide: ${await res.text()}`);
  return await res.json();
}

async function generateAndUploadImage(imgPrompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const finalPrompt = `${imgPrompt}. Aspect ratio 16:9. Realistic standard.`;
  
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: finalPrompt,
      config: {
        responseModalities: ["IMAGE"]
      }
    });

    const partsArray = response.candidates?.[0]?.content?.parts || [];
    const imagePart = partsArray.find((p: any) => p.inlineData);
    if (!imagePart) throw new Error("No image data returned from generator.");

    const buffer = Buffer.from(imagePart.inlineData!.data!, "base64");
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const fileName = `generated/yt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
    const { error } = await supabase.storage.from("deck-assets").upload(fileName, buffer, { contentType: "image/png" });
    if (error) throw new Error("Supabase Storage Error: " + error.message);
    
    const { data: { publicUrl } } = supabase.storage.from("deck-assets").getPublicUrl(fileName);
    return publicUrl;
  } catch (err: any) {
    throw new Error("Image gen failed: " + err.message);
  }
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const args = rawArgs.filter(a => !a.startsWith('--'));
  const flags = rawArgs.filter(a => a.startsWith('--'));
  
  if (args.length < 1) {
    console.error("Usage: pnpm tsx scripts/youtube-to-deck.ts <YOUTUBE_URL_OR_ID> [DECK_SLUG] [NUM_SLIDES] [--transcript-only] [--enable-image-gen]");
    process.exit(1);
  }

  const transcriptOnly = flags.includes('--transcript-only');
  const enableImageGen = flags.includes('--enable-image-gen');
  const videoInput = args[0];
  const targetDeck = args[1] || "priyoshop-exec";
  const numSlides = args[2] ? parseInt(args[2], 10) : null;
  const videoId = extractVideoId(videoInput);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is not set in .env.local");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let uploadedImages: any[] = [];

  if (!transcriptOnly) {
    console.log(`[1] Downloading video using yt-dlp... (may take a minute)`);
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    
    const videoPath = path.join(tempDir, `${videoId}.mp4`);
    
    // Only download if not somehow already cached
    if (!fs.existsSync(videoPath)) {
      try {
        execSync(`yt-dlp -f "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/mp4" -o "${videoPath}" "https://www.youtube.com/watch?v=${videoId}"`, { stdio: 'inherit' });
      } catch (err) {
        console.error("Failed to download video with yt-dlp. Make sure yt-dlp is installed.");
        process.exit(1);
      }
    }
    
    console.log(`[1.5] Extracting 1 frame per 60 seconds using ffmpeg...`);
    const framesDir = path.join(tempDir, `${videoId}_frames`);
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir);
      try {
        execSync(`ffmpeg -i "${videoPath}" -vf "fps=1/60" -q:v 2 "${framesDir}/frame_%03d.jpg"`, { stdio: 'inherit' });
      } catch (err) {
        console.error("Failed to extract frames with ffmpeg.");
        process.exit(1);
      }
    }

    console.log(`[2] Uploading extracted frames to Google AI...`);
    const frameFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).sort();
    
    const uploadPromises = frameFiles.map(async f => {
      const uploadObj = await ai.files.upload({ file: path.join(framesDir, f), config: { mimeType: "image/jpeg" } });
      return uploadObj;
    });
    
    uploadedImages = await Promise.all(uploadPromises);
    console.log(`Uploaded ${uploadedImages.length} frames.`);
  }

  console.log(`[3] Fetching transcript for video ID: ${videoId}...`);
  let transcriptText = "";
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    transcriptText = transcript.map((item) => item.text).join(' ');
    console.log(`✅ Fetched transcript (${transcriptText.split(' ').length} words)`);
  } catch (error) {
    console.error("Failed to fetch transcript. Continuing relying purely on video if provided.");
  }

  console.log(`[4] Sending content to Gemini to generate slides (with image tools)...`);
  
  const slideCountDirective = numSlides ? `Format exactly ${numSlides} slides based on these concepts.` : `Provide as many slides as necessary to fully cover the material (e.g., 8-15 slides for longer dense transcripts).`;

  const promptText = `
You are an expert presentation designer and frontend engineer.
Thoroughly analyze the provided video transcript (and the video visual content if available) to extract ALL major actionable concepts and tips.
Convert these comprehensively into a series of presentation slides.
${slideCountDirective}

CRITICAL FRONTEND AESTHETICS GUIDELINES:
- Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.
- Commit to a BOLD aesthetic direction for EACH slide (vary it!).
- Motion: Use animation and stagger effects via Tailwind (e.g., animate-fade-up, transition-all, delay-100).
- Spatial Composition: Use unexpected layouts, asymmetry, overlaying absolute elements, diagonal flow.
- Backgrounds & Details: Create atmosphere via gradients (bg-gradient-to-tr) and dynamic shadows.
- DO NOT use generic predictable layouts unless heavily styled.
- Available custom components if needed: <Card accent="purple|blue|green|amber|red"><CardTitle>Title</CardTitle><CardText>Description</CardText></Card>, <Stat>, <MetricRow>, <Tag>.
- Ensure valid JSX syntax. 
\${enableImageGen ? "- You MUST use standard HTML <img> tags with URLs returned by your 'generate_image' tool wherever visual reinforcement is powerful. Ensure the <img> is integrated seamlessly in your frontend-design." : ""}

Respond ONLY with a valid JSON array of objects representing the slides. Do not wrap it in markdown code fences if possible, or if you do, ensure it can be safely and easily parsed.
Format:
[
  {
    "title": "Slide Title",
    "variant": "dark",
    "sectionLabel": "Sec X: Video Summary",
    "mdx": "<div className=\\"h-full relative overflow-hidden bg-gradient-to-br from-indigo-900 to-black p-8\\">...bold maximalist code \${enableImageGen ? "with <img src=\\"GEN_URL\\"/>" : ""}...</div>"
  }
]

TRANSCRIPT:
${transcriptText}
`;

  let parts: any[] = [{ text: promptText }];
  if (uploadedImages.length > 0) {
    uploadedImages.forEach(img => {
      parts.push({
        fileData: { mimeType: "image/jpeg", fileUri: img.uri }
      });
    });
  }

  let messages: any[] = [{ role: "user", parts }];

  const tools: any = enableImageGen ? [{
    functionDeclarations: [{
      name: "generate_image",
      description: "Generate a custom photographic or detailed image to use inside the slide. Returns the public URL. Use this tool any time a gorgeous visual is demanded.",
      parameters: { type: "OBJECT", properties: { prompt: { type: "STRING" } }, required: ["prompt"] }
    }]
  }] : undefined;

  let isDone = false;
  let finalResponse = "";
  
  while (!isDone) {
    const reqPayload: any = {
      model: DEFAULT_MODEL,
      contents: messages
    };
    if (tools) reqPayload.config = { tools };

    const response = await ai.models.generateContent(reqPayload);

    if (response.usageMetadata) {
      await logAiUsage({
        endpoint: "youtube-to-deck",
        model: DEFAULT_MODEL,
        promptTokens: response.usageMetadata.promptTokenCount,
        completionTokens: response.usageMetadata.candidatesTokenCount,
        totalTokens: response.usageMetadata.totalTokenCount,
        deckSlug: targetDeck
      });
    }

    if (response.functionCalls && response.functionCalls.length > 0) {
      const toolResults = [];
      const toolCallParts = response.functionCalls.map(c => ({ functionCall: c }));
      messages.push({ role: "model", parts: toolCallParts });

      for (const call of response.functionCalls) {
        if (call.name === "generate_image") {
          const promptArg = call.args ? (call.args.prompt as string) : "";
          console.log(`✨ Gemini asked to generate an image: "${promptArg}"...`);
          try {
            const url = await generateAndUploadImage(promptArg);
            console.log(`✅ Image ready: ${url}`);
            
            await logAiUsage({
              endpoint: "generate_image_tool",
              model: IMAGE_MODEL,
              imagesGenerated: 1,
              deckSlug: targetDeck
            });

            toolResults.push({ functionResponse: { name: call.name, response: { url } } });
          } catch (e: any) {
             console.error(`❌ Image generation failed: ${e.message}`);
             toolResults.push({ functionResponse: { name: call.name, response: { error: e.message } } });
          }
        }
      }
      messages.push({ role: "user", parts: toolResults });
    } else {
      isDone = true;
      finalResponse = response.text || "";
    }
  }

  let generatedSlides: any[] = [];
  try {
    const jsonStr = finalResponse.replace(/^\\s*\`\`\`json\\s*/i, '').replace(/\\s*\`\`\`\\s*$/i, '').replace(/\`\`\`/g, '').trim();
    generatedSlides = JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON directly. Using regex fallback.");
    const match = finalResponse.match(/\\[\\s*\\{[\\s\\S]*?\\}\\s*\\]/);
    if (match) {
      try {
        generatedSlides = JSON.parse(match[0]);
      } catch(err) { throw new Error("Unparseable output from model. Output was: " + finalResponse); }
    } else {
        console.error(finalResponse);
        throw new Error("No JSON array found in output");
    }
  }

  console.log(`✅ Generated ${generatedSlides.length} slides.`);

  console.log(`[5] Fetching existing slides in deck '${targetDeck}' to determine order offset...`);
  let currentSlidesData = await fetchAllSlides(targetDeck);
  let existingSlides = currentSlidesData.slides || currentSlidesData;
  const maxOrder = existingSlides.reduce((max: number, s: any) => Math.max(max, s.slide_order || 0), 0);
  
  console.log(`[6] Inserting new slides at the end of the deck...`);
  let orderOffset = maxOrder + 10;
  
  for (const s of generatedSlides) {
    console.log(`   -> Creating slide: "${s.title}"`);
    const fm = { title: s.title, variant: s.variant || "dark", sectionLabel: s.sectionLabel || "Video Summary" };
    await upsertSlide(targetDeck, orderOffset++, fm, s.mdx);
  }

  console.log("🎉 Successfully completed!");
}

main().catch(console.error);
