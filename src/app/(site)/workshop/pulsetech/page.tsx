import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AimHuge × PulseTech — AI Engineering in Production",
  description:
    "3-day AI Engineering in Production workshop & hackathon. March 31 – April 2, 2026. Dhaka, Bangladesh. Build software 2-5x faster with Claude Code.",
  openGraph: {
    title: "AimHuge × PulseTech — AI Engineering in Production | Mar 31 – Apr 2, 2026",
    description:
      "3-day AI Engineering in Production workshop & hackathon. March 31 – April 2, 2026 in Dhaka, Bangladesh. Build software 2-5x faster with Claude Code.",
    images: [{ url: "/images/pulsetech-og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AimHuge × PulseTech — AI Engineering in Production | Mar 31 – Apr 2, 2026",
    description:
      "3-day AI Engineering in Production workshop & hackathon. March 31 – April 2, 2026 in Dhaka, Bangladesh. Build software 2-5x faster with Claude Code.",
    images: ["/images/pulsetech-og.jpg"],
  },
};

export default function PulseTechOnePager() {
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
                Private Workshop · March 31 – April 2, 2026
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                AI Engineering
                <br />
                in Production
              </h1>
              <p className="text-lg text-muted max-w-lg leading-relaxed">
                A 3-day immersive workshop and hackathon for PulseTech&apos;s
                engineering team. Build real projects. Ship with AI. Transform
                how your team develops software.
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
                × PulseTech
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
              { label: "Dates", value: "Mar 31 – Apr 2, 2026" },
              { label: "Location", value: "PulseTech Office, Dhaka" },
              { label: "Focus", value: "Engineering Teams" },
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

      {/* ═══ 3-DAY SCHEDULE ═══ */}
      <section className="mx-auto max-w-5xl px-8 py-16">
        <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
          Schedule
        </p>
        <h2 className="text-2xl font-bold mb-12">Three days, one mission</h2>

        <div className="space-y-12">
          {/* Day 1 */}
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase">
                Day 1
              </p>
              <p className="text-xs text-muted mt-1">
                Tuesday, March 31
              </p>
              <p className="text-xs text-muted">12:30 PM – 6:00 PM</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Executive 101s &amp; Team Orientation
              </h3>
              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex gap-3">
                  <span className="text-accent shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      1-on-1s with tech team
                    </p>
                    <p className="text-muted">
                      Understand current AI usage, pain points, tooling, and
                      ambitions
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      1-on-1s with business team
                    </p>
                    <p className="text-muted">
                      Product priorities, delivery challenges, AI adoption
                      expectations
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-accent shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Office tour &amp; team introductions
                    </p>
                    <p className="text-muted">
                      Informal meet-and-greet with the full team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-card-border" />

          {/* Day 2 */}
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase">
                Day 2
              </p>
              <p className="text-xs text-muted mt-1">
                Wednesday, April 1
              </p>
              <p className="text-xs text-muted">9:00 AM – Midnight</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Workshop + Hackathon Kickoff
              </h3>
              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Discovery &amp; Celebration
                    </p>
                    <p className="text-muted">
                      Silent Meeting format — surface existing skills, fears,
                      gaps. Identify internal AI champions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Claude Code Deep Dive
                    </p>
                    <p className="text-muted">
                      Context management, agent control, production workflows,
                      git integration, security, and testing. Live demos from
                      real AI-built apps.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Hackathon Kickoff
                    </p>
                    <p className="text-muted">
                      Pitch ideas, form teams, define scope — then build until
                      midnight.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-card-border" />

          {/* Day 3 */}
          <div className="grid md:grid-cols-[200px_1fr] gap-6">
            <div>
              <p className="text-sm font-semibold tracking-wide uppercase">
                Day 3
              </p>
              <p className="text-xs text-muted mt-1">
                Thursday, April 2
              </p>
              <p className="text-xs text-muted">9:00 AM – 7:00 PM</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Ship &amp; Present
              </h3>
              <div className="space-y-3 text-sm text-foreground/80">
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Final build sprint
                    </p>
                    <p className="text-muted">
                      Teams complete their projects with mentoring support
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Presentations &amp; judging
                    </p>
                    <p className="text-muted">
                      Each team demos their project. Winners announced.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-1 bg-accent/30 rounded-full" />
                  <div>
                    <p className="font-medium text-foreground">
                      Team dinner
                    </p>
                    <p className="text-muted">
                      Celebrate together, decompress, and discuss next steps
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUTCOMES ═══ */}
      <section className="bg-surface border-y border-card-border">
        <div className="mx-auto max-w-5xl px-8 py-16">
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
            Expected outcomes
          </p>
          <h2 className="text-2xl font-bold mb-10">
            What PulseTech walks away with
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
                title: "Culture shift",
                desc: "Move from AI-curious to AI-native — responsible, enthusiastic adoption",
              },
              {
                num: "04",
                title: "Working software",
                desc: "Real projects built and shipped during the hackathon, not just slides",
              },
              {
                num: "05",
                title: "Clear AI roadmap",
                desc: "Understanding of where AI fits into PulseTech's engineering workflow",
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
            <h3 className="text-lg font-bold mb-2">PulseTech Office</h3>
            <p className="text-sm text-muted">
              25 BSTI Road
              <br />
              Dhaka, Bangladesh
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
            Confidential — Prepared for PulseTech
          </p>
        </div>
      </footer>
    </div>
  );
}
