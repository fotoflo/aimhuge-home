import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talks — AimHuge",
  description:
    "Conference talks and presentations by Alex Miller on startup mindset, AI engineering, and building products.",
};

const talks = [
  {
    title: "The Founder Mindset Playbook",
    event: "TechSauce Global Summit 2025 — Founder Stage",
    description:
      "A deep dive into the mental models and frameworks that separate successful founders from the rest. Covering resilience, decision-making under uncertainty, and how to maintain clarity as you scale.",
    youtubeId: "PD2Pvwz38oM",
    youtubeUrl: "https://www.youtube.com/watch?v=PD2Pvwz38oM",
  },
];

export default function TalksPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          Speaking
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Talks & Presentations
        </h1>
        <p className="text-lg text-muted mt-6 max-w-2xl">
          Conference talks on founder mindset, AI engineering, and building
          products that matter.
        </p>
      </section>

      {/* Talks */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {talks.map((talk) => (
          <div
            key={talk.title}
            className="rounded-xl border border-card-border overflow-hidden"
          >
            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${talk.youtubeId}`}
                title={talk.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-8 space-y-3">
              <p className="text-xs font-medium text-accent uppercase tracking-wider">
                {talk.event}
              </p>
              <h2 className="text-2xl font-bold">{talk.title}</h2>
              <p className="text-muted max-w-2xl">{talk.description}</p>
              <a
                href={talk.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm font-medium inline-block mt-2"
              >
                Watch on YouTube →
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* YouTube channel */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">More on YouTube</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            Subscribe to my channel for more talks, tutorials, and thoughts on
            startups and AI.
          </p>
          <a
            href="https://www.youtube.com/@fotoflo"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-8 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
          >
            Visit YouTube Channel
          </a>
        </div>
      </section>

      {/* Speaking CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Invite me to speak</h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          I speak at conferences and company events on AI engineering, founder
          mindset, and building products in the age of AI.
        </p>
        <a
          href="https://calendly.com/fotoflo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-8 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
