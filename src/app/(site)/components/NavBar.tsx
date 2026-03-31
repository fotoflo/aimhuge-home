"use client";

import Link from "next/link";
import Image from "next/image";
import { LoginButton } from "./LoginButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workshop", label: "AI Workshop" },
  { href: "/advisory", label: "Advisory" },
  { href: "/talks", label: "Talks" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-white.png"
            alt="AimHuge"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
            style={{ width: "auto" }}
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
          <LoginButton />
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
  );
}
