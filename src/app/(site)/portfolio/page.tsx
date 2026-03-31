import type { Metadata } from "next";
import { NewsletterCTA } from "../components/NewsletterCTA";
import { ClientLogo } from "./ClientLogo";

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
  {
    title: "KooBits",
    desc: "AI-driven edtech startup democratizing K-12 education through interactive learning.",
    url: "https://koobits.com",
    tag: "Advisory",
    logo: "https://logo.clearbit.com/koobits.com",
  },
  {
    title: "ORKO",
    desc: "All-in-one management platform for EVs, fleet operators, and charging stations.",
    url: "https://orkoon.com",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/orkoon.com",
  },
  {
    title: "Living Roots",
    desc: "Agri-tech startup producing probiotics and supplements for crops.",
    url: "https://livingrootsbaja.org",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/livingrootsbaja.org",
  },
  {
    title: "Fullfily",
    desc: "EV-based logistics and delivery sector startup in India.",
    url: "https://fullfily.com",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/fullfily.com",
  },
  {
    title: "Chhaya",
    desc: "Bangladesh's first tech-enabled micro-insurance provider.",
    url: "https://chhayacenter.com",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/chhayacenter.com",
  },
  {
    title: "PulseTech",
    desc: "B2B e-commerce platform for retail pharmacies in Bangladesh.",
    url: "https://pulsetech.mx",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/pulsetech.mx",
  },
  {
    title: "MedEasy",
    desc: "Digital health platform and online pharmacy assisting chronic disease patients.",
    url: "https://medeasy.health",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/medeasy.health",
  },
  {
    title: "K-LINK",
    desc: "Omnichannel cloud contact center platform for business communications.",
    url: "https://k-net.co.id",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/k-net.co.id",
  },
  {
    title: "Sova Health",
    desc: "Precision nutrition and full-stack gut health platform in India.",
    url: "https://sova.health",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/sova.health",
  },
  {
    title: "SupplyLine",
    desc: "B2B procurement and invoice financing platform for retail stores in Bangladesh.",
    url: "https://supplyline.network",
    tag: "Syndicate Portfolio",
    logo: "https://logo.clearbit.com/supplyline.network",
  },
  {
    title: "Tokban",
    desc: "B2B construction materials platform in Indonesia.",
    url: "https://tokban.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/tokban.com",
  },
  {
    title: "60plus India",
    desc: "Comprehensive eldercare platform for products and services.",
    url: "https://60plusindia.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/60plusindia.com",
  },
  {
    title: "Relay.Club",
    desc: "Cross-border influencer marketing platform.",
    url: "https://relay.club",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/relay.club",
  },
  {
    title: "Nu-Credits",
    desc: "Trade finance platform connecting businesses with lenders.",
    url: "https://nu-credits.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/nu-credits.com",
  },
  {
    title: "BizB",
    desc: "Marketplace connecting sellers of used apparel and accessories with buyers in Pakistan.",
    url: "https://bizbuysell.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/bizbuysell.com",
  },
  {
    title: "Cocotel",
    desc: "Proptech firm helping independent hotels manage operations and marketing in the Philippines.",
    url: "https://cocotel.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/cocotel.com",
  },
  {
    title: "Easy Rice",
    desc: "Agritech firm using AI to digitize food supply chains in Thailand.",
    url: "https://easyrice.ai",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/easyrice.ai",
  },
  {
    title: "Healthpro",
    desc: "Healthtech platform providing on-demand healthcare workers in Indonesia.",
    url: "https://healthproductsforyou.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/healthproductsforyou.com",
  },
  {
    title: "Hishabee",
    desc: "MSME business solution platform digitizing operations in Bangladesh.",
    url: "https://hishabee.business",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/hishabee.business",
  },
  {
    title: "Kooky.io",
    desc: "Platform connecting global superfans with K-pop artists.",
    url: "https://kooky.io",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/kooky.io",
  },
  {
    title: "Safe Truck",
    desc: "AI and IoT-based fleet management firm in Malaysia.",
    url: "https://safetruck.co",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/safetruck.co",
  },
  {
    title: "Ulisse",
    desc: "IoT company providing analytics on physical commercial spaces.",
    url: "https://ulisses-spiele.de",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/ulisses-spiele.de",
  },
  {
    title: "Edutechs",
    desc: "Comprehensive education technology platform in Bangladesh.",
    url: "https://edutechspot.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/edutechspot.com",
  },
  {
    title: "Lemonade",
    desc: "Marketplace brand retailing luxury goods globally.",
    url: "https://lemonade.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/lemonade.com",
  },
  {
    title: "Lister",
    desc: "Online learning platform for languages and test preparation in Indonesia.",
    url: "https://listerhill.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/listerhill.com",
  },
  {
    title: "On Demand Deals",
    desc: "Commerce platform converting unused spaces into cloud convenience stores.",
    url: "https://ondemand.deals",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/ondemand.deals",
  },
  {
    title: "Pattern",
    desc: "Social food app focused on the dine-in and pick-up experience in Pakistan.",
    url: "https://patternreview.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/patternreview.com",
  },
  {
    title: "Proton",
    desc: "Behavior-based data insurance platform in the UAE.",
    url: "https://proton.me",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/proton.me",
  },
  {
    title: "Sparklehaze",
    desc: "AI voice assistant provider for the luxury hospitality industry.",
    url: "https://sparklehaze.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/sparklehaze.com",
  },
  {
    title: "WeGro",
    desc: "Data-driven agritech startup integrating farmers with finance and markets.",
    url: "https://wegrowth.io",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/wegrowth.io",
  },
  {
    title: "Auptimate",
    desc: "Platform to design, launch, and operate special-purpose vehicles (SPVs).",
    url: "https://auptimate.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/auptimate.com",
  },
  {
    title: "BrickandMortar.AI",
    desc: "AI platform connecting existing CCTV infrastructure for real-time intelligence.",
    url: "https://brickandmortarai.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/brickandmortarai.com",
  },
  {
    title: "Interactive Cares",
    desc: "Virtual edtech startup offering academic, career, and skill development courses.",
    url: "https://interactivecares-courses.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/interactivecares-courses.com",
  },
  {
    title: "Mintpay",
    desc: "Shopping aggregator in Sri Lanka offering BNPL and flexible payment options.",
    url: "https://mintpay.lk",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/mintpay.lk",
  },
  {
    title: "noApp",
    desc: "AI-driven marketing platform utilizing the WhatsApp API.",
    url: "https://noappforlife.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/noappforlife.com",
  },
  {
    title: "PEEL Lab",
    desc: "B2B climatetech startup making plant-based leather from pineapple leaves.",
    url: "https://peel-lab.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/peel-lab.com",
  },
  {
    title: "UXArmy",
    desc: "Remote user research platform for quick customer insights.",
    url: "https://uxarmy.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/uxarmy.com",
  },
  {
    title: "Blursday",
    desc: "AI-powered branding and enforcement solution for startups.",
    url: "https://blursday.wtf",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/blursday.wtf",
  },
  {
    title: "HiPajak",
    desc: "AI tax consultant for SMEs and individuals in Indonesia.",
    url: "https://hipajak.id",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/hipajak.id",
  },
  {
    title: "Myfitsociety",
    desc: "Women's wellness and fitness platform in Indonesia.",
    url: "https://myfitsociety.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/myfitsociety.com",
  },
  {
    title: "Palki Motors",
    desc: "Bangladesh's first electric car and truck manufacturer.",
    url: "https://palkimotors.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/palkimotors.com",
  },
  {
    title: "Prospero",
    desc: "Risk Management SaaS for enterprises.",
    url: "https://prosperousuniverse.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/prosperousuniverse.com",
  },
  {
    title: "Relaxy",
    desc: "Mental health platform combining community, AI, and professional support.",
    url: "https://relax-yachting.com",
    tag: "Investment & Advisory",
    logo: "https://logo.clearbit.com/relax-yachting.com",
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
              className="rounded-xl border border-card-border p-6 hover:border-accent/50 transition-colors flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                  {project.tag}
                </span>
                {project.logo && (
                  <ClientLogo src={project.logo} alt={`${project.title} logo`} />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted flex-grow mb-4">{project.desc}</p>
              <span className="text-accent text-sm font-medium mt-auto">
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
