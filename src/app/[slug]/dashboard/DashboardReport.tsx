"use client";
import { useState, useEffect, useCallback } from "react";
import { AppointmentTable } from "./AppointmentTable";
import { StatCards } from "./StatCards";
import { jwtDecode } from "jwt-decode";

export function DashboardReport({ slug, token }: { slug: string; token: string }) {
  const [reportData, setReportData] = useState<any>(null);
  const [agendamentosBrutos, setAgendamentosBrutos] = useState([]);
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<{ role: string; id: string } | null>(null);
  const hoje = new Date().toLocaleDateString('en-CA'); 
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [barbeiroId, setBarbeiroId] = useState("todos");

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const roleNormalizado = decoded.role?.toLowerCase();
        setUser({ role: roleNormalizado, id: decoded.id });
        if (roleNormalizado !== "dono") {
          setBarbeiroId(decoded.id);
        }
      } catch (e) {
        console.error("Erro ao decodificar token");
      }
    }
  }, [token]);

  const isDono = user?.role === "dono";

  useEffect(() => {
    async function loadBasics() {
      if (!slug || slug === "undefined") return;
      try {
        const [resB, resS, resC] = await Promise.all([
          fetch(`http://localhost:3000/barbershops/${slug}/barbers`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:3000/barbershops/${slug}/services`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:3000/barbershops/${slug}/clients`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setBarbeiros(await resB.json());
        setServicos(await resS.json());
        setClientes(await resC.json());
      } catch (err) {
        console.error("Erro ao carregar dados básicos:", err);
      }
    }
    loadBasics();
  }, [slug, token]);

  const fetchData = useCallback(async () => {
    if (!slug || slug === "undefined" || !user) return;
    try {
      setLoading(true);
      let barbeiroQuery = "";
      const idParaUrl = isDono ? barbeiroId : user.id;

      if (idParaUrl !== "todos") {
        const selecionado = barbeiros.find(b => b.id === idParaUrl);
        if (selecionado) {
          const usernameUrl = selecionado.username.replace(/\s+/g, '-');
          barbeiroQuery = `&barbeiro=${usernameUrl}`;
        }
      }

      const [resFat, resAg] = await Promise.all([
        fetch(`http://localhost:3000/barbershops/${slug}/appointment/dashboard/faturamento?inicio=${dataInicio}&fim=${dataFim}${barbeiroQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:3000/barbershops/${slug}/appointment?inicio=${dataInicio}&fim=${dataFim}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setReportData(await resFat.json());
      setAgendamentosBrutos(await resAg.json());
    } catch (err) {
      console.error("Erro ao carregar relatório:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, token, dataInicio, dataFim, barbeiroId, barbeiros, isDono, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFinalizar = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });
      if (res.ok) fetchData(); 
    } catch (err) { console.error(err); }
  };

  const handleNoShow = async (id: string) => {
    if (!confirm("Confirmar que o cliente não compareceu?")) return;
    try {
      const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'no_show' })
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  const agendamentosFormatados = (Array.isArray(agendamentosBrutos) ? agendamentosBrutos : [])
  .filter((ag: any) => {
    const idParaFiltro = isDono ? barbeiroId : user?.id;

    // filtro por barbeiro continua existindo
    const matchesBarber =
      idParaFiltro === "todos" ||
      ag.barbeiro === barbeiros.find(b => b.id === idParaFiltro)?.username;

    // filtro de data usando os campos reais da rota
    const matchesDate =
      ag.data >= dataInicio && ag.data <= dataFim;

    return matchesBarber && matchesDate;
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
            <select 
              value={isDono ? barbeiroId : user?.id} 
              onChange={(e) => setBarbeiroId(e.target.value)} 
              disabled={!isDono}
              className={`bg-black border border-zinc-800 rounded p-2 text-white text-sm outline-none ${!isDono && 'opacity-50 cursor-not-allowed'}`}
            >
              {isDono && <option value="todos">Todos os Profissionais</option>}
              {barbeiros.map((b: any) => <option key={b.id} value={b.id}>{b.username}</option>)}
            </select>
          </div>
        </div>
        <button onClick={fetchData} className="bg-amber-500 text-black px-8 py-3 rounded font-bold uppercase hover:bg-amber-600 transition-all">
          Aplicar Filtros
        </button>
      </div>

      {isDono && (
        <StatCards 
          faturamento={reportData?.faturamento_total || "0.00"} 
          qtdServicos={reportData?.resumo?.concluidos || 0}
          qtdCancelados={reportData?.resumo?.cancelados || 0}
          qtdNoShow={reportData?.resumo?.faltas || 0}
        />
      )}

      <section>
        <h3 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest">
          {isDono ? "Agenda da Unidade" : "Minha Agenda"} ({agendamentosFormatados.length})
        </h3>
        
        {loading ? (
          <p className="text-zinc-600 animate-pulse text-xs italic uppercase">Sincronizando...</p>
        ) : (
          <AppointmentTable 
            agendamentos={agendamentosFormatados} 
            onFinalizar={handleFinalizar} 
            onExcluir={handleNoShow} 
          />
        )}
      </section>
    </div>
  );
}