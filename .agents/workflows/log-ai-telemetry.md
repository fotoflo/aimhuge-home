---
description: How to log AI token usage and costs into the telemetry database when building AI agents or features.
---

# Logging AI Telemetry

When generating content using AI models (like Gemini) via backend API routes or server actions, you **MUST** log the token usage to the `ai_usage_logs` database table.

This allows the application to aggregate AI cost usage per project (`deckSlug`) and per slide (`slideId`), ensuring that the `/tokens` dashboard stays fully updated in real-time.

## Implementation Guidelines

### 1. Import the utility function
Always use the central `logAiUsage` utility rather than querying Supabase directly. This handles standard cost-estimation calculation internally.

```typescript
import { logAiUsage } from "@/lib/ai-telemetry";
```

### 2. Extract Project Identifiers
You **MUST** pipe `deckSlug` (the exact presentation's slug label) from the frontend down to your API endpoint. The token cost relies on this payload string. Optionally, include `slideId` if the generation targets a specific slide.

### 3. Log the Telemetry Metadata
For `@google/genai`, the token usage comes back inside the `usageMetadata` object on the final stream resolution or the standard generated response.

### Example Code

```typescript
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DEFAULT_MODEL } from "@/lib/gemini";
import { logAiUsage } from "@/lib/ai-telemetry";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  // 1. Mandatory requirement to pipe identifiers
  const { deckSlug, slideId, promptContext } = await req.json();

  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: [{ role: "user", parts: [{ text: promptContext }] }]
  });

  // 2. Wrap logger in an asynchronous block to avoid blocking user returns
  if (response.usageMetadata) {
    logAiUsage({
      endpoint: "your_feature_name", 
      model: DEFAULT_MODEL,
      promptTokens: response.usageMetadata.promptTokenCount,
      completionTokens: response.usageMetadata.candidatesTokenCount,
      totalTokens: response.usageMetadata.totalTokenCount,
      deckSlug: deckSlug, // Mandatory to track cost per project
      slideId: slideId,   // Optional
    });
  }

  return NextResponse.json({ text: response.text });
}
```

## Note on Cost Estimation
The logging utility automatically calculates costs locally for `gemini-2.5-flash` based on mid-2024 standardized pricing strings. If you switch to another foundational model (like Claude 3.5 Sonnet), agents should proactively navigate to `src/lib/ai-telemetry.ts` and append its exact cost estimators.
