import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-outfit">
      {/* Visual / Branding Side */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-900/20 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),_transparent_60%)]"></div>
        
        <div className="z-10 max-w-lg">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-12 gap-2">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Play your part. <br />
            Make an impact.
          </h1>
          <p className="text-lg text-emerald-100/70">
            Join the only golf subscription platform where your performance directly contributes to the charities you care about.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-6 left-6 md:hidden">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors gap-2">
            <ArrowLeft size={20} />
            <span>Home</span>
          </Link>
        </div>
        
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}
