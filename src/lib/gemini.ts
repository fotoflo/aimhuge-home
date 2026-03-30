import { GoogleGenAI } from "@google/genai";

export type AIModelType = 'text' | 'image' | 'multimodal' | 'embedding';

export interface AIModelConfig {
  id: string;
  name: string;
  type: AIModelType;
  costPer1mInputTokens?: number;
  costPer1mOutputTokens?: number;
  costPerImage?: number;
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  "gemini-3-flash-preview": {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    type: "multimodal",
    costPer1mInputTokens: 0.075,
    costPer1mOutputTokens: 0.300,
  },
  "gemini-2.5-pro": {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    type: "multimodal",
    costPer1mInputTokens: 1.25,
    costPer1mOutputTokens: 5.0,
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    type: "multimodal",
    costPer1mInputTokens: 0.075,
    costPer1mOutputTokens: 0.300,
  },
  "gemini-3.1-flash-image-preview": {
    id: "gemini-3.1-flash-image-preview",
    name: "Gemini 3.1 Flash Image",
    type: "image",
    costPerImage: 0.03,
  },
  "gemini-3-pro-image-preview": {
    id: "gemini-3-pro-image-preview",
    name: "Gemini 3 Pro Image",
    type: "image",
    costPerImage: 0.06,
  },
  "gemini-2.5-flash-image": {
    id: "gemini-2.5-flash-image",
    name: "Gemini 2.5 Flash Image",
    type: "image",
    costPerImage: 0.03,
  },
  "gemini-embedding-001": {
    id: "gemini-embedding-001",
    name: "Gemini Text Embedding",
    type: "embedding",
    costPer1mInputTokens: 0.02,
  }
};

// Global default models used across the application
export const DEFAULT_MODEL = "gemini-3-flash-preview";
export const IMAGE_MODEL = "gemini-3.1-flash-image-preview";
export const EMBEDDING_MODEL = "gemini-embedding-001";

// Embedding utility
export async function generateSlideEmbedding(text: string): Promise<number[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const result = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
  });
  
  const embedding = result.embeddings?.[0]?.values;
  if (!embedding) {
    throw new Error("Failed to generate embedding: no values returned");
  }
  
  return embedding;
}
