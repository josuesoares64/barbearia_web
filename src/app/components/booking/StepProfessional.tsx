"use client";
import React from "react";

export default function StepProfessional({ 
  professionals, 
  booking, 
  setBooking, 
  onNext, 
  onBack,
  slug 
}: any) {
  
  const handleSelectProfessional = (p: any) => {
    setBooking((prev: any) => ({
      ...prev,
      barber_id: p.id,
      barber_name: p.username || p.name,
      service_id: null, 
      service_name: ""
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic">
          The Specialists
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Escolha o <span className="text-amber-500">Mestre</span>
        </h2>
      </div>
      
      <div className="grid gap-4">
        {professionals.map((p: any) => {
          const isSelected = booking.barber_id === p.id;
          const displayName = p.username || p.name;
          
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectProfessional(p)}
              className={`relative p-6 text-left transition-all duration-500 group overflow-hidden border
                ${isSelected 
                  ? "border-amber-500 bg-zinc-900/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                  : "border-zinc-900 bg-zinc-950 hover:border-zinc-700"
                }`}
            >
              {/* Indicador de Seleção lateral */}
              <div className={`absolute left-0 top-0 h-full w-1 bg-amber-500 transition-transform duration-500 ${isSelected ? "scale-y-100" : "scale-y-0"}`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col">
                  <p className={`font-black uppercase italic tracking-widest text-lg transition-colors ${isSelected ? "text-amber-500" : "text-zinc-100 group-hover:text-white"}`}>
                    {displayName}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 mt-1">
                    {p.role === 'dono' ? '👑 Master Barber / Owner' : '✂️ Elite Professional'}
                  </p>
                </div>

                {/* Badge de Status */}
                <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-amber-500 animate-pulse" : "bg-zinc-800"}`} />
              </div>

              {/* Efeito de brilho interno no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/[0.03] to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col gap-4 pt-8">
        <button 
          onClick={onNext} 
          disabled={!booking.barber_id}
          className={`w-full py-5 font-black uppercase italic tracking-[0.3em] transition-all relative overflow-hidden group
            ${booking.barber_id 
              ? "bg-amber-500 text-black hover:bg-white" 
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
            }`}
        >
          <span className="relative z-10">{booking.barber_id ? "Continuar Reserva" : "Selecione um Profissional"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-400 transition-colors italic border-t border-zinc-900/50 mt-2"
        >
          ← Voltar para Data
        </button>
      </div>
    </div>
  );
}