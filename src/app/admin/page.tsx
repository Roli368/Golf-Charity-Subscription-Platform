import { Users, DollarSign, Dna, TrendingUp } from "lucide-react";

export default function AdminOverview() {
  const STATS = [
    { label: "Active Subscribers", value: "2,405", icon: Users, trend: "+12%" },
    { label: "Total Prize Pool", value: "$48,150", icon: DollarSign, trend: "+8%" },
    { label: "Charity Raised (Lifetime)", value: "$124,500", icon: TrendingUp, trend: "+15%" },
    { label: "Next Draw Date", value: "Nov 1st", icon: Dna, trend: "In 14 days" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-white/5 group-hover:scale-110 transition-transform duration-500">
              <stat.icon size={64} />
            </div>
            
            <p className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mb-4">{stat.value}</h3>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg">
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Growth</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
             <span className="text-zinc-500 text-sm">Chart Placeholder</span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl h-80 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Charity Distribution</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
             <span className="text-zinc-500 text-sm">Donut Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
