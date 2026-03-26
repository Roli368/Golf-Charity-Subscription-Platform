"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type CharityRow = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  allocation?: string; 
};

export default function CharityManagementAdmin() {
  const [charities, setCharities] = useState<CharityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    setLoading(true);
    const { data } = await supabase.from('charities').select('*').order('name');
    if (data) setCharities(data);
    setLoading(false);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (charity: CharityRow) => {
    setIsEditing(true);
    setCurrentId(charity.id);
    setFormData({ name: charity.name, description: charity.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`WARNING: Are you sure you want to permanently delete "${name}"? Subscribers attached to this charity may be reset.`)) {
      const { error } = await supabase.from('charities').delete().eq('id', id);
      if (error) alert("Error deleting charity: " + error.message);
      else fetchCharities();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (isEditing) {
      const { error } = await supabase.from('charities').update({
        name: formData.name,
        description: formData.description
      }).eq('id', currentId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('charities').insert({
        name: formData.name,
        description: formData.description
      });
      if (error) alert(error.message);
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchCharities();
  };

  const filteredCharities = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up relative">
      
      {/* Configuration Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Charity Directory</h1>
          <p className="text-zinc-400">Manage the publicly listed organizations that subscribers can direct their deployment percentages towards.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)] shrink-0 cursor-pointer"
        >
          <Plus size={18} /> Add New Organization
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
              placeholder="Search directory..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
             <div className="col-span-full py-12 text-center text-zinc-500 flex flex-col items-center">
               <div className="w-8 h-8 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin mb-4"></div>
               Loading Database...
             </div>
          ) : filteredCharities.length === 0 ? (
             <div className="col-span-full py-12 text-center text-zinc-500">No organizations found. Click "Add New Organization" to build your roster.</div>
          ) : filteredCharities.map((charity) => (
            <div key={charity.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between group hover:bg-white/10 transition-colors shadow-lg">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center text-xl shadow-[0_0_10px_rgba(225,29,72,0.1)]">
                    🌍
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(charity)}
                      className="p-2 bg-white/5 text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(charity.id, charity.name)}
                      className="p-2 bg-white/5 text-zinc-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{charity.name}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-3 leading-relaxed">{charity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up CMS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-6">
              {isEditing ? `Edit ${formData.name}` : "Register New Charity"}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Organization Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  placeholder="e.g. Trees for the Future"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Description / Mission</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  placeholder="Explain their global impact so subscribers know who they are supporting..."
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] disabled:opacity-70 cursor-pointer"
                >
                  <Save size={18} />
                  {saving ? "Deploying..." : (isEditing ? "Save Configuration" : "Deploy Charity")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
