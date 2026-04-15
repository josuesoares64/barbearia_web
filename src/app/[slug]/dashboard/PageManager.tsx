"use client";
import { useState, useEffect } from "react";
import { AddressSearch } from "../../components/AddressSearch"; // componente que criamos

export function PageManager({ slug, token }: { slug: string; token: string }) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [formData, setFormData] = useState({
    hero_title: "",
    hero_subtitle: "",
    about_text: "",
    whatsapp_url: "",
    instagram_url: "",
    email_contato: "",
    // Localização
    endereco_texto: "",
    mapa_embed_url: "",
  });

  // Estado separado pra imagens — são enviadas via multipart, não JSON
  const [imagens, setImagens] = useState<{
    logo: File | null;
    banner: File | null;
    about: File | null;
  }>({ logo: null, banner: null, about: null });

  // Preview local das imagens antes de fazer upload
  const [previews, setPreviews] = useState<{
    logo: string;
    banner: string;
    about: string;
  }>({ logo: "", banner: "", about: "" });

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setFormData({
            hero_title: data.hero_title || "",
            hero_subtitle: data.hero_subtitle || "",
            about_text: data.about_text || "",
            whatsapp_url: data.whatsapp_url || "",
            instagram_url: data.instagram_url || "",
            email_contato: data.email_contato || "",
            endereco_texto: data.endereco_texto || "",
            mapa_embed_url: data.mapa_embed_url || "",
          });
          // Carrega as URLs já salvas como preview
          setPreviews({
            logo: data.logo_url || "",
            banner: data.banner_url || "",
            about: data.about_url || "",
          });
        }
      }
    } catch (err) {
      console.error("Erro ao carregar customização", err);
    }
  };

  // Salva textos + localização via JSON (PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        alert("Site atualizado com sucesso!");
      } else {
        const err = await res.json();
        alert(`Erro: ${err.message || "Erro ao salvar"}`);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Faz upload das imagens via multipart (PATCH)
  const handleUploadImagens = async () => {
    const temAlguma = imagens.logo || imagens.banner || imagens.about;
    if (!temAlguma) return alert("Selecione ao menos uma imagem.");

    setUploadingImages(true);
    try {
      const formDataImg = new FormData();
      if (imagens.logo) formDataImg.append("logo", imagens.logo);
      if (imagens.banner) formDataImg.append("banner", imagens.banner);
      if (imagens.about) formDataImg.append("about", imagens.about);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization/imagens`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          // Sem Content-Type aqui — o browser define automaticamente com o boundary do multipart
          body: formDataImg,
        }
      );

      if (res.ok) {
        alert("Imagens enviadas com sucesso!");
        setImagens({ logo: null, banner: null, about: null });
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error || "Erro ao enviar imagens"}`);
      }
    } catch {
      alert("Erro de conexão ao enviar imagens.");
    } finally {
      setUploadingImages(false);
    }
  };

  // Quando o usuário seleciona um arquivo, gera preview local
  const handleFileChange = (tipo: "logo" | "banner" | "about", file: File | null) => {
    if (!file) return;
    setImagens((prev) => ({ ...prev, [tipo]: file }));
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [tipo]: url }));
  };

  if (!isOwner) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 mt-4">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
        </div>
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Página de Vendas</h3>
          <p className="text-zinc-500 text-[10px]">Customize o site que seus clientes visualizam</p>
        </div>
      </div>

      {/* ── SEÇÃO DE IMAGENS ── */}
      <div className="mb-8 space-y-4">
        <h4 className="text-[9px] text-amber-500 uppercase font-black tracking-widest">
          Imagens do Site
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["logo", "banner", "about"] as const).map((tipo) => {
            const labels = {
              logo: "Logo da Barbearia",
              banner: "Foto de Capa (Hero)",
              about: 'Foto da Seção "Sobre"',
            };
            return (
              <div key={tipo} className="space-y-2">
                <label className="text-[9px] text-zinc-400 uppercase font-black">
                  {labels[tipo]}
                </label>

                {/* Preview */}
                {previews[tipo] ? (
                  <div className="relative w-full h-28 rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={previews[tipo]}
                      alt={labels[tipo]}
                      className="w-full h-full object-cover"
                    />
                    {/* Indica que é uma imagem nova ainda não enviada */}
                    {imagens[tipo] && (
                      <span className="absolute top-1 right-1 bg-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded">
                        NOVO
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 text-[10px]">
                    Sem imagem
                  </div>
                )}

                {/* Input de arquivo */}
                <label className="block w-full cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg px-3 py-2 text-[10px] text-zinc-300 text-center transition-colors">
                  {imagens[tipo] ? "Trocar arquivo" : "Selecionar imagem"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(tipo, e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleUploadImagens}
          disabled={uploadingImages || (!imagens.logo && !imagens.banner && !imagens.about)}
          className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-black py-3 rounded-lg uppercase transition-all"
        >
          {uploadingImages ? "Enviando imagens..." : "Enviar Imagens Selecionadas"}
        </button>
      </div>

      {/* ── FORMULÁRIO DE TEXTOS ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <h4 className="text-[9px] text-amber-500 uppercase font-black tracking-widest">
          Conteúdo do Site
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Título Principal (Hero)</label>
            <input type="text" value={formData.hero_title} onChange={e => setFormData({ ...formData, hero_title: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Subtítulo (Hero)</label>
            <input type="text" value={formData.hero_subtitle} onChange={e => setFormData({ ...formData, hero_subtitle: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] text-zinc-400 uppercase font-black">Sobre a Barbearia</label>
          <textarea rows={4} value={formData.about_text} onChange={e => setFormData({ ...formData, about_text: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg resize-none outline-none focus:border-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">WhatsApp (Apenas números)</label>
            <input type="text" value={formData.whatsapp_url} onChange={e => setFormData({ ...formData, whatsapp_url: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">E-mail de Contato</label>
            <input type="email" value={formData.email_contato} onChange={e => setFormData({ ...formData, email_contato: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] text-zinc-400 uppercase font-black">Link do Instagram</label>
            <input type="text" value={formData.instagram_url} onChange={e => setFormData({ ...formData, instagram_url: e.target.value })} className="w-full bg-black border border-zinc-800 p-3 text-xs text-white rounded-lg outline-none focus:border-amber-500" />
          </div>
          {/* Campo de localização com autocomplete */}
          <AddressSearch
            value={formData.endereco_texto}
            onChange={(endereco, embedUrl) =>
              setFormData({ ...formData, endereco_texto: endereco, mapa_embed_url: embedUrl })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black py-4 rounded-lg uppercase transition-all transform active:scale-[0.98]"
        >
          {loading ? "Processando..." : "Publicar Alterações no Site"}
        </button>
      </form>
    </div>
  );
}