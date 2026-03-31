import type { Metadata } from "next";
import { NewsletterCTA } from "../components/NewsletterCTA";

export const metadata: Metadata = {
  title: "Portfolio — AimHuge",
  description:
    "Projects, investments, and ventures by Alex Miller — from startup syndicates to fitness apps.",
  openGraph: {
    title: "Portfolio — AimHuge",
    description:
      "Projects, investments, and ventures by Alex Miller — from startup syndicates to fitness apps.",
    images: [{ url: "/images/alex-headshot.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — AimHuge",
    description:
      "Projects, investments, and ventures by Alex Miller — from startup syndicates to fitness apps.",
    images: ["/images/alex-headshot.jpg"],
  },
};

const projects = [
  {
    title: "Particle Alliance",
    desc: "Startup investment syndicate. Investing in early-stage startups with a hands-on approach to portfolio support.",
    url: "https://particlealliance.com",
    tag: "Investment",
  },
  {
    title: "HabitCal",
    desc: "Habit tracking app designed around calendar-based workflows for building consistent daily practices.",
    url: "https://habitcal.app",
    tag: "Product",
  },
  {
    title: "FlexBike",
    desc: "Fitness cycling app. CTO and builder of the core product experience.",
    url: "https://flexbike.app",
    tag: "Product",
  },
];

const socialLinks = [
  {
    title: "LinkedIn",
    desc: "Professional profile and career history.",
    url: "https://www.linkedin.com/in/fotoflo",
  },
  {
    title: "YouTube",
    desc: "Talks, tutorials, and thoughts on startups and AI.",
    url: "https://www.youtube.com/@fotoflo",
  },
  {
    title: "Instagram",
    desc: "Life in Asia, travel, and behind the scenes.",
    url: "https://www.instagram.com/fotoflo",
  },
  {
    title: "Facebook",
    desc: "Personal updates and community.",
    url: "https://www.facebook.com/fotoflo",
  },
];

const mentorship = [
  "Accelerating Asia",
  "Orbit Startups",
  "500 Startups",
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          Projects & Ventures
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
          Portfolio
        </h1>
        <p className="text-lg text-muted mt-6 max-w-2xl">
          A selection of things I&apos;ve built, invested in, and contributed
          to.
        </p>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-card-border p-6 space-y-3 hover:border-accent/50 transition-colors block"
            >
              <span className="text-xs font-medium text-accent uppercase tracking-wider">
                {project.tag}
              </span>
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-muted">{project.desc}</p>
              <span className="text-accent text-sm font-medium">
                Visit →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Mentorship */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Mentorship & Accelerators
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            Mentor and advisor to startups through leading accelerator programs
            across Asia and globally.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {mentorship.map((org) => (
              <span
                key={org}
                className="rounded-full border border-card-border px-6 py-3 text-sm font-medium"
              >
                {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social links */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Find Me Online</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {socialLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-card-border p-6 hover:border-accent/50 transition-colors block"
            >
              <h3 className="font-semibold mb-1">{link.title}</h3>
              <p className="text-sm text-muted">{link.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Writings */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Writing Archive</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            30 years on the internet means a lot of writing. From LiveJournal to
            today, I&apos;ve been thinking out loud about technology, startups,
            and life in Asia.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCTA sourcePage="/portfolio" />
    </>
  );
}
