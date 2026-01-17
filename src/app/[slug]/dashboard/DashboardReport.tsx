"use client";
import { useState, useEffect, useCallback } from "react";
import { AppointmentTable } from "./AppointmentTable";
import { StatCards } from "./StatCards";

export function DashboardReport({ slug, token }: { slug: string; token: string }) {
  const [reportData, setReportData] = useState<any>(null);
  const [agendamentosBrutos, setAgendamentosBrutos] = useState([]);
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dataInicio, setDataInicio] = useState("2026-01-01");
  const [dataFim, setDataFim] = useState("2026-01-31");
  const [barbeiroId, setBarbeiroId] = useState("todos");

  const fetchData = useCallback(async () => {
    if (!slug || slug === "undefined") return;
    try {
      setLoading(true);

      const [resFat, resAg, resB, resS, resC] = await Promise.all([
        fetch(`http://localhost:3000/barbershops/${slug}/appointment/dashboard/faturamento?inicio=${dataInicio}&fim=${dataFim}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/barbershops/${slug}/appointment?inicio=${dataInicio}&fim=${dataFim}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/barbershops/${slug}/barbers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/barbershops/${slug}/services`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:3000/barbershops/${slug}/clients`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setReportData(await resFat.json());
      setAgendamentosBrutos(await resAg.json());
      setBarbeiros(await resB.json());
      setServicos(await resS.json());
      setClientes(await resC.json());

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, token, dataInicio, dataFim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFinalizar = async (id: string) => {
    try {
      // Usando PUT e a estrutura exata: /barbershops/:slug/appointment/:id
      const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/${id}`, {
        method: 'PUT', // Alterado de PATCH para PUT conforme seu teste no Postman
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (res.ok) {
        // Atualiza a lista: o agendamento sumirá da tela (pelo filtro de status)
        // e o faturamento nos cards vai atualizar
        fetchData(); 
      } else {
        const errorData = await res.json();
        console.error("Erro da API:", errorData);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Deseja excluir este agendamento?")) return;
    try {
      await fetch(`http://localhost:3000/barbershops/${slug}/appointment/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const agendamentosFormatados = (Array.isArray(agendamentosBrutos) ? agendamentosBrutos : [])
    .filter((ag: any) => {
      const isScheduled = ag.status === "scheduled";
      const matchesBarber = barbeiroId === "todos" || ag.barber_id === barbeiroId;
      return isScheduled && matchesBarber;
    })
   .map((ag: any) => {
  const servicoObj = servicos.find(s => s.id === ag.service_id);
  const barbeiroObj = barbeiros.find(b => b.id === ag.barber_id);
  const clienteObj = clientes.find(c => c.id === ag.client_id);
  
  // Monta o nome completo com segurança
  const nomeCompleto = clienteObj 
    ? `${clienteObj.first_name} ${clienteObj.last_name || ""}`.trim() 
    : "Cliente Particular";

  return {
    ...ag,
    data: ag.appointment_date,
    horario: ag.appointment_time,
    servico: servicoObj?.name || "Serviço",
    valor: servicoObj?.price || "0,00",
    barbeiro: barbeiroObj?.username || "Profissional",
    cliente: nomeCompleto
  };
});

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Início</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="bg-black border border-zinc-800 rounded p-2 text-white text-sm outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Fim</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="bg-black border border-zinc-800 rounded p-2 text-white text-sm outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Barbeiro</label>
            <select value={barbeiroId} onChange={(e) => setBarbeiroId(e.target.value)} className="bg-black border border-zinc-800 rounded p-2 text-white text-sm outline-none">
              <option value="todos">Todos os Profissionais</option>
              {barbeiros.map((b: any) => <option key={b.id} value={b.id}>{b.username}</option>)}
            </select>
          </div>
        </div>
        <button onClick={fetchData} className="bg-amber-500 text-black px-8 py-3 rounded font-bold uppercase hover:bg-amber-600 transition-all">
          Aplicar Filtros
        </button>
      </div>

      <StatCards 
        faturamento={reportData?.faturamento_total || "0.00"} 
        qtdServicos={reportData?.quantidade_servicos || 0} 
      />

      <section>
        <h3 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest">
          Próximos Atendimentos ({agendamentosFormatados.length})
        </h3>
        
        {loading ? (
          <p className="text-zinc-600 animate-pulse text-xs italic uppercase">Sincronizando...</p>
        ) : (
          <AppointmentTable 
            agendamentos={agendamentosFormatados} 
            onFinalizar={handleFinalizar} 
            onExcluir={handleExcluir} 
          />
        )}
      </section>
    </div>
  );
}