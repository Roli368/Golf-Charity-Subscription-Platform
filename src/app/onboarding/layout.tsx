import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Fairways & Futures",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-[radial-gradient(ellipse_at_top,_var(--color-surface),_transparent_80%)] font-outfit flex flex-col items-center">
      
      {/* Step Indicator (Mocked for layout) */}
      <div className="w-full max-w-2xl mb-12 animate-fade-in-up">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10 -z-10"></div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]">1</div>
            <span className="text-xs font-semibold text-emerald-400">Select Charity</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-zinc-400 font-bold">2</div>
            <span className="text-xs font-medium text-zinc-400">Subscribe</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-zinc-400 font-bold">3</div>
            <span className="text-xs font-medium text-zinc-400">Done</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl w-full">
        {children}
      </div>
    </div>
  );
}
