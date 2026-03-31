import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterCTA } from "../components/NewsletterCTA";
import { CopyCurlButton } from "./components/CopyCurlButton";
import { ImageModal } from "./components/ImageModal";

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

      {/* New York */}
      <section className="bg-card-bg border-y border-card-border">
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
                width={300}
                height={400}
                className="rounded-2xl object-cover w-full h-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* First Exit */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">My First Exit</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                When I was 13, I came into a little money from my family and I invested it all. A whole $800 in Apple stock. A few years later, when I was 19, I got my first exit.
              </p>
              <p>
                I sold the stock for $2,100 and used it to travel around China by train. I&apos;ve been traveling, meeting people, and enjoying life ever since.
              </p>
              <p>
                That first exit... well, an $800 investment returning $2,100 over 6 years is an IRR of about 17.5%. 17.5% isn&apos;t the 30% that VCs look for, but it gave me a taste of letting money work for me.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 md:w-5/12">
            <Image
              src="/images/alex-first-exit.png"
              alt="Young Alex"
              width={360}
              height={270}
              className="rounded-2xl object-cover w-full h-auto shadow-xl border border-card-border"
            />
          </div>
        </div>
      </section>

      {/* Harvard Summer */}
      <section className="bg-card-bg border-y border-card-border">
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
                width={360}
                height={240}
                className="rounded-2xl object-cover w-full h-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Renren */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">My Time at Renren.com</h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                As I wandered across China for the next 11 years, I met many amazing people and got many amazing opportunities. The first key opportunity being a job at Renren.com.
              </p>
              <p>
                Luckily, I had chosen to take a lower salary and more stock with that job, and I made my second exit. It wasn&apos;t a massive one because I was employee number 800, but I learned to lead teams and build technology at scale.
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
              width={768}
              height={1024}
              className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border"
            />
          </div>
        </div>
      </section>

      {/* 500 Startups */}
      <section className="bg-card-bg border-y border-card-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold">500 Startups</h2>
            <div className="space-y-4 text-muted leading-relaxed mb-6">
              <p>
                At 500, I had the privilege to learn directly from Dave McClure, the founder. AARRR is Dave&apos;s framework for growth.
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
                width={400}
                height={225}
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
      <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">Accelerating Asia</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  In my time at Accelerating Asia, I trained entrepreneurs from over 60 startups, teaching them the fundamentals of company building, fundraising, management, dealing with stress and mental strain.
                </p>
                <p>
                  I&apos;ve reviewed about 3,000 decks, interviewed more than 500 founders, and sat in and advised IC meetings for almost 50 investments into companies from Seoul to Dhaka.
                </p>
                <p>
                  As an advisor, I also worked with them on GTM, product, tech, and HR strategy. I always tell founders I only have 8 minutes, but usually, we schedule hour-long meetings every week.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-full md:w-[480px]">
              <Image
                src="/images/accelerating-asia.jpg"
                alt="Accelerating Asia zoom calls"
                width={540}
                height={304}
                className="rounded-2xl object-cover w-full h-auto shadow-2xl border border-card-border"
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
                  I&apos;ve worked out of offices in New York, Austin, Beijing, Shanghai, Guangzhou, Hong Kong, San Francisco, Mountain View, Singapore, Tokyo, Osaka, Dhaka, Bali, Jakarta, Danang, Manila, Penang, KL, Bangkok and now Chiang Mai.
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
            <div className="flex-shrink-0">
              <Image
                src="/images/alex-kyoto.png"
                alt="Alex in Kyoto"
                width={360}
                height={540}
                className="rounded-2xl object-cover w-72 h-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Advisor */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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
      </section>

      {/* Personal */}
      <section className="bg-card-bg border-y border-card-border">
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
      <section className="mx-auto max-w-6xl px-6 py-20">
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
