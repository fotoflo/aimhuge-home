import { Inter } from "next/font/google";
import "./wegro.css";

const inter = Inter({ subsets: ["latin"] });

export default function BoardDeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-900 text-slate-800 overflow-hidden h-screen">
        {children}
      </body>
    </html>
  );
}
