"use client";

import React from "react";

export function OccupancyMetrics({ data }: { data: any }) {
  // Garantimos que o componente não quebre se o data vier nulo
  const displayData = data || { geral: 0, porBarbeiro: [] };

  // Função simples para mudar a cor baseada na performance
  const getStatusColor = (percent: number) => {
    if (percent === 0) return "bg-zinc-700";
    if (percent < 30) return "bg-rose-500"; // Baixa ocupação
    if (percent < 70) return "bg-amber-500"; // Média
    return "bg-emerald-500"; // Alta/Ideal
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* CARD PRINCIPAL - GERAL */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-[10px] uppercase font-black tracking-tighter">
              Performance da Unidade
            </span>
            <h2 className="text-xl font-bold text-zinc-100">Ocupação Geral</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-mono font-black text-amber-500 leading-none">
              {displayData.geral}%
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">Capacidade Total</span>
          </div>
        </div>
        
        <div className="w-full bg-zinc-800/50 h-4 rounded-full overflow-hidden p-1 border border-zinc-700/50">
          <div 
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
            style={{ width: `${displayData.geral}%` }}
          />
        </div>
      </div>

      {/* GRID DE BARBEIROS */}
      {displayData.porBarbeiro && displayData.porBarbeiro.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayData.porBarbeiro.map((barbeiro: any) => (
            <div 
              key={barbeiro.nome} 
              className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/50 flex flex-col gap-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-100 font-bold truncate max-w-[120px]">
                    {barbeiro.nome}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                    {barbeiro.qtdAgendamentos} agendamentos
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {barbeiro.percentual}%
                </span>
              </div>

              {/* Barra individual com cor dinâmica */}
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${getStatusColor(barbeiro.percentual)}`} 
                  style={{ width: `${barbeiro.percentual}%` }} 
                />
              </div>

              <div className="flex justify-between text-[9px] text-zinc-600 font-medium uppercase">
                <span>Trabalhado: {barbeiro.minutosTrabalhados} min</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}