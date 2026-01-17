interface StatCardsProps {
  faturamento: string;
  qtdServicos: number;
}

export function StatCards({ faturamento, qtdServicos }: StatCardsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1 bg-zinc-900 p-6 rounded-xl border border-amber-500/20">
        <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Faturamento Total</h2>
        <p className="text-3xl font-black text-amber-500">R$ {faturamento}</p>
      </div>
      <div className="flex-1 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Serviços Realizados</h2>
        <p className="text-3xl font-black text-white">{qtdServicos}</p>
      </div>
    </div>
  );
}