import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardText } from "../components/Card";
import { Tag } from "../components/Tag";

const deferred = [
  { name: "International Expansion (India)", score: 10, trigger: "BD revenue > $X", desc: "Impact could be enormous, but effort and cost scores are 1/5 each. We lack the local networks, regulatory knowledge, and bandwidth. Re-evaluate in Q4 once Bangladesh KPIs are met." },
  { name: "Drone Deployment", score: 11, trigger: ">25K farmers", desc: "Cool technology, limited near-term impact. Satellite imagery already covers monitoring needs at a fraction of the cost. Drones add value at scale we haven't reached yet." },
  { name: "Commodity Trading Platform", score: 13, trigger: "500T monthly vol", desc: "Building a full exchange requires regulatory approval, technology investment, and market liquidity we don't have. We'll trade manually and build toward this over time." },
  { name: "Net Houses at Scale", score: 12, trigger: "govt subsidy", desc: "Requires heavy capex ($$$), subsidy relationships, and a longer payback period. Following India's model is promising but premature for our current stage." },
  { name: "Liquid Fertiliser R&D", score: 14, trigger: "IP deal signed", desc: "Scientifically promising but slow (IP licensing in progress). We'll continue research conversations but not allocate resources until IP terms are finalised." },
];

export function SayNoSlide() {
  return (
    <SlideShell
      variant="dark"
      sectionLabel="Strategic Discipline"
      title="What We're Saying No To — And Why"
      subtitle="Focus requires explicit decisions about what not to pursue. These are deferred, not abandoned."
    >
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-3.5">
          {deferred.slice(0, 3).map((d) => (
            <Card key={d.name} dark>
              <CardTitle dark><span className="flex gap-2 items-center"><span className="text-red-500">✗</span> {d.name}</span></CardTitle>
              <CardText dark>{d.desc}</CardText>
              <div className="mt-2"><Tag color="red">Score: {d.score}/25</Tag><Tag color="slate">Trigger: {d.trigger}</Tag></div>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-3.5">
          {deferred.slice(3).map((d) => (
            <Card key={d.name} dark>
              <CardTitle dark><span className="flex gap-2 items-center"><span className="text-red-500">✗</span> {d.name}</span></CardTitle>
              <CardText dark>{d.desc}</CardText>
              <div className="mt-2"><Tag color="red">Score: {d.score}/25</Tag><Tag color="slate">Trigger: {d.trigger}</Tag></div>
            </Card>
          ))}
          <Card small dark className="!bg-[#015546]/[0.12] !border-[#015546]/[0.25]">
            <CardTitle><span className="text-[#FF8F1C] text-sm">The Discipline</span></CardTitle>
            <CardText dark>Every deferred initiative has a re-entry trigger — a specific KPI or event that prompts re-scoring. We review the full matrix every 6 months. This isn&apos;t saying &quot;never.&quot; It&apos;s saying &quot;not yet, and here&apos;s what changes our mind.&quot;</CardText>
          </Card>
        </div>
      </div>
    </SlideShell>
  );
}
