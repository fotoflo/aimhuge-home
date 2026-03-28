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
      variant="light"
      sectionLabel="Section 2"
      title="What is AI?"
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
      topRight="~20 min"
    >
      <div className="grid grid-cols-2 gap-5 mt-4 flex-1">
        {points.map((p) => (
          <Card key={p.title} accent="purple">
            <CardTitle>{p.title}</CardTitle>
            <CardText>{p.text}</CardText>
          </Card>
        ))}
      </div>
    </SlideShell>
  );
}
