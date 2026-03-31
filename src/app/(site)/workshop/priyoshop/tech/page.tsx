import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AimHuge × Priyoshop — AI Engineering in Production",
  description:
    "1-day AI Engineering Workshop for Priyoshop tech team. March 30, 2026. Dhaka, Bangladesh. Claude Code, AI-assisted development, and production workflows.",
  openGraph: {
    title: "AimHuge × Priyoshop — AI Engineering in Production | March 30, 2026",
    description:
      "1-day AI Engineering Workshop for Priyoshop tech team. Claude Code, AI-assisted development, and production workflows.",
    images: [{ url: "/images/priyoshop-tech-og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AimHuge × Priyoshop — AI Engineering in Production | March 30, 2026",
    description:
      "1-day AI Engineering Workshop for Priyoshop tech team. Claude Code, AI-assisted development, and production workflows.",
    images: ["/images/priyoshop-tech-og.jpg"],
  },
};

export default function PriyoshopTechWorkshop() {
  return (
    <div className="relative min-h-screen">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none grain z-50" />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-surface" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, var(--accent) 0%, transparent 50%)",
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent" />

        <div className="relative z-10 mx-auto max-w-5xl px-8 pt-20 pb-16">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs text-accent tracking-[0.3em] uppercase">
                Engineering Workshop · March 30, 2026
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                AI Engineering
                <br />
                in Production
              </h1>
              <p className="text-lg text-muted max-w-lg leading-relaxed">
                A full-day intensive for Priyoshop&apos;s engineering team.
                Master Claude Code, ship AI-assisted code, and transform
                your development workflow.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right shrink-0">
              <Image
                src="/images/logo-white.png"
                alt="AimHuge"
                width={120}
                height={32}
                className="h-7 w-auto opacity-80"
                priority
                style={{ width: "auto" }}
              />
              <span className="text-xs text-muted tracking-wider">
                × Priyoshop
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ KEY DETAILS BAR ═══ */}
      <section className="border-y border-card-border bg-card-bg">
        <div className="mx-auto max-w-5xl px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {[
              { label: "Date", value: "March 30, 2026" },
              { label: "Location", value: "Dhaka, Bangladesh" },
              { label: "Audience", value: "Engineering Team" },
              { label: "Primary Tool", value: "Claude Code" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] text-accent tracking-[0.2em] uppercase mb-1">
                  {item.label}
                </p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OBJECTIVE ═══ */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
          Objective
        </p>
        <h2 className="text-2xl font-bold mb-6">
          Build software 2–5× faster with AI
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⚡",
              title: "Ship faster",
              desc: "Use Claude Code to build production-quality features in a fraction of the time",
            },
            {
              icon: "🛠",
              title: "Real workflows",
              desc: "Learn context management, agent control, git integration, and testing strategies for AI-assisted development",
            },
            {
              icon: "🔒",
              title: "Production-grade",
              desc: "Security considerations, code review, and quality assurance when working with AI-generated code",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-card-border rounded-lg p-6 bg-card-bg"
            >
              <p className="text-2xl mb-3">{item.icon}</p>
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SCHEDULE ═══ */}
      <section className="bg-surface border-y border-card-border">
        <div className="mx-auto max-w-5xl px-8 py-16">
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
            Schedule
          </p>
          <h2 className="text-2xl font-bold mb-12">
            One day, maximum impact
          </h2>

          <div className="space-y-6">
            {[
              {
                time: "Morning",
                title: "Discovery & Claude Code Foundations",
                items: [
                  "Silent Meeting: team writes about current AI usage, pain points, and ambitions",
                  "Celebrate what the team is already doing well — surface internal AI champions",
                  "Deep dive into Claude Code: setup, context management, and agent control",
                  "Live demos of production projects built with AI (Flexbike, Notation CMS)",
                ],
              },
              {
                time: "Midday",
                title: "Production Workflows & Skills",
                items: [
                  "Git workflow for AI-assisted development",
                  "Security considerations and testing strategies",
                  "Building a personal skills & commands library",
                  "Prompt engineering for production code — not chatbot prompts",
                ],
              },
              {
                time: "Afternoon",
                title: "Hands-On Build & Apply",
                items: [
                  "Engineers pair up and build a real feature or tool using Claude Code",
                  "Apply AI-assisted development to actual Priyoshop codebase challenges",
                  "Demo what you built — share learnings with the team",
                  "Action planning: integrate AI workflows into daily engineering practice",
                ],
              },
            ].map((block) => (
              <div
                key={block.time}
                className="grid md:grid-cols-[160px_1fr] gap-6"
              >
                <div>
                  <p className="text-sm font-semibold tracking-wide uppercase">
                    {block.time}
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{block.title}</h3>
                  <div className="space-y-2 text-sm text-foreground/80">
                    {block.items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                        <p className="text-muted">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOOLS COVERED ═══ */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
          Tools & Topics
        </p>
        <h2 className="text-2xl font-bold mb-10">What we&apos;ll cover</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            {
              num: "01",
              title: "Claude Code mastery",
              desc: "Plan mode, resume, context management, and building production-quality code with AI",
            },
            {
              num: "02",
              title: "Git & AI workflow",
              desc: "Branch strategies, commit hygiene, and code review practices for AI-assisted development",
            },
            {
              num: "03",
              title: "Prompt engineering for code",
              desc: "Writing effective prompts for complex features, debugging, and refactoring",
            },
            {
              num: "04",
              title: "Testing & security",
              desc: "Ensuring AI-generated code meets quality and security standards before shipping",
            },
            {
              num: "05",
              title: "Skills & commands library",
              desc: "Build reusable prompt templates and workflows your team can share",
            },
            {
              num: "06",
              title: "Real-world application",
              desc: "Apply everything to Priyoshop's actual codebase and engineering challenges",
            },
          ].map((topic) => (
            <div key={topic.num} className="flex gap-4 items-start">
              <span className="text-accent font-mono text-sm font-bold mt-0.5 shrink-0">
                {topic.num}
              </span>
              <div>
                <p className="font-semibold text-sm">{topic.title}</p>
                <p className="text-sm text-muted mt-0.5">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ OUTCOMES ═══ */}
      <section className="bg-surface border-y border-card-border">
        <div className="mx-auto max-w-5xl px-8 py-16">
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
            Expected outcomes
          </p>
          <h2 className="text-2xl font-bold mb-10">
            What Priyoshop&apos;s engineering team walks away with
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              {
                num: "01",
                title: "2–5× faster development",
                desc: "Engineers build software dramatically faster using AI-assisted workflows",
              },
              {
                num: "02",
                title: "Claude Code fluency",
                desc: "Team-wide confidence with production-grade AI development tooling",
              },
              {
                num: "03",
                title: "Production-ready skills",
                desc: "Not just demos — real techniques for shipping quality code with AI every day",
              },
              {
                num: "04",
                title: "Shared team playbook",
                desc: "Reusable prompts, workflows, and best practices the whole team can build on",
              },
              {
                num: "05",
                title: "Hands-on experience",
                desc: "Every engineer will have built something real with Claude Code during the workshop",
              },
            ].map((outcome) => (
              <div key={outcome.num} className="flex gap-4 items-start">
                <span className="text-accent font-mono text-sm font-bold mt-0.5 shrink-0">
                  {outcome.num}
                </span>
                <div>
                  <p className="font-semibold text-sm">{outcome.title}</p>
                  <p className="text-sm text-muted mt-0.5">{outcome.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <div className="border-l-2 border-accent/40 pl-8 max-w-2xl">
          <p
            className="text-xl leading-relaxed text-foreground/80"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            &ldquo;Probably one of the best company investments in training
            I&apos;ve personally ever made or at least delivered the highest ROI.
            A few die hard AI fans now! Including me.&rdquo;
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Image
              src="https://media.licdn.com/dms/image/v2/D5603AQGfcL-T-5AvXQ/profile-displayphoto-shrink_200_200/B56ZSCOThsHsAY-/0/1737351580267?e=1776297600&v=beta&t=og22w4KJ144GnQl9MUeHPi5XBGgoslImVS0HklttyCA"
              alt="Fawad Akram"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">Fawad Akram</p>
              <p className="text-xs text-muted">
                Founder &amp; CGO, Jibble Group — Previous AimHuge client
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FACILITATOR ═══ */}
      <section className="bg-surface border-y border-card-border">
        <div className="mx-auto max-w-5xl px-8 py-16">
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
            Your facilitator
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Image
              src="/images/alex-headshot.jpg"
              alt="Alex Miller"
              width={120}
              height={120}
              className="w-28 h-28 rounded-sm object-cover shrink-0"
            />
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Alex I Miller</h3>
              <p className="text-sm text-accent">Founder, AimHuge</p>
              <div className="text-sm text-muted leading-relaxed space-y-2">
                <p>
                  Former CTO and venture investor at Accelerating Asia (56
                  portfolio companies). Builder of multiple production AI-built
                  apps including Flexbike, HabitCal, and Notation CMS.
                </p>
                <p>
                  Workshops delivered for{" "}
                  <a href="https://www.jibble.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Jibble Group</a>,{" "}
                  <a href="https://ling-app.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Ling App</a>, and others.
                  25+ years building software across Asia. Based in Chiang
                  Mai, Thailand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOCATION ═══ */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
              Location
            </p>
            <h3 className="text-lg font-bold mb-2">Dhaka, Bangladesh</h3>
            <p className="text-sm text-muted">
              Venue to be confirmed
            </p>
          </div>
          <div>
            <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
              Contact
            </p>
            <h3 className="text-lg font-bold mb-2">Alex Miller</h3>
            <p className="text-sm text-muted">
              <a href="mailto:fotoflo@gmail.com" className="hover:text-foreground transition-colors">fotoflo@gmail.com</a>
              <br />
              <a
                href="https://calendly.com/fotoflo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                Book a call →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-card-border">
        <div className="mx-auto max-w-5xl px-8 py-6 flex items-center justify-between">
          <Image
            src="/images/logo-white.png"
            alt="AimHuge"
            width={80}
            height={22}
            className="h-5 w-auto opacity-60"
            style={{ width: "auto" }}
          />
          <p className="text-xs text-muted">
            Confidential — Prepared for Priyoshop
          </p>
        </div>
      </footer>
    </div>
  );
}
