import { SlideShell } from "@/app/decks/components/SlideShell";
import { Card, CardTitle, CardText } from "@/app/decks/components/Card";
import Image from "next/image";

const artifactTypes = [
  { title: "Documents", desc: "Reports, memos, proposals", accent: "purple" as const },
  { title: "Spreadsheets", desc: "Trackers, dashboards, templates", accent: "blue" as const },
  { title: "Presentations", desc: "Slide decks with structure", accent: "green" as const },
  { title: "Code", desc: "Scripts, tools, mini-apps", accent: "amber" as const },
  { title: "Visualizations", desc: "Charts, diagrams, flowcharts", accent: "red" as const },
];

export function ArtifactsSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Section 3C"
      title="Artifacts"
      subtitle="Instead of Claude just telling you something, it makes it for you. You can download, edit, and share artifacts — they're real files."
      logo={<Image src="/images/logo-white.png" alt="AimHuge" width={60} height={20} className="invert" />}
    >
      <div className="grid grid-cols-5 gap-4 mt-4 flex-1">
        {artifactTypes.map((a) => (
          <Card key={a.title} accent={a.accent} small>
            <CardTitle>{a.title}</CardTitle>
            <CardText>{a.desc}</CardText>
          </Card>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <p className="text-[15px] text-slate-500 italic">
          Demo: Build an artifact together live — e.g. &ldquo;Create a weekly KPI dashboard for PriyoShop&rdquo;
        </p>
      </div>
    </SlideShell>
  );
}
