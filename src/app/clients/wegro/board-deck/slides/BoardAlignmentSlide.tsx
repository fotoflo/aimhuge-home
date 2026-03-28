import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardText } from "../components/Card";

export function BoardAlignmentSlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Board Alignment"
      title="Decisions We Need From the Board"
      subtitle="Five questions that require board input to unlock the next phase of execution."
    >
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col gap-3.5">
          <Card accent="green">
            <CardTitle>1. Endorse the Prioritisation Framework</CardTitle>
            <CardText>Do we have board support for the &quot;score and cut&quot; discipline? This means accepting that high-potential initiatives (India, drones, net houses) are explicitly deferred.</CardText>
          </Card>
          <Card accent="purple">
            <CardTitle>2. Data Monetisation Timing</CardTitle>
            <CardText>We&apos;ve been providing data to banks for free to build trust. Management recommends transitioning to paid licensing in Q2. Do we have alignment on timing and pricing?</CardText>
          </Card>
          <Card accent="blue">
            <CardTitle>3. Agronomist Co-Founder Hire</CardTitle>
            <CardText>Our commercial strength needs a technical counterpart. Hiring an agronomist/scientist co-founder would strengthen inputs quality, yield prediction accuracy, and credibility with partners.</CardText>
          </Card>
        </div>
        <div className="flex flex-col gap-3.5">
          <Card accent="amber">
            <CardTitle>4. Capital Allocation</CardTitle>
            <CardText>How should we balance scaling proven divisions (seeds, aggregation) vs. investing in emerging ones (data platform, crop financing tech)? Management proposes a 70/30 split.</CardText>
          </Card>
          <Card className="!bg-slate-800 !border-slate-700">
            <CardTitle dark>5. Quarterly Reporting Cadence</CardTitle>
            <CardText dark>We commit to reporting against the prioritisation matrix quarterly. Re-score all initiatives every 6 months. Board receives KPI dashboard monthly.</CardText>
          </Card>
          <Card small className="!bg-[#e6f2ef] !border-[#015546]/20">
            <CardTitle><span className="text-[#015546] text-sm">Management Commitment</span></CardTitle>
            <CardText>We are transitioning from broad experimentation to focused execution. The prioritisation framework ensures every initiative is scored, ranked, and either pursued, deferred, or cut. Accountability starts now.</CardText>
          </Card>
        </div>
      </div>
    </SlideShell>
  );
}
