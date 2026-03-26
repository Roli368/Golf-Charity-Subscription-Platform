import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import { InteractiveEnvironment } from "@/components/InteractiveEnvironment";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Digital Heroes | Play with Purpose',
  description: 'A modern golf performance platform combining stableford tracking with community-driven charity draws.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${geist.variable} dark`}>
      <body className="antialiased font-sans">
        <InteractiveEnvironment />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-surface),_transparent_50%)]"></div>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.05),_transparent_50%)]"></div>
        {children}
      </body>
    </html>
  );
}
