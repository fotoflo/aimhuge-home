import Image from "next/image";
import Link from "next/link";
import { NewsletterCTA } from "./components/NewsletterCTA";

const testimonials = [
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
  {
    quote:
      "I learned how to use Cursor AI to speed up my daily work — how to write good prompts, Cursor applied rules and context, and more.",
    name: "Trong",
    title: "Engineer, Jibble",
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
            <p className="text-lg text-muted max-w-xl leading-relaxed">
              With 25+ years building products across Asia—and having served as CTO, Chief Growth Officer, and Director of VC accelerators—I don't just teach theory. I help engineering, product, and leadership teams go from curious about AI to building with it through hands-on workshops, hackathons, and 1:1 executive training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
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
              width={804}
              height={1071}
              sizes="(max-width: 768px) 100vw, 320px"
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

      {/* Featured Testimonial — Fawad */}
      <section className="relative overflow-hidden grain">
        {/* Background layers */}
        <div className="absolute inset-0 bg-surface" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 40%)",
          }}
        />
        {/* Accent bar — left edge only, asymmetric */}
        <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-accent" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-[1fr_280px] gap-16 md:gap-20 items-center">
            {/* Quote side — left aligned, editorial */}
            <div className="space-y-8 animate-slide-left">
              {/* Oversized quote mark as a design element */}
              <span
                className="block text-accent text-[120px] md:text-[160px] leading-[0.6] font-serif select-none opacity-60"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <div className="-mt-8 space-y-5">
                <p
                  className="text-[1.65rem] md:text-[2.1rem] leading-[1.3] tracking-[-0.01em] text-white"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Probably one of the best company investments in training
                  I&apos;ve personally ever made or at least delivered the
                  highest ROI.
                </p>
                <p
                  className="text-xl md:text-2xl leading-[1.35] text-white/80"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  A few die hard AI fans now! Including me.
                </p>
              </div>

              {/* Attribution */}
              <div className="pt-6 flex items-center gap-5">
                <div className="w-12 h-[2px] bg-accent" />
                <a
                  href="https://www.linkedin.com/in/fawadakram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <p className="text-base font-semibold text-white group-hover:text-accent transition-colors tracking-wide uppercase">
                    Fawad Akram
                  </p>
                  <p className="text-muted text-sm mt-0.5">
                    Founder &amp; Chief Growth Officer, Jibble Group
                  </p>
                </a>
              </div>
            </div>

            {/* Photo — right side, square crop with corner accent */}
            <div className="animate-slide-right delay-2 justify-self-center md:justify-self-end">
              <div className="relative">
                {/* Corner accent lines */}
                <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-accent/50" />
                <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-accent/50" />

                <a
                  href="https://www.linkedin.com/in/fawadakram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D5603AQGfcL-T-5AvXQ/profile-displayphoto-shrink_200_200/B56ZSCOThsHsAY-/0/1737351580267?e=1776297600&v=beta&t=og22w4KJ144GnQl9MUeHPi5XBGgoslImVS0HklttyCA"
                    alt="Fawad Akram"
                    width={200}
                    height={200}
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="w-52 h-52 md:w-60 md:h-60 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </a>

                {/* Company label */}
                <p className="absolute -bottom-8 right-0 text-xs text-muted tracking-[0.2em] uppercase">
                  Jibble Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-xs text-accent tracking-[0.3em] uppercase mb-3">
          From the team
        </p>
        <h2 className="text-3xl font-bold mb-16">
          What participants are saying
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`relative border-l-2 border-accent/30 pl-6 py-1 animate-fade-up delay-${i + 1}`}
            >
              <p
                className="text-[15px] text-foreground/80 leading-relaxed mb-4"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-[1px] bg-card-border" />
                <div>
                  <p className="font-medium text-sm tracking-wide">{t.name}</p>
                  <p className="text-xs text-muted">{t.title}</p>
                </div>
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

      {/* Newsletter */}
      <NewsletterCTA sourcePage="/" />

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
