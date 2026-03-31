import { Metadata } from "next";
import { NewsletterCTA } from "../components/NewsletterCTA";
import { Mail, MapPin, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Newsletter — AimHuge",
  description: "Get in touch with Alex Miller or join the mailing list for updates.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="relative px-6 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-surface -z-20" />
        <div className="absolute inset-0 grain opacity-[0.05] -z-10 mix-blend-overlay" />
        <div className="absolute -top-40 right-10 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] -z-10 opacity-60 pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="text-sm font-medium text-accent uppercase tracking-[0.2em] animate-fade-up">Let&apos;s Talk</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-up delay-1">Contact</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed animate-fade-up delay-2">
            Whether you want to bring an AI workshop to your team, need strategic advisory, or just want to say hi.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-20 animate-fade-up delay-3">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Direct Contact Blocks */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Get in touch directly</h2>
            <p className="text-muted leading-relaxed">
              I&apos;m actively working with leadership and engineering teams across Asia and globally. The fastest way to explore how we can work together is to book a quick intro call.
            </p>

            <div className="space-y-6">
              <a href="https://calendly.com/fotoflo/30min" target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-card-bg border border-card-border hover:border-accent/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">Book a 30-min Intro Call</h3>
                    <p className="text-sm text-muted">Check my Calendly for availability</p>
                  </div>
                </div>
              </a>

              <a href="mailto:alex@aimhuge.com" className="block group">
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-card-bg border border-card-border hover:border-accent/40 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-surface border border-card-border flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Me</h3>
                    <p className="text-sm text-muted">Usually respond within 24 hours</p>
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-5 p-5 rounded-2xl bg-transparent border border-transparent">
                <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-muted">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Based Location</h3>
                  <p className="text-sm text-muted">Chiang Mai, Thailand (GMT+7)</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 flex items-center gap-6">
              <a href="https://www.linkedin.com/in/fotoflo" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors font-medium">
                LinkedIn
              </a>
              <a href="https://www.youtube.com/@fotoflo" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors font-medium">
                YouTube
              </a>
              <a href="https://instagram.com/fotoflo" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors font-medium">
                Instagram
              </a>
            </div>
          </div>

          {/* Newsletter Form Side */}
          <div className="h-full pt-10 md:pt-0">
            <div className="sticky top-24">
              <NewsletterCTA sourcePage="/contact" />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
