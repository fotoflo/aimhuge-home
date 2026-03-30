import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

const geistSans = localFont({
  src: [
    { path: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2", weight: "400" },
    { path: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2", weight: "500" },
    { path: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", weight: "600" },
    { path: "../../../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2", weight: "700" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    { path: "../../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", weight: "400" },
    { path: "../../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AimHuge Services",
  description: "AimHuge internal applications and utilities.",
};

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
