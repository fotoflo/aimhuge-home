import { SlideShell } from "@/app/decks/components/SlideShell";
import { Card, CardTitle, CardText } from "@/app/decks/components/Card";
import Image from "next/image";

const points = [
  { title: "Language Models", text: "Claude, ChatGPT, and Gemini are language models that speak computer. They understand and generate human language." },
  { title: "Small → Large", text: "Every provider has small, medium, and large models. We use frontier models (the most expensive) because they have the most power." },
  { title: "Getting Cheaper Fast", text: "Models are improving fast — soon cheaper models will do what expensive ones do today." },
  { title: "Think: Phones", text: "Today's budget phone is better than last year's flagship. AI is on the same trajectory, but faster." },
];

// Pre-compute random values at module load time (stable across renders)
const matrixColumns = Array.from({ length: 20 }, (_, col) => ({
  left: `${col * 5}%`,
  duration: `${8 + (col * 0.6)}s`,
  delay: `${-(col * 0.5)}s`,
  chars: Array.from({ length: 40 }, (_, i) =>
    String.fromCharCode(0x30A0 + ((col * 40 + i * 7) % 96))
  ).join("\n"),
}));

export function WhatIsAISlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Section 2"
      title="What is AI?"
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} />}
      topRight="~20 min"
    >
      {/* Matrix rain background — CSS animated */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none opacity-[0.07]">
        {matrixColumns.map((col, i) => (
          <div
            key={i}
            className="absolute top-0 text-[14px] font-mono leading-[1.2] text-[#9b82fd] whitespace-pre"
            style={{
              left: col.left,
              animation: `matrixFall ${col.duration} linear infinite`,
              animationDelay: col.delay,
            }}
          >
            {col.chars}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 mt-4 flex-1 relative z-10">
        {points.map((p) => (
          <Card key={p.title} accent="purple" dark>
            <CardTitle dark>{p.title}</CardTitle>
            <CardText dark>{p.text}</CardText>
          </Card>
        ))}
      </div>
    </SlideShell>
  );
}
