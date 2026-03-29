import { SlideShell } from "@/app/decks/components/SlideShell";
import { Card, CardTitle, CardText } from "@/app/decks/components/Card";
import Image from "next/image";

const points = [
  { title: "Language Models", text: "Claude, ChatGPT, and Gemini are language models that speak computer. They understand and generate human language." },
  { title: "Small → Large", text: "Every provider has small, medium, and large models. We use frontier models (the most expensive) because they have the most power." },
  { title: "Getting Cheaper Fast", text: "Models are improving fast — soon cheaper models will do what expensive ones do today." },
  { title: "Think: Phones", text: "Today's budget phone is better than last year's flagship. AI is on the same trajectory, but faster." },
];

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
        {[...Array(20)].map((_, col) => (
          <div
            key={col}
            className="absolute top-0 text-[14px] font-mono leading-[1.2] text-[#9b82fd] whitespace-pre"
            style={{
              left: `${col * 5}%`,
              animation: `matrixFall ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${-Math.random() * 10}s`,
            }}
          >
            {Array.from({ length: 40 }, () =>
              String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
            ).join("\n")}
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
