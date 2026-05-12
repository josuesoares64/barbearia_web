"use client";
import { useState, useEffect, useCallback } from "react";
import { AppointmentTable } from "./AppointmentTable";
import { StatCards } from "./StatCards";
import { OccupancyMetrics } from "./OccupancyBars";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { PlanGate } from "@/app/components/PlanGate";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardReport({ slug }: { slug: string }) {
  const { user } = useAuth();

  const [reportData, setReportData] = useState<any>(null);
  const [occupancyData, setOccupancyData] = useState<any>(null);
  const [agendamentosBrutos, setAgendamentosBrutos] = useState<any[]>([]);
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hoje = new Date().toLocaleDateString("en-CA");
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [barbeiroId, setBarbeiroId] = useState("todos");

  const isDono = user?.role === "dono";
  const planoAtual = (user?.plan || "trial") as "trial" | "starter" | "pro" | "premium";
  const temPlanoMetricas = ["pro", "premium"].includes(planoAtual);

  // Quando é barbeiro, filtra pelo próprio id
  useEffect(() => {
    if (user && user.role !== "dono") {
      setBarbeiroId(user.id);
    }
  }, [user]);

  // Carrega a lista de barbeiros
  useEffect(() => {
    async function loadBarbers() {
      if (!slug || slug === "undefined") return;
      try {
        const resB = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers`
        );
        if (!resB.ok) return;
        const data = await resB.json();
        setBarbeiros(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
    loadBarbers();
  }, [slug]);

  // Carrega dados do dashboard
  const fetchData = useCallback(async () => {
    if (!slug || slug === "undefined" || !user) return;
    try {
      setLoading(true);
      let barbeiroQuery = "";
      const idParaUrl = isDono ? barbeiroId : user.id;

      if (idParaUrl !== "todos") {
        const selecionado = barbeiros.find((b) => b.id === idParaUrl);
        if (selecionado) {
          barbeiroQuery = `&barbeiro=${selecionado.username.replace(/\s+/g, "-")}`;
        }
      }

      // Agendamentos — liberado para todos
      const resAg = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment?inicio=${dataInicio}&fim=${dataFim}`
      );
      if (resAg.ok) {
        const data = await resAg.json();
        setAgendamentosBrutos(Array.isArray(data) ? data : []);
      } else {
        setAgendamentosBrutos([]);
      }

      // Métricas e ocupação — só busca se tiver plano pro ou superior
      if (isDono && temPlanoMetricas) {
        const [resFat, resOcup] = await Promise.all([
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment/dashboard/faturamento?inicio=${dataInicio}&fim=${dataFim}${barbeiroQuery}`
          ),
          fetchWithAuth(
            `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment/dashboard/ocupacao?inicio=${dataInicio}&fim=${dataFim}`
          ),
        ]);

        if (resFat.ok) setReportData(await resFat.json());
        else setReportData(null);

        if (resOcup.ok) setOccupancyData(await resOcup.json());
        else setOccupancyData(null);
      }
    } catch (err) {
      console.error("Erro ao carregar relatório:", err);
    } finally {
      setLoading(false);
    }
  }, [slug, dataInicio, dataFim, barbeiroId, barbeiros, isDono, user, temPlanoMetricas]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Finalizar agendamento
  const handleFinalizar = async (id: string) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status: "completed" }) }
      );
      if (res.ok) {
        setAgendamentosBrutos((prev) =>
          prev.map((ag) => ag.id === id ? { ...ag, status: "completed" } : ag)
        );
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // No-show
  const handleNoShow = async (id: string) => {
    if (!confirm("Confirmar que o cliente não compareceu?")) return;
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment/${id}/status`,
        { method: "PATCH", body: JSON.stringify({ status: "no_show" }) }
      );
      if (res.ok) {
        setAgendamentosBrutos((prev) =>
          prev.map((ag) => ag.id === id ? { ...ag, status: "no_show" } : ag)
        );
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtra agendamentos para exibição
  const agendamentosFormatados = (
    Array.isArray(agendamentosBrutos) ? agendamentosBrutos : []
  ).filter((ag: any) => {
    const idParaFiltro = isDono ? barbeiroId : user?.id;
    const matchesBarber =
      idParaFiltro === "todos" ||
      ag.barbeiro === barbeiros.find((b) => b.id === idParaFiltro)?.username;
    const matchesDate = ag.data >= dataInicio && ag.data <= dataFim;
    const status = ag.status?.toLowerCase();
    const isPending = status === "scheduled" || status === "pending" || !status;
    return matchesBarber && matchesDate && isPending;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* FILTROS */}
      <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex flex-col gap-1.5 text-white">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="bg-black border border-zinc-800 rounded p-2 outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-white">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="bg-black border border-zinc-800 rounded p-2 outline-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-white">
            <label className="text-zinc-500 text-[10px] uppercase font-bold">Barbeiro</label>
            <select
              value={isDono ? barbeiroId : user?.id}
              onChange={(e) => setBarbeiroId(e.target.value)}
              disabled={!isDono}
              className="bg-black border border-zinc-800 rounded p-2 text-sm outline-none disabled:opacity-50"
            >
              {isDono && <option value="todos">Todos os Profissionais</option>}
              {barbeiros.map((b: any) => (
                <option key={b.id} value={b.id}>{b.username}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="bg-amber-500 text-black px-8 py-3 rounded font-bold uppercase hover:bg-amber-600 transition-all"
        >
          Aplicar Filtros
        </button>
      </div>

      {/* OCUPAÇÃO */}
      {isDono && (
        <PlanGate planoAtual={planoAtual} planoNecessario="pro">
          {occupancyData && <OccupancyMetrics data={occupancyData} />}
        </PlanGate>
      )}

      {/* MÉTRICAS */}
      {isDono && (
        <PlanGate planoAtual={planoAtual} planoNecessario="pro">
          <StatCards
            faturamento={reportData?.faturamento_total || "0.00"}
            qtdServicos={reportData?.resumo?.concluidos || 0}
            qtdCancelados={reportData?.resumo?.cancelados || 0}
            qtdNoShow={reportData?.resumo?.faltas || 0}
          />
        </PlanGate>
      )}

      {/* AGENDA */}
      <section>
        <h3 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest">
          Agenda ({agendamentosFormatados.length})
        </h3>
        {loading ? (
          <p className="text-zinc-600 animate-pulse text-xs italic uppercase">
            Sincronizando...
          </p>
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