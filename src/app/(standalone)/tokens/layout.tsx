import type { Metadata } from "next";
import "@/app/(site)/globals.css";

export const metadata: Metadata = {
  title: "AI Token Terminal"
};

export default function TokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We need an html and body tag here because the root layout in Next.js 
  // is circumvented by the (site) and (decks) route groups.
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
