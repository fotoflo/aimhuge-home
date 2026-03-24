import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Alex Miller — AimHuge",
  description:
    "25+ years building software products in Asia. Startup operator, investor, triathlete, and AI trainer.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">
              About
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Alex Miller
            </h1>
            <div className="space-y-4 text-muted leading-relaxed max-w-xl">
              <p>
                I&apos;ve been building software products for over 25 years.
                I&apos;ve served as CTO, Head of Product, and Chief Growth
                Officer at companies across Asia and beyond. I&apos;ve run VC
                accelerator programs with 56 portfolio companies and designed
                training programs for global organizations like Lenovo and Volvo.
              </p>
              <p>
                Today I focus on helping founders and CXOs revamp their
                organizations for AI — starting with the people they have.
                I train engineers, product managers, and leadership on using AI
                tools to ship faster and think bigger.
              </p>
              <p>
                I&apos;m also an active investor through{" "}
                <a
                  href="https://particlealliance.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover"
                >
                  Particle Alliance
                </a>
                , and I build products like{" "}
                <a
                  href="https://habitcal.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover"
                >
                  HabitCal
                </a>{" "}
                and{" "}
                <a
                  href="https://flexbike.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover"
                >
                  FlexBike
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/me.jpg"
              alt="Alex Miller"
              width={360}
              height={480}
              className="rounded-2xl object-cover w-72 h-96"
            />
          </div>
        </div>
      </section>

      {/* Asia */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">25+ Years in Asia</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  I&apos;ve lived and worked across Asia for over two decades.
                  I speak Mandarin, Indonesian, and Singlish — and I understand
                  the unique dynamics of building technology businesses in the
                  region.
                </p>
                <p>
                  This experience gives me a perspective that most Western
                  advisors don&apos;t have. I understand the markets, the
                  cultures, and the pace at which things move in Southeast Asia
                  and Greater China.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Image
                src="/images/alex-dion.jpg"
                alt="Alex in Asia"
                width={360}
                height={360}
                className="rounded-2xl object-cover w-72 h-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Personal */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <Image
              src="/images/triathlon.jpg"
              alt="Alex at triathlon"
              width={360}
              height={260}
              className="rounded-2xl object-cover w-72 h-52"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">Beyond Work</h2>
            <p className="text-muted leading-relaxed">
              When I&apos;m not building software or advising startups, you can
              find me training for triathlons, cycling, or exploring the outdoor
              landscapes of Southeast Asia. I believe in building physical and
              mental resilience alongside professional growth.
            </p>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Languages</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["English (Native)", "Mandarin", "Indonesian", "Singlish"].map(
              (lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-card-border px-6 py-3 text-sm font-medium"
                >
                  {lang}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Want to connect?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto">
          I&apos;m always happy to chat with founders, operators, and anyone
          building interesting things.
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
