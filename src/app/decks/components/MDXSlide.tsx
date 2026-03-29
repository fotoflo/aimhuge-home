import { MDXRemote } from "next-mdx-remote/rsc";
import { SlideShell } from "./SlideShell";
import { Card, CardTitle, CardText, CardList } from "./Card";
import { Stat, MetricRow } from "./Stat";
import { Tag } from "./Tag";
import Image from "next/image";
import type { SlideFrontmatter } from "../lib/mdx-types";

/** Convert HTML style="..." attributes to JSX style={{...}} in MDX source */
function fixStringStyles(mdx: string): string {
  // Match style="..." on any JSX/HTML element
  return mdx.replace(/\bstyle="([^"]*)"/g, (_match, css: string) => {
    const pairs = css
      .split(";")
      .filter(Boolean)
      .map((s: string) => {
        const [key, ...val] = s.split(":");
        const camel = key.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        return `${JSON.stringify(camel)}: ${JSON.stringify(val.join(":").trim())}`;
      })
      // Drop cursor:pointer — inherited from .slide-container CSS;
      // keeping it inline causes hydration mismatches.
      .filter((p: string) => !p.includes('"cursor"'));
    if (pairs.length === 0) return "";
    return `style={{${pairs.join(", ")}}}`;
  });
}

/** Strip cursor:pointer from JSX-syntax style objects in MDX (e.g. style={{cursor:"pointer"}}) */
function stripCursorPointer(mdx: string): string {
  // Remove standalone style={{cursor:"pointer"}} or style={{ cursor: "pointer" }}
  return mdx
    .replace(/\bstyle=\{\{\s*cursor\s*:\s*["']pointer["']\s*\}\}/g, "")
    // Remove cursor:"pointer" entry from multi-property style objects
    .replace(/,?\s*cursor\s*:\s*["']pointer["']\s*,?/g, (match) => {
      // If match has commas on both sides, keep one comma
      if (match.trimStart().startsWith(",") && match.trimEnd().endsWith(",")) return ",";
      return "";
    });
}

/** img tag that works without width/height (uses unoptimized next/image or plain img) */
function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img suppressHydrationWarning {...props} />;
}

/** Components available inside MDX without explicit imports */
const mdxComponents = {
  Card,
  CardTitle,
  CardText,
  CardList,
  Stat,
  MetricRow,
  Tag,
  Image: MdxImage,
  img: MdxImage,
  // Prevent <p> nesting — MDX auto-wraps text in <p>, so use <div> instead
  p: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
};

interface MDXSlideProps {
  frontmatter: SlideFrontmatter;
  content: string;
}

function renderLogo(fm: SlideFrontmatter) {
  if (fm.logo === false) return undefined;
  const invert = fm.variant === "light";
  return (
    <Image
      src="https://cnnttsihfbyxhzlmzdtv.supabase.co/storage/v1/object/public/deck-assets/site-images/logo-white.png"
      alt="AimHuge"
      width={60}
      height={20}
      className={invert ? "invert" : ""}
      style={{ width: "auto", height: "auto" }}
    />
  );
}

export function MDXSlide({ frontmatter: fm, content }: MDXSlideProps) {
  // For hero/close variants, render MDX content directly (full custom layout)
  if (fm.variant === "hero" || fm.variant === "close") {
    return (
      <div className={`slide slide-${fm.variant}`}>
        <div className="relative z-10">
                    <MDXRemote source={stripCursorPointer(fixStringStyles(content))} components={mdxComponents} />
        </div>
      </div>
    );
  }

  return (
    <SlideShell
      variant={fm.variant}
      sectionLabel={fm.sectionLabel}
      title={fm.title}
      subtitle={fm.subtitle}
      logo={renderLogo(fm)}
      topRight={fm.topRight ? <span>{fm.topRight}</span> : undefined}
      backgroundImage={fm.backgroundImage}
      backgroundOverlay={fm.backgroundOverlay}
    >
            <MDXRemote source={stripCursorPointer(fixStringStyles(content))} components={mdxComponents} />
    </SlideShell>
  );
}
