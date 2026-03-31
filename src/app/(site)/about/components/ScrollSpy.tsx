"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Intro" },
  { id: "new-york", label: "New York Roots" },
  { id: "first-exit", label: "First Exit" },
  { id: "harvard", label: "Harvard Summer" },
  { id: "china", label: "Time In China" },
  { id: "500-startups", label: "500 Startups" },
  { id: "accelerating-asia", label: "Accelerating Asia" },
  { id: "asia", label: "25+ Years In Asia" },
  { id: "ai-advisor", label: "AI Advisor" },
  { id: "beyond-work", label: "Beyond Work" },
  { id: "languages", label: "Languages" },
];

export function ScrollSpy() {
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    // Intersect in the middle third of the screen
    const observer = new IntersectionObserver(
      (entries) => {
        // Get the intersecting entries
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the one that takes up more space
          // or just the first one. We'll pick the first intersecting one.
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // offset for fixed header
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-5 z-40">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group relative flex items-center justify-end"
            aria-label={label}
          >
            {/* Hover Tooltip / Active Label */}
            <span
              className={`absolute right-8 text-xs font-medium tracking-wide transition-all duration-300 pointer-events-none ${
                isActive
                  ? "opacity-100 translate-x-0 text-accent"
                  : "opacity-0 translate-x-2 text-muted group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {label}
            </span>

            {/* Glowing Dot */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-accent scale-[1.3] shadow-[0_0_12px_var(--accent)]"
                  : "bg-card-border group-hover:bg-muted group-hover:scale-110"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
