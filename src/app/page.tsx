import Link from "next/link";
import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { ArrowRight, BarChart3, Globe2, ShieldCheck, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white selection:bg-emerald-500/30 overflow-hidden font-outfit">
      
     
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

     
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
             <div className="relative w-10 h-10 flex items-center justify-center">
               <Image src="/logo.png" alt="FairwayFund Logo" width={40} height={40} className="rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500 border border-emerald-500/30 group-hover:border-emerald-400" />
             </div>
             <span className="text-xl font-bold tracking-tight">Fairway<span className="text-emerald-400">Fund</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-400">
             <Link href="#features" className="hover:text-emerald-400 hover:-translate-y-1 transition-all">Platform</Link>
             <Link href="/charities" className="hover:text-emerald-400 hover:-translate-y-1 transition-all">Charities</Link>
             <Link href="#impact" className="hover:text-emerald-400 hover:-translate-y-1 transition-all">Global Impact</Link>
          </div>
          <div className="flex items-center gap-6">
             <Link href="/login" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors hidden sm:block">Log In</Link>
             <Link href="/signup" className="group px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-emerald-400 hover:text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2">
               <span>Join Club</span>
               <span className="inline-block group-hover:translate-x-1 group-hover:-rotate-12 transition-all">🏌️</span>
             </Link>
          </div>
        </div>
      </nav>

      
      <main className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mt-4 md:mt-8">
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-bold tracking-wide mb-8 animate-fade-in-up hover:bg-emerald-500/20 transition-colors cursor-default group">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 group-hover:scale-150 transition-transform"></span>
            </span>
            <span>Live: <span className="text-white"><CountUp end={12450} prefix="$" /></span> Monthly Charity Pool</span>
            <span className="ml-2 opacity-50 group-hover:animate-pulse-heart origin-center">💚</span>
          </div>
          
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter text-white !leading-[1.1] mb-8 drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Drive the Green. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 relative inline-block group">
               Change the World.
               <span className="absolute -right-16 top-0 text-4xl opacity-0 group-hover:opacity-100 group-hover:animate-roll-in transition-all duration-300">⚪</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-14 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            The world's first platform combining deep stableford golf analytics with automated charitable giving and a mechanical lottery-style player draw. Put your scores to work.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto px-6 sm:px-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link 
              href="/signup" 
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full font-bold text-lg transition-all duration-500 transform hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] w-full sm:w-auto overflow-hidden"
            >
              <span>Tee Off Now</span>
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-12 transition-transform duration-500 relative">
                 <span className="absolute group-hover:opacity-0 transition-opacity">⛳</span>
                 <span className="absolute opacity-0 group-hover:opacity-100 font-sans text-xl translate-x-[-20px] group-hover:translate-x-0 transition-all">⚪</span>
              </div>
            </Link>
            <Link 
              href="/charities" 
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 text-white rounded-full font-bold text-lg transition-all duration-500 backdrop-blur-md hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="text-2xl group-hover:animate-pulse-heart">💚</span>
              <span>Find a Foundation</span>
            </Link>
          </div>
        </div>

       
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 relative px-4 md:px-0">
       
          <div className="glass-panel p-10 rounded-3xl flex flex-col gap-8 group hover:-translate-y-4 transition-all duration-500 ease-out hover:shadow-[0_40px_80px_rgba(16,185,129,0.2)] hover:border-emerald-500/40 hover:bg-emerald-900/10 overflow-hidden relative animate-float cursor-default">
          
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <div className="relative w-full h-24 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-end padding-4">
              
               <div className="absolute bottom-2 right-4 w-12 h-4 bg-black rounded-[100%] border border-white/10 shadow-inner">
                  <div className="absolute bottom-0 right-4 text-3xl group-hover:animate-flag-wave drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10">⛳</div>
               </div>
              
               <div className="absolute bottom-2 left-6 text-xl opacity-0 group-hover:opacity-100 group-hover:animate-roll-in drop-shadow-[0_5px_10px_rgba(255,255,255,0.4)] z-0">⚪</div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                 Rolling Stableford
              </h3>
              <p className="text-zinc-400 leading-relaxed text-lg group-hover:text-emerald-50 min-h-24 transition-colors">Sink your scores on the course. Only your 5 most recent rounds qualify your account for the mechanical draw.</p>
            </div>
          </div>

        
          <div className="glass-panel p-10 rounded-3xl flex flex-col gap-8 group hover:-translate-y-4 transition-all duration-500 ease-out hover:shadow-[0_40px_80px_rgba(59,130,246,0.2)] hover:border-blue-500/40 hover:bg-blue-900/10 overflow-hidden relative animate-float-delayed cursor-default">
          
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700"></div>
            <div className="relative w-full h-24 bg-gradient-to-t from-blue-500/10 to-transparent rounded-2xl border border-white/5 flex items-center justify-center">
               <div className="text-6xl drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:animate-pulse-heart text-blue-400 transition-all duration-300 group-hover:scale-110">💚</div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Passive Altruism</h3>
              <p className="text-zinc-400 leading-relaxed text-lg group-hover:text-blue-50 min-h-24 transition-colors">Send 10% to 100% of your subscription natively to verified global charities every single month automatically. Give back to the game.</p>
            </div>
          </div>

        
          <div className="glass-panel p-10 rounded-3xl flex flex-col gap-8 group hover:-translate-y-4 transition-all duration-500 ease-out hover:shadow-[0_40px_80px_rgba(244,63,94,0.2)] hover:border-rose-500/40 hover:bg-rose-900/10 overflow-hidden relative animate-float cursor-default">
        
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all duration-700"></div>
            <div className="relative w-full h-24 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-end justify-center pb-2">
             
               <div className="text-5xl group-hover:animate-swing origin-bottom drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] relative z-10 transition-transform duration-300">🏌️‍♂️</div>
             
               <div className="absolute top-4 right-8 text-2xl opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 delay-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">💰</div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Take The Prize</h3>
              <p className="text-zinc-400 leading-relaxed text-lg group-hover:text-rose-50 min-h-24 transition-colors">Match 3, 4, or 5 numbers exact to instantly win a cut of the global player prize pool. Every stroke counts.</p>
            </div>
          </div>

        </div>

      
        <div id="impact" className="col-span-1 md:col-span-3 mt-32 p-1.5 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-rose-500/20 animate-fade-in-up transition-transform duration-700 hover:scale-[1.01] overflow-hidden group">
          <div className="bg-[#0a0a0c]/90 backdrop-blur-3xl rounded-[2.3rem] p-10 md:p-14 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
           
            <div className="absolute top-0 right-1/4 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex-1 space-y-5 relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                 <span>Global Clubhouse Impact.</span>
                 <span className="text-4xl group-hover:animate-pulse-heart">💚</span>
              </h2>
              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">Our unified ledger ensures every subscription dollar is mathematically distributed directly to your chosen golf or youth charity flawlessly.</p>
            </div>
            
            <div className="flex gap-10 md:gap-16 relative z-10">
              <div className="flex flex-col gap-2 relative">
                <span className="text-5xl md:text-6xl font-black text-white group-hover:text-emerald-400 transition-colors duration-500 relative z-10"><CountUp end={42} suffix="+" duration={3000} /></span>
                <span className="text-sm md:text-base font-medium text-zinc-500 flex items-center gap-2 uppercase tracking-wider relative z-10"><Globe2 size={16} className="text-emerald-400" /> Authorized Charities</span>
              </div>
              <div className="w-px bg-white/10 hidden sm:block"></div>
              <div className="flex flex-col gap-2 relative">
                <span className="text-5xl md:text-6xl font-black text-white group-hover:text-blue-400 transition-colors duration-500 relative z-10"><CountUp end={14} prefix="$" suffix="M" duration={4000} /></span>
                <span className="text-sm md:text-base font-medium text-zinc-500 flex items-center gap-2 uppercase tracking-wider relative z-10"><ShieldCheck size={16} className="text-blue-400" /> Donated by Players</span>
              </div>
            </div>
          </div>
        </div>
      </main>

   
      <footer className="border-t border-emerald-500/10 bg-[#060608] pt-24 pb-10 px-6 mt-32 relative z-10 overflow-hidden group">
      
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform duration-1000"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 mb-20">
          <div className="md:col-span-5 pr-0 md:pr-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-2xl border border-emerald-500/30 group-hover:border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors">
                  <Image src="/logo.png" alt="FairwayFund" width={48} height={48} className="object-cover" />
               </div>
               <span className="text-2xl font-bold tracking-tight text-white">Fairway<span className="text-emerald-400">Fund</span></span>
            </div>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Combining the prestige of golf with the power of global philanthropy. Put your stableford scores to work.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-8">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Platform <span className="text-emerald-400">⛳</span></h4>
            <ul className="space-y-4 text-zinc-400 font-medium">
              <li><Link href="#features" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">How to Play</Link></li>
              <li><Link href="/charities" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Charity Roster</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Clubhouse Login</Link></li>
              <li><Link href="/signup" className="hover:text-emerald-400 hover:translate-x-1 transition-all inline-block">Join the Club</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Impact <span className="text-blue-400">💚</span></h4>
            <ul className="space-y-4 text-zinc-400 font-medium">
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Distribution Ledgers</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Charity Onboarding</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tax Deductions</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Foundation</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 font-medium text-sm">© 2026 FairwayFund Architecture. Play Responsibly. Give Generously.</p>
        </div>
      </footer>

    </div>
  );
}
