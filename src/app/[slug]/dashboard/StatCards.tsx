interface StatCardsProps {
  faturamento: string | number;
  qtdServicos: number;
  qtdCancelados: number;
  qtdNoShow: number;
}

export function StatCards({ faturamento, qtdServicos, qtdCancelados, qtdNoShow }: StatCardsProps) {
  const faturamentoFormatado = Number(faturamento).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* CARD 1: FATURAMENTO */}
      <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800">
        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
          Faturamento Total
        </span>
        <h2 className="text-amber-500 text-4xl font-black mt-2">
          {faturamentoFormatado}
        </h2>
      </div>

      {/* CARD 2: SERVIÇOS E RESUMO DISCRETO */}
      <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between">
        <div>
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
            Serviços Realizados
          </span>
          <h2 className="text-green-500 text-4xl font-black mt-2">
            {qtdServicos}
          </h2>
        </div>

        {/* METRICAS DE FALTAS E CANCELAMENTOS */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Faltas:</span>
            <span className="text-orange-500 font-bold text-sm">{qtdNoShow}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Cancelados:</span>
            <span className="text-red-500 font-bold text-sm">{qtdCancelados}</span>
          </div>
        </div>
      </div>
    </div>
  );
}