/**
 * Seed the Priyoshop exec-deck slides into Supabase.
 * Run with: npx tsx scripts/seed-priyoshop-slides.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const DECK = "priyoshop-exec";

const slides = [
  {
    slide_order: 10,
    frontmatter: {
      variant: "hero",
      logo: false,
      title: "AI Productivity for Leadership",
    },
    mdx_content: `<div className="flex flex-col items-center text-center">
  <img src="/images/logo-white.png" alt="AimHuge" width="160" height="42" className="mb-6" />
  <div className="text-sm font-semibold text-[#9b82fd] uppercase tracking-[3px] mb-5">
    Executive Training — March 30, 2026
  </div>
  <h1 className="text-[68px] font-black text-white tracking-tight leading-none">
    AI Productivity<br />for Leadership
  </h1>
  <div className="text-[22px] font-light text-slate-400 mt-5 max-w-[640px] leading-relaxed">
    A full-day immersive session for Priyoshop's leadership team.<br />
    Reduce time waste. Improve decisions. Increase speed.
  </div>
  <div className="mt-14 text-sm text-slate-600">
    Prepared for Priyoshop • Confidential
  </div>
</div>`,
  },
  {
    slide_order: 20,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Day 2",
      title: "Today's Agenda",
      subtitle: "~3.5 hours including breaks",
      logo: "white",
      topRight: "Confidential",
    },
    mdx_content: `<div className="flex flex-col gap-4 mt-4">
  <div className="flex items-start gap-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">01</span>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold text-white">Silent Meeting</span>
        <span className="text-sm text-slate-500">~20 min</span>
      </div>
      <div className="text-[15px] text-slate-400 mt-0.5">Reflect on what you learned, what surprised you, what confused you</div>
    </div>
  </div>
  <div className="flex items-start gap-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">02</span>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold text-white">What is AI?</span>
        <span className="text-sm text-slate-500">~20 min</span>
      </div>
      <div className="text-[15px] text-slate-400 mt-0.5">Language models, frontier models, and why this matters now</div>
    </div>
  </div>
  <div className="flex items-start gap-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">03</span>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold text-white">Skills & Context</span>
        <span className="text-sm text-slate-500">~1 hour</span>
      </div>
      <div className="text-[15px] text-slate-400 mt-0.5">Context, saved skills, and artifacts — the three power tools</div>
    </div>
  </div>
  <div className="flex items-start gap-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">04</span>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold text-white">Hands-On Cowork</span>
        <span className="text-sm text-slate-500">~1 hour</span>
      </div>
      <div className="text-[15px] text-slate-400 mt-0.5">Writing, spreadsheets, data, presentations, email, and interviewing</div>
    </div>
  </div>
  <div className="flex items-start gap-5">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">05</span>
    <div className="flex-1">
      <div className="flex items-baseline gap-3">
        <span className="text-[20px] font-bold text-white">Claude Code Demo</span>
        <span className="text-sm text-slate-500">~20 min</span>
      </div>
      <div className="text-[15px] text-slate-400 mt-0.5">See what happens when AI can actually write and run code</div>
    </div>
  </div>
</div>`,
  },
  {
    slide_order: 30,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 1",
      title: "Silent Meeting",
      subtitle: "Everyone writes simultaneously in a shared doc — then we read and discuss.",
      logo: "white",
      backgroundImage: "/images/hallwaybg.jpg",
    },
    mdx_content: `<div className="flex flex-col gap-6 mt-8 max-w-2xl">
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/15 flex items-center justify-center shrink-0">
      <span className="text-[#9b82fd] font-bold text-lg">1</span>
    </div>
    <div className="text-[28px] font-light text-white leading-snug">What did you learn in the last 2 days?</div>
  </div>
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/15 flex items-center justify-center shrink-0">
      <span className="text-[#9b82fd] font-bold text-lg">2</span>
    </div>
    <div className="text-[28px] font-light text-white leading-snug">What surprised you?</div>
  </div>
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-[#7c5cfc]/15 flex items-center justify-center shrink-0">
      <span className="text-[#9b82fd] font-bold text-lg">3</span>
    </div>
    <div className="text-[28px] font-light text-white leading-snug">What confused you?</div>
  </div>
</div>`,
  },
  {
    slide_order: 40,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 2",
      title: "What is AI?",
      logo: "color",
      topRight: "~20 min",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-5 mt-4 flex-1">
  <Card accent="purple"><CardTitle>Language Models</CardTitle><CardText>Claude, ChatGPT, and Gemini are language models that speak computer. They understand and generate human language.</CardText></Card>
  <Card accent="purple"><CardTitle>Small → Large</CardTitle><CardText>Every provider has small, medium, and large models. We use frontier models (the most expensive) because they have the most power.</CardText></Card>
  <Card accent="purple"><CardTitle>Getting Cheaper Fast</CardTitle><CardText>Models are improving fast — soon cheaper models will do what expensive ones do today.</CardText></Card>
  <Card accent="purple"><CardTitle>Think: Phones</CardTitle><CardText>Today's budget phone is better than last year's flagship. AI is on the same trajectory, but faster.</CardText></Card>
</div>`,
  },
  {
    slide_order: 50,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3A",
      title: "Context",
      subtitle: "The most important concept. Claude doesn't know you, your company, or your job — unless you tell it.",
      logo: "white",
      topRight: "~1 hour",
    },
    mdx_content: `<div className="mt-6 flex flex-col gap-0">
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">01</span>
    <div>
      <span className="text-[20px] font-bold text-white">Who you are</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Role, department, responsibilities</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">02</span>
    <div>
      <span className="text-[20px] font-bold text-white">What you're working on</span>
      <div className="text-[15px] text-slate-400 mt-0.5">The specific task, the data, the situation</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">03</span>
    <div>
      <span className="text-[20px] font-bold text-white">Who it's for</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Your boss, a partner, a customer</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-4">
    <span className="text-[#9b82fd] font-mono text-sm font-bold mt-1 shrink-0 w-6">04</span>
    <div>
      <span className="text-[20px] font-bold text-white">What good looks like</span>
      <div className="text-[15px] text-slate-400 mt-0.5">Format, tone, length, examples</div>
    </div>
  </div>
</div>

<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500 italic">
    Exercise: Everyone writes a "context paragraph" about their role at PriyoShop and saves it as a reusable prompt.
  </div>
</div>`,
  },
  {
    slide_order: 60,
    frontmatter: {
      variant: "light",
      sectionLabel: "Exercise",
      title: "Write Your Context",
      subtitle: "Paste this at the start of every conversation with Claude.",
      logo: "color",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 text-[14px]">
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Asikul</span>
    <span className="text-slate-600">CEO, head of finance, oversees 1,500 employees, weekly reporting from department heads</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Asan</span>
    <span className="text-slate-600">Partnerships, expansion proposals, business projections for new territories</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Shahid</span>
    <span className="text-slate-600">KPI monitoring, business performance tracking across regions</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Ropik</span>
    <span className="text-slate-600">Operations, day-to-day delivery, manages field teams</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Dipty</span>
    <span className="text-slate-600">Marketing/design, brand assets, WordPress, social media</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Majundar</span>
    <span className="text-slate-600">Data analysis, Excel (vlookups, countifs), reporting</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Mashi</span>
    <span className="text-slate-600">Finance, working capital, cash flow, reconciliation</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Romel</span>
    <span className="text-slate-600">HR, payroll, HRIS, people & culture</span>
  </div>
  <div className="flex items-start gap-3 py-2 border-b border-slate-100">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Irfan</span>
    <span className="text-slate-600">.NET/SQL development, system maintenance</span>
  </div>
  <div className="flex items-start gap-3 py-2">
    <span className="font-bold text-[#7c5cfc] shrink-0 w-20">Hadasa</span>
    <span className="text-slate-600">Marketing, branding, production coordination</span>
  </div>
</div>`,
  },
  {
    slide_order: 70,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 3B",
      title: "Skills",
      subtitle: "A skill is a saved instruction that tells Claude how to do a specific task your way. It turns a 10-minute back-and-forth into a 1-message task.",
      logo: "white",
    },
    mdx_content: `<div className="mt-4 flex flex-col gap-0">
  <div className="flex items-start gap-5 py-3.5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">Asan</span>
    <div>
      <span className="text-[18px] font-bold text-white">Expansion proposal generator</span>
      <div className="text-[14px] text-slate-400 mt-0.5">Input territory data → formatted proposal with unit economics</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-3.5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">Shahid</span>
    <div>
      <span className="text-[18px] font-bold text-white">KPI weekly digest</span>
      <div className="text-[14px] text-slate-400 mt-0.5">Input raw numbers → performance summary with flags</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-3.5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">Mashi</span>
    <div>
      <span className="text-[18px] font-bold text-white">Cash flow narrator</span>
      <div className="text-[14px] text-slate-400 mt-0.5">Input inflow/outflow data → finance summary for Asikul</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-3.5 border-b border-white/[0.06]">
    <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">Romel</span>
    <div>
      <span className="text-[18px] font-bold text-white">Offer letter drafter</span>
      <div className="text-[14px] text-slate-400 mt-0.5">Input role/salary/start date → formatted offer letter</div>
    </div>
  </div>
  <div className="flex items-start gap-5 py-3.5">
    <span className="text-[#9b82fd] font-semibold text-[14px] shrink-0 w-20 mt-0.5">Dipty</span>
    <div>
      <span className="text-[18px] font-bold text-white">Social media post generator</span>
      <div className="text-[14px] text-slate-400 mt-0.5">Input product/promo details → posts for multiple platforms</div>
    </div>
  </div>
</div>

<div className="mt-auto pt-6 border-t border-white/[0.06]">
  <div className="text-[15px] text-slate-500 italic">
    Live exercise: Pick one person's recurring task. Break it down — input, output, rules. Write it. Test it. Refine it.
  </div>
</div>`,
  },
  {
    slide_order: 80,
    frontmatter: {
      variant: "light",
      sectionLabel: "Section 3C",
      title: "Artifacts",
      subtitle: "Instead of Claude just telling you something, it makes it for you. You can download, edit, and share artifacts — they're real files.",
      logo: "color",
    },
    mdx_content: `<div className="grid grid-cols-5 gap-4 mt-4 flex-1">
  <Card accent="purple" small><CardTitle>Documents</CardTitle><CardText>Reports, memos, proposals</CardText></Card>
  <Card accent="blue" small><CardTitle>Spreadsheets</CardTitle><CardText>Trackers, dashboards, templates</CardText></Card>
  <Card accent="green" small><CardTitle>Presentations</CardTitle><CardText>Slide decks with structure</CardText></Card>
  <Card accent="amber" small><CardTitle>Code</CardTitle><CardText>Scripts, tools, mini-apps</CardText></Card>
  <Card accent="red" small><CardTitle>Visualizations</CardTitle><CardText>Charts, diagrams, flowcharts</CardText></Card>
</div>

<div className="mt-auto pt-6 border-t border-slate-100">
  <div className="text-[15px] text-slate-500 italic">
    Demo: Build an artifact together live — e.g. "Create a weekly KPI dashboard for PriyoShop"
  </div>
</div>`,
  },
  {
    slide_order: 90,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 4",
      title: "Hands-On Cowork",
      subtitle: "~1 hour of exercises with Claude. Work on real PriyoShop tasks.",
      logo: "white",
      topRight: "~1 hour",
    },
    mdx_content: `<div className="grid grid-cols-2 gap-4 mt-4 flex-1">
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4A</span>
      <span className="text-[18px] font-bold text-white">Writing</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Emails, memos, translations — give Claude a bad first draft and watch it improve</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4B</span>
      <span className="text-[18px] font-bold text-white">Spreadsheets</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Upload Excel, add formulas, generate trackers, clean messy data</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4C</span>
      <span className="text-[18px] font-bold text-white">Database & Data</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Find patterns, write SQL queries, generate charts, cross-reference datasets</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4D</span>
      <span className="text-[18px] font-bold text-white">Presentations</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Slide outlines from a brief, turn reports into decks, speaker notes</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4E</span>
      <span className="text-[18px] font-bold text-white">Email & Calendar</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Batch draft emails, plan your week, connect Gmail and Calendar</div>
  </div>
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-5 flex flex-col">
    <div className="flex items-baseline gap-3 mb-1.5">
      <span className="text-[#9b82fd] font-mono text-[13px] font-bold">4F</span>
      <span className="text-[18px] font-bold text-white">Interviewing</span>
      <span className="text-[12px] text-slate-500 ml-auto">10 min</span>
    </div>
    <div className="text-[14px] text-slate-400 leading-relaxed">Claude interviews you — stress-test decisions, prep for presentations, find root causes</div>
  </div>
</div>`,
  },
  {
    slide_order: 100,
    frontmatter: {
      variant: "dark",
      sectionLabel: "Section 5",
      title: "Claude Code",
      subtitle: "What happens when AI can actually write and run code.",
      logo: "white",
      topRight: "~20 min",
    },
    mdx_content: `<div className="flex flex-col items-center justify-center flex-1 gap-8 mt-4">
  <div className="max-w-xl text-center">
    <div className="text-[24px] font-light text-slate-300 leading-relaxed">
      Live demo — build something useful for PriyoShop in real time.
    </div>
    <div className="text-[18px] text-slate-500 mt-4 leading-relaxed">
      This is the future. Today it requires a developer, but soon everyone will have access.
    </div>
  </div>

  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 max-w-lg w-full font-mono text-[14px] text-slate-400">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 rounded-full bg-red-500/60" />
      <div className="w-3 h-3 rounded-full bg-amber-500/60" />
      <div className="w-3 h-3 rounded-full bg-green-500/60" />
    </div>
    <div><span className="text-[#9b82fd]">$</span> claude</div>
    <div className="mt-2 text-slate-500">&gt; Build a PriyoShop sales dashboard</div>
    <div className="mt-1 text-slate-500">&gt; that reads from the weekly Excel reports...</div>
    <div className="mt-2 text-green-400/70">Creating project structure...</div>
  </div>
</div>`,
  },
  {
    slide_order: 110,
    frontmatter: {
      variant: "close",
      logo: false,
      title: "Thank You.",
    },
    mdx_content: `<div className="flex flex-col items-center text-center">
  <img src="/images/logo-white.png" alt="AimHuge" width="140" height="38" className="mb-8" />
  <h2 className="text-[56px] font-black text-white tracking-tight leading-none mb-4">
    Thank You.
  </h2>
  <div className="text-[20px] font-light text-slate-400 max-w-[500px] leading-relaxed">
    Let's build something extraordinary together.
  </div>
  <div className="mt-12 flex flex-col items-center gap-2 text-sm text-slate-500">
    <span>Alex Miller — fotoflo@gmail.com</span>
    <span>calendly.com/fotoflo/30min</span>
  </div>
</div>`,
  },
];

async function seed() {
  // Delete existing slides for this deck first
  await supabase.from("deck_slides").delete().eq("deck_slug", DECK);

  for (const slide of slides) {
    const { error } = await supabase.from("deck_slides").insert({
      deck_slug: DECK,
      slide_order: slide.slide_order,
      frontmatter: slide.frontmatter,
      mdx_content: slide.mdx_content,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error(`Failed to seed slide ${slide.slide_order}:`, error);
    } else {
      console.log(`✓ Slide ${slide.slide_order}: ${slide.frontmatter.title ?? slide.frontmatter.sectionLabel}`);
    }
  }
  console.log("\nDone! Seeded", slides.length, "slides.");
}

seed();
