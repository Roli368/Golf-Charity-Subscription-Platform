"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Lock, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
 
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const hasStripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== undefined && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== "";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Please log in to subscribe.");
      setLoading(false);
      return;
    }

    if (hasStripeKey) {
      // Real Stripe Flow
      try {
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: selectedPlan, userId: session.user.id })
        });
        
        const data = await res.json();
        
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          setError(data.error || "Failed to initialize checkout.");
        }
      } catch (err) {
        setError("Network error communicating with payment gateway.");
      }
      setLoading(false);
      return;
    }

   
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await supabase
      .from('profiles')
      .update({ subscription_status: 'active' })
      .eq('id', session.user.id);

    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Complete Your Journey</h1>
        <p className="text-lg text-zinc-400">Subscribe to track scores, engage in monthly mechanical draws, and automate your charitable impact.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 relative">
       
        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
          
          <div className="bg-white/5 p-1 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <button 
              onClick={() => setSelectedPlan("monthly")}
              className={`flex-1 w-full py-3 text-sm font-medium rounded-lg transition-all ${
                selectedPlan === "monthly" ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSelectedPlan("yearly")}
              className={`flex-1 w-full py-3 text-sm font-medium rounded-lg transition-all ${
                selectedPlan === "yearly" ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"
              }`}
            >
              Yearly <span className="text-xs text-emerald-200 ml-1">Save 15%</span>
            </button>
          </div>

          <div className="flex flex-col mt-4">
            <span className="text-zinc-400 text-sm font-medium">Platform Access</span>
            <div className="flex items-end gap-2 my-2">
              <span className="text-5xl font-bold text-white tracking-tight">
                ${selectedPlan === "monthly" ? "20" : "200"}
              </span>
              <span className="text-zinc-500 mb-1.5 font-medium">/{selectedPlan === "monthly" ? "mo" : "yr"}</span>
            </div>
            
            <ul className="mt-8 space-y-5">
              {[
                "Unlimited 5-score rolling tracking",
                "Automatic entry into monthly draw",
                "Direct automated charity donations",
                "Community impact reports"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Gateway Form area */}
        <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between">
          <form onSubmit={handleSubscribe} className="space-y-6 flex flex-col h-full">
            <div className="flex items-center gap-3 text-white font-semibold pb-4 border-b border-white/10">
              <CreditCard size={22} className="text-emerald-400" />
              <span className="text-lg">Secure Checkout</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {hasStripeKey ? (
               <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 py-6">
                 <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
                   <Zap size={36} className="text-indigo-400" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-white mb-2">Stripe Checkout</h3>
                   <p className="text-zinc-400 text-sm max-w-[250px] mx-auto">
                     You will be redirected securely to Stripe to complete your subscription using Apple Pay, Google Pay, Link, or standard Card.
                   </p>
                 </div>
               </div>
            ) : (
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-zinc-300">Card Number (Sandbox)</label>
                   <div className="relative">
                     <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                     <input
                       type="text"
                       required
                       maxLength={19}
                       value={cardNumber}
                       onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim())}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                       placeholder="4242 4242 4242 4242"
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-zinc-300">Expiry</label>
                     <input
                       type="text"
                       required
                       maxLength={5}
                       value={expiry}
                       onChange={(e) => setExpiry(e.target.value.replace(/\W/gi, '').replace(/(.{2})/, '$1/').trim())}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-center font-mono"
                       placeholder="MM/YY"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium text-zinc-300">CVC</label>
                     <div className="relative">
                       <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                       <input
                         type="text"
                         required
                         maxLength={4}
                         value={cvc}
                         onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                         className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                         placeholder="123"
                       />
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 mt-4">
                   <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                   <div>
                     <p className="text-xs text-emerald-100/70 leading-relaxed">
                       Sandbox mode is active because Stripe keys are missing. Any fake card will authorize.
                     </p>
                   </div>
                 </div>
               </div>
            )}

            <div className="mt-auto">
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 group relative inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-70 cursor-pointer text-lg"
              >
                <span>{loading ? "Initializing..." : (hasStripeKey ? "Proceed to Stripe Checkout" : `Pay $${selectedPlan === "monthly" ? "20" : "200"} (Fake)`)}</span>
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
