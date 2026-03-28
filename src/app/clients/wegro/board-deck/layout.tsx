import { Fira_Sans } from "next/font/google";
import "./wegro.css";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function BoardDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${firaSans.className} fixed inset-0 z-[100] bg-[#011412] text-slate-800 overflow-hidden`}>
      {children}
    </div>
  );
}
