import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geistSans = localFont({
  src: [
    { path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2", weight: "400" },
    { path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2", weight: "500" },
    { path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", weight: "600" },
    { path: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2", weight: "700" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", weight: "400" },
    { path: "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AimHuge — Alex Miller",
  description:
    "Startup operator, investor, and AI trainer. Helping teams build with AI through hands-on workshops and advisory.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workshop", label: "AI Workshop" },
  { href: "/advisory", label: "Advisory" },
  { href: "/talks", label: "Talks" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo-white.png"
                alt="AimHuge"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://calendly.com/fotoflo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
              >
                Book a Call
              </a>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-card-border mt-24">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <Image
                  src="/images/logo-white.png"
                  alt="AimHuge"
                  width={100}
                  height={28}
                  className="h-7 w-auto mb-3"
                />
                <p className="text-sm text-muted max-w-xs">
                  Startup operator, investor, and AI trainer helping teams build
                  the future.
                </p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground mb-1">Links</span>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground mb-1">
                  Connect
                </span>
                <a
                  href="https://www.linkedin.com/in/fotoflo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/fotoflo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@fotoflo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  YouTube
                </a>
                <a
                  href="https://www.facebook.com/fotoflo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-card-border text-xs text-muted">
              &copy; {new Date().getFullYear()} AimHuge. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
