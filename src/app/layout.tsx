import type { Metadata } from "next";
import "@/styles/tokens.css"; // design tokens (สี/spacing/radius/สถานะ)
// ถ้ามี globals.css ของคุณเองอยู่แล้ว สามารถ import ต่อท้ายได้ เช่น:
// import "./globals.css";

export const metadata: Metadata = {
  title: "Claqueta",
  description: "Film-grade pre-production hub: shotlist, stripboard, call sheet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          background: "var(--neutral-900)",
          color: "white",
          fontFamily: "var(--font-th, var(--font-en, system-ui, -apple-system, sans-serif))",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
