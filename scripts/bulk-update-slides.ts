/**
 * Script to bulk update the Priyoshop Exec Deck slides and reorganize them into the new sequence.
 * 
 * Run with: pnpm tsx scripts/bulk-update-slides.ts
 */

const API = "http://localhost:4000/api/decks/slides";
const SUMMARY_API = "http://localhost:4000/api/decks/summary";
const REORDER_API = "http://localhost:4000/api/decks/slides/reorder";
const DECK = "priyoshop-exec";

async function fetchAllSlides() {
  const res = await fetch(`${API}?deck=${DECK}`);
  if (!res.ok) throw new Error("Failed to fetch slides: " + await res.text());
  return await res.json();
}

async function upsertSlide(slide_order: number, frontmatter: any, mdx_content: string) {
  const payload = {
    deck_slug: DECK,
    slide_order,
    frontmatter,
    mdx_content
  };
  const res = await fetch(API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to upsert slide: ${await res.text()}`);
  return await res.json();
}

async function patchSlide(id: string, frontmatter: any, mdx_content: string, slide_order: number) {
  const payload = {
    id,
    deck_slug: DECK,
    slide_order,
    frontmatter,
    mdx_content
  };
  const res = await fetch(API, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to patch slide ${id}: ${await res.text()}`);
  return await res.json();
}

async function main() {
  console.log("Fetching current slides...");
  let currentSlides = await fetchAllSlides();
  let slides = currentSlides.slides || currentSlides;

  console.log(`Found ${slides.length} slides.`);

  // 1. Modifying "Getting Cheaper Fast"
  const gettingCheaperSlide = slides.find((s: any) => s.frontmatter?.title?.includes("Getting Cheaper Fast"));
  if (gettingCheaperSlide) {
    if (!gettingCheaperSlide.mdx_content.includes("generating display ad creative")) {
      console.log("Updating 'Getting Cheaper Fast'...");
      const newMdx = gettingCheaperSlide.mdx_content + "\n\n<Card accent=\"blue\"><CardTitle>Product Integration</CardTitle><CardText>Inference costs fraction of a cent. We can generate **display ad creative** at scale and generate product description variants for A/B testing instantly.</CardText></Card>";
      await patchSlide(gettingCheaperSlide.id, gettingCheaperSlide.frontmatter, newMdx, gettingCheaperSlide.slide_order);
    } else {
      console.log("'Getting Cheaper Fast' already updated.");
    }
  }

  // 2. Modifying "The Window Grows"
  const windowGrowsSlide = slides.find((s: any) => s.frontmatter?.title?.includes("The Window Grows"));
  if (windowGrowsSlide) {
    if (!windowGrowsSlide.mdx_content.includes("The \"Full Bucket\"")) {
      console.log("Updating 'The Window Grows'...");
      const newMdx = windowGrowsSlide.mdx_content + "\n\n<Card accent=\"amber\"><CardTitle>The \"Full Bucket\"</CardTitle><CardText>As you chat back and forth, the window fills up. Eventually, the AI forgets the initial instructions provided at the start.</CardText></Card>";
      await patchSlide(windowGrowsSlide.id, windowGrowsSlide.frontmatter, newMdx, windowGrowsSlide.slide_order);
    } else {
      console.log("'The Window Grows' already updated.");
    }
  }

  // 3. Insert New Slides at highly offset slide orders to avoid collision before reorder
  console.log("Inserting new slides...");

  const newSlidesToCreate = [
    {
      title: "Why AI for PriyoShop?",
      variant: "dark", sectionLabel: "Sec 1: Business Context",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"purple\"><CardTitle>Information Extraction</CardTitle><CardText>Without a central BI tool, executives can drop raw spreadsheets into an AI and instantly query data without waiting for analytics teams.</CardText></Card>\n<Card accent=\"blue\"><CardTitle>Inventory & Logistics</CardTitle><CardText>Quickly parse sales vs. stock data to identify slow-moving inventory before it becomes a liability.</CardText></Card>\n</div>"
    },
    {
      title: "ROI & Business Value",
      variant: "light", sectionLabel: "Sec 1: Business Context",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"amber\"><CardTitle>The Operational Multiplier</CardTitle><CardText>Equip your team to do the same workflows in half the time—from summarizing vendor negotiations to reconciling mismatching invoices.</CardText></Card>\n</div>"
    },
    {
      title: "E-Commerce AI Integrations",
      variant: "dark", sectionLabel: "Sec 1.5: E-Commerce Use Cases",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"purple\"><CardTitle>Conversational Commerce</CardTitle><CardText>Search intent matching: \"I need an outfit for a summer wedding in Dhaka\" instead of rigid keyword filters.</CardText></Card>\n<Card accent=\"blue\"><CardTitle>Automated Catalog Tagging</CardTitle><CardText>AI looks at product photos and automatically generates metadata (color, fabric, occasion), saving hours of manual entry.</CardText></Card>\n</div>"
    },
    {
      title: "E-Commerce Operations & Ads",
      variant: "light", sectionLabel: "Sec 1.5: E-Commerce Use Cases",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"purple\"><CardTitle>Generative Display Ads</CardTitle><CardText>Generate 100 variants of ad creative for different demographics instantly.</CardText></Card>\n<Card accent=\"amber\"><CardTitle>Customer Service Triage</CardTitle><CardText>Automate the first 80% of support tickets (\"Where is my order?\") by connecting to the order database.</CardText></Card>\n</div>"
    },
    {
      title: "Enterprise vs Consumer AI",
      variant: "dark", sectionLabel: "Sec 3: Privacy & Security",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"red\"><CardTitle>Protecting the Bank & Keys</CardTitle><CardText>Engineers must not paste database credentials, API keys, or raw profit margins into free consumer tools (like free ChatGPT), which use data for training.</CardText></Card>\n<Card accent=\"green\"><CardTitle>Enterprise Isolation</CardTitle><CardText>Enterprise tools and API accounts guarantee 0-day retention and ring-fence proprietary business logic.</CardText></Card>\n</div>"
    },
    {
      title: "Data Retention & Privacy",
      variant: "light", sectionLabel: "Sec 3: Privacy & Security",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"red\"><CardTitle>Rule #1</CardTitle><CardText>Never paste actual customer PII (Personally Identifiable Information) into any public LLM.</CardText></Card>\n<Card accent=\"green\"><CardTitle>Rule #2</CardTitle><CardText>Confidential P&L, inventory margins, and vendor negotiations stay exclusively in approved Enterprise/Team tiers.</CardText></Card>\n</div>"
    },
    {
      title: "Establishing an AI Council",
      variant: "dark", sectionLabel: "Sec 8: Organizational Action",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"purple\"><CardTitle>Cross-Functional Task Force</CardTitle><CardText>AI adoption fails if merely ''given'' to employees. Create a committee to surface the best workflows across Ops, Tech, and Sales.</CardText></Card>\n<Card accent=\"amber\"><CardTitle>Building Skill Files</CardTitle><CardText>Develop specific instructional documents (Skill Files) for PriyoShop routines, stored in a shared repository for new hires to instantly leverage.</CardText></Card>\n</div>"
    },
    {
      title: "Next Steps / Action Plan",
      variant: "light", sectionLabel: "Sec 8: Organizational Action",
      mdx: "<div className=\"flex flex-col gap-6\">\n<Card accent=\"purple\"><CardTitle>Week 1</CardTitle><CardText>Every executive completes their ''Write Your Context'' exercise and applies it.</CardText></Card>\n<Card accent=\"amber\"><CardTitle>Week 2</CardTitle><CardText>Identify one reporting workflow or manual spreadsheet reconciliation task to fully automate using AI.</CardText></Card>\n<Card accent=\"green\"><CardTitle>Week 4</CardTitle><CardText>Regroup and share the first PriyoShop-specific Skill File created by the team.</CardText></Card>\n</div>"
    }
  ];

  let orderOffset = 1000;
  for (const s of newSlidesToCreate) {
    if (!slides.find((existing: any) => existing.frontmatter?.title === s.title)) {
      console.log(`Creating ${s.title}...`);
      const fm = { title: s.title, variant: s.variant, sectionLabel: s.sectionLabel };
      await upsertSlide(orderOffset++, fm, s.mdx);
    } else {
      console.log(`${s.title} already exists, skipping creation.`);
    }
  }

  // Re-fetch to include the newly inserted slides before reordering
  currentSlides = await fetchAllSlides();
  slides = currentSlides.slides || currentSlides;

  console.log("Reordering slides globally...");

  const preferredOrder = [
    "AI Productivity for Leadership",
    "Morning Agenda",
    "Afternoon Agenda",
    "Silent Meeting",
    "Why AI for PriyoShop?",
    "ROI & Business Value",
    "E-Commerce AI Integrations",
    "E-Commerce Operations & Ads",
    "LLM — Large Language Model",
    "Multimodal",
    "Tool Use: Speaking Computer",
    "Tool Use: Browsing",
    "Frontier Models",
    "Getting Cheaper Fast",
    "Enterprise vs Consumer AI",
    "Data Retention & Privacy",
    "Voice Input",
    "Activity: Paste an Image",
    "Paste Whole Documents",
    "Summarize Anything",
    "Prompts Between AIs",
    "Prompts That Write Prompts",
    "Let AI Interview You",
    "When AI Says No",
    "Context Window",
    "The Window Grows",
    "Lost in the Middle",
    "Don't Worry Too Much",
    "Quiz: When to Start a New Chat?",
    "Write Your Context",
    "Connect Your Workspace",
    "Artifacts",
    "Skills",
    "Claude Code",
    "Writing",
    "Spreadsheets",
    "Documents",
    "Data & Analysis",
    "Email & Calendar",
    "AI Interviews You",
    "Presentations",
    "Establishing an AI Council",
    "Next Steps / Action Plan",
    "Thank You."
  ];

  const finalOrderUpdates = [];
  const seenIds = new Set();
  
  let currentOrderIdx = 0;
  for (const title of preferredOrder) {
    const slide = slides.find((s: any) => s.frontmatter?.title?.trim() === title.trim() && !seenIds.has(s.id));
    if (slide) {
      finalOrderUpdates.push({ id: slide.id, slide_order: currentOrderIdx++ });
      seenIds.add(slide.id);
    } else {
      console.warn(`Could not find slide: ${title}`);
    }
  }

  // Any remaining slides
  for (const s of slides) {
    if (!seenIds.has(s.id)) {
      finalOrderUpdates.push({ id: s.id, slide_order: currentOrderIdx++ });
      seenIds.add(s.id);
    }
  }

  const payload = { slides: finalOrderUpdates };
  const reorderRes = await fetch(REORDER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!reorderRes.ok) {
    throw new Error(`Failed to reorder: ${await reorderRes.text()}`);
  }
  
  const reorderBody = await reorderRes.json();
  console.log("Successfully reordered slides!", reorderBody);

}

main().catch(console.error);
