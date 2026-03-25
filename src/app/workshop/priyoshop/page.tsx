import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AimHuge × Priyoshop — AI Productivity for Leadership",
  description:
    "1-day AI Productivity Workshop for Priyoshop leadership team. March 30, 2026. Dhaka, Bangladesh. Reduce time waste, improve decision quality, increase execution speed.",
  openGraph: {
    title: "AimHuge × Priyoshop — AI Productivity for Leadership | March 30, 2026",
    description:
      "1-day AI Productivity Workshop for 30 leadership team members. March 30, 2026 in Dhaka, Bangladesh. ChatGPT, Claude, AI assistants, and practical use cases.",
    images: [{ url: "/images/alex-headshot.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AimHuge × Priyoshop — AI Productivity for Leadership | March 30, 2026",
    description:
      "1-day AI Productivity Workshop for 30 leadership team members. March 30, 2026 in Dhaka, Bangladesh. ChatGPT, Claude, AI assistants, and practical use cases.",
    images: ["/images/alex-headshot.jpg"],
  },
};

export default function PriyoshopWorkshop() {
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
                Leadership Workshop · March 30, 2026
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                AI Productivity
                <br />
                for Leadership
              </h1>
              <p className="text-lg text-muted max-w-lg leading-relaxed">
                A full-day immersive session for Priyoshop&apos;s leadership
                team. Reduce time waste. Improve decision quality. Increase
                execution speed across the organization.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right shrink-0">
              <Image
                src="/images/logo-white.png"
                alt="AimHuge"
                width={120}
                height={32}
                className="h-7 w-auto opacity-80"
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
              { label: "Audience", value: "~30 Leadership Team" },
              { label: "Tools", value: "ChatGPT, Claude, AI Assistants" },
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
          Transform how your leadership team works with AI
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "⏱",
              title: "Reduce time waste",
              desc: "Automate repetitive tasks, streamline communication, and eliminate manual bottlenecks with AI tools",
            },
            {
              icon: "🎯",
              title: "Improve decision quality",
              desc: "Use AI for data analysis, scenario planning, and decision support across business functions",
            },
            {
              icon: "⚡",
              title: "Increase execution speed",
              desc: "Move faster from insight to action with AI-assisted workflows embedded into daily operations",
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
                title: "AI Landscape & Hands-On Foundations",
                items: [
                  "Welcome & current AI usage audit — where is your team today?",
                  "Live demos: ChatGPT, Claude, and AI personal assistants in action",
                  "Hands-on: Every participant sets up and uses AI tools in real time",
                  "Prompt engineering for leaders — how to get reliable, high-quality outputs",
                ],
              },
              {
                time: "Midday",
                title: "Practical Use Cases & Workflows",
                items: [
                  "Converting Excel workflows into AI-driven data analysis",
                  "AI for decision support — scenario planning and strategic analysis",
                  "Email, reporting, and communication automation",
                  "Building your personal AI assistant stack",
                ],
              },
              {
                time: "Afternoon",
                title: "Team Exercises & Action Planning",
                items: [
                  "Team exercises: Apply AI to real Priyoshop challenges",
                  "Identify top 5 AI opportunities for each department",
                  "Build 90-day AI adoption roadmap for leadership team",
                  "Q&A, debrief, and next steps",
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
              title: "ChatGPT & Claude",
              desc: "When to use which, prompt strategies, and getting consistent professional outputs",
            },
            {
              num: "02",
              title: "AI Personal Assistants",
              desc: "Set up AI assistants for scheduling, email, research, and daily task management",
            },
            {
              num: "03",
              title: "Excel to AI Data Analysis",
              desc: "Transform manual spreadsheet workflows into AI-powered analysis and reporting",
            },
            {
              num: "04",
              title: "Decision Support",
              desc: "Use AI to synthesize data, model scenarios, and support strategic decisions",
            },
            {
              num: "05",
              title: "Communication & Reporting",
              desc: "Draft reports, presentations, and stakeholder communications 5× faster",
            },
            {
              num: "06",
              title: "Team AI Playbook",
              desc: "Build a shared playbook of AI workflows your leadership team can use immediately",
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
            What Priyoshop walks away with
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              {
                num: "01",
                title: "AI-confident leadership",
                desc: "Every leader comfortable using AI tools in their daily workflow",
              },
              {
                num: "02",
                title: "Practical AI skills",
                desc: "Hands-on experience with ChatGPT, Claude, and AI assistants — not just theory",
              },
              {
                num: "03",
                title: "Data-driven decisions",
                desc: "AI workflows replacing manual Excel analysis for faster, better insights",
              },
              {
                num: "04",
                title: "90-day adoption roadmap",
                desc: "Clear action plan for rolling out AI productivity across the leadership team",
              },
              {
                num: "05",
                title: "Shared AI playbook",
                desc: "Team-wide library of prompts, workflows, and best practices to use immediately",
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
          />
          <p className="text-xs text-muted">
            Confidential — Prepared for Priyoshop
          </p>
        </div>
      </footer>
    </div>
  );
}
