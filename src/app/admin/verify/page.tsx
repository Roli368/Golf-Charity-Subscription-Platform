"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Search, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PendingVerificationType = {
  id: string;
  user_id: string;
  match_type: number;
  amount: number;
  verification_image_url: string;
  created_at: string;
  profiles?: { email: string };
};

export default function VerificationPage() {
  const [pending, setPending] = useState<PendingVerificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from('winnings')
        .select(`
          *,
          profiles(email)
        `)
        .eq('status', 'pending')
        .not('verification_image_url', 'is', null)
        .order('created_at', { ascending: true });

      if (data) setPending(data as unknown as PendingVerificationType[]);
      setLoading(false);
    };

    fetchPending();
  }, []);

  const handleAction = async (id: string, newStatus: 'paid' | 'rejected') => {
    if(!confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    
    // Optimistic UI update
    setPending(prev => prev.filter(p => p.id !== id));
    
    const { error } = await supabase
      .from('winnings')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      alert("Failed to update status: " + error.message);
      // Rollback (omitted for brevity)
    }
  };

  const filtered = pending.filter(p => p.id.includes(search) || p.profiles?.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Winner Verification</h1>
        <p className="text-zinc-400">Review uploaded score screenshots from members to approve and release draw payouts.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl mt-4">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Pending Reviews ({pending.length})</h3>
          <div className="flex gap-2">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                placeholder="Search ID or Email"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-zinc-500 font-medium">
                <th className="pb-3 px-4">Transaction ID</th>
                <th className="pb-3 px-4">Member Email</th>
                <th className="pb-3 px-4">Match Tier</th>
                <th className="pb-3 px-4">Payout Amount</th>
                <th className="pb-3 px-4 text-center">Proof Document</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Loading verifications...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-500">No pending verifications with uploads found.</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-zinc-300 font-mono text-xs">{item.id.slice(0, 8)}</td>
                  <td className="py-4 px-4 text-white font-medium">{item.profiles?.email}</td>
                  <td className="py-4 px-4 text-zinc-400">{item.match_type}-Number</td>
                  <td className="py-4 px-4 text-emerald-400 font-bold">${item.amount.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={() => window.open(item.verification_image_url, "_blank")}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors mx-auto cursor-pointer"
                    >
                      <Eye size={14} /> View Image
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleAction(item.id, 'paid')}
                         className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer" 
                         title="Approve & Pay"
                       >
                         <CheckCircle2 size={18} />
                       </button>
                       <button 
                         onClick={() => handleAction(item.id, 'rejected')}
                         className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer" 
                         title="Reject"
                       >
                         <XCircle size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
