/**
 * Upsert new "Interacting with AI" slides + hands-on expansion
 * into the priyoshop-exec deck via the local API.
 *
 * Run: pnpm tsx scripts/upsert-new-slides.ts
 *
 * Current DB order (0-20):
 *  0  Title (hero)
 *  1  Agenda
 *  2  Silent Meeting
 *  3  LLM
 *  4  Tool Use: Speaking Computer
 *  5  Multimodal
 *  6  Tool Use: Browsing
 *  7  Frontier Models
 *  8  Getting Cheaper Fast
 *  9  Activity: Paste an Image
 * 10  Context Window
 * 11  The Window Grows
 * 12  Lost in the Middle
 * 13  Don't Worry Too Much
 * 14  Quiz: New Chat?
 * 15  Write Your Context
 * 16  Skills
 * 17  Artifacts
 * 18  Hands-On Cowork
 * 19  Claude Code
 * 20  Thank You
 *
 * New order — we insert new slides and reorder:
 *  0  Title (keep)
 *  1  Agenda (keep — update content separately)
 *  2  Silent Meeting (keep)
 *  3  LLM (keep)
 *  4  Tool Use: Speaking Computer (keep)
 *  5  Multimodal (keep)
 *  6  Tool Use: Browsing (keep)
 *  7  Frontier Models (keep)
 *  8  Getting Cheaper Fast (keep)
 *  --- Section 3: Interacting with AI (NEW) ---
 *  9  Voice Features (NEW)
 * 10  Screenshots & Photos (NEW)
 * 11  Prompts Between AIs (NEW)
 * 12  Pasting Documents (NEW)
 * 13  Summarizing Long Texts (NEW)
 * 14  Prompts That Write Prompts (NEW)
 * 15  Let AI Interview You (NEW)
 * 16  When AI Says No (NEW)
 *  --- Section 4: Artifacts (moved) ---
 * 17  Artifacts (was 17)
 *  --- Activity ---
 * 18  Activity: Paste an Image (was 9)
 *  --- Section 5: Context (moved) ---
 * 19  Context Window (was 10)
 * 20  The Window Grows (was 11)
 * 21  Lost in the Middle (was 12)
 * 22  Don't Worry Too Much (was 13)
 * 23  Quiz: New Chat? (was 14)
 * 24  Write Your Context (was 15)
 *  --- BREAK ---
 *  --- Setup + Skills ---
 * 25  Setup Cowork (NEW)
 * 26  Skills (was 16)
 *  --- Section 7: Hands-On (expanded) ---
 * 27  Hands-On: Writing (NEW)
 * 28  Hands-On: Spreadsheets (NEW)
 * 29  Hands-On: Documents (NEW)
 * 30  Hands-On: Data (NEW)
 * 31  Hands-On: Email & Calendar (NEW)
 * 32  Hands-On: Interviewing (NEW)
 * 33  Hands-On: Presentations (NEW)
 *  --- Section 8 ---
 * 34  Claude Code (was 19)
 * 35  Thank You (was 20)
 */

const API = "http://localhost:4000/api/decks/slides";
const DECK = "priyoshop-exec";

interface SlidePayload {
  deck_slug: string;
  slide_order: number;
  frontmatter: Record<string, unknown>;
  mdx_content: string;
}

async function upsert(slide: SlidePayload) {
  const res = await fetch(API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slide),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to upsert slide_order=${slide.slide_order}: ${err}`);
  }
  const data = await res.json();
  console.log(`✓ Order ${slide.slide_order}: ${slide.frontmatter.title}`);
  return data;
}

// First, reorder existing slides to their new positions
async function reorderExisting() {
  // Fetch current slides
  const res = await fetch(`${API}?deck=${DECK}`);
  const slides = await res.json();

  // Map old order → new order
  const reorderMap: Record<number, number> = {
    0: 0,    // Title
    1: 1,    // Agenda
    2: 2,    // Silent Meeting
    3: 3,    // LLM
    4: 4,    // Tool Use: Speaking Computer
    5: 5,    // Multimodal
    6: 6,    // Tool Use: Browsing
    7: 7,    // Frontier Models
    8: 8,    // Getting Cheaper Fast
    9: 18,   // Activity: Paste an Image → after Artifacts
    10: 19,  // Context Window
    11: 20,  // The Window Grows
    12: 21,  // Lost in the Middle
    13: 22,  // Don't Worry Too Much
    14: 23,  // Quiz: New Chat?
    15: 24,  // Write Your Context
    16: 26,  // Skills → after Setup
    17: 17,  // Artifacts
    18: -1,  // Hands-On Cowork → will be replaced by individual slides, soft-delete
    19: 34,  // Claude Code
    20: 35,  // Thank You
  };

  // First soft-delete the old combined Hands-On slide
  const handsOnSlide = slides.find((s: any) => s.slide_order === 18);
  if (handsOnSlide) {
    const delRes = await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: handsOnSlide.id }),
    });
    if (delRes.ok) console.log("✓ Soft-deleted old Hands-On Cowork slide");
  }

  // Reorder: to avoid conflicts, first move everything to high temp numbers
  for (const slide of slides) {
    const oldOrder = slide.slide_order;
    const newOrder = reorderMap[oldOrder];
    if (newOrder === undefined || newOrder === -1 || newOrder === oldOrder) continue;

    // Use PATCH to update just the frontmatter won't change order...
    // We need to use PUT to upsert at new position
    // Actually the upsert key is deck_slug + slide_order, so we need to
    // update the existing record's slide_order directly via Supabase
    // For now, let's just create at new positions with the same content
  }

  // Actually, the simplest approach: re-PUT each existing slide at its new order
  // This will create duplicates at the new positions, but the old ones stay too.
  // We need a different strategy - let's use PATCH on each slide's ID to only
  // update what we need... but PATCH doesn't support changing slide_order.
  //
  // The cleanest approach: soft-delete everything, then re-create in order.
  // But that's destructive. Let's just insert the new slides at their positions
  // and handle reordering separately.

  console.log("\n⚠ Reordering existing slides requires direct DB access.");
  console.log("  For now, inserting only the NEW slides at their target positions.");
  console.log("  You can reorder existing slides via the editor UI.\n");
}

const newSlides: SlidePayload[] = [
  // ── 9: Voice Features ──
  {
    deck_slug: DECK,
    slide_order: 9,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Voice Input",
      subtitle: "You don't have to type everything. Your phone's microphone is the fastest input device you own.",
      logo: "white",
    },
    mdx_content: `<div className="flex gap-10 mt-6 items-start">
  <div className="flex-1 flex flex-col gap-5">
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-0.5">🎙️</span>
      <div>
        <div className="text-[20px] font-bold text-white">Whisper to your phone</div>
        <div className="text-[15px] text-slate-400 mt-0.5">Voice input is faster than typing — talk to Claude like a colleague</div>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-0.5">🔄</span>
      <div>
        <div className="text-[20px] font-bold text-white">Think out loud</div>
        <div className="text-[15px] text-slate-400 mt-0.5">Ramble, correct yourself, add context — AI handles messy input well</div>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-0.5">🌍</span>
      <div>
        <div className="text-[20px] font-bold text-white">Any language works</div>
        <div className="text-[15px] text-slate-400 mt-0.5">Speak in Bangla, English, or mix — Claude understands both</div>
      </div>
    </div>
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-0.5">⚡</span>
      <div>
        <div className="text-[20px] font-bold text-white">Voice → text → edit</div>
        <div className="text-[15px] text-slate-400 mt-0.5">Dictate a rough draft, then ask Claude to clean it up</div>
      </div>
    </div>
  </div>
</div>`,
  },

  // ── 10: Screenshots & Photos ──
  {
    deck_slug: DECK,
    slide_order: 10,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Screenshots & Photos",
      subtitle: "Your camera is an input device. Stop retyping — just show AI what you see.",
      logo: "color",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4">
  <Card accent="purple">
    <CardTitle>Screenshot → Paste</CardTitle>
    <CardText>⌘+Shift+4 on Mac, then paste directly into Claude. Grab error messages, charts, anything on screen.</CardText>
    <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#7c5cfc]">Setup required</div>
  </Card>
  <Card accent="purple">
    <CardTitle>Phone Photo → AI</CardTitle>
    <CardText>Take a photo of a whiteboard, receipt, or printed doc. Upload it and let AI extract the text.</CardText>
    <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#7c5cfc]">Try it now</div>
  </Card>
  <Card accent="purple">
    <CardTitle>OCR Extraction</CardTitle>
    <CardText>AI reads text from images — handwriting, printed pages, even blurry photos. No more retyping.</CardText>
    <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#7c5cfc]">Any language</div>
  </Card>
  <Card accent="purple">
    <CardTitle>Analyze Images</CardTitle>
    <CardText>Paste a chart, dashboard, or diagram — ask Claude to explain it, find issues, or extract data.</CardText>
    <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#7c5cfc]">Power move</div>
  </Card>
</div>
<div className="mt-auto pt-5 border-t border-slate-200">
  <div className="text-[14px] text-slate-500"><strong>Quick setup:</strong> On Mac, go to Screenshot settings and enable "Copy to Clipboard." On Windows: Win+Shift+S.</div>
</div>`,
  },

  // ── 11: Prompts Between AIs ──
  {
    deck_slug: DECK,
    slide_order: 11,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Prompts Between AIs",
      subtitle: "Use one AI to create inputs for another. They don't compete — they collaborate.",
      logo: "white",
    },
    mdx_content: `<div className="flex flex-col gap-0 mt-4">
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">01</span>
    <div>
      <span className="text-[20px] font-bold text-white">Start anywhere</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Use ChatGPT, Gemini, or Claude to brainstorm an idea or draft a prompt</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">02</span>
    <div>
      <span className="text-[20px] font-bold text-white">Copy the output</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Take the AI's response — even if it's rough — and paste it into a different AI</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">03</span>
    <div>
      <span className="text-[20px] font-bold text-white">Ask AI to improve it</span>
      <div className="text-[15px] text-slate-400 mt-0.5">"Make this prompt better" or "Write a more detailed version of this instruction"</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">04</span>
    <div>
      <span className="text-[20px] font-bold text-white">Cross-pollinate</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Different AIs have different strengths — use one to check or enhance another's work</div>
    </div>
  </div>
</div>`,
  },

  // ── 12: Pasting Documents ──
  {
    deck_slug: DECK,
    slide_order: 12,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Paste Whole Documents",
      subtitle: "Don't summarize for the AI — give it the raw data. Claude can read up to 200,000 words in one conversation.",
      logo: "color",
    },
    mdx_content: `<div className="flex gap-10 mt-4 items-start">
  <div className="flex-1 grid grid-cols-2 gap-4">
    <Card accent="purple"><CardTitle>CSV / TSV</CardTitle><CardText>Sales data, exports from ERP, transaction logs</CardText></Card>
    <Card accent="blue"><CardTitle>Excel</CardTitle><CardText>Upload .xlsx files directly — formulas, multiple sheets</CardText></Card>
    <Card accent="green"><CardTitle>PDF</CardTitle><CardText>Contracts, invoices, reports — AI reads them all</CardText></Card>
    <Card accent="amber"><CardTitle>Plain Text</CardTitle><CardText>Emails, meeting notes, copy-paste from anywhere</CardText></Card>
  </div>
  <div className="w-[320px] shrink-0">
    <div className="bg-[#7c5cfc]/[0.06] border-2 border-dashed border-[#7c5cfc]/30 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
      <div className="text-4xl">📄</div>
      <div>
        <div className="text-[18px] font-bold text-slate-900">Drag & drop</div>
        <div className="text-[14px] text-slate-500 mt-1">or paste with ⌘V / Ctrl+V</div>
      </div>
      <div className="text-[13px] text-[#7c5cfc] font-semibold mt-2">CSV • XLSX • PDF • TXT • JSON</div>
    </div>
  </div>
</div>
<div className="mt-auto pt-5 border-t border-slate-200">
  <div className="text-[14px] text-slate-500 italic">Exercise: Export a report from your system. Paste it into Claude. Ask: "Summarize the key findings and flag anything unusual."</div>
</div>`,
  },

  // ── 13: Summarizing Long Texts ──
  {
    deck_slug: DECK,
    slide_order: 13,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Summarize Anything",
      subtitle: "Give AI the full document. Ask for exactly the format you need.",
      logo: "white",
    },
    mdx_content: `<div className="flex flex-col gap-4 mt-6">
  <div className="flex items-center gap-0">
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-l-xl px-6 py-4">
      <div className="text-[17px] text-slate-300">40-page quarterly report</div>
    </div>
    <div className="w-20 flex items-center justify-center text-[#7c5cfc] text-2xl">→</div>
    <div className="flex-1 rounded-r-xl px-6 py-4 bg-[#7c5cfc]/10 border-l-[3px] border-l-[#7c5cfc]">
      <div className="text-[17px] font-semibold text-white">5 bullet executive summary</div>
    </div>
  </div>
  <div className="flex items-center gap-0">
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-l-xl px-6 py-4">
      <div className="text-[17px] text-slate-300">200 customer support tickets</div>
    </div>
    <div className="w-20 flex items-center justify-center text-blue-500 text-2xl">→</div>
    <div className="flex-1 rounded-r-xl px-6 py-4 bg-blue-500/10 border-l-[3px] border-l-blue-500">
      <div className="text-[17px] font-semibold text-white">Top 5 themes with counts</div>
    </div>
  </div>
  <div className="flex items-center gap-0">
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-l-xl px-6 py-4">
      <div className="text-[17px] text-slate-300">Hour-long meeting transcript</div>
    </div>
    <div className="w-20 flex items-center justify-center text-emerald-500 text-2xl">→</div>
    <div className="flex-1 rounded-r-xl px-6 py-4 bg-emerald-500/10 border-l-[3px] border-l-emerald-500">
      <div className="text-[17px] font-semibold text-white">Action items + decisions</div>
    </div>
  </div>
  <div className="flex items-center gap-0">
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-l-xl px-6 py-4">
      <div className="text-[17px] text-slate-300">Legal contract (50 pages)</div>
    </div>
    <div className="w-20 flex items-center justify-center text-amber-500 text-2xl">→</div>
    <div className="flex-1 rounded-r-xl px-6 py-4 bg-amber-500/10 border-l-[3px] border-l-amber-500">
      <div className="text-[17px] font-semibold text-white">Key terms + risks flagged</div>
    </div>
  </div>
</div>
<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500 italic">Pro tip: Tell Claude the format — "Give me bullet points, max 5 lines" or "Write it as an email to my boss."</div>
</div>`,
  },

  // ── 14: Prompts That Write Prompts ──
  {
    deck_slug: DECK,
    slide_order: 14,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Prompts That Write Prompts",
      subtitle: "You don't need to be a prompt engineer. Just ask AI to write the prompt for you.",
      logo: "color",
    },
    mdx_content: `<div className="flex gap-8 mt-4 items-start">
  <div className="flex-1">
    <div className="bg-white border-2 border-[#7c5cfc]/30 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#7c5cfc]"></div>
        <span className="text-[12px] font-mono text-slate-400">You say:</span>
      </div>
      <div className="text-[16px] text-slate-700 italic">"Write me a prompt that will help me analyze my weekly sales data"</div>
      <div className="mt-5 bg-slate-50 border border-[#7c5cfc]/20 rounded-xl p-5 ml-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9b82fd]"></div>
          <span className="text-[12px] font-mono text-slate-400">Claude generates:</span>
        </div>
        <div className="text-[14px] text-slate-600 font-mono leading-relaxed">"You are a sales analyst for PriyoShop. Each week I will paste a CSV of regional sales. Compare to the previous week. Flag any region that dropped more than 10%..."</div>
        <div className="mt-4 bg-[#7c5cfc]/[0.06] border border-[#7c5cfc]/15 rounded-lg p-4 ml-4">
          <div className="text-[13px] text-[#7c5cfc] font-semibold">→ Use it every week. Consistent, high-quality output every time.</div>
        </div>
      </div>
    </div>
  </div>
  <div className="w-[300px] shrink-0 flex flex-col gap-5">
    <Card accent="purple"><CardTitle>Meta-prompting</CardTitle><CardText>"Write me a prompt for..." is the most underused technique in AI.</CardText></Card>
    <Card accent="blue"><CardTitle>Save & reuse</CardTitle><CardText>Once the prompt works, save it. Use it every week. Build a personal AI toolkit.</CardText></Card>
    <Card accent="green"><CardTitle>Iterate</CardTitle><CardText>"That prompt is good but also add a section for..." — refine until it's perfect.</CardText></Card>
  </div>
</div>`,
  },

  // ── 15: Let AI Interview You ──
  {
    deck_slug: DECK,
    slide_order: 15,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "Let AI Interview You",
      subtitle: "Instead of writing everything yourself — tell Claude to ask you questions. It pulls the knowledge out of your head.",
      logo: "white",
    },
    mdx_content: `<div className="flex flex-col gap-6 mt-6">
  <div className="flex gap-5 items-stretch">
    <div className="flex-1 bg-[#7c5cfc]/[0.08] border border-[#7c5cfc]/20 rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b82fd] block mb-1">You say</span>
      <div className="text-[16px] text-white italic">"Interview me about my department's biggest bottleneck"</div>
    </div>
    <div className="flex items-center text-[#9b82fd] text-2xl">→</div>
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">What happens</span>
      <div className="text-[15px] text-slate-300">AI asks targeted questions → you discover root causes you hadn't articulated</div>
    </div>
  </div>
  <div className="flex gap-5 items-stretch">
    <div className="flex-1 bg-[#7c5cfc]/[0.08] border border-[#7c5cfc]/20 rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b82fd] block mb-1">You say</span>
      <div className="text-[16px] text-white italic">"Ask me questions to write my performance review"</div>
    </div>
    <div className="flex items-center text-[#9b82fd] text-2xl">→</div>
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">What happens</span>
      <div className="text-[15px] text-slate-300">AI pulls out accomplishments, metrics, and growth areas through guided Q&A</div>
    </div>
  </div>
  <div className="flex gap-5 items-stretch">
    <div className="flex-1 bg-[#7c5cfc]/[0.08] border border-[#7c5cfc]/20 rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b82fd] block mb-1">You say</span>
      <div className="text-[16px] text-white italic">"Help me prepare for my board presentation by questioning my assumptions"</div>
    </div>
    <div className="flex items-center text-[#9b82fd] text-2xl">→</div>
    <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">What happens</span>
      <div className="text-[15px] text-slate-300">AI stress-tests your logic, finds gaps, helps you rehearse tough questions</div>
    </div>
  </div>
</div>
<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500 italic">Key phrase: "Don't write it for me — ask me questions first, then write it from my answers."</div>
</div>`,
  },

  // ── 16: When AI Says No ──
  {
    deck_slug: DECK,
    slide_order: 16,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 3 — Interacting with AI",
      title: "When AI Says No",
      subtitle: "AI is cautious by default. You often need to push back, rephrase, or give it permission.",
      logo: "color",
    },
    mdx_content: `<div className="flex flex-col gap-3 mt-2">
  <div className="bg-white border border-slate-200 rounded-[14px] p-5 flex gap-6 items-start">
    <div className="w-[220px] shrink-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">AI says</span>
      <div className="text-[16px] font-mono text-slate-900 font-semibold">"I can't access the internet"</div>
    </div>
    <div className="flex-1 border-l-2 border-slate-100 pl-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reality</span>
      <div className="text-[14px] text-slate-600">It can still analyze data, write code, generate reports — most tasks don't need live web access</div>
    </div>
    <div className="w-[280px] shrink-0 bg-[#7c5cfc]/[0.06] rounded-lg p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-1">You respond</span>
      <div className="text-[13px] text-slate-700 italic">"I know you can't browse, but you can still analyze this data I'm pasting"</div>
    </div>
  </div>
  <div className="bg-white border border-slate-200 rounded-[14px] p-5 flex gap-6 items-start">
    <div className="w-[220px] shrink-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">AI says</span>
      <div className="text-[16px] font-mono text-slate-900 font-semibold">"I can't do that"</div>
    </div>
    <div className="flex-1 border-l-2 border-slate-100 pl-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reality</span>
      <div className="text-[14px] text-slate-600">Often it's being cautious. Rephrase, break the task into steps, or provide more context</div>
    </div>
    <div className="w-[280px] shrink-0 bg-[#7c5cfc]/[0.06] rounded-lg p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-1">You respond</span>
      <div className="text-[13px] text-slate-700 italic">"Let's break this into smaller steps. Start with just the first part."</div>
    </div>
  </div>
  <div className="bg-white border border-slate-200 rounded-[14px] p-5 flex gap-6 items-start">
    <div className="w-[220px] shrink-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">AI says</span>
      <div className="text-[16px] font-mono text-slate-900 font-semibold">"I don't have enough info"</div>
    </div>
    <div className="flex-1 border-l-2 border-slate-100 pl-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reality</span>
      <div className="text-[14px] text-slate-600">Give it permission to make assumptions, then correct what's wrong</div>
    </div>
    <div className="w-[280px] shrink-0 bg-[#7c5cfc]/[0.06] rounded-lg p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-1">You respond</span>
      <div className="text-[13px] text-slate-700 italic">"Make your best guess. I'll correct anything that's off."</div>
    </div>
  </div>
  <div className="bg-white border border-slate-200 rounded-[14px] p-5 flex gap-6 items-start">
    <div className="w-[220px] shrink-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">AI says</span>
      <div className="text-[16px] font-mono text-slate-900 font-semibold">"That's not appropriate"</div>
    </div>
    <div className="flex-1 border-l-2 border-slate-100 pl-5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reality</span>
      <div className="text-[14px] text-slate-600">Rephrase the business context — AI is cautious but handles legitimate work tasks</div>
    </div>
    <div className="w-[280px] shrink-0 bg-[#7c5cfc]/[0.06] rounded-lg p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-1">You respond</span>
      <div className="text-[13px] text-slate-700 italic">"This is for an internal business report. Here's the context..."</div>
    </div>
  </div>
</div>`,
  },

  // ── 25: Setup Cowork ──
  {
    deck_slug: DECK,
    slide_order: 25,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Setup",
      title: "Connect Your Workspace",
      subtitle: "Let's get everyone set up. Claude works best when it can see your real documents and calendar.",
      logo: "white",
      topRight: "~15 min",
    },
    mdx_content: `<div className="flex flex-col gap-2 mt-4">
  <div className="flex items-center gap-6 py-5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold shrink-0 w-6">01</span>
    <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center shrink-0 text-2xl">🌐</div>
    <div className="flex-1">
      <span className="text-[20px] font-bold text-white">Open Claude in your browser</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Go to claude.ai — sign in with your Google account</div>
    </div>
  </div>
  <div className="flex items-center gap-6 py-5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold shrink-0 w-6">02</span>
    <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center shrink-0 text-2xl">📁</div>
    <div className="flex-1">
      <span className="text-[20px] font-bold text-white">Connect Google Drive</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Settings → Integrations → Google Drive. This lets Claude read your docs and sheets directly.</div>
    </div>
  </div>
  <div className="flex items-center gap-6 py-5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold shrink-0 w-6">03</span>
    <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center shrink-0 text-2xl">📅</div>
    <div className="flex-1">
      <span className="text-[20px] font-bold text-white">Connect Google Calendar</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Settings → Integrations → Google Calendar. Claude can see your schedule and help you plan.</div>
    </div>
  </div>
  <div className="flex items-center gap-6 py-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold shrink-0 w-6">04</span>
    <div className="w-12 h-12 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center shrink-0 text-2xl">📄</div>
    <div className="flex-1">
      <span className="text-[20px] font-bold text-white">Create your first document</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Ask Claude to write something → click "Open in Docs" → it appears in your Google Drive</div>
    </div>
  </div>
</div>`,
  },

  // ── 27: Hands-On: Writing ──
  {
    deck_slug: DECK,
    slide_order: 27,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 7 — Hands-On",
      title: "Writing",
      subtitle: "Emails, memos, reports, translations — start with something real from your work.",
      logo: "color",
      topRight: "10 min",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4">
  <Card accent="purple"><CardTitle>Rewrite a bad email</CardTitle><CardText>Paste a real email you wrote. Ask Claude to make it clearer, shorter, and more professional.</CardText></Card>
  <Card accent="purple"><CardTitle>Translate a memo</CardTitle><CardText>Write in Bangla, get English — or vice versa. Keep the tone and meaning intact.</CardText></Card>
  <Card accent="purple"><CardTitle>Turn bullets into a report</CardTitle><CardText>Give Claude your rough notes. Get back a polished document ready to send.</CardText></Card>
  <Card accent="purple"><CardTitle>Write from a template</CardTitle><CardText>"Write a weekly update email in the same format as this example..."</CardText></Card>
</div>`,
  },

  // ── 28: Hands-On: Spreadsheets ──
  {
    deck_slug: DECK,
    slide_order: 28,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 7 — Hands-On",
      title: "Spreadsheets",
      subtitle: "Upload your real Excel files. Let Claude do the formula work.",
      logo: "white",
      topRight: "10 min",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4">
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">01</span>
      <span className="text-[18px] font-bold text-white">Upload & analyze</span>
    </div>
    <div className="text-[14px] text-slate-400">Upload an Excel file. Ask: "What are the top 3 insights from this data?"</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">02</span>
      <span className="text-[18px] font-bold text-white">Generate formulas</span>
    </div>
    <div className="text-[14px] text-slate-400">Describe what you need in plain language. Get VLOOKUP, SUMIF, pivot tables — explained.</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">03</span>
      <span className="text-[18px] font-bold text-white">Create from scratch</span>
    </div>
    <div className="text-[14px] text-slate-400">"Build me a monthly budget tracker for 8 departments" → download as .xlsx</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">04</span>
      <span className="text-[18px] font-bold text-white">Clean messy data</span>
    </div>
    <div className="text-[14px] text-slate-400">Paste raw data with duplicates, errors, mixed formats. Claude fixes it.</div>
  </div>
</div>
<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500"><strong className="text-slate-300">Majundar's challenge:</strong> Upload a real PriyoShop report with VLOOKUPs. Ask Claude to add a COUNTIF summary row.</div>
</div>`,
  },

  // ── 29: Hands-On: Documents ──
  {
    deck_slug: DECK,
    slide_order: 29,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 7 — Hands-On",
      title: "Documents",
      subtitle: "Create a document from a prompt and open it directly in Google Docs.",
      logo: "color",
      topRight: "10 min",
    },
    mdx_content: `<div className="flex gap-8 mt-4 items-start">
  <div className="flex-1 flex flex-col gap-5">
    <div className="bg-white border-2 border-[#7c5cfc]/20 rounded-2xl p-6">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5cfc] block mb-2">Try this prompt</span>
      <div className="text-[17px] text-slate-800 leading-relaxed italic">"Write a one-page proposal for expanding PriyoShop into a new district. Include: market opportunity, required investment, expected timeline, and key risks. Format it as a professional memo."</div>
    </div>
    <div className="flex gap-4">
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="text-[15px] font-bold text-slate-900 mb-1">Then try</div>
        <div className="text-[13px] text-slate-600">"Make it more concise"</div>
      </div>
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="text-[15px] font-bold text-slate-900 mb-1">Then try</div>
        <div className="text-[13px] text-slate-600">"Add a budget table"</div>
      </div>
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="text-[15px] font-bold text-slate-900 mb-1">Then</div>
        <div className="text-[13px] text-slate-600">"Open in Google Docs"</div>
      </div>
    </div>
  </div>
  <div className="w-[220px] shrink-0 flex flex-col items-center gap-3">
    <div className="w-[180px] rounded-xl px-5 py-3 text-center font-semibold text-[15px] text-[#7c5cfc] bg-[#7c5cfc]/[0.08] border-2 border-[#7c5cfc]/20">Prompt</div>
    <div className="text-slate-400">↓</div>
    <div className="w-[180px] rounded-xl px-5 py-3 text-center font-semibold text-[15px] text-blue-500 bg-blue-500/[0.08] border-2 border-blue-500/20">Draft</div>
    <div className="text-slate-400">↓</div>
    <div className="w-[180px] rounded-xl px-5 py-3 text-center font-semibold text-[15px] text-purple-500 bg-purple-500/[0.08] border-2 border-purple-500/20">Refine</div>
    <div className="text-slate-400">↓</div>
    <div className="w-[180px] rounded-xl px-5 py-3 text-center font-semibold text-[15px] text-emerald-500 bg-emerald-500/[0.08] border-2 border-emerald-500/20">Google Docs</div>
  </div>
</div>`,
  },

  // ── 30: Hands-On: Data ──
  {
    deck_slug: DECK,
    slide_order: 30,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 7 — Hands-On",
      title: "Data & Analysis",
      subtitle: "Upload real PriyoShop data. Find patterns. Generate charts. Write queries.",
      logo: "white",
      topRight: "10 min",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4">
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[18px] font-bold text-white">Find patterns</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-[#9b82fd] bg-[#7c5cfc]/10">Analysis</span>
    </div>
    <div className="text-[14px] text-slate-400">Upload a dataset. Ask: "What patterns do you see? What's unusual?"</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[18px] font-bold text-white">Write SQL queries</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-blue-400 bg-blue-500/10">Database</span>
    </div>
    <div className="text-[14px] text-slate-400">Describe your database in plain language. Claude writes the query.</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[18px] font-bold text-white">Generate charts</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10">Visualization</span>
    </div>
    <div className="text-[14px] text-slate-400">"Make a bar chart of monthly sales by region" — Claude creates it as an artifact.</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[18px] font-bold text-white">Cross-reference</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-amber-400 bg-amber-500/10">Comparison</span>
    </div>
    <div className="text-[14px] text-slate-400">Paste two datasets. Ask Claude to find mismatches, duplicates, or correlations.</div>
  </div>
</div>
<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500"><strong className="text-slate-300">Shahid's challenge:</strong> Upload KPI data from two regions. Ask Claude to compare performance and flag the biggest gap.</div>
</div>`,
  },

  // ── 31: Hands-On: Email & Calendar ──
  {
    deck_slug: DECK,
    slide_order: 31,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 7 — Hands-On",
      title: "Email & Calendar",
      subtitle: "Connect Gmail and Google Calendar. Let Claude handle the scheduling and drafting.",
      logo: "color",
      topRight: "10 min",
    },
    mdx_content: `<div className="flex flex-col gap-4 mt-4">
  <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-[14px] px-6 py-5">
    <span className="text-3xl">✉️</span>
    <div className="flex-1">
      <div className="text-[18px] font-bold text-slate-900">Batch draft emails</div>
      <div className="text-[14px] text-slate-500 mt-0.5 italic">"Write follow-up emails to these 5 partners based on our last meeting notes"</div>
    </div>
  </div>
  <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-[14px] px-6 py-5">
    <span className="text-3xl">📅</span>
    <div className="flex-1">
      <div className="text-[18px] font-bold text-slate-900">Plan your week</div>
      <div className="text-[14px] text-slate-500 mt-0.5 italic">"Look at my calendar for next week and suggest time blocks for deep work"</div>
    </div>
  </div>
  <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-[14px] px-6 py-5">
    <span className="text-3xl">📋</span>
    <div className="flex-1">
      <div className="text-[18px] font-bold text-slate-900">Meeting prep</div>
      <div className="text-[14px] text-slate-500 mt-0.5 italic">"I have a meeting with [person] tomorrow. Draft an agenda based on our last 3 email threads"</div>
    </div>
  </div>
  <div className="flex items-center gap-5 bg-white border border-slate-200 rounded-[14px] px-6 py-5">
    <span className="text-3xl">🕐</span>
    <div className="flex-1">
      <div className="text-[18px] font-bold text-slate-900">Smart scheduling</div>
      <div className="text-[14px] text-slate-500 mt-0.5 italic">"Find a 1-hour slot next week where both my calendar and Asan's are free"</div>
    </div>
  </div>
</div>`,
  },

  // ── 32: Hands-On: Interviewing ──
  {
    deck_slug: DECK,
    slide_order: 32,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 7 — Hands-On",
      title: "AI Interviews You",
      subtitle: "The most powerful technique: let Claude ask the questions.",
      logo: "white",
      topRight: "10 min",
    },
    mdx_content: `<div className="flex flex-col gap-5 mt-4">
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="text-[18px] font-bold text-white mb-2">Stress-test a decision</div>
    <div className="text-[15px] text-[#9b82fd] italic mb-3">"I'm planning to open 3 new warehouses. Interview me about this plan and challenge my assumptions."</div>
    <div className="text-[14px] text-slate-400">✓ Claude asks tough questions → you discover blind spots before committing resources</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="text-[18px] font-bold text-white mb-2">Prep for a presentation</div>
    <div className="text-[15px] text-[#9b82fd] italic mb-3">"Pretend you're a skeptical board member. Ask me the hardest questions about our Q2 results."</div>
    <div className="text-[14px] text-slate-400">✓ Practice handling objections → walk in confident with prepared answers</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-6">
    <div className="text-[18px] font-bold text-white mb-2">Find root causes</div>
    <div className="text-[15px] text-[#9b82fd] italic mb-3">"Our delivery success rate dropped 12% last month. Interview me to find out why."</div>
    <div className="text-[14px] text-slate-400">✓ Structured 5-whys questioning → get from symptom to root cause</div>
  </div>
</div>`,
  },

  // ── 33: Hands-On: Presentations ──
  {
    deck_slug: DECK,
    slide_order: 33,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 7 — Hands-On",
      title: "Presentations",
      subtitle: "Turn reports and briefs into slide outlines, speaker notes, and structured decks.",
      logo: "color",
      topRight: "10 min",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4">
  <Card accent="purple"><CardTitle>Brief → Outline</CardTitle><CardText>"I need a 10-slide deck on Q2 results for the board. Here are my notes..."</CardText></Card>
  <Card accent="purple"><CardTitle>Report → Slides</CardTitle><CardText>"Turn this 20-page report into a 5-slide executive summary with key charts"</CardText></Card>
  <Card accent="purple"><CardTitle>Speaker notes</CardTitle><CardText>"Write speaker notes for each slide — what should I say out loud?"</CardText></Card>
  <Card accent="purple"><CardTitle>Design suggestions</CardTitle><CardText>"What visuals or charts would make each slide more compelling?"</CardText></Card>
</div>
<div className="mt-auto pt-5 border-t border-slate-200">
  <div className="text-[14px] text-slate-500">Claude can't create PowerPoint directly — but it can create the content, structure, and speaker notes. Copy into your template.</div>
</div>`,
  },
];

async function main() {
  console.log("Upserting new slides into priyoshop-exec deck...\n");

  // First, reorder existing slides
  // We need to move slides 9-18 to new positions to make room
  // The API upserts by deck_slug + slide_order, so inserting at occupied
  // positions will overwrite. We need to reorder existing slides first.

  // Fetch current
  const res = await fetch(`${API}?deck=${DECK}`);
  const current = await res.json();

  // Move existing slides that are at positions we need (9-16, 25-33)
  // to temporary high positions first
  console.log("Phase 1: Moving conflicting existing slides to temp positions...");

  // Slides at positions 9-16 need to move
  const conflicting = current.filter((s: any) =>
    (s.slide_order >= 9 && s.slide_order <= 16) ||
    s.slide_order === 25 ||
    (s.slide_order >= 27 && s.slide_order <= 33)
  );

  // For each conflicting slide, we need to re-create it at a new position
  // But the upsert key is deck_slug + slide_order, so we can't just "move"
  // We need to: create at new position, then soft-delete old position

  // Map of old_order → new_order for existing slides
  const moveMap: Record<number, number> = {
    9: 18,   // Activity: Paste an Image
    10: 19,  // Context Window
    11: 20,  // The Window Grows
    12: 21,  // Lost in the Middle
    13: 22,  // Don't Worry Too Much
    14: 23,  // Quiz: New Chat?
    15: 24,  // Write Your Context
    16: 26,  // Skills
    // 17 stays (Artifacts)
    // 18 gets deleted (old Hands-On Cowork)
    // 19 → 34 (Claude Code)
    // 20 → 35 (Thank You)
  };

  // Also move Claude Code and Thank You
  const tailSlides = current.filter((s: any) => s.slide_order === 19 || s.slide_order === 20);

  for (const slide of tailSlides) {
    const newOrder = slide.slide_order === 19 ? 34 : 35;
    console.log(`  Moving "${slide.frontmatter.title}" from ${slide.slide_order} → ${newOrder}`);
    await upsert({
      deck_slug: DECK,
      slide_order: newOrder,
      frontmatter: slide.frontmatter,
      mdx_content: slide.mdx_content,
    });
  }

  // Move slides 9-16 to their new positions
  for (const slide of current) {
    const newOrder = moveMap[slide.slide_order];
    if (newOrder === undefined) continue;
    console.log(`  Moving "${slide.frontmatter.title}" from ${slide.slide_order} → ${newOrder}`);
    await upsert({
      deck_slug: DECK,
      slide_order: newOrder,
      frontmatter: slide.frontmatter,
      mdx_content: slide.mdx_content,
    });
  }

  // Soft-delete old Hands-On Cowork (was at 18, but it might have been overwritten)
  const handsOn = current.find((s: any) => s.slide_order === 18);
  if (handsOn) {
    await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: handsOn.id }),
    });
    console.log(`  Soft-deleted old "Hands-On Cowork"`);
  }

  // Soft-delete old positions for moved slides
  const toDelete = current.filter((s: any) =>
    moveMap[s.slide_order] !== undefined ||
    s.slide_order === 19 || s.slide_order === 20
  );
  for (const slide of toDelete) {
    await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slide.id }),
    });
    console.log(`  Soft-deleted old position ${slide.slide_order} (${slide.frontmatter.title})`);
  }

  console.log("\nPhase 2: Inserting new slides...");
  for (const slide of newSlides) {
    await upsert(slide);
  }

  console.log("\nDone! New deck order:");
  const finalRes = await fetch(`${API}?deck=${DECK}`);
  const finalSlides = await finalRes.json();
  for (const s of finalSlides) {
    console.log(`  ${String(s.slide_order).padStart(2)} | ${s.frontmatter.variant?.padEnd(5)} | ${s.frontmatter.title}`);
  }
}

main().catch(console.error);
