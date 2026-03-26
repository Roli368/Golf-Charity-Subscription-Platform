"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Bell, Save, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        setName(data.full_name || "");
        setEmail(data.email || "");
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', userId);

    setLoading(false);
    
    if (error) {
      alert("Database error: " + error.message);
    } else {
      alert("Architectural Profile Identity overridden successfully.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Encryption array length insufficient. (min 6)");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    
    if (error) {
      alert("Encryption failed: " + error.message);
    } else {
      alert("Security Keys rotated globally.");
      setIsChangingPassword(false);
      setNewPassword("");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      
      {/* Header Array */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Security & Routing Parameters</h1>
        <p className="text-zinc-400 text-sm max-w-xl">Modify root global player identifiers, rotate cryptographic keys, and establish neural link notification systems.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Profile Settings Engine */}
        <div className="md:col-span-7 glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-lg border border-white/5 backdrop-blur-3xl hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden group cursor-default">
          <div className="absolute top-0 right-[-10%] w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-700"></div>
          
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2 uppercase tracking-widest relative z-10">
             <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><User size={16} /></span>
             Player Identifier Arrays
          </h3>

          <form onSubmit={handleSave} className="space-y-4 relative z-10">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Player Moniker</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] focus:bg-[#0a0a0c] transition-all font-bold text-sm"
                  placeholder="e.g. Architect Zero"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Endpoint Router</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  disabled
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border-dashed shadow-inner"
                />
              </div>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest px-1">Network lock enforced on base emails.</p>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="mt-6 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto cursor-pointer text-[11px]"
             >
               <Save size={16} />
               <span>{loading ? "Overwriting..." : "Push Update"}</span>
             </button>
           </form>
         </div>

         {/* Security & Notifications Modules */}
         <div className="md:col-span-5 flex flex-col gap-6">
           <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/5 backdrop-blur-3xl hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden group cursor-default">
             <div className="absolute top-0 right-[-10%] w-32 h-32 bg-rose-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-rose-500/20 transition-colors"></div>
             
             <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2 uppercase tracking-widest relative z-10">
               <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400"><Shield size={16} /></span>
               Key Management
             </h3>
             {isChangingPassword ? (
               <form onSubmit={handlePasswordChange} className="space-y-3 relative z-10">
                 <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-400 transition-colors" size={16} />
                   <input
                     type="password"
                     required
                     autoFocus
                     placeholder="New Key (min 6)"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 focus:shadow-[0_0_15px_rgba(244,63,94,0.2)] font-mono tracking-widest text-sm transition-all"
                   />
                 </div>
                 <div className="flex gap-2">
                   <button
                     type="submit"
                     disabled={passwordLoading}
                     className="flex-1 bg-rose-500 hover:bg-rose-400 text-black py-3 rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-70 text-[10px] shadow-md hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 cursor-pointer"
                   >
                     {passwordLoading ? "Hashing..." : "Rotate"}
                   </button>
                   <button
                     type="button"
                     onClick={() => { setIsChangingPassword(false); setNewPassword(""); }}
                     className="px-5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest transition-colors text-[10px] border border-white/10 cursor-pointer"
                   >
                     Void
                   </button>
                 </div>
               </form>
             ) : (
               <button 
                 onClick={() => setIsChangingPassword(true)}
                 className="w-full bg-[#0a0a0c] hover:bg-rose-500/10 hover:border-rose-500/30 text-rose-400 p-4 rounded-xl font-bold uppercase tracking-widest transition-all border border-white/5 text-[10px] cursor-pointer shadow-inner flex items-center justify-center gap-2 group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                 <Shield size={14} className="group-hover:scale-110 transition-transform" /> Initialize Rotation
               </button>
             )}
           </div>

          <div className="glass-panel p-6 rounded-2xl flex-1 shadow-lg border border-emerald-500/20 backdrop-blur-3xl hover:-translate-y-1 transition-transform duration-500 bg-emerald-900/5 relative overflow-hidden group cursor-default">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
            <h3 className="text-sm font-bold text-white border-b border-emerald-500/20 pb-4 mb-4 flex items-center gap-2 uppercase tracking-widest relative z-10">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Bell size={16} /></span>
              Neural Links
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 bg-white/5 border border-white/5 rounded-xl hover:border-emerald-500/30 transition-colors">
                <div>
                   <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-0.5">Match Alerts</span>
                   <span className="text-[9px] text-zinc-400 font-medium">Webhook on draw day</span>
                </div>
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-6 bg-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:shadow-[0_0_15px_rgba(16,185,129,0.5)] relative shadow-inner border border-white/10 transition-all"></div>
              </label>
              <label className="flex items-center justify-between cursor-pointer p-4 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/30 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest block mb-0.5">Ledger Output</span>
                  <span className="text-[9px] text-zinc-400 font-medium">Impact receipts</span>
                </div>
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-6 bg-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 peer-checked:shadow-[0_0_15px_rgba(59,130,246,0.5)] relative shadow-inner border border-white/10 transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
