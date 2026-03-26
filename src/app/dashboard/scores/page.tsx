"use client";

import { useState, useEffect } from "react";
import { Plus, Target, CalendarDays, History, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ScoreEntry = {
  id: string;
  score: number;
  date: string;
  created_at: string;
};

export default function ScoresPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [newScore, setNewScore] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoadingData(false);
        return;
      }
      setUserId(session.user.id);

      const { data } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) setScores(data);
      setLoadingData(false);
    };

    fetchScores();
  }, []);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScore || !newDate || !userId) return;
    
    const scoreNum = parseInt(newScore);
    if (scoreNum < 1 || scoreNum > 45) {
      alert("Stableford matrix inputs must be between 1 and 45.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('scores')
      .insert([{ user_id: userId, score: scoreNum, date: newDate }])
      .select();

    if (error) {
      alert("Error adding score to database: " + error.message);
    } else if (data && data.length > 0) {
      const { data: updatedScores } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (updatedScores) setScores(updatedScores);
      setNewScore("");
      setNewDate("");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Performance Matrix</h1>
        <p className="text-zinc-400 text-sm">Log your Stableford scores securely. The latest 5 entries structure your mechanical draw string.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Active Numbers Display */}
        <div className="md:col-span-12 w-full glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/20 shadow-lg backdrop-blur-3xl bg-gradient-to-t from-emerald-900/10 to-[#0a0a0c] relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none"></div>
          
          <div className="text-left relative z-10 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wide uppercase text-xs mb-1">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg group-hover:animate-flag-wave origin-bottom drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">⛳</span>
              <span>Active Draw Vector</span>
            </div>
            <p className="text-xs text-zinc-400 font-medium ml-10">Algorithmically cross-referenced in draw.</p>
          </div>
          
          <div className="flex flex-wrap items-center sm:justify-end gap-3 w-full sm:w-auto relative z-10">
            {loadingData ? (
               <div className="text-sm text-emerald-400 animate-pulse font-bold tracking-widest">Querying Matrix...</div>
            ) : (
               <>
                 {scores.slice(0, 5).map((score) => (
                   <div key={score.id} className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl md:text-2xl font-black text-white shadow-md transform hover:scale-105 hover:border-emerald-500/40 transition-all duration-300">
                     {score.score}
                   </div>
                 ))}
                 {Array.from({ length: 5 - scores.length }).map((_, i) => (
                   <div key={`empty-${i}`} className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-xl font-black text-zinc-700 border-dashed shadow-inner">
                     -
                   </div>
                 ))}
               </>
            )}
          </div>
        </div>

        {/* Add Score Form */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/5 backdrop-blur-3xl relative overflow-hidden group transition-all hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
               <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                 <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Plus size={16} /></span>
                 Input New Block
               </h3>
            </div>
            
            <form onSubmit={handleAddScore} className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Stableford Value (1-45)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                  <input
                    type="number"
                    min="1"
                    max="45"
                    required
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:bg-white/10 transition-all font-bold text-sm"
                    placeholder="e.g. 36"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Creation Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:bg-white/10 transition-all font-bold text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !userId}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] enabled:hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                {loading ? "Injecting Data..." : "Deploy Score"}
              </button>
            </form>
          </div>
        </div>

        {/* Score History */}
        <div className="md:col-span-8 glass-panel p-6 rounded-2xl flex flex-col h-[420px] shadow-lg border border-white/5 backdrop-blur-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10 border-b border-white/10 pb-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
               <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><History size={16} /></span>
               Historical Archive
             </h3>
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Ledger</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar relative z-10">
            {loadingData ? (
              <div className="text-zinc-500 text-center py-10 text-sm font-medium">Fetching secure records...</div>
            ) : scores.map((score, index) => (
              <div key={score.id} className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 group cursor-default relative overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-xl font-black text-white group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300 shadow-inner group-hover:text-blue-100">
                     {score.score}
                  </div>
                  <div>
                    <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mb-0.5 group-hover:text-blue-400/70 transition-colors">Date</div>
                    <div className="text-white font-medium text-sm group-hover:text-blue-50 transition-colors">{new Date(score.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                {index === 0 && (
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md shadow-[0_0_10px_rgba(16,185,129,0.2)] tracking-widest relative z-10 animate-pulse">
                    Live Node
                  </span>
                )}
              </div>
            ))}
            {!loadingData && scores.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-16 gap-3">
                <Target size={32} className="opacity-20" />
                <p className="text-sm font-medium">No performance blocks recorded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
