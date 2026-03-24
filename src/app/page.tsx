import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "Even skeptical team members have been silenced or won around — probably one of the best company investments in training I've personally ever made, or at least delivered the highest ROI.",
    name: "Fawad Akram",
    title: "Founder & CGO, Jibble",
  },
  {
    quote:
      "I passed over my AI coding prejudice, set a goal to create all code using just AI and learned a lot from it. I see a bunch of places where we can speed up development without losing in quality.",
    name: "Alex K",
    title: "Mobile & Desktop Team Lead, Jibble",
  },
  {
    quote:
      "It was the first time I used AI to build a product end-to-end that connects to another product using API keys. Working with AI exceeded my expectations.",
    name: "Nikofor",
    title: "Quantitative Financial Analyst & PM",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">
              Startup Operator · Investor · AI Trainer
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform your team with{" "}
              <span className="text-accent">AI engineering</span> that actually
              ships.
            </h1>
            <p className="text-lg text-muted max-w-xl">
              I help engineering, product, and leadership teams go from curious
              about AI to building with it — through hands-on workshops,
              hackathons, and 1:1 executive training.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://calendly.com/fotoflo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Book a Call
              </a>
              <Link
                href="/workshop"
                className="rounded-full border border-card-border px-7 py-3 font-medium text-foreground hover:border-muted transition-colors"
              >
                Learn About the Workshop
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/alex-headshot.jpg"
              alt="Alex Miller"
              width={360}
              height={360}
              className="rounded-2xl object-cover w-72 h-72 md:w-80 md:h-80"
              priority
            />
          </div>
        </div>
      </section>

      {/* Workshop highlight */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">
              Featured Program
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              AI Engineering in Production
            </h2>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              A 2-day immersive workshop with a 24-hour hackathon. Your team
              learns real AI engineering skills and ships a project before they
              leave.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                label: "Day 1",
                title: "Learn & Build Skills",
                desc: "Unpack existing skills, find internal leaders, master Claude Code and Cursor, build a skills library, and form hackathon teams.",
              },
              {
                label: "Overnight",
                title: "24-Hour Hackathon",
                desc: "Teams build real projects using their new AI skills. Ship something meaningful in 24 hours with hands-on mentoring.",
              },
              {
                label: "Day 2",
                title: "Ship & Celebrate",
                desc: "Wrap up projects, present to the group, team dinner, and announce the winners. Walk away with real momentum.",
              },
            ].map((phase) => (
              <div
                key={phase.label}
                className="rounded-xl border border-card-border p-6 space-y-3"
              >
                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                  {phase.label}
                </span>
                <h3 className="text-xl font-semibold">{phase.title}</h3>
                <p className="text-sm text-muted">{phase.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/workshop"
              className="rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-hover transition-colors inline-block"
            >
              Workshop Details →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-card-border p-6 space-y-4"
            >
              <p className="text-sm text-muted leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services overview */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            How I Can Help
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Team Workshops",
                desc: "2-day AI Engineering in Production program for engineering and product teams. Hands-on skills training plus a 24-hour hackathon.",
                href: "/workshop",
              },
              {
                title: "Executive Training",
                desc: "1:1 sessions for founders and C-suite on Claude Cowork and Claude Code. Learn how AI fits into your leadership and decision-making.",
                href: "/advisory",
              },
              {
                title: "Startup Advisory",
                desc: "25+ years of operating experience across CTO, CPO, and CGO roles. Technology, go-to-market, leadership, and AI strategy.",
                href: "/advisory",
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="rounded-xl border border-card-border p-6 space-y-3 hover:border-accent/50 transition-colors block"
              >
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted">{s.desc}</p>
                <span className="text-accent text-sm font-medium">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to level up your team?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Whether you need a full workshop for your engineering org or 1:1
          executive coaching on AI, let&apos;s talk about what makes sense for
          you.
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
