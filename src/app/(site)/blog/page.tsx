import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AimHuge",
  description:
    "Articles on AI workshops, Claude Code skills, and building with AI-assisted development.",
  openGraph: {
    title: "Blog — AimHuge",
    description:
      "Articles on AI workshops, Claude Code skills, and building with AI-assisted development.",
    images: [{ url: "/images/alex-headshot.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — AimHuge",
    description:
      "Articles on AI workshops, Claude Code skills, and building with AI-assisted development.",
    images: ["/images/alex-headshot.jpg"],
  },
};

const posts = [
  {
    slug: "how-to-write-a-done-skill-for-claude-code",
    title: "How to Write a /done Skill for Claude Code",
    description:
      "A step-by-step guide to building a /done skill that wraps up your Claude Code sessions with architecture docs, lint fixes, commits, and productivity reports.",
    date: "March 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
          Blog
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Articles
        </h1>
        <p className="text-muted leading-relaxed max-w-xl">
          Writing about AI workshops, Claude Code workflows, and building
          software with AI.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-card-border p-6 hover:border-accent/50 transition-colors"
            >
              <p className="text-sm text-muted mb-2">{post.date}</p>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {post.title}
              </h2>
              <p className="text-muted text-sm">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
