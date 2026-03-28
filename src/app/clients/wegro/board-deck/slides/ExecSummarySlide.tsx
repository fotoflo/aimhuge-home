import { SlideShell } from "../components/SlideShell";
import { Card, CardTitle, CardText } from "../components/Card";
import { Tag } from "../components/Tag";

export function ExecSummarySlide() {
  return (
    <SlideShell
      variant="light"
      sectionLabel="Executive Summary"
      title="Four Divisions, One Ecosystem"
      subtitle="WeGro captures value across the entire agricultural value chain through four interconnected businesses."
    >
      <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
        <Card accent="green">
          <div className="text-2xl mb-2">&#127793;</div>
          <CardTitle>Inputs</CardTitle>
          <CardText>Seeds, fertilisers, micronutrients, machinery, and protected agriculture. High-margin products that establish the farmer relationship.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="green">Entry Point</Tag>
            <Tag color="green">60-80% margins</Tag>
          </div>
        </Card>
        <Card accent="blue">
          <div className="text-2xl mb-2">&#128176;</div>
          <CardTitle>Financing</CardTitle>
          <CardText>Crop-collateralised loans, trade financing, and electronic warehouse receipts. Solves the capital gap for smallholders.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="blue">Lock-in</Tag>
            <Tag color="blue">$3.5B mandate</Tag>
          </div>
        </Card>
        <Card accent="amber">
          <div className="text-2xl mb-2">&#128666;</div>
          <CardTitle>Trading</CardTitle>
          <CardText>Aggregation from smallholders to industrial buyers. Contract growing, stockpiling, and commodity price optimisation.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="amber">Volume</Tag>
            <Tag color="amber">Yield capture</Tag>
          </div>
        </Card>
        <Card accent="purple">
          <div className="text-2xl mb-2">&#128202;</div>
          <CardTitle>Data</CardTitle>
          <CardText>Satellite imagery, AI yield prediction, and farmer credit scoring sold to banks and financial institutions as a B2B service.</CardText>
          <div className="mt-auto pt-3.5">
            <Tag color="purple">B2B SaaS</Tag>
            <Tag color="slate">5x ROI for banks</Tag>
          </div>
        </Card>
      </div>
    </SlideShell>
  );
}
