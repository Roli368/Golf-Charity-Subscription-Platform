"use client";

import { useState, useEffect } from "react";
import { CountUp } from "@/components/CountUp";
import { Trophy, UploadCloud, CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

type WinningsRecord = {
  id: string;
  draw_id: string;
  match_type: number;
  amount: number;
  status: string;
  verification_image_url: string | null;
  draws?: { drawn_at: string };
};

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<WinningsRecord[]>([]);
  const [totalWon, setTotalWon] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [completedPayouts, setCompletedPayouts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinnings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('winnings')
        .select('*, draws(drawn_at)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setWinnings(data as unknown as WinningsRecord[]);
        
        let total = 0, pending = 0, completed = 0;
        data.forEach((w) => {
          total += w.amount || 0;
          if (w.status === 'paid') completed += w.amount || 0;
          if (w.status === 'pending') pending += w.amount || 0;
        });

        setTotalWon(total);
        setPendingPayouts(pending);
        setCompletedPayouts(completed);
      }
      setLoading(false);
    };
    fetchWinnings();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* Header Engine */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Winnings & Verification</h1>
        <p className="text-zinc-400 text-sm max-w-2xl">Track global pool algorithmic results, view historic allocations, and securely provide verification proof to finalize transfers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden shadow-lg border border-white/5 backdrop-blur-3xl group transition-all duration-500 animate-float cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute top-4 right-4 text-4xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 pointer-events-none drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">🏆</div>
          <div className="relative z-10">
             <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-2 block">Total Lifetime Return</span>
             <span className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
               <CountUp end={totalWon} prefix="$" decimals={2} duration={2500} />
             </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 to-blue-500 opacity-50"></div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden shadow-lg border border-white/5 backdrop-blur-3xl group transition-all duration-500 animate-float-delayed cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute top-4 right-4 text-4xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 pointer-events-none drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">⏳</div>
          <div className="relative z-10">
             <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-2 block">Pending Payout Assets</span>
             <span className="text-4xl font-black text-amber-400 tracking-tighter drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">
               <CountUp end={pendingPayouts} prefix="$" decimals={2} duration={3000} />
             </span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden shadow-lg border border-emerald-500/30 bg-emerald-900/10 backdrop-blur-3xl group transition-all duration-500 animate-float cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute top-4 right-4 text-4xl group-hover:scale-125 transition-all duration-500 pointer-events-none drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">💸</div>
          <div className="relative z-10">
             <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest mb-2 block">Dispersed Capital</span>
             <span className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
               <CountUp end={completedPayouts} prefix="$" decimals={2} duration={2500} />
             </span>
          </div>
        </div>
      </div>

      {/* Advanced Ledger History */}
      <div className="glass-panel rounded-2xl border border-white/5 backdrop-blur-3xl shadow-lg relative overflow-hidden mt-2">
        
        {/* Header Ribbon */}
        <div className="p-6 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <div className="absolute top-0 right-1/4 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Draw Allocation History</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Official immutable algorithmic database outputs.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
             <ShieldCheck size={14} /> Data Secured
          </div>
        </div>

        <div className="p-6 space-y-4 bg-gradient-to-t from-[#0a0a0c] to-transparent">
          {loading ? (
             <div className="text-zinc-500 text-center py-12 text-sm font-medium animate-pulse">Running Ledger Queries...</div>
          ) : winnings.length === 0 ? (
             <div className="text-zinc-500 text-center py-16 flex flex-col items-center justify-center gap-3">
               <Trophy size={36} className="opacity-20" />
               <p className="text-base font-medium">No algorithmic winnings recorded yet.</p>
               <p className="text-xs mt-1 max-w-sm">Continue logging your stableford scores. A 3-number match on the 1st of the month will trigger an impact event here.</p>
             </div>
          ) : winnings.map((winning) => (
            <div key={winning.id} className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/30 transition-colors group">
              
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-xl shadow-md">
                  {winning.match_type}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-sm md:text-base tracking-tight">
                      {winning.draws?.drawn_at ? new Date(winning.draws.drawn_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recent Action"} Draw
                    </h4>
                    {winning.status === "paid" ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 size={10} /> Settled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center gap-1 shadow-sm">
                        <Clock size={10} /> Wait
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-medium">{winning.match_type}-Number Structural Match Sequence</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-6 md:w-1/2">
                <div className="text-2xl md:text-3xl font-black text-white shrink-0 tracking-tighter">
                  ${(winning.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>

                {!winning.verification_image_url && winning.status === "pending" && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-[0_5px_15px_rgba(16,185,129,0.2)] w-full md:w-auto shrink-0 enabled:hover:-translate-y-0.5 pointer bg-emerald-500 cursor-pointer">
                    <UploadCloud size={14} />
                    <span>Upload Proof</span>
                  </button>
                )}
                {winning.verification_image_url && winning.status === "pending" && (
                   <div className="px-4 py-2 border border-white/10 text-zinc-400 shadow-inner text-[11px] font-bold uppercase tracking-wider rounded-lg text-center bg-black/40 w-full md:w-auto flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Verifying...
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
