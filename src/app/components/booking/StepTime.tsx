"use client";

import React from "react";

type StepTimeProps = {
  times: string[]; // Horários que vieram da API (AvailabilityController)
  booking: any;
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
};

const StepTime = ({
  times,
  booking,
  setBooking,
  onNext,
  onBack,
}: StepTimeProps) => {
  
  function handleSelectTime(time: string) {
    setBooking((prev: any) => ({
      ...prev,
      time: time,
    }));
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic">
          Available Slots
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Horários <span className="text-amber-500">Disponíveis</span>
        </h2>
      </div>
      
      {/* Grid de Horários */}
      {times.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {times.map((time) => {
            const isSelected = booking.time === time;
            return (
              <button
                key={time}
                onClick={() => handleSelectTime(time)}
                className={`py-4 border font-mono text-sm font-bold transition-all duration-300 rounded-none
                  ${isSelected
                    ? "border-amber-500 bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02] z-10"
                    : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white"
                  }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      ) : (
        /* Estado Vazio */
        <div className="py-12 text-center border border-dashed border-zinc-900 bg-zinc-950/50">
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-900/60 italic px-4">
            Nenhum horário disponível para este profissional nesta data.
          </p>
        </div>
      )}

      {/* Navegação Inferior */}
      <div className="flex flex-col gap-4 pt-6">
        <button
          disabled={!booking.time}
          onClick={onNext}
          className={`w-full py-5 font-black uppercase italic tracking-[0.3em] transition-all relative overflow-hidden group
            ${booking.time 
              ? "bg-amber-500 text-black hover:bg-white active:scale-[0.98] shadow-lg shadow-amber-500/10" 
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50"
            }`}
        >
          <span className="relative z-10">
            {booking.time ? "Revisar Agendamento →" : "Selecione o Horário"}
          </span>
          {/* Efeito de brilho no botão */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-400 transition-colors italic border-t border-zinc-900/50 mt-2"
        >
          ← Voltar para Serviços
        </button>
      </div>
    </div>
  );
};

export default StepTime;