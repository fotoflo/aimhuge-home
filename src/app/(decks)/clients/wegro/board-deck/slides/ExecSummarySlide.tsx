import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardText } from "../components/Card";
import { Tag } from "../components/Tag";

export function ExecSummarySlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Executive Summary"
      title="Four Divisions, One Ecosystem"
      subtitle="Four interconnected businesses capturing value across the full agricultural value chain."
    >
      <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
        <Card accent="green">
          <CardTitle>Inputs</CardTitle>
          <CardText>Seeds, fertilisers, machinery, and protected agriculture. High margins establish the farmer relationship.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="green">Entry Point</Tag>
            <Tag color="green">60-80% margins</Tag>
          </div>
        </Card>
        <Card accent="blue">
          <CardTitle>Financing</CardTitle>
          <CardText>Crop-collateralised loans, trade financing, and e-warehouse receipts. Solves the smallholder capital gap.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="blue">Lock-in</Tag>
            <Tag color="blue">$3.5B mandate</Tag>
          </div>
        </Card>
        <Card accent="amber">
          <CardTitle>Trading</CardTitle>
          <CardText>Smallholder-to-buyer aggregation. Contract growing, stockpiling, and price optimisation.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="amber">Volume</Tag>
            <Tag color="amber">Yield capture</Tag>
          </div>
        </Card>
        <Card accent="purple">
          <CardTitle>Data</CardTitle>
          <CardText>Satellite imagery, AI yield prediction, and credit scoring sold as B2B SaaS to banks.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="purple">B2B SaaS</Tag>
            <Tag color="slate">5x ROI for banks</Tag>
          </div>
        </Card>
      </div>
    </SlideShell>
  );
}
