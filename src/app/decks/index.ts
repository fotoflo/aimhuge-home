/* ── Deck Kit — reusable presentation components ───────────── */

// Components
export { DeckShell } from "./components/DeckShell";
export { SlideShell } from "./components/SlideShell";
export { SlideNav } from "./components/SlideNav";
export { Card, CardTitle, CardText, CardList } from "./components/Card";
export { Stat, MetricRow } from "./components/Stat";
export { Tag } from "./components/Tag";

// Config (server-only — Redis read/write)
export { getDeckConfig, setDeckConfig } from "./lib/config";
export { deckConfigRoute } from "./lib/api";

// Types
export type { DeckTheme, SlideVariant, CardAccent, TagColor } from "./lib/types";
