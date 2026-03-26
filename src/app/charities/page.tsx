"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Charity = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
};

export default function CharitiesPublicPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase.from('charities').select('*').order('name');
      if (data) setCharities(data);
      setLoading(false);
    };
    fetchCharities();
  }, []);

  const filtered = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-outfit text-white relative overflow-hidden">
      
      {/* Top Navbar (Persistent Across Public Pages) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group cursor-pointer">
             <div className="relative w-10 h-10 flex items-center justify-center">
               <Image src="/logo.png" alt="FairwayFund Logo" width={40} height={40} className="rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500 border border-emerald-500/30 group-hover:border-emerald-400" />
             </div>
             <span className="text-xl font-bold tracking-tight">Fairway<span className="text-emerald-400">Fund</span></span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/login" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors hidden sm:block">Log In</Link>
             <Link href="/signup" className="group px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-emerald-400 hover:text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2">
               <span>Join Club</span>
               <span className="inline-block group-hover:translate-x-1 group-hover:-rotate-12 transition-all">🏌️‍♂️</span>
             </Link>
          </div>
        </div>
      </nav>

      {/* Atmospheric Mesh */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-surface),_transparent_60%)] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse-slow pointer-events-none"></div>
      
      <main className="max-w-7xl mx-auto flex flex-col gap-14 px-6 pt-28 pb-32 relative z-10">
        
        {/* Massive Header Engine */}
        <div className="flex flex-col gap-6 animate-fade-in-up items-center text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm text-blue-400 font-bold tracking-wide mb-2 group">
             <span className="text-xl group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">💚</span>
             Charity Foundation Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 tracking-tighter drop-shadow-2xl px-4">
            Supported Causes
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed font-light mt-2 relative overflow-hidden group">
            Explore the strictly verified global organizations that benefit directly from the community's combined stableford platform subscriptions.
            <span className="absolute -bottom-2 left-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-roll-in transition-all duration-300 text-3xl z-0">⚪</span>
          </p>
        </div>

        {/* Floating Search Console */}
        <div className="glass-panel p-6 rounded-[2rem] animate-fade-in-up shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-3xl mx-auto relative z-10" style={{ animationDelay: '100ms' }}>
          <div className="relative w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={24} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl py-5 pl-16 pr-6 text-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all font-medium"
              placeholder="Search charities by name or focus..."
            />
          </div>
        </div>

        {/* Architectural Organization Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 relative z-10">
          {loading ? (
             <div className="col-span-full py-32 flex flex-col items-center justify-center text-zinc-500 space-y-6">
               <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
               <p className="text-xl font-medium animate-pulse">Loading global charity directory...</p>
             </div>
          ) : filtered.length === 0 ? (
             <div className="col-span-full py-32 text-center text-zinc-500 text-xl font-medium">No verified charities found matching &quot;{search}&quot;.</div>
          ) : filtered.map((charity, index) => (
             <div 
                key={charity.id} 
                className="glass-panel p-8 rounded-3xl flex flex-col group hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(16,185,129,0.2)] hover:bg-emerald-900/10 border border-white/5 hover:border-emerald-500/40 overflow-hidden relative cursor-default animate-fade-in-up"
                style={{ animationDelay: `${200 + (index * 50)}ms` }}
              >
                {/* Micro-glow strictly on hover */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/0 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-2xl flex items-center justify-center mb-6 text-3xl border border-emerald-500/20 shadow-[0_10px_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform duration-500 z-10">
                  <span className="group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">💚</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 z-10 font-outfit tracking-tight leading-tight">{charity.name}</h3>
                
                <p className="text-lg text-zinc-400 flex-1 leading-relaxed line-clamp-4 z-10 group-hover:text-emerald-50 min-h-24 transition-colors">
                  {charity.description || "No public mandate provided by this organization yet."}
                </p>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between z-10 relative">
                  <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-bold uppercase tracking-widest text-emerald-400 shadow-inner">Verified Pool</span>
                  <Link href="/signup" className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Support Initiative <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
             </div>
          ))}
        </div>
      </main>

      {/* Simplified Footer for App Pages */}
      <footer className="border-t border-white/10 bg-[#060608] py-10 px-6 relative z-10 group">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl border border-emerald-500/30 group-hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors">
                <Image src="/logo.png" alt="FairwayFund Logo" width={40} height={40} className="object-cover" />
             </div>
             <span className="text-xl font-bold tracking-tight text-white font-outfit">Fairway<span className="text-emerald-400">Fund</span></span>
          </div>
          <p className="text-zinc-500 text-sm font-medium">© 2026 Distribution Matrix. Authorized access only.</p>
        </div>
      </footer>
    </div>
  );
}
