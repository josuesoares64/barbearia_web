"use client";
import React from "react";

const StepSummary = ({ booking, onBack, onConfirm }: any) => {
  // Função para formatar a data visualmente
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col text-center">
        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic">
          Final Review
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Resumo do <span className="text-amber-500">Agendamento</span>
        </h2>
      </div>

      {/* CARD DE RESUMO ESTILO RECIBO PREMIUM */}
      <div className="bg-zinc-950 border border-zinc-900 relative overflow-hidden">
        {/* Detalhe estético lateral */}
        <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
        
        <div className="p-6 space-y-5">
          {/* SEÇÃO: QUEM E ONDE */}
          <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-5">
            <div>
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-1 italic">Profissional</p>
              <p className="text-sm font-bold text-zinc-100 uppercase italic tracking-wider">
                {booking.barber_name || "Não selecionado"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-1 italic">Serviço</p>
              <p className="text-sm font-bold text-amber-500 uppercase italic tracking-wider">
                {booking.service_name || "Não selecionado"}
              </p>
            </div>
          </div>

          {/* SEÇÃO: QUANDO */}
          <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-5">
            <div>
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-1 italic">Data</p>
              <p className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
                {formatDate(booking.date)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-1 italic">Horário</p>
              <p className="text-sm font-mono font-bold text-amber-500">
                {booking.time}
              </p>
            </div>
          </div>

          {/* SEÇÃO: CLIENTE */}
          <div className="pt-2">
            <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest mb-1 italic">Cliente & Contato</p>
            <p className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
              {`${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Não informado"}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              {booking.phone}
            </p>
          </div>
        </div>

        {/* Efeito de marca d'água decorativa */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none transform rotate-12">
          <span className="text-6xl font-black italic uppercase">Barber</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <button
          onClick={onConfirm}
          className="w-full py-5 font-black uppercase italic tracking-[0.3em] bg-amber-500 text-black hover:bg-white active:scale-[0.98] transition-all relative overflow-hidden group shadow-lg shadow-amber-500/10"
        >
          <span className="relative z-10">Confirmar Agendamento</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-400 transition-colors italic border-t border-zinc-900/50 mt-2"
        >
          ← Alterar Meus Dados
        </button>
      </div>

      <p className="text-center text-[8px] uppercase font-bold text-zinc-800 tracking-[0.3em]">
        Confirme os detalhes acima antes de finalizar sua reserva.
      </p>
    </div>
  );
};

export default StepSummary;