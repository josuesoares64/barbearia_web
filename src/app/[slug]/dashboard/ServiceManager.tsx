"use client";
import { useState } from "react";

export function ServiceManager({ slug, token }: { slug: string; token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Aqui você adicionaria a lógica de POST para a rota que você mandou
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Lógica de fetch POST aqui...
    setLoading(false);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Meus Serviços</h3>
          <p className="text-zinc-500 text-[10px]">Vincule os serviços que você realiza.</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black px-3 py-2 rounded uppercase transition-all"
        >
          {isOpen ? "Fechar" : "Gerenciar"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">ID do Serviço</label>
              <input 
                type="text" 
                placeholder="Ex: 27ea1da6..." 
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-100 hover:bg-white text-black text-[10px] font-black py-2.5 rounded uppercase transition-all disabled:opacity-50"
              >
                {loading ? "Adicionando..." : "Vincular Serviço"}
              </button>
            </div>
          </form>
          
          {/* Aqui você pode listar os serviços já vinculados que vieram no seu JSON */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-zinc-800 text-zinc-400 text-[9px] px-2 py-1 rounded border border-zinc-700 flex items-center gap-2">
              CORTE DE CABELO
              <button className="text-red-500 hover:text-red-400">×</button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}