"use client";

import { useState, useEffect } from "react";
import { Heart, Edit2, CheckCircle2, Building2, X, Search, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CharityOption = { id: string, name: string, description: string };

export default function CharityManagementPage() {
  const [percentage, setPercentage] = useState(10);
  const [charityName, setCharityName] = useState("Loading...");
  const [charityDesc, setCharityDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [charityList, setCharityList] = useState<CharityOption[]>([]);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCharityData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('charity_percentage, charities(id, name, description)')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setPercentage(profile.charity_percentage || 10);
        const charityData = profile.charities as any;
        if (charityData) {
          const finalCharity = Array.isArray(charityData) ? charityData[0] : charityData;
          setCharityName(finalCharity?.name || "No Organization Elected");
          setCharityDesc(finalCharity?.description || "Select a verified initiative from the global directory to enforce capital distribution.");
        } else {
          setCharityName("No Organization Elected");
          setCharityDesc("Please select an initiative from the global directory.");
        }
      }

      const { data: directory } = await supabase.from('charities').select('id, name, description').order('name');
      if (directory) setCharityList(directory);

      setLoading(false);
    };

    fetchCharityData();
  }, []);

  const handleSavePercentage = async () => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ charity_percentage: percentage })
      .eq('id', userId);
      
    if (!error) setIsEditing(false);
    else alert("Failed to save settings: " + error.message);
    setLoading(false);
  };

  const handleUpdateCharity = async (newCharityId: string) => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ chosen_charity_id: newCharityId })
      .eq('id', userId);

    if (error) {
      alert("Failed to bind allocation array: " + error.message);
      setLoading(false);
    } else {
      window.location.reload();
    }
  };

  const filteredCharities = charityList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* Configuration Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Impact Configuration</h1>
        <p className="text-zinc-400 text-sm max-w-2xl">Modify your platform contribution limits securely and elect the exact global foundation.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative">
        
        {/* Active Charity Details */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-lg border border-white/5 backdrop-blur-3xl transition-transform duration-500 relative overflow-hidden group animate-float cursor-default">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
          
          <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-widest text-[11px] relative z-10 border-b border-white/10 pb-4">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-sm"><Building2 size={12} /></span>
              Current Beneficiary Target
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-6 bg-gradient-to-t from-black/20 to-transparent rounded-xl border border-white/5 shadow-inner relative z-10">
            <div className="w-16 h-16 mb-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.2)] text-3xl transition-transform duration-500 group-hover:scale-110">
              <span className="group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">💚</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tighter px-4">{charityName}</h3>
            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed px-4">{charityDesc}</p>
            
            <button 
              onClick={() => setShowCharityModal(true)}
              className="mt-6 flex items-center gap-2 text-xs text-black font-bold uppercase tracking-widest transition-all z-10 bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-full shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Modify Target</span>
            </button>
          </div>
        </div>

        {/* Financial Flow Settings */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-lg border border-white/5 backdrop-blur-3xl transition-transform duration-500 animate-float-delayed relative overflow-hidden group cursor-default">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-widest text-[11px] relative z-10 border-b border-white/10 pb-4">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"><Heart size={12} className="fill-emerald-400/20" /></span>
              Financial Flow Parameters
            </span>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                 <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] block mb-0.5">Base Subscription</span>
                 <span className="text-white font-bold text-sm">Operational Access</span>
              </div>
              <div className="text-lg font-black text-emerald-400">$20.00 <span className="text-xs text-zinc-500 font-bold">/m</span></div>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="flex justify-between items-end">
                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] block">Philanthropy Output %</span>
                <span className="text-white font-black text-2xl leading-none">{percentage}%</span>
              </label>
              
              <div className="relative h-8 flex items-center">
                <input
                  type="range"
                  min="10"
                  max="100"
                  disabled={!isEditing || loading}
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 z-10"
                />
              </div>
            </div>

            <div className="bg-emerald-900/10 rounded-xl p-4 flex items-center justify-between border border-emerald-500/20 shadow-inner">
              <div>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest block mb-0.5">Algorithmic Impact</span>
                <div className="flex items-end gap-2 text-white font-black">
                  <span className="text-2xl tracking-tighter">${(20 * (percentage / 100)).toFixed(2)}</span>
                  <span className="text-[10px] mb-1 text-zinc-500 uppercase tracking-widest">Distributed Flawlessly</span>
                </div>
              </div>
               <ShieldCheck size={24} className="text-emerald-500/30" />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                   <button 
                    onClick={handleSavePercentage}
                    disabled={loading}
                    className="flex-1 px-4 py-3 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold uppercase tracking-widest transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer text-[10px]"
                  >
                    <CheckCircle2 size={14} /> {loading ? "Updating..." : "Lock Parameters"}
                  </button>
                  <button 
                    onClick={() => { setIsEditing(false); window.location.reload(); }}
                    className="sm:w-1/3 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest transition-all border border-white/10 cursor-pointer text-[10px]"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest transition-all border border-white/10 cursor-pointer shadow-inner text-[10px] hover:border-emerald-500/30 hover:text-emerald-400"
                >
                  <Edit2 size={14} /> Override Configuration
                </button>
              )}
            </div>
            
            <div className="text-center mt-1">
               <button className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest hover:text-red-400 transition-colors">
                  Terminate Access Array
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Luxury Charity Modal */}
      {showCharityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-md" onClick={() => setShowCharityModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#0d0d12] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] animate-fade-in-up overflow-hidden">
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between relative bg-white/5">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Verified Infrastructure</h2>
                <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-widest">Elect a secure distribution target</p>
              </div>
              <button 
                onClick={() => setShowCharityModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-black/40 border-b border-white/5 relative z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 focus:border-emerald-500/40 font-bold shadow-inner"
                  placeholder="Query authorized platforms..."
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto overflow-x-hidden flex-1 space-y-3 custom-scrollbar bg-gradient-to-b from-[#0a0a0c] to-black">
              {filteredCharities.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 font-bold text-sm">0 AUTHORIZED NODES LOCATED.</div>
              ) : filteredCharities.map(charity => (
                <div key={charity.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-emerald-900/20 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer" onClick={() => handleUpdateCharity(charity.id)}>
                  <div className="flex gap-4 items-center flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-xl font-black text-white shadow-md group-hover:scale-110 transition-transform duration-500">
                      <span className="group-hover:animate-pulse-heart origin-center drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">💚</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-white font-bold tracking-tight mb-0.5 group-hover:text-emerald-400 transition-colors">{charity.name}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2">{charity.description}</p>
                    </div>
                  </div>
                  <button className="md:w-auto w-full px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0 whitespace-nowrap shadow-sm">
                    Bind To Vector
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
