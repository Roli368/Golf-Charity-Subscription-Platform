"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ArrowRight, Building2 } from "lucide-react";

const MOCK_CHARITIES = [
  { id: 1, name: "Youth On Course", desc: "Providing youth access to golf." },
  { id: 2, name: "First Tee", desc: "Impacting youth through the game of golf." },
  { id: 3, name: "Water.org", desc: "Empowering families with access to safe water." },
  { id: 4, name: "Local Hospital Foundation", desc: "Supporting community healthcare initiatives." },
];

export default function CharitySelectionPage() {
  const [search, setSearch] = useState("");
  const [selectedCharity, setSelectedCharity] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number>(10);

  const filteredCharities = MOCK_CHARITIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Impact</h1>
        <p className="text-lg text-zinc-400">Select the charity you want to support with your monthly subscription. A minimum of 10% is required.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Charity Selection */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Search charities..."
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-2 custom-scrollbar">
            {filteredCharities.map(charity => (
              <div 
                key={charity.id}
                onClick={() => setSelectedCharity(charity.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCharity === charity.id 
                    ? "bg-emerald-500/10 border-emerald-500/50" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedCharity === charity.id ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-400"}`}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{charity.name}</h3>
                      <p className="text-sm text-zinc-400">{charity.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution Settings */}
        <div className="flex flex-col justify-between">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 h-full mb-6">
            <div className="flex items-center gap-3 text-emerald-400 font-medium pb-4 border-b border-white/10">
              <Heart size={20} className="fill-emerald-400/20" />
              <span>Contribution Settings</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white flex justify-between">
                <span>Monthly Contribution %</span>
                <span className="text-emerald-400 font-bold">{percentage}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-1">
                <span>10% (Required)</span>
                <span>100%</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mt-auto">
              <h4 className="text-sm text-zinc-300 font-medium mb-1">Impact Preview</h4>
              <p className="text-xs text-zinc-500">
                If you choose a $20/mo subscription, <span className="text-emerald-400 font-medium">${(20 * (percentage / 100)).toFixed(2)}</span> will go directly to your chosen charity every month! The rest funds the platform and mechanical draw prize pool.
              </p>
            </div>
          </div>

          <Link href="/onboarding/subscribe" className="w-full">
            <button 
              disabled={!selectedCharity}
              className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue to Subscription</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
