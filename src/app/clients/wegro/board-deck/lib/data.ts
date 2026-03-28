import { Initiative } from "./types";

export const defaultInitiatives: Initiative[] = [
  { id: "seed-dist", name: "White-Label Seed Distribution", division: "inputs", scores: { impact: 5, lowEffort: 4, lowCost: 4, speed: 4, alignment: 5 } },
  { id: "contract-grow", name: "Contract Growing & Aggregation", division: "trading", scores: { impact: 4, lowEffort: 4, lowCost: 4, speed: 5, alignment: 5 } },
  { id: "seed-partners", name: "Exclusive Seed Brand Partnerships", division: "inputs", scores: { impact: 4, lowEffort: 4, lowCost: 4, speed: 4, alignment: 5 } },
  { id: "biofertiliser", name: "Biofertiliser Production", division: "inputs", scores: { impact: 3, lowEffort: 4, lowCost: 4, speed: 5, alignment: 5 } },
  { id: "data-platform", name: "Farmer Data Platform for Banks", division: "data", scores: { impact: 5, lowEffort: 3, lowCost: 4, speed: 4, alignment: 5 } },
  { id: "micronutrients", name: "Micronutrient Distribution", division: "inputs", scores: { impact: 2, lowEffort: 5, lowCost: 5, speed: 5, alignment: 4 } },
  { id: "crop-finance", name: "Crop Collateralised Financing", division: "financing", scores: { impact: 5, lowEffort: 3, lowCost: 3, speed: 4, alignment: 5 } },
  { id: "credit-scoring", name: "Farmer Credit Scoring", division: "data", scores: { impact: 5, lowEffort: 3, lowCost: 4, speed: 3, alignment: 5 } },
  { id: "seedlings", name: "Seedling Business", division: "inputs", scores: { impact: 3, lowEffort: 4, lowCost: 4, speed: 4, alignment: 4 } },
  { id: "trade-finance", name: "Trade Financing (Factoring)", division: "financing", scores: { impact: 3, lowEffort: 4, lowCost: 4, speed: 4, alignment: 4 } },
  { id: "ai-yield", name: "AI Yield Prediction", division: "data", scores: { impact: 4, lowEffort: 2, lowCost: 3, speed: 3, alignment: 5 } },
  { id: "stockpiling", name: "Commodity Stockpiling", division: "trading", scores: { impact: 3, lowEffort: 3, lowCost: 3, speed: 4, alignment: 4 } },
  { id: "dryers", name: "Multi-Crop Dryer Deployment", division: "inputs", scores: { impact: 4, lowEffort: 3, lowCost: 2, speed: 3, alignment: 4 } },
  { id: "liquid-fert", name: "Liquid Chemical Fertiliser R&D", division: "inputs", scores: { impact: 3, lowEffort: 2, lowCost: 3, speed: 2, alignment: 4 } },
  { id: "trading-platform", name: "Commodity Trading Platform", division: "trading", scores: { impact: 3, lowEffort: 2, lowCost: 3, speed: 2, alignment: 3 } },
  { id: "net-houses", name: "Net Houses / Protected Agriculture", division: "inputs", scores: { impact: 3, lowEffort: 2, lowCost: 1, speed: 2, alignment: 4 } },
  { id: "gap-cert", name: "GAP Certification Programme", division: "inputs", scores: { impact: 3, lowEffort: 2, lowCost: 2, speed: 2, alignment: 3 } },
  { id: "drones", name: "Drone Deployment", division: "inputs", scores: { impact: 2, lowEffort: 2, lowCost: 2, speed: 2, alignment: 3 } },
  { id: "india", name: "International Expansion (India)", division: "trading", scores: { impact: 4, lowEffort: 1, lowCost: 1, speed: 1, alignment: 3 } },
  { id: "blockchain-ewr", name: "Blockchain-based EWR", division: "financing", scores: { impact: 2, lowEffort: 1, lowCost: 2, speed: 1, alignment: 3 } },
];
