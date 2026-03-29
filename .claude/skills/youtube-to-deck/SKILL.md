---
name: youtube-to-deck
description: Fetch a YouTube video transcript and automatically generate slides for it using Gemini.
argument-hint: "<YOUTUBE_URL_OR_ID> [DECK_SLUG] [NUM_SLIDES] [--transcript-only]"
---

# YouTube to Deck Generator

You manage the automated extraction of YouTube transcripts and synthesize them into slide decks using the `scripts/youtube-to-deck.ts` utility.

## Steps

### 1. Identify the Target Video and Deck
From the user's prompt, extract the YouTube URL or Video ID.
If no deck slug is provided, it defaults to `priyoshop-exec`.

### 2. Execute the Generator Script
Run the script using `pnpm tsx` and pass the arguments.

```bash
pnpm tsx scripts/youtube-to-deck.ts "<YOUTUBE_URL>" "<DECK_SLUG>" [NUM_SLIDES] [--transcript-only]
```

Note: By default, the script shells out to `yt-dlp` to download the full video, uploading it via the File API for deep multimodal processing and automatic tool use to generate custom images for slides. If the `--transcript-only` flag is provided, it skips the slow video download and relies entirely on the transcript text.

### 3. Verify and Inform
The script will automatically summarize the transcript using the Gemini API and append the newly formatted MDX slides to the end of the specified deck via the local application's API.

After running the script, confirm to the user that the slides were generated and appended. Suggest they review the new slides at `http://localhost:4000/clients/priyoshop/exec-deck`.

## Rules
- The script relies on `.env.local` having a valid `GEMINI_API_KEY`.
- If the video does not have captions or transcripts enabled, the script will naturally fail. Let the user know if this happens.
