"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiScissors,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiSearch,
  FiArrowRight,
  FiClock,
  FiActivity,
  FiSmartphone,
  FiAlertCircle,
  FiX,
  FiCheck,
  FiChevronDown,
  FiZap,
  FiBarChart2,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const problems = [
  {
    icon: <FiClock className="w-6 h-6" />,
    title: "Horários Encavalados",
    desc: "Dois clientes marcados no mesmo horário. Confusão, briga, cliente perdido. Isso nunca mais vai acontecer.",
  },
  {
    icon: <FiAlertCircle className="w-6 h-6" />,
    title: "Sem Controle de Faturamento",
    desc: "Você não sabe quanto cada barbeiro faturou no mês. Não sabe quais serviços vendem mais. Está gerindo no escuro.",
  },
  {
    icon: <FiX className="w-6 h-6" />,
    title: "Cliente Some Sem Avisar",
    desc: "Faltou e você ficou sabendo na hora. Slot perdido, barbeiro parado, dinheiro jogado fora.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 89,
    desc: "Para barbeiros autônomos que querem organização profissional.",
    highlight: false,
    features: [
      "1 barbeiro",
      "Agendamento online",
      "Portal do cliente",
      "Dashboard básico",
      "Suporte por e-mail",
    ],
    notIncluded: [
      "Faturamento e ocupação",
      "Gestão de produtos",
      "Landing page própria",
      "Relatórios por barbeiro",
    ],
    cta: "Começar agora",
  },
  {
    name: "Pro",
    price: 159,
    desc: "Para barbearias com equipe. Controle total de cada cadeira.",
    highlight: true,
    features: [
      "Até 5 barbeiros",
      "Tudo do Starter",
      "Faturamento e ocupação",
      "Gestão de produtos",
      "Landing page própria",
      "Suporte prioritário",
    ],
    notIncluded: ["Relatórios por barbeiro"],
    cta: "Mais popular",
  },
  {
    name: "Premium",
    price: 239,
    desc: "Para donos de franquia ou múltiplas unidades.",
    highlight: false,
    features: [
      "Barbeiros ilimitados",
      "Múltiplas unidades",
      "Tudo do Pro",
      "Relatórios por barbeiro",
      "Slug personalizado",
      "Suporte dedicado",
    ],
    notIncluded: [],
    cta: "Quero o Premium",
  },
];

const faqs = [
  {
    q: "Meu cliente precisa baixar algum aplicativo?",
    a: "Não. O portal do cliente é 100% web. Ele acessa pelo navegador do celular, digita o telefone e já vê o histórico e agenda no horário que quiser.",
  },
  {
    q: "Como funciona o pagamento do plano?",
    a: "Por enquanto o pagamento é feito manualmente, de forma simples e direta. Após o cadastro, nossa equipe entra em contato para combinar os detalhes.",
  },
  {
    q: "Quantos barbeiros posso cadastrar?",
    a: "Depende do plano. No Starter você tem 1 barbeiro, no Pro até 5, e no Premium é ilimitado. Você pode fazer upgrade a qualquer momento sem perder dados.",
  },
  {
    q: "Os dados da minha barbearia são seguros?",
    a: "Sim. Cada barbearia tem um ambiente completamente isolado (arquitetura multi-tenant). Nenhuma barbearia tem acesso aos dados de outra.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multa e sem burocracia. Você cancela quando quiser.",
  },
  {
    q: "Como funciona o controle de horários disponíveis?",
    a: "O sistema calcula automaticamente os slots disponíveis considerando a duração do serviço e os horários já ocupados. Se não cabe, o horário não aparece para o cliente.",
  },
];

// ─────────────────────────────────────────────
// DASHBOARD MOCKUP
// ─────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-700/60 overflow-hidden shadow-2xl shadow-black/60 text-xs">
      {/* Top bar */}
      <div className="bg-zinc-800/80 border-b border-zinc-700/50 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-zinc-500 text-[10px] font-mono">barbersaas.app/dashboard</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-36 bg-zinc-900 border-r border-zinc-800 p-3 flex flex-col gap-1 shrink-0">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
              <FiScissors className="text-black w-3 h-3" />
            </div>
            <span className="text-white font-black text-[9px] uppercase tracking-tight leading-tight">Barbearia<br />do Josué</span>
          </div>
          {[
            { icon: <FiBarChart2 className="w-3 h-3" />, label: "Visão geral", active: true },
            { icon: <FiScissors className="w-3 h-3" />, label: "Produtos", active: false },
            { icon: <FiUsers className="w-3 h-3" />, label: "Gerenciar Unidade", active: false },
            { icon: <FiClock className="w-3 h-3" />, label: "Horários", active: false },
            { icon: <FiSmartphone className="w-3 h-3" />, label: "Pág. de vendas", active: false },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wide ${item.active ? "bg-amber-500/15 text-amber-500 border border-amber-500/20" : "text-zinc-500"}`}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="mb-4">
            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-0.5">Barbearia do Josué</p>
            <h2 className="text-base font-black tracking-tight">
              Olá, <span className="text-amber-500">Josué!</span>
            </h2>
            <p className="text-zinc-500 text-[9px]">Gerencie o faturamento e a agenda da sua unidade.</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-[9px] text-zinc-400 font-bold uppercase">
              <FiCalendar className="w-2.5 h-2.5" /> 29/01/2026
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-[9px] text-zinc-400 font-bold uppercase">
              <FiCalendar className="w-2.5 h-2.5" /> 10/02/2026
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-[9px] text-zinc-400 font-bold uppercase">
              <FiUser className="w-2.5 h-2.5" /> Todos
            </div>
            <div className="bg-amber-500 text-black rounded-lg px-3 py-1.5 text-[9px] font-black uppercase">
              Filtrar
            </div>
          </div>

          {/* Ocupação */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Performance da Unidade</p>
                <p className="text-white font-black text-xs">Ocupação Geral</p>
              </div>
              <span className="text-amber-500 font-black text-sm">87%</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "87%" }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Rafael S.", agendamentos: 14, pct: 72 },
                { name: "Lucas A.", agendamentos: 18, pct: 87 },
              ].map((b, i) => (
                <div key={i} className="bg-zinc-800 rounded-lg p-2 border border-zinc-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-white font-black">{b.name}</span>
                    <span className="text-amber-500 text-[9px] font-black">{b.pct}%</span>
                  </div>
                  <p className="text-[8px] text-zinc-500 uppercase mb-1">{b.agendamentos} agendamentos</p>
                  <div className="h-1 bg-zinc-700 rounded-full">
                    <div className="h-full bg-amber-500/70 rounded-full" style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cards métricas */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Faturamento Total</p>
              <p className="text-amber-500 font-black text-sm tracking-tighter">R$ 5.730,00</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Serviços Realizados</p>
              <div className="flex items-end gap-2">
                <p className="text-white font-black text-sm">7</p>
                <div className="flex gap-1 mb-0.5">
                  <span className="text-[8px] text-red-400 font-bold">Faltas: 1</span>
                  <span className="text-[8px] text-zinc-500">·</span>
                  <span className="text-[8px] text-red-400 font-bold">Cancel: 3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3">
            <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-2">Agenda</p>
            <div className="space-y-1.5">
              {[
                { hora: "14:00", servico: "Nevou", cliente: "Luiz Otávio", status: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
                { hora: "15:30", servico: "Corte + Barba", cliente: "Carlos M.", status: "Finalizado", color: "bg-green-500/20 text-green-400 border-green-500/30" },
                { hora: "16:00", servico: "Corte Simples", cliente: "Pedro H.", status: "Faltou", color: "bg-red-500/20 text-red-400 border-red-500/30" },
              ].map((ag, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-900/60 rounded-lg px-2.5 py-1.5 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-black text-[9px]">{ag.hora}</span>
                    <div>
                      <p className="text-white text-[9px] font-bold">{ag.servico}</p>
                      <p className="text-zinc-500 text-[8px]">{ag.cliente}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${ag.color}`}>
                    {ag.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="font-bold text-sm uppercase tracking-wider text-white">{q}</span>
        <FiChevronDown className={`text-amber-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function LandingPage() {
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30">

      {/* ── MODAL DASHBOARD ── */}
      {dashboardOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDashboardOpen(false)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Preview do Dashboard</p>
              <button onClick={() => setDashboardOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <DashboardMockup />
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header>
        <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                <FiScissors className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Barber<span className="text-amber-500">SaaS</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <a href="#gestao" className="hover:text-amber-500 transition-colors">Gestão</a>
              <a href="#precos" className="hover:text-amber-500 transition-colors">Preços</a>
              <a href="#agendamento" className="hover:text-amber-500 transition-colors">Agendamento</a>
              <Link href="/login" className="bg-white text-black px-6 py-3 rounded-full hover:bg-amber-500 transition-all font-black uppercase text-[10px] tracking-widest">
                Entrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <FiZap className="w-3 h-3" /> 15 dias grátis · Sem burocracia
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            A Inteligência que <br />
            <span className="text-amber-500">sua cadeira merece.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Gestão completa de unidades, controle de faturamento individualizado
            e um fluxo de agendamento que pensa por você.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastrar"
              className="w-full sm:w-auto bg-amber-500 text-black font-black px-12 py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all"
            >
              Cadastrar Minha Barbearia <FiArrowRight />
            </Link>
            <button
              onClick={() => setDashboardOpen(true)}
              className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiBarChart2 className="w-4 h-4" /> Ver Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-8 px-6 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {[
            { value: "+200", label: "Barbearias ativas", amber: true },
            { value: "Multi-tenant", label: "Dados 100% isolados", amber: false },
            { value: "+12k", label: "Agendamentos/mês", amber: true },
            { value: "15 dias", label: "Grátis pra testar", amber: false },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="hidden sm:block w-px h-10 bg-zinc-800" />}
              <div className="text-center">
                <p className={`text-3xl font-black tracking-tighter ${item.amber ? "text-amber-500" : "text-white"}`}>{item.value}</p>
                <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-1">{item.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">O Problema</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Gestão no improviso<br /><span className="text-amber-500">custa caro.</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="relative bg-zinc-900/20 border border-zinc-800 p-8 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-400">{p.icon}</div>
                <h4 className="text-lg font-black uppercase mb-3 tracking-tight">{p.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GESTÃO DA UNIDADE ── */}
      <section id="gestao" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Módulo Administrativo</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Gerencie sua unidade <br /><span className="text-amber-500">sem esforço.</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiScissors className="text-amber-500 w-6 h-6" />, title: "Serviços Customizados", desc: "Crie, edite e organize seu catálogo. Defina nome, preço e o tempo exato de cada execução para alimentar nossa inteligência de agenda." },
              { icon: <FiUsers className="text-amber-500 w-6 h-6" />, title: "Equipe & Vínculos", desc: "Cadastre barbeiros com acessos individuais e vincule serviços específicos a cada profissional de forma dinâmica." },
              { icon: <FiShield className="text-amber-500 w-6 h-6" />, title: "Controle de Folgas", desc: "Bloqueie horários para a equipe toda em feriados ou defina períodos de folga por profissional. A agenda trava na hora." },
            ].map((card, i) => (
              <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">{card.icon}</div>
                <h4 className="text-xl font-black uppercase mb-4 tracking-tight">{card.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 order-2 md:order-1">
            <DashboardMockup />
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-6">
              Dashboard <span className="text-amber-500">Poderoso.</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              O coração do seu negócio alimentado por um filtro inteligente. Donos visualizam o faturamento global e a performance de cada cadeira. Barbeiros acessam apenas sua própria produtividade.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
                <FiActivity className="text-amber-500 shrink-0" /> Status em tempo real (Pendente / Finalizado / Faltou)
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
                <FiTrendingUp className="text-amber-500 shrink-0" /> Métricas de ocupação total e individual
              </li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
                <FiSearch className="text-amber-500 shrink-0" /> Gestão de agendamentos com botões de ação rápida
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── AGENDAMENTO INTELIGENTE ── */}
      <section id="agendamento" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-6">
            Agenda com <span className="text-amber-500">Cérebro.</span>
          </h3>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Nada de horários encavalados. Nosso sistema calcula o tempo do serviço contra o espaço livre. Se não cabe, ele não mostra. Simples assim.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="bg-zinc-900/20 border border-zinc-800 p-10 rounded-3xl">
            <FiClock className="text-amber-500 w-10 h-10 mb-6" />
            <h4 className="text-2xl font-black uppercase mb-4 italic">Cálculo de Slot Real</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Exemplo: Um barbeiro tem 15min livres. O cliente escolhe um serviço de 30min. O sistema identifica a falta de espaço e remove esse horário das opções, garantindo que o barbeiro nunca atrase.
            </p>
          </div>
          <div className="bg-zinc-900/20 border border-zinc-800 p-10 rounded-3xl">
            <FiSmartphone className="text-amber-500 w-10 h-10 mb-6" />
            <h4 className="text-2xl font-black uppercase mb-4 italic">Portal do Cliente</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              O cliente acessa, digita o telefone e vê todo o seu histórico. Ele mesmo pode editar ou cancelar o agendamento, liberando sua equipe para o que importa: o corte.
            </p>
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="precos" className="py-24 px-6 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Planos</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">
              Simples e <span className="text-amber-500">transparente.</span>
            </h3>
            <p className="text-zinc-500 text-sm">Pagamento manual · Sem cartão de crédito · 15 dias grátis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-3xl p-8 border flex flex-col transition-all ${
                  plan.highlight
                    ? "bg-amber-500 border-amber-400 text-black shadow-2xl shadow-amber-500/20 md:-mt-4"
                    : "bg-zinc-900/30 border-zinc-800 text-white hover:border-zinc-600"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-amber-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/30 whitespace-nowrap">
                    Mais popular
                  </div>
                )}
                <div className="mb-6">
                  <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-4xl font-black tracking-tighter ${plan.highlight ? "text-black" : "text-white"}`}>
                      R$ {plan.price}
                    </span>
                    <span className={`text-sm font-bold mb-1 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>/mês</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? "text-black/70" : "text-zinc-500"}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm font-bold ${plan.highlight ? "text-black" : "text-zinc-300"}`}>
                      <FiCheck className={`shrink-0 w-4 h-4 ${plan.highlight ? "text-black" : "text-amber-500"}`} />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <li key={`no-${j}`} className={`flex items-center gap-3 text-sm ${plan.highlight ? "text-black/30 line-through" : "text-zinc-600 line-through"}`}>
                      <FiX className="shrink-0 w-4 h-4 opacity-30" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/cadastrar"
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs text-center transition-all hover:scale-105 block ${
                    plan.highlight
                      ? "bg-black text-white hover:bg-zinc-900"
                      : "bg-amber-500 text-black hover:bg-amber-400"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Dúvidas</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Perguntas <span className="text-amber-500">frequentes.</span>
            </h3>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 px-6 bg-amber-500 text-black text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-black/50">
          Sem cartão · Sem burocracia · 15 dias grátis
        </p>
        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8">
          Pronto para o <br />Próximo Nível?
        </h3>
        <Link
          href="/cadastrar"
          className="inline-flex items-center gap-3 bg-black text-white font-black px-16 py-6 rounded-2xl uppercase text-sm hover:scale-105 transition-all shadow-xl"
        >
          Quero usar na minha barbearia <FiArrowRight />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-20 border-t border-zinc-900 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2">
            <FiScissors className="text-amber-500 w-6 h-6" />
            <span className="text-lg font-black tracking-tighter uppercase text-white">BarberSaaS</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">
            © 2026 — O Sistema Definitivo de Barbearias
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="/login" className="hover:text-white transition-colors">Login Dono</a>
          </div>
        </div>
      </footer>
    </div>
  );
}