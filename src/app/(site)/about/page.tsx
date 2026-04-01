import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterCTA } from "../components/NewsletterCTA";
import { CopyCurlButton } from "./components/CopyCurlButton";
import { ImageModal } from "./components/ImageModal";
import { ScrollSpy } from "./components/ScrollSpy";

export const metadata: Metadata = {
  title: "About Alex Miller — AimHuge",
  description:
    "25+ years building software products in Asia. Startup operator, investor, triathlete, and AI trainer.",
  openGraph: {
    title: "About Alex Miller — AimHuge",
    description:
      "25+ years building software products in Asia. Startup operator, investor, triathlete, and AI trainer.",
    images: [{ url: "/images/about-og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Alex Miller — AimHuge",
    description:
      "25+ years building software products in Asia. Startup operator, investor, triathlete, and AI trainer.",
    images: ["/images/about-og.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <ScrollSpy />
      {/* Hero */}
      <section id="hero" className="mx-auto max-w-6xl px-6 pt-24 pb-16">
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
              width={1328}
              height={1662}
              sizes="(max-width: 768px) 100vw, 360px"
              className="rounded-2xl object-cover w-72 h-96"
            />
          </div>
        </div>
      </section>

      {/* New York */}
      <section id="new-york" className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">New York Roots</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  I grew up in New York. Growing up in the city shaped my hustle and gave me the foundational drive to start building things early. Before I was running startups, I was just a kid in a Yankees cap swinging for the fences.
                </p>
                <p>
                  I got started programming in Visual Basic at 12, which quickly led to my first programming job at 16 in a Silicon Alley startup (thanks for the intro, Dad — I miss you).
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 md:w-1/3">
              <Image
                src="/images/alex-new-york.png"
                alt="Alex in New York, 1992"
                width={722}
                height={963}
                sizes="(max-width: 768px) 100vw, 360px"
                className="rounded-2xl object-cover w-full h-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* First Exit */}
      <section id="first-exit" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">My First Exit</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                When I was 13, I came into a little money from my family and I invested it all. A whole $800 in Apple stock.
              </p>
              <p>
                A few years later, I got my first exit. I sold that stock to fund a train trip across China. That&apos;s where I met my wife and built my career, so you could say it was a good investment.
              </p>
              <p>
                However, that stock would be worth over $10 million today.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 md:w-5/12">
            <Image
              src="/images/alex-first-exit.png"
              alt="Young Alex"
              width={250}
              height={188}
              sizes="(max-width: 768px) 100vw, 360px"
              className="rounded-2xl object-cover w-full h-auto shadow-xl border border-card-border"
            />
          </div>
        </div>
      </section>

      {/* Harvard Summer */}
      <section id="harvard" className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">Harvard Summer</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  In the summer of 2004, after my train trip to China, I studied travel writing and photography at Harvard Summer School. 
                </p>
                <p>
                  It turned out to be an incredibly fun and formative experience, laying the groundwork for how I frame stories and document my travels across Asia years later.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 md:w-[360px]">
              <Image
                src="/images/alex-harvard.jpg"
                alt="Alex Harvard ID"
                width={1024}
                height={767}
                sizes="(max-width: 768px) 100vw, 360px"
                className="rounded-2xl object-cover w-full h-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Renren */}
      <section id="china" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">My Time In China</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                As I wandered across China for the next 11 years, I met many amazing people and got many amazing opportunities. My first key opportunity was joining Oak Pacific Interactive, the company behind <a href="https://techcrunch.com/2011/05/03/renren-prices-its-ipo-at-14-per-share-to-raise-743m/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Renren.com</a>.
              </p>
              <p>
                Luckily, I had chosen to take a lower salary and more stock with that job, and I made my second exit when they raised $743 million in their NYSE IPO. It wasn&apos;t a massive one because I was employee number 800, but I learned to lead teams and build technology at scale.
              </p>
              <p>
                I also learned what it means to have a great mentor. My boss <a href="https://www.linkedin.com/in/lidonna/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Donna (离普庆)</a> embedded me in our media planning team, brainstorming ad campaigns for international brands like Nike and Estée Lauder, and local ones like Haier and Nongfu Spring all day. She made me write sales decks for our 70-person sales team before ever letting me build a single product. That foundation paid off: the team I led ended up building an ad engine that served billions of daily impressions and helped drive our growth from $5M to $50M ARR in 3 years.
              </p>
              <p>
                I also married my wife Yan around that time. Since then, I&apos;ve lived and worked in a half dozen companies and advised over 60 startups from seed stage to Series A.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-[400px]">
            <Image
              src="/images/alex-renren-yan.png"
              alt="Alex inside an airport with his wife Yan wearing a Renren shirt"
              width={722}
              height={963}
              sizes="(max-width: 768px) 100vw, 400px"
              className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border"
            />
          </div>
        </div>
      </section>

      {/* 500 Startups */}
      <section id="500-startups" className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">500 Startups</h2>
            <div className="space-y-4 text-muted leading-relaxed mb-6">
              <p>
                At 500 Startups, I had the privilege to learn directly from <a href="https://www.linkedin.com/in/davemcclure/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Dave McClure</a>, the founder (now running <a href="https://practicalvc.com/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Practical Venture Capital</a>). AARRR is his famous framework for growth.
              </p>
              <p>
                The fundamentals of this framework are really just about building a better product, going to market better, tracking users better, monetizing them better, and retaining them better. You haven&apos;t seen it? You gotta watch this video.
              </p>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-card-border mt-6">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/irjgfW0BIrw"
                title="Dave McClure AARRR"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full md:w-[400px]">
            <div className="relative top-2 md:mt-12 group">
              <ImageModal
                previewSrc="/images/dave-mcclure-screenshot-v2.png"
                fullSrc="/images/dave-mcclure-google-photos-v4.webp"
                alt="Dave McClure presenting in Beijing, Oct 2012"
                width={1024}
                height={636}
                sizes="(max-width: 768px) 100vw, 400px"
                className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-4 -left-4 bg-card-bg border border-card-border px-4 py-2 rounded-xl text-xs font-mono font-medium text-muted shadow-lg z-10 pointer-events-none">
                Beijing, Oct 2012
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      {/* Accelerating Asia */}
      <section id="accelerating-asia" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">Accelerating Asia</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  In my time at <a href="https://acceleratingasia.com" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Accelerating Asia</a>, I trained entrepreneurs from over 60 startups, teaching them the fundamentals of company building, fundraising, management, dealing with stress and mental strain.
                </p>
                <p>
                  I&apos;ve reviewed about 3,000 decks, interviewed more than 500 founders, and sat in and advised IC meetings for almost 50 investments into companies from Seoul to Dhaka.
                </p>
                <p>
                  As an advisor, I also worked with them on GTM, product, tech, and HR strategy. I tell founders I always have 8 minutes for them if they ever need me, no matter the time of day or night—though the real heavy lifting happens in our dedicated, hour-long strategy sessions every week.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-[480px]">
              <Image
                src="/images/accelerating-asia.jpg"
                alt="Accelerating Asia zoom calls"
                width={1024}
                height={581}
                sizes="(max-width: 768px) 100vw, 540px"
                className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border"
              />
            </div>
          </div>
      </section>

      {/* Asia */}
      <section id="asia" className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">25+ Years In Asia</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  I&apos;ve lived and worked across Asia for over two decades.
                  I&apos;ve worked out of offices in New York, Austin, Beijing, Shanghai, Guangzhou, Hong Kong, San Francisco, Mountain View, Singapore, Tokyo, Osaka, Kyoto, Dhaka, Bali, Jakarta, Danang, Manila, Penang, KL, Bangkok and now Chiang Mai.
                </p>
                <p>
                  I speak fluent Mandarin, conversational Indonesian and Malay, and &quot;Singlish lah&quot;. I can also successfully order a meal in Thai, Japanese, Korean, and Bengali — and, having worked intimately with founders in every country in Asia, I intimately understand the unique dynamics of building technology businesses in the region.
                </p>
                <p>
                  This experience gives me a perspective that most Western
                  advisors don&apos;t have. I understand the markets, the
                  cultures, and the pace at which things move in Southeast Asia
                  and Greater China.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 relative group">
              <Image
                src="/images/alex-kyoto.png"
                alt="Judging a pitch event in Kyoto"
                width={541}
                height={963}
                sizes="(max-width: 768px) 100vw, 360px"
                className="rounded-2xl object-cover w-72 h-auto shadow-xl transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-3 -left-3 bg-card-bg border border-card-border px-4 py-2 rounded-xl text-xs font-mono font-medium text-muted shadow-lg z-10 pointer-events-none">
                Judging a pitch event in Kyoto
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Advisor */}
      <section id="ai-advisor" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">AI Advisor</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Now I work with the best founders across Asia as an advisor, and I train their teams on AI. Building the future is no longer just about hiring more engineers; it&apos;s about augmenting the capabilities of the people you already have.
              </p>
              <div className="mt-6 border-l-4 border-accent pl-6 py-2">
                <blockquote className="italic text-foreground">
                  &quot;You didn&apos;t just talk about AI, you showed how leaders can actually use it to think faster, decide better, and execute with clarity. That shift from information to real capability is what matters. This wasn&apos;t training for the sake of learning. This was capability building for scale.&quot;
                </blockquote>
                <div className="mt-3 font-semibold text-sm">
                  — <a href="https://www.linkedin.com/in/asikulalamkhan/" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Asikul Alam Khan</a>, Founder of <a href="https://priyoshop.com" target="_blank" rel="noopener noreferrer" className="text-accent transition-colors hover:text-accent-hover">Priyoshop</a>
                </div>
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
      </section>

      {/* Personal */}
      <section id="beyond-work" className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <video
              src="https://cnnttsihfbyxhzlmzdtv.supabase.co/storage/v1/object/public/deck-assets/alex-yoga-small.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-2xl object-cover w-64 h-[400px] shadow-xl border border-card-border"
            />
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">Beyond Work</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                When I&apos;m not building software or advising startups, you can
                find me practicing yoga, exploring the outdoor landscapes of
                Southeast Asia, or picking up new physical disciplines. 
              </p>
              <p>
                I believe in building physical and mental resilience alongside
                professional growth. (Oh, and I occasionally run a triathlon ad-hoc).
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">Languages: &quot;I Speak Computer&quot;</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["English (Native)", "Mandarin (Fluent)", "Indonesian & Malay (Conversational)", '"Singlish lah"', "Computer"].map(
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
            <div className="flex flex-wrap justify-center gap-4 mb-8 mt-4">
              {["ChatGPT", "Claude", "Gemini"].map((ai) => (
                <span key={ai} className="rounded-full border border-accent text-accent bg-accent/5 px-6 py-2 text-sm font-semibold tracking-wide shadow-sm">
                  {ai}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 opacity-60 max-w-2xl mx-auto">
              {[
                "JavaScript", "TypeScript", "Perl", "Python", "Rust", "Go", "Swift", ".NET", "SQL",
                "Next.js", "React", "React Native", "Node.js", "Ruby on Rails", "PHP", "Tailwind CSS",
                "Firebase", "Supabase", "PostgreSQL", "Redis", "MongoDB", "GraphQL",
                "Vercel", "AWS", "Docker", "Git",
                "WordPress", "Stripe", "Notion", "Google Sheets", "Figma", "Zapier", "Airtable"
              ].map((tech) => (
                <span key={tech} className="text-sm font-mono tracking-tight bg-card-border/30 hover:bg-card-border/50 transition-colors px-3 py-1 rounded-md cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 mt-16 max-w-4xl mx-auto">
            <div className="flex-shrink-0">
              <Image
                src="/images/c3po-r2d2.png"
                alt="R2D2 and C3PO"
                width={300}
                height={300}
                className="rounded-2xl object-cover w-64 h-64"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-bold">With AI we can now talk to any computer, Just like C3P0</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  How many languages does a protocol droid speak in Star Wars? C-3PO is fluent in over six million forms of communication. But R2-D2? He speaks computer. He plugs into the main frame, and things just start happening.
                </p>
                <p>
                  Now, with AI, we can all speak computer. If you know what to ask for, and how to command the machine, we can build incredible things.
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* Newsletter */}
      <NewsletterCTA sourcePage="/about" />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Want to connect?
        </h2>
        <p className="text-muted mb-8 max-w-xl mx-auto leading-relaxed">
          I&apos;m always happy to chat with founders, operators, and anyone
          building interesting things. If you want to learn more, hit the CTA below or just run this <code>curl</code> command:
        </p>
        
        <div className="max-w-3xl mx-auto mb-12 bg-[#0d0d0d] border border-card-border rounded-xl p-6 text-left overflow-x-auto shadow-2xl relative group">
          <div className="absolute top-0 flex items-center justify-between w-full left-0 px-4 py-2 border-b border-card-border/50 bg-[#161616] rounded-t-xl">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-xs text-muted font-mono tracking-widest uppercase">bash</div>
          </div>
          <CopyCurlButton text={`curl -X POST https://aimhuge.com/api/v1/leads \\\n  -H "Content-Type: application/json" \\\n  -d '{"email": "your@email.com", "message": "Let\\'s chat."}'`} />
          <pre className="font-mono text-sm text-green-400 mt-8 whitespace-pre-wrap">
            <code>
              curl -X POST https://aimhuge.com/api/v1/leads \{"\n"}
              {"  "}-H &quot;Content-Type: application/json&quot; \{"\n"}
              {"  "}-d &apos;&#123;&quot;email&quot;: &quot;your@email.com&quot;, &quot;message&quot;: &quot;Let&apos;s chat.&quot;&#125;&apos;
            </code>
          </pre>
        </div>

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
