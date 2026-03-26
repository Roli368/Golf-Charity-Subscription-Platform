"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col justify-center items-center relative overflow-hidden font-outfit p-6 sm:p-12">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-emerald-600/10 blur-[140px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Brand Anchor */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 z-50 group hover:-translate-y-1 transition-transform duration-300">
        <Image src="/logo.png" alt="FairwayFund Logo" width={40} height={40} className="rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-300 border border-emerald-500/30 group-hover:border-emerald-400" />
        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">Fairway<span className="text-emerald-400">Fund</span></span>
      </Link>

      {/* Main Authentication Panel */}
      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        {/* Decorative inner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative glass-panel bg-[#0a0a0c]/80 backdrop-blur-3xl p-8 rounded-2xl w-full flex flex-col gap-6 shadow-2xl border border-white/5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Clubhouse Login</h2>
            <p className="text-zinc-400 text-sm">Access your player dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center justify-center text-center animate-fade-in-up">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:bg-[#0a0a0c] transition-all font-bold text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-[10px] uppercase font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] focus:bg-[#0a0a0c] transition-all font-mono tracking-widest text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Clubhouse"}</span>
              {!loading && (
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="pt-5 border-t border-white/5 text-center text-zinc-400 text-xs font-medium">
            Not registered on the platform?{" "}
            <Link href="/signup" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors ml-1 uppercase tracking-wider text-[10px]">
              Join the Club
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
