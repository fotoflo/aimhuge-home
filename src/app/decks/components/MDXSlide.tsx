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
      });
    return `style={{${pairs.join(", ")}}}`;
  });
}

/** img tag that works without width/height (uses unoptimized next/image or plain img) */
function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
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
                    <MDXRemote source={fixStringStyles(content)} components={mdxComponents} />
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
            <MDXRemote source={fixStringStyles(content)} components={mdxComponents} />
    </SlideShell>
  );
}
