/* ── Deck Theme ─────────────────────────────────────────────── */

export interface DeckTheme {
  /** Primary brand color (used for accents, headings on light slides) */
  primary: string;
  /** Secondary / highlight color (used for labels, tags, stat values on dark) */
  secondary: string;
  /** Dark background gradient start */
  bgDark: string;
  /** Dark background gradient end */
  bgDarkEnd: string;
  /** Light background color */
  bgLight: string;
  /** Optional hero background image path */
  heroBg?: string;
  /** Optional closing slide background image path */
  closeBg?: string;
  /** Logo (white version) for dark slides */
  logoWhite?: string;
  /** Logo (color version) for light slides */
  logoColor?: string;
}

/* ── Slide Variants ────────────────────────────────────────── */

export type SlideVariant = "dark" | "light" | "hero" | "close";

/* ── Card Accents ──────────────────────────────────────────── */

export type CardAccent = "green" | "blue" | "amber" | "purple" | "red";

/* ── Tag Colors ────────────────────────────────────────────── */

export type TagColor = "green" | "blue" | "amber" | "slate" | "purple" | "red";
