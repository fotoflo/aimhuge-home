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
    <div className={`${firaSans.className} min-h-screen bg-[#011412] text-slate-800`}>
      {children}
    </div>
  );
}
