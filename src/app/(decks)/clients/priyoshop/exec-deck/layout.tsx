import localFont from "next/font/local";
import "@/app/decks/deck.css";
import "./aimhuge.css";

const geistSans = localFont({
  src: [
    { path: "../../../../../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2", weight: "400" },
    { path: "../../../../../../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2", weight: "500" },
    { path: "../../../../../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2", weight: "600" },
    { path: "../../../../../../node_modules/geist/dist/fonts/geist-sans/Geist-Bold.woff2", weight: "700" },
  ],
  display: "swap",
});

export default function ExecDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.className} min-h-screen bg-[#08080a] text-slate-200`}>
      {children}
    </div>
  );
}
