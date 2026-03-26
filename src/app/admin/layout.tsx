"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Dna, 
  ShieldCheck, 
  HeartHandshake,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Platform Overview", href: "/admin", icon: BarChart3 },
    { label: "Draw Engine", href: "/admin/draw", icon: Dna },
    { label: "Winner Actions", href: "/admin/verify", icon: ShieldCheck },
    { label: "Subscribers", href: "/admin/users", icon: Users },
    { label: "Charities", href: "/admin/charities", icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen pt-20 px-6 font-outfit flex justify-center pb-20">
      
      {/* Admin specific background gradient */}
      <div className="fixed top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.05),_transparent_60%)] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
        
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 animate-fade-in-up">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden border-rose-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl mb-2">
              A
            </div>
            <div>
              <h2 className="text-white font-semibold flex items-center gap-2">
                Ops Center <ShieldCheck size={16} className="text-rose-400" />
              </h2>
              <div className="text-xs text-zinc-400 mt-1">Super Admin Access</div>
            </div>
          </div>

          <nav className="glass-panel p-3 rounded-2xl flex flex-col gap-1 border-rose-500/10">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-rose-500/15 text-rose-400 font-medium" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="h-px bg-white/10 my-2 mx-2"></div>
            
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium text-left">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
