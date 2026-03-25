import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Engineering Workshop — AimHuge",
  description:
    "A 2-day immersive AI engineering workshop with a 24-hour hackathon. Your team learns real AI engineering skills and ships a project before they leave.",
  openGraph: {
    title: "AI Engineering Workshop — AimHuge",
    description:
      "2-day immersive AI engineering workshop + 24-hour hackathon. Your team learns real AI skills and ships a project before they leave.",
    images: [{ url: "/images/alex-headshot.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Engineering Workshop — AimHuge",
    description:
      "2-day immersive AI engineering workshop + 24-hour hackathon. Your team learns real AI skills and ships a project before they leave.",
    images: ["/images/alex-headshot.jpg"],
  },
};

const skills = [
  "Claude Code & Cursor mastery",
  "Plan mode, resume, and new commands",
  "Building a skills & commands library",
  "Voice-driven development",
  "Letting AI interview you for context",
  "Prompt engineering for production code",
];

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
      "I learned how to use Cursor AI to speed up my daily work — how to write good prompts, Cursor applied rules and context, and more.",
    name: "Trong",
    title: "Engineer, Jibble",
  },
  {
    quote:
      "It was the first time I used AI to build a product end-to-end that connects to another product using API keys. Working with AI exceeded my expectations.",
    name: "Nikofor",
    title: "Quantitative Financial Analyst & PM",
  },
  {
    quote:
      "I really liked seeing AI inside real systems, such as for parsing and analyzing some information. It made me think more about practical AI use cases.",
    name: "Dennis",
    title: "Engineer, Jibble",
  },
  {
    quote:
      "I loved to see everyone's creativity and determination throughout the hackathon.",
    name: "Saysha",
    title: "PM, Jibble",
  },
];

export default function WorkshopPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          2-Day Immersive Program
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          AI Engineering in Production
        </h1>
        <p className="text-lg text-muted mt-6 max-w-2xl">
          Your team learns real AI engineering skills on Day 1, then proves it
          by shipping a project in a 24-hour hackathon. We wrap up with a team
          dinner and winner announcements on Day 2.
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href="https://calendly.com/fotoflo/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-hover transition-colors"
          >
            Book a Call to Learn More
          </a>
        </div>
      </section>

      {/* Three tracks */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">Three Tracks</h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            Tailored content for every level of your organization.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Engineering",
                audience: "Developers & technical leads",
                desc: "Deep dive into AI-assisted coding with Claude Code and Cursor. Build skills libraries, learn plan mode, and ship real features using AI pair programming.",
              },
              {
                title: "Product & PM",
                audience: "Product managers & designers",
                desc: "Learn how AI changes product development workflows. Use AI for research, spec writing, prototyping, and user testing at unprecedented speed.",
              },
              {
                title: "Executive (1:1)",
                audience: "Founders & C-suite",
                desc: "Private sessions on Claude Cowork and Code. Understand how to lead an AI-first org, evaluate AI initiatives, and make informed strategic decisions.",
              },
            ].map((track) => (
              <div
                key={track.title}
                className="rounded-xl border border-card-border p-6 space-y-3"
              >
                <h3 className="text-xl font-semibold">{track.title}</h3>
                <p className="text-xs text-accent font-medium">
                  {track.audience}
                </p>
                <p className="text-sm text-muted">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">The Format</h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {[
            {
              time: "Day 1 — Morning",
              title: "Unpack & Discover",
              desc: "We assess your team's existing skills, identify internal leaders who can lead by example, and set the foundation for what's possible with AI.",
            },
            {
              time: "Day 1 — Afternoon",
              title: "Skill Building",
              desc: "Hands-on training with Claude Code and Cursor. Learn key commands like plan mode, resume, and new. Create a skills library and commands. Practice voice-driven development and AI interviewing techniques.",
            },
            {
              time: "Day 1 — Evening",
              title: "Team Formation",
              desc: "Form hackathon teams, define projects, and kick off the 24-hour build. Teams are balanced across skill levels with clear goals.",
            },
            {
              time: "Overnight",
              title: "24-Hour Hackathon",
              desc: "Teams build real projects using their new AI engineering skills. Mentoring and support available throughout.",
            },
            {
              time: "Day 2 — Evening",
              title: "Ship & Celebrate",
              desc: "Project presentations, team dinner, and winner announcements. Your team leaves with real skills, real projects, and real momentum.",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-accent mt-2" />
                {i < 4 && (
                  <div className="w-px flex-1 bg-card-border mt-2" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-xs font-medium text-accent uppercase tracking-wider">
                  {step.time}
                </p>
                <h3 className="text-lg font-semibold mt-1">{step.title}</h3>
                <p className="text-sm text-muted mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills covered */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Skills Your Team Will Learn
          </h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {skills.map((skill, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-card-border p-4"
              >
                <span className="text-accent font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          From Past Participants
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
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

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bring this workshop to your team
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          Every workshop is tailored to your organization&apos;s tech stack,
          goals, and team composition. Let&apos;s design the right program
          together.
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
