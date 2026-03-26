"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Send password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel p-8 md:p-10 rounded-2xl w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-zinc-400">We&apos;ll send you a secure link to reset it.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
          <CheckCircle2 size={48} className="text-emerald-400" />
          <h3 className="text-xl font-bold text-white mt-2">Check Your Email</h3>
          <p className="text-sm">We&apos;ve sent a password reset link to {email}. Please click the link to choose a new password.</p>
          <Link href="/login" className="mt-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-2 rounded-xl transition-colors font-medium">
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">Registered Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{loading ? "Sending Link..." : "Send Reset Link"}</span>
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      )}

      {!success && (
        <div className="mt-2 text-center text-sm text-zinc-400">
          Remembered your password?{" "}
          <Link href="/login" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
