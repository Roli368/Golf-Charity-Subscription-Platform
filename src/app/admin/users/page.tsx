"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ProfileRow = {
  id: string;
  email: string;
  role: string;
  subscription_status: string;
  created_at: string;
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscriber Management</h1>
          <p className="text-zinc-400">View and manage all registered users, their subscription status, and scores.</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(225,29,72,0.2)] cursor-pointer">
          Export Members List
        </button>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
              placeholder="Search by email..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-zinc-500 font-medium tracking-wider">
                <th className="pb-3 px-4">Member Email</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Role</th>
                <th className="pb-3 px-4">Joined</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="text-center text-zinc-500 py-8">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-zinc-500 py-8">No members found.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.subscription_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {user.subscription_status || 'inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-300 capitalize">{user.role}</td>
                  <td className="py-4 px-4 text-zinc-400">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors ml-1 cursor-pointer">
                      <ShieldAlert size={16} />
                    </button>
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
