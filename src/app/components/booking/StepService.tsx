"use client";
import React, { useState, useEffect } from "react";

interface StepServiceProps {
  booking: any;
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
  slug: string;
}

export default function StepService({ booking, setBooking, onNext, onBack, slug }: StepServiceProps) {
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA PRESERVADA (SEM ALTERAÇÕES) ---
  useEffect(() => {
    if (!booking.barber_id || !slug) return;

    const fetchProfessionalServices = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/barbers/${booking.barber_id}/services`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          const professionalServices = data.map((item: any) => item.service).filter(Boolean);
          setFilteredServices(professionalServices);
        }
      } catch (error) {
        console.error("Erro fetch serviços:", error);
      } finally { setLoading(false); }
    };

    fetchProfessionalServices();
  }, [booking.barber_id, slug]);
  // --- FIM DA LÓGICA PRESERVADA ---

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic">
          Service Menu
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          O que vamos <span className="text-amber-500">Fazer?</span>
        </h2>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-[1px] bg-zinc-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          </div>
          <p className="text-[9px] uppercase tracking-[0.5em] text-zinc-600 font-bold italic">Consultando Serviços</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredServices.map((s) => {
            const isSelected = booking.service_id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setBooking((prev: any) => ({ ...prev, service_id: s.id, service_name: s.name }));
                }}
                className={`group relative p-6 text-left transition-all duration-500 border overflow-hidden
                  ${isSelected 
                    ? "border-amber-500 bg-zinc-900/40 shadow-[0_0_25px_rgba(245,158,11,0.05)]" 
                    : "border-zinc-900 bg-zinc-950 hover:border-zinc-700"
                  }`}
              >
                {/* Indicador lateral de seleção */}
                <div className={`absolute left-0 top-0 h-full w-1 bg-amber-500 transition-transform duration-500 ${isSelected ? "scale-y-100" : "scale-y-0"}`} />

                <div className="flex justify-between items-center relative z-10">
                  <div className="flex flex-col">
                    <span className={`text-lg font-black uppercase italic tracking-widest transition-colors ${isSelected ? "text-amber-500" : "text-zinc-100 group-hover:text-white"}`}>
                      {s.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 mt-1">
                      Tempo estimado: {s.duration_minutes || '30'} min
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-mono font-bold ${isSelected ? "text-white" : "text-zinc-400"}`}>
                      R$ {s.price}
                    </span>
                  </div>
                </div>

                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/[0.02] to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-4 pt-10">
        <button 
          disabled={!booking.service_id} 
          onClick={onNext} 
          className={`w-full py-5 font-black uppercase italic tracking-[0.3em] transition-all relative overflow-hidden group
            ${booking.service_id 
              ? "bg-amber-500 text-black hover:bg-white active:scale-[0.98]" 
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
            }`}
        >
          <span className="relative z-10">{booking.service_id ? "Confirmar Serviço" : "Selecione uma opção"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-400 transition-colors italic border-t border-zinc-900/50 mt-2"
        >
          ← Alterar Profissional
        </button>
      </div>
    </div>
  );
}