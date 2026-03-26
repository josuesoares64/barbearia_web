"use client";
import { useState, useEffect } from "react";

export function PageManager({ slug, token }: { slug: string; token: string }) {
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    banner_url: "",
    logo_url: "",
    about_text: "",
    whatsapp_url: "",
    instagram_url: "",
    email_contato: "",
    google_maps_link: ""
  });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsOwner(payload.role?.toLowerCase() === "dono");
      } catch (e) {
        console.error("Erro ao validar permissão", e);
      }
    }
  }, [token]);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData({
            hero_title: data.hero_title || "",
            hero_subtitle: data.hero_subtitle || "",
            banner_url: data.banner_url || "",
            logo_url: data.logo_url || "",
            about_text: data.about_text || "",
            whatsapp_url: data.whatsapp_url || "",
            instagram_url: data.instagram_url || "",
            email_contato: data.email_contato || "",
            google_maps_link: data.google_maps_link || ""
          });
        }
      }
    } catch (err) {
      console.error("Erro ao carregar customização", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Site atualizado com sucesso!");
      } else {
        const errorData = await res.json();
        alert(`Erro: ${errorData.message || "Erro ao salvar"}`);
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Página de Vendas</h3>
          <p className="text-zinc-500 text-[10px]">Customize o site que seus clientes visualizam</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Título Principal (Hero)</label>
            <input type="text" value={formData.hero_title} onChange={e => setFormData({...formData, hero_title: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Subtítulo (Hero)</label>
            <input type="text" value={formData.hero_subtitle} onChange={e => setFormData({...formData, hero_subtitle: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-zinc-400 uppercase font-black">Sobre a Barbearia</label>
          <textarea rows={4} value={formData.about_text} onChange={e => setFormData({...formData, about_text: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg resize-none outline-none focus:border-amber-500" />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Link da Foto de Capa (URL)</label>
            <input type="text" value={formData.banner_url} onChange={e => setFormData({...formData, banner_url: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Link da Logo (URL)</label>
            <input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" placeholder="https://imgur.com/logo.png" />
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">WhatsApp (Apenas números)</label>
            <input type="text" value={formData.whatsapp_url} onChange={e => setFormData({...formData, whatsapp_url: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">E-mail de Contato</label>
            <input type="email" value={formData.email_contato} onChange={e => setFormData({...formData, email_contato: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Link do Instagram</label>
            <input type="text" value={formData.instagram_url} onChange={e => setFormData({...formData, instagram_url: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Link Google Maps</label>
            <input type="text" value={formData.google_maps_link} onChange={e => setFormData({...formData, google_maps_link: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black py-4 rounded-lg uppercase transition-all transform active:scale-[0.98]">
          {loading ? "Processando..." : "Publicar Alterações no Site"}
        </button>
      </form>
    </div>
  );
}