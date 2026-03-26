"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Target, 
  HeartHandshake, 
  Trophy, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("Loading...");
  const [initials, setInitials] = useState("");
  const [status, setStatus] = useState("inactive");

  const NAV_ITEMS = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Scores", href: "/dashboard/scores", icon: Target },
    { label: "Charity", href: "/dashboard/charity", icon: HeartHandshake },
    { label: "Winnings", href: "/dashboard/winnings", icon: Trophy },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success') {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'active' })
          .eq('id', session.user.id);
        router.replace(pathname);
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, subscription_status')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        const display = data.full_name || data.email?.split('@')[0] || "Golfer";
        setName(display);
        setInitials(display.substring(0, 2).toUpperCase());
        setStatus(data.subscription_status || "inactive");
      }
    };
    fetchProfile();
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-20 px-6 font-outfit flex justify-center pb-20 relative overflow-hidden">
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[130px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4 animate-fade-in-up">
          <Link href="/" className="glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-lg border border-white/5 backdrop-blur-3xl group cursor-pointer hover:bg-white/5 transition-all">
             <Image src="/logo.png" alt="FairwayFund Logo" width={32} height={32} className="rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-300 border border-emerald-500/30 group-hover:border-emerald-400" />
             <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">Fairway<span className="text-emerald-400">Fund</span></span>
          </Link>
          
          <div className="glass-panel p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-lg border border-white/5 backdrop-blur-3xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-1 shadow-sm">
              {initials}
            </div>
            <div>
              <h2 className="text-lg text-white font-bold truncate tracking-tight">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {status === 'active' ? (
                  <>
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Active Member</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                    <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Restricted Access</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <nav className="glass-panel p-3 rounded-2xl flex flex-col gap-1 shadow-lg border border-white/5 backdrop-blur-3xl">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm group hover:scale-[1.02] ${
                    isActive 
                      ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent shadow-sm hover:shadow-md"
                  }`}
                >
                  <item.icon size={18} className={`transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${isActive ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "opacity-70 group-hover:opacity-100"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2 mx-3"></div>
            
            <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-medium text-left cursor-pointer border border-transparent text-sm group hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              <LogOut size={18} className="opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 relative z-10" />
              <span className="relative z-10">Sign Out Protocol</span>
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
