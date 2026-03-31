import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterCTA } from "../components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Advisory & Executive Training — AimHuge",
  description:
    "25+ years of startup operating experience. AI strategy, technology leadership, go-to-market, and 1:1 executive AI training.",
  openGraph: {
    title: "Advisory & Executive Training — AimHuge",
    description:
      "25+ years of startup operating experience. AI strategy, technology leadership, go-to-market, and 1:1 executive AI training.",
    images: [{ url: "/images/alex-headshot.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Advisory & Executive Training — AimHuge",
    description:
      "25+ years of startup operating experience. AI strategy, technology leadership, go-to-market, and 1:1 executive AI training.",
    images: ["/images/alex-headshot.jpg"],
  },
};

const experience = [
  {
    role: "CTO, Head of Product, Chief Growth Officer",
    desc: "25+ years building software products across multiple roles and industries.",
  },
  {
    role: "VC Accelerator Programs",
    desc: "4 years running accelerator programs with 56 portfolio companies.",
  },
  {
    role: "Enterprise Training",
    desc: "5 years designing training programs for global organizations including Lenovo and Volvo.",
  },
  {
    role: "Startup Ecosystem",
    desc: "Mentor at Accelerating Asia, Orbit Startups, and 500 Startups.",
  },
];

const advisoryAreas = [
  {
    title: "AI Strategy & Implementation",
    desc: "Help your organization understand where AI fits, what to build vs. buy, and how to upskill your team for an AI-first future.",
  },
  {
    title: "Technology Leadership",
    desc: "Architecture decisions, team building, engineering culture, and technical roadmap guidance from someone who's been CTO multiple times.",
  },
  {
    title: "Go-to-Market",
    desc: "Product-market fit, growth strategy, and scaling — informed by decades of launching products across Asia and globally.",
  },
  {
    title: "Leadership & Org Design",
    desc: "How to structure teams, develop leaders, and create cultures that ship. Especially relevant for AI-era organizational transformation.",
  },
];

export default function AdvisoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">
              Advisory & Executive Training
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Decades of operating experience, applied to your challenges.
            </h1>
            <p className="text-lg text-muted max-w-xl">
              I advise startups and growth-stage companies on technology,
              go-to-market, leadership, and AI strategy. For executives, I offer
              private 1:1 training on AI tools like Claude Cowork and Claude
              Code.
            </p>
            <a
              href="https://calendly.com/fotoflo/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
            >
              Book a Call
            </a>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/alex-full.jpg"
              alt="Alex Miller"
              width={300}
              height={400}
              className="rounded-2xl object-cover w-64 h-80"
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Background</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {experience.map((exp) => (
              <div
                key={exp.role}
                className="rounded-xl border border-card-border p-6 space-y-2"
              >
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory areas */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How I Can Help
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {advisoryAreas.map((area) => (
            <div key={area.title} className="space-y-2">
              <h3 className="text-xl font-semibold">{area.title}</h3>
              <p className="text-sm text-muted">{area.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Executive training */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
              For Founders & C-Suite
            </p>
            <h2 className="text-3xl font-bold mb-4">
              1:1 Executive AI Training
            </h2>
            <p className="text-muted mb-8">
              Private sessions teaching you Claude Cowork and Claude Code.
              Understand AI not as a buzzword but as a practical tool for
              decision-making, communication, and strategic thinking. C-suite
              executives are also always welcome to join the full team workshop.
            </p>
            <a
              href="https://calendly.com/fotoflo/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-8 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
            >
              Schedule a Session
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCTA sourcePage="/advisory" />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Let&apos;s work together
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Whether you need ongoing advisory or a focused engagement, I&apos;m
          happy to explore how I can help.
        </p>
        <a
          href="https://calendly.com/fotoflo/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-8 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
        >
          Book a 30-Minute Call
        </a>
      </section>
    </>
  );
}
