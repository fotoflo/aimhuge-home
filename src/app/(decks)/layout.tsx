import type { Metadata } from "next";
import "@/app/(site)/globals.css";
import { SuppressHydrationWarning } from "./SuppressHydrationWarning";

export const metadata: Metadata = {
  title: "AimHuge Decks",
};

export default function DecksRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        <SuppressHydrationWarning />
        {children}
      </body>
    </html>
  );
}
