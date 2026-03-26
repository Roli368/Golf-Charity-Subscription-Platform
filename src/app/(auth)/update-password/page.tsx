"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Update password for the currently authed user
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Secure Your Account</h2>
        <p className="text-zinc-400">Enter a new strong password below.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {success ? (
         <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <CheckCircle2 size={48} className="text-emerald-400" />
          <h3 className="text-xl font-bold text-white mt-2">Password Updated!</h3>
          <p className="text-sm">Your password has been successfully changed. You can now access your dashboard.</p>
          <Link href="/dashboard" className="mt-4 bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white px-6 py-3 rounded-xl transition-all font-bold">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="password">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="confirmPassword">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || password !== confirmPassword}
            className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{loading ? "Updating..." : "Update Password"}</span>
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      )}
    </div>
  );
}
