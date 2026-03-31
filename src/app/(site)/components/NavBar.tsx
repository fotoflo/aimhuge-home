"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-white.png"
            alt="AimHuge"
            width={256}
            height={98}
            sizes="120px"
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
        
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted hover:text-white transition-colors z-50"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Full Screen Mobile Overlay */}
      <div 
        className={`md:hidden absolute top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-background/98 backdrop-blur-3xl border-t border-white/5 transition-all duration-300 origin-top overflow-y-auto ${
          isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col px-8 py-12 gap-8 min-h-full">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-3xl font-bold tracking-tight text-white/70 hover:text-white transition-all transform hover:translate-x-2"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-8 mt-auto border-t border-white/10 flex flex-col gap-6">
            <LoginButton />
            <a
              href="https://calendly.com/fotoflo/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-accent px-6 py-4 text-center text-lg font-bold tracking-wide text-white shadow-[0_0_20px_var(--accent)] hover:bg-accent-hover hover:scale-[1.02] transition-all"
            >
              Book a Call
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
