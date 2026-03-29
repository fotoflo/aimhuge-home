# Bug Fix: Gemini 3.1 Thought Signature Missing

**Date**: 2026-03-29
**Severity**: High

## Symptom
When asking the AI copilot to generate an image for a slide, it would initiate the `generate_image` function call, output `Generating image: "..."...`, and then abruptly crash with:

```json
{
  "error": {
    "code": 400,
    "message": "Function call is missing a thought_signature in functionCall parts. This is required for tools to work correctly, and missing thought_signature may lead to degraded model performance. Additional data, function call `default_api:generate_image`, position 2."
  }
}
```

## Root Cause
With Gemini 3.0 and 3.1, Google introduced a strict requirement for function calling payloads. The original streaming implementation in the Next.js API route (`/api/decks/slides/prompt`) was manually constructing a new `Part` for the history array:

```typescript
// Incorrect
messages.push({ role: "model", parts: [{ functionCall: toolCall }] });
```

Because the original `Part` received from the library contained internal metadata (`thoughtSignature` alongside `functionCall`), simply passing `{ functionCall: toolCall }` stripped the required verification signature, causing a `400` server validation fault on the subsequent turnaround back to the model.

## The Fix
Instead of manually composing the history part from the extracted `functionCall`, we must extract the verbatim raw `Part` object from `chunk.candidates[0].content.parts` to preserve exactly what the `@google/genai` API emitted.

```typescript
// Correct
let toolCallPart: any = null;

// Traverse and find the original containing object:
for await (const chunk of stream) {
  if (chunk.functionCalls && chunk.functionCalls.length > 0) {
     toolCall = chunk.functionCalls[0];
     // Capture the intact candidate part!
     toolCallPart = chunk.candidates?.[0]?.content?.parts?.find((p: any) => p.functionCall);
     break; 
  }
}

// ...
// Provide the exact layout back to the model:
const modelPart = toolCallPart || { functionCall: toolCall };
messages.push({ role: "model", parts: [modelPart] });
```

## Key Rule
When executing Gemini tool calls across multiple turns, **always store and echo back the exact `Part` object given by the initial candidate** rather than blindly destructuring and reassembling it.

## Files Involved
- `src/app/api/decks/slides/prompt/route.ts`
