"use client";

interface Appointment {
  id: string;
  data: string;
  horario: string;
  servico: string;
  valor: string;
  cliente: string;
  phone?: string; // Adicionado para suportar o número
  barbeiro: string;
}

interface TableProps {
  agendamentos: Appointment[];
  onFinalizar: (id: string) => void;
  onExcluir: (id: string) => void;
}

export function AppointmentTable({ agendamentos, onFinalizar, onExcluir }: TableProps) {
  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-zinc-800/50 text-zinc-500 text-[10px] uppercase font-bold">
            <tr>
              <th className="p-4">Data / Horário</th>
              <th className="p-4">Serviço</th>
              <th className="p-4">Cliente / Profissional</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {agendamentos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-zinc-600 text-xs italic uppercase">
                  Nenhum agendamento pendente encontrado para este período.
                </td>
              </tr>
            ) : (
              agendamentos.map((ag) => (
                <tr key={ag.id} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-xs">{ag.data}</span>
                      <span className="font-mono text-amber-500 font-bold text-sm">
                        {ag.horario.substring(0, 5)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-zinc-200 font-semibold">{ag.servico}</span>
                      <span className="text-[10px] text-amber-500/80">R$ {ag.valor}</span>
                    </div>
                  </td>
                  <td className="p-4">
  <div className="flex flex-col">
    <span className="text-sm text-zinc-300 font-medium">
      Cliente: {ag.cliente}
    </span>
    
    {/* Exibição do Telefone */}
    {ag.phone && (
      <span className="text-[11px] text-amber-500/90 font-mono mt-0.5">
        Telefone:{ag.phone}
      </span>
    )}

    <span className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1">
      Profissional: {ag.barbeiro}
    </span>
  </div>
</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => onFinalizar(ag.id)}
                        className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black px-3 py-1.5 rounded hover:bg-green-500 hover:text-white transition-all uppercase"
                      >
                        Finalizar
                      </button>
                      <button
                        onClick={() => onExcluir(ag.id)}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-all uppercase"
                      >
                        Faltou
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}