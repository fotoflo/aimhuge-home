import type { SlideVariant } from "./types";
import type { ComponentType } from "react";

export interface SlideFrontmatter {
  /** Controls slide ordering (10, 20, 30… — gaps allow easy insertion) */
  order: number;
  /** Slide variant — drives background, text colors */
  variant: SlideVariant;
  /** Small label above the title (e.g. "Section 2") */
  sectionLabel?: string;
  /** Slide title */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Top-right label (e.g. "~20 min", "Confidential") */
  topRight?: string;
  /** Full-bleed background image path */
  backgroundImage?: string;
  /** Overlay color over the background image (default: "bg-black/50") */
  backgroundOverlay?: string;
  /** Which logo to show: "white" for dark slides, "color" for light, false for none */
  logo?: "white" | "color" | false;
  /** Nesting level: 0 = top-level, 1 = subslide (max 2 levels) */
  level?: number;
}

export interface MDXSlideModule {
  default: ComponentType;
  frontmatter: SlideFrontmatter;
}
