"use client";

import { useState, useEffect } from "react";
import { CountUp } from "@/components/CountUp";
import { Target, Trophy, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [scores, setScores] = useState<number[]>([]);
  const [poolTotal, setPoolTotal] = useState<number>(0);
  const [charityName, setCharityName] = useState("Loading...");
  const [charityAlloc, setCharityAlloc] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: scoreData } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (scoreData) setScores(scoreData.map(s => s.score));

      const { data: profile } = await supabase
        .from('profiles')
        .select('charity_percentage, charities(name)')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setCharityAlloc(profile.charity_percentage || 10);
        const charityData = profile.charities as any;
        setCharityName(charityData?.name || charityData?.[0]?.name || "No Charity Selected");
      }

      const { data: drawData } = await supabase
        .from('draws')
        .select('total_pool')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (drawData) setPoolTotal(drawData.total_pool);
      setLoading(false);
    };

    fetchOverviewData();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* Premium Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Overview Engine</h1>
        <p className="text-zinc-400 text-sm">Your central hub for tracking performance and monitoring algorithmic draw sequences.</p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        
        {/* Next Draw Summary Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-lg border border-white/5 backdrop-blur-3xl transition-all duration-500 animate-float cursor-default">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute -right-2 -bottom-6 text-7xl pointer-events-none group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            💰
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 tracking-wide uppercase text-xs">
              <span className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center"><Trophy size={14} /></span>
              <span>Pending Draw Pool</span>
            </div>
            <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-md">
              <CountUp end={poolTotal} prefix="$" decimals={2} duration={2500} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-zinc-300 text-[11px] font-bold uppercase tracking-wider">
               <ShieldCheck size={12} className="text-blue-400" />
               Mathematical Distribution
            </div>
          </div>

          <div className="mt-8 space-y-3 relative z-10">
            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-zinc-400 font-semibold">Player Vector</span>
              <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded shadow-sm">Last 5 Stableford Scores</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-zinc-400 font-semibold">Engine Run</span>
              <span className="text-white font-bold text-emerald-400">Targeting 1st of Month</span>
            </div>
          </div>
        </div>

        {/* Rolling Scores Widget */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-lg border border-white/5 backdrop-blur-3xl transition-all duration-500 animate-float-delayed relative overflow-hidden group cursor-default">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="w-full relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wide uppercase text-xs">
                <span className="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center text-sm group-hover:animate-flag-wave origin-bottom drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">⛳</span>
                <span>Active Numbers Overlay</span>
              </div>
              <Link href="/dashboard/scores" className="group text-xs font-bold text-white bg-white/5 hover:bg-emerald-500 border border-white/10 hover:border-emerald-500 rounded-full px-4 py-1.5 transition-all flex items-center gap-1.5">
                Manage <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="flex gap-3 justify-between mt-6">
              {loading ? (
                <div className="text-zinc-500 py-6 text-center w-full animate-pulse font-bold text-sm">Initializing...</div>
              ) : (
                <>
                  {scores.slice(0, 5).map((score, i) => (
                    <div key={i} className="flex-1 aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                      <span className="text-xl md:text-2xl font-black text-white relative z-10"><CountUp end={score} duration={1500} /></span>
                      {i === 0 && <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/50 rounded-xl animate-pulse pointer-events-none"></div>}
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - scores.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex-1 aspect-square rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-zinc-700 shadow-inner overflow-hidden">
                      <span className="text-xl font-black">-</span>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">Your platform algorithm uses your last 5 Stableford scores automatically for mechanical draw comparisons.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Integrated Charity Impact Strip */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-900/10 via-[#0a0a0c] to-blue-900/10 shadow-[0_15px_30px_rgba(16,185,129,0.15)] flex flex-col md:flex-row gap-6 items-center justify-between hover:border-emerald-500/40 transition-colors duration-500 mt-6 relative z-10 animate-fade-in-up group overflow-hidden cursor-default" style={{ animationDelay: '300ms' }}>
        <div className="absolute top-0 right-1/4 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
            <span className="text-2xl group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">💚</span>
          </div>
          <div>
            <h3 className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-0.5">Directing Philanthropy to</h3>
            <h4 className="text-xl font-black text-white font-outfit">{charityName}</h4>
            <div className="inline-flex items-center gap-2 mt-1.5">
               <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase rounded-md shadow-sm">Automated Release</span>
               <span className="text-xs text-zinc-400 font-medium">({charityAlloc}% allocation protocol)</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right w-full md:w-auto bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
          <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Historic Impact</div>
          <div className="text-3xl font-black text-white drop-shadow-sm flex items-center">
            <CountUp end={0} prefix="$" decimals={2} duration={2000} />
          </div>
        </div>
      </div>

    </div>
  );
}
