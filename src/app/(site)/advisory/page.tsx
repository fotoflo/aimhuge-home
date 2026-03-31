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
    title: "Company Building & Business Models",
    desc: "Drawing from 25+ years operating across Asia and working at VC accelerators, I help founders refine unit economics, define product-market fit, and construct resilient business models.",
  },
  {
    title: "AI Strategy & Implementation",
    desc: "Move past the AI hype. I work directly with leadership to deploy practical AI tooling like Claude, ChatGPT, Gemini, and Antigravity, systematically upskilling your team for an AI-first future.",
  },
  {
    title: "Technology Leadership & Architecture",
    desc: "Technical roadmap guidance, scaling infrastructure, and forging elite engineering culture based on decades of rapid prototyping and high-scale buildouts (like my time scaling core teams at Renren).",
  },
  {
    title: "Leadership & Org Design",
    desc: "Guidance on structuring teams, developing leaders, unlocking bottlenecks, and creating cultures that reliably ship. Especially critical for organizational agility in the AI era.",
  },
  {
    title: "Connecting Founders & Building Bridges",
    desc: "A thriving ecosystem requires real human connection. Whether it's organizing cross-border farm visits in Chiang Mai, hosting last-minute founder dinners, or discussing the future of agritech and sustainability, I actively work to bridge the gap between people and ideas across Asia.",
  },
  {
    title: "Fundraising & Investor Relations",
    desc: "Leveraging my experience reviewing thousands of pitch decks and actively investing via Particle Alliance, I assist founders in crafting compelling narratives, structuring deals, and navigating complex funding rounds.",
  },
  {
    title: "Pitch Events & Demo Day Prep",
    desc: "Having run accelerator programs and hosted multiple demo days, I help founders refine their story, stage presence, and deck structure to deliver high-impact pitches that resonate cleanly with investors.",
  },
  {
    title: "Neurodivergent Leadership",
    desc: "As a founder managing my own neurodivergency (ADHD, dyslexia), I understand the unique challenges and superpowers that come with it. I coach neurodivergent founders on leveraging their creative problem-solving skills, building structures that work for them, and navigating the often rigid expectations of the business world.",
  },
];

const testimonials = [
  {
    name: "Abhi Agarwal",
    title: "CEO @ Living Roots",
    quote: "Alex is a force. He has been a constant lifeline for entrepreneurs, especially for us. We would not be as far along if it wasn't for Alex. He has a really special ability to break down problems and tackle them from the principles, and I always leave meetings with Alex having more clarity.",
  },
  {
    name: "Mustafa Al Momin",
    title: "Founder & CEO, Palki Motors",
    quote: "Alex has been an invaluable support, helping me build crucial connections for funding my company. He's truly my driving force... After just one meeting with him, my sales shot up by 200%—he identified and removed the blocks that were holding me back.",
  },
  {
    name: "Danil Khasanshin",
    title: "Co-founder & CEO, Laoshi",
    quote: "We only had one call with Alex and only one piece of SEO advice. Since then we have 60k users/month.",
  },
  {
    name: "Ithamar Sorek",
    title: "Chief Revenue Officer, Refuel4",
    quote: "HACKING!!! That is the 1st word that comes to mind... Hacking how to disrupt distribution models with product... This dude puts the pedal to the metal! When talking about SHIPPING and disrupting Alex just GO IT!... It is seldom that you meet Product Peeps that can wear and think in a commercial mind set. The combination of these two things is what makes you GREAT and super valuable.",
  },
  {
    name: "George W. Stone",
    title: "Former Editor in Chief, National Geographic Traveler",
    quote: "Alex was the smartest and hardest-working junior associate we had on staff. He produced excellent articles, generated strong story ideas... Alex matched tremendous skill as both a writer and a photographer, which is a rare asset and one that proved invaluable.",
  },
  {
    name: "Jane Boomer",
    title: "Former Director of Disability Services, Oberlin College",
    quote: "Alex is extremely bright, even when compared to the best of the best. He's tenacious about his learning... A risk taker and creative problem solver, Alex embraces travel and diverse cultures with enthusiasm and sensitivity. I'm pleased to know him as a person, as a friend, and as an academic advisee.",
  }
];

export default function AdvisoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-medium text-accent uppercase tracking-wider">
              Advisory & Executive Training
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Decades of operating experience, applied to your challenges.
            </h1>
            <p className="text-lg text-muted max-w-xl leading-relaxed">
              With 25+ years launching products across Asia and working at VC accelerators, I advise founders and startups on robust company building, scaling business models, and technology leadership. For executives, I provide deep-dive 1:1 training on practical AI implementation using tools like Claude, ChatGPT, Gemini, and Antigravity to transform how your organization ships code and makes strategic decisions.
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
          <div className="flex-shrink-0 md:w-[400px]">
            <Image
              src="/images/alex-full.jpg"
              alt="Alex Miller"
              width={804}
              height={1071}
              sizes="(max-width: 768px) 100vw, 400px"
              className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border"
            />
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">How I Work</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  I&apos;ve reviewed about 3,000 decks, interviewed more than 500 founders, and sat in and advised IC meetings for almost 50 investments across Asia. This pattern recognition allows me to quickly identify bottlenecks in product, tech, GTM, and HR strategy.
                </p>
                <p>
                  I tell founders I always have 8 minutes for them if they ever need me, no matter the time of day or night—though the real heavy lifting happens in our dedicated, hour-long strategy sessions every week.
                </p>
                <div className="mt-8 border-l-4 border-accent pl-6 py-2">
                  <blockquote className="italic text-foreground">
                    &quot;You didn&apos;t just talk about AI, you showed how leaders can actually use it to think faster, decide better, and execute with clarity. That shift from information to real capability is what matters. This wasn&apos;t training for the sake of learning. This was capability building for scale.&quot;
                  </blockquote>
                  <div className="mt-3 font-semibold text-sm">— Asikul Alam Khan, Founder of Priyoshop</div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 md:w-[480px]">
              <Image
                src="/images/alex-priyoshop.jpg"
                alt="Alex at Priyoshop"
                width={540}
                height={405}
                className="rounded-2xl object-cover w-full h-auto shadow-xl border border-card-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20 border-b border-card-border lg:border-none">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Say
        </h2>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((test) => (
            <div key={test.name} className="break-inside-avoid p-6 rounded-2xl border border-card-border hover:border-accent/40 transition-colors bg-card-bg/30 shadow-sm">
              <div className="flex flex-col h-full space-y-4">
                <p className="text-muted leading-relaxed italic">&quot;{test.quote}&quot;</p>
                <div>
                  <p className="font-bold text-foreground">{test.name}</p>
                  <p className="text-xs text-accent uppercase tracking-wider mt-1">{test.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What I Advise & Coach On */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What I Advise & Coach On
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {advisoryAreas.map((area) => (
              <div key={area.title} className="p-8 rounded-2xl border border-card-border hover:border-accent/40 bg-black/20 transition-colors space-y-3">
                <h3 className="text-xl font-bold">{area.title}</h3>
                <p className="text-muted leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Building in Action */}
      <section className="mx-auto max-w-6xl px-6 py-20 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Building Bridges in the Wild</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
             <div key={num} className="break-inside-avoid relative rounded-2xl overflow-hidden border border-card-border/50 group bg-card-bg/20 shadow-md">
                <Image
                  src={`/images/events/${num}.jpg`}
                  alt={`Connecting founders in the wild`}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
             </div>
          ))}
        </div>
      </section>

      {/* Experience Summary */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Experience at a Glance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experience.map((exp) => (
              <div
                key={exp.role}
                className="space-y-2 text-center p-6 rounded-xl border border-card-border lg:border-none lg:p-0"
              >
                <h3 className="font-semibold text-accent">{exp.role}</h3>
                <p className="text-sm text-muted">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive training */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            For Founders & C-Suite
          </p>
          <h2 className="text-3xl font-bold mb-4">
            1:1 Executive AI Training
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Private sessions teaching you AI implementation using Claude, ChatGPT, Gemini, and Antigravity.
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
