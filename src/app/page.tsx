"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiShield,
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
  FiLayers,
  FiGrid,
} from "react-icons/fi";
import Image from "next/image";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const segments = [
  { icon: "✂️", label: "Barbearias" },
  { icon: "💅", label: "Salões de beleza" },
  { icon: "🧖", label: "Clínicas estéticas" },
  { icon: "🐾", label: "Petshops" },
  { icon: "🖋️", label: "Estúdios de tatuagem" },
  { icon: "🏋️", label: "Estúdios de personal" },
];

const problems = [
  {
    icon: <FiClock className="w-6 h-6" />,
    title: "Horários encavalados",
    desc: "Dois clientes no mesmo horário. Confusão, cliente perdido, reputação no chão. Isso nunca mais vai acontecer.",
  },
  {
    icon: <FiAlertCircle className="w-6 h-6" />,
    title: "Sem controle de faturamento",
    desc: "Você não sabe quanto cada profissional faturou. Não sabe quais serviços vendem mais. Está gerindo no improviso.",
  },
  {
    icon: <FiX className="w-6 h-6" />,
    title: "Cliente some sem avisar",
    desc: "Faltou e você ficou sabendo na hora. Slot perdido, profissional parado, dinheiro jogado fora.",
  },
];

const plans = [
  {
    name: "Starter",
    price: 89,
    desc: "Para autônomos que querem sair do caderno e do WhatsApp.",
    highlight: false,
    features: [
      "1 profissional",
      "Agendamento online",
      "Portal do cliente",
      "Controle de agenda e folgas",
      "Suporte por e-mail",
    ],
    notIncluded: [
      "Métricas de faturamento",
      "Gestão de produtos",
      "Página própria do negócio",
      "Relatórios por profissional",
    ],
    cta: "Começar agora",
  },
  {
    name: "Pro",
    price: 159,
    desc: "Para negócios com equipe. Visão completa do que acontece na sua unidade.",
    highlight: true,
    features: [
      "Até 5 profissionais",
      "Tudo do Starter",
      "Métricas de faturamento e ocupação",
      "Gestão de produtos",
      "Página própria do negócio",
      "Suporte prioritário",
    ],
    notIncluded: ["Relatórios por profissional"],
    cta: "Mais popular",
  },
  {
    name: "Premium",
    price: 239,
    desc: "Para quem tem equipe grande e precisa de controle individual de cada profissional.",
    highlight: false,
    features: [
      "Profissionais ilimitados",
      "Tudo do Pro",
      "Relatórios individuais por profissional",
      "Suporte dedicado",
    ],
    notIncluded: [],
    cta: "Quero o Premium",
  },
];

const faqs = [
  {
    q: "Funciona para qualquer tipo de negócio de serviços?",
    a: "Sim. O sistema foi projetado para qualquer negócio que trabalhe com agendamento por horário: barbearias, salões de beleza, clínicas estéticas, petshops, estúdios de tatuagem, personal trainers e muito mais. A lógica é a mesma — profissional, serviço, horário.",
  },
  {
    q: "Meu cliente precisa baixar algum aplicativo?",
    a: "Não. O portal do cliente é 100% web. Ele acessa pelo navegador do celular, digita o telefone e já vê o histórico de agendamentos. Pode editar ou cancelar sem precisar de login.",
  },
  {
    q: "Como funciona o pagamento do plano?",
    a: "Por enquanto o pagamento é feito manualmente, de forma simples e direta. Após o cadastro, nossa equipe entra em contato para combinar os detalhes.",
  },
  {
    q: "Quantos profissionais posso cadastrar?",
    a: "Depende do plano. No Starter você tem 1 profissional, no Pro até 5, e no Premium é ilimitado. Você pode fazer upgrade a qualquer momento sem perder dados.",
  },
  {
    q: "Os dados do meu negócio são seguros?",
    a: "Sim. Cada estabelecimento tem um ambiente completamente isolado (arquitetura multi-tenant). Nenhum negócio tem acesso aos dados de outro.",
  },
  {
    q: "Como o sistema evita conflito de horários?",
    a: "O sistema calcula automaticamente os slots disponíveis levando em conta a duração do serviço, folgas do profissional e horários já ocupados. Se não cabe, o horário simplesmente não aparece para o cliente.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, sem multa e sem burocracia.",
  },
];

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
        <FiChevronDown
          className={`text-amber-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
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
// DASHBOARD PLACEHOLDER
// ─────────────────────────────────────────────

function DashboardImage() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-zinc-700/60">
      <Image
        src="/tela-dashboard.png"
        alt="Dashboard do Scheduly"
        width={1280}
        height={720}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400/30">

      {/* ── NAVBAR ── */}
      <header>
        <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiCalendar className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">
                Scheduly
              </span>
            </div>
            {/* Links */}
            <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              <a href="#como-funciona" className="hover:text-amber-500 transition-colors">Como funciona</a>
              <a href="#precos" className="hover:text-amber-500 transition-colors">Preços</a>
              <a href="#faq" className="hover:text-amber-500 transition-colors">FAQ</a>
              <Link
                href="/login"
                className="bg-amber-500 text-white px-6 py-3 rounded-full hover:bg-amber-400 transition-all font-black uppercase text-[10px] tracking-widest"
              >
                Entrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-500/8 blur-[140px] rounded-full -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <FiZap className="w-3 h-3" /> 15 dias grátis · Sem burocracia
          </div>
          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Agendamento inteligente<br />
            <span className="text-amber-500">para quem vende serviço.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
            Gestão completa de equipe, faturamento por profissional e um fluxo
            de agendamento que pensa por você. Para qualquer negócio de serviços.
          </p>
          {/* Segmentos inline */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {segments.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-bold px-3 py-1.5 rounded-full"
              >
                <span>{s.icon}</span> {s.label}
              </span>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastrar"
              className="w-full sm:w-auto bg-amber-500 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-3 hover:bg-amber-400 hover:scale-105 transition-all"
            >
              Cadastrar-se <FiArrowRight />
            </Link>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiLayers className="w-4 h-4" /> Ver como funciona
            </a>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-8 px-6 border-y border-zinc-900 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {[
            { value: "+300", label: "Negócios ativos", accent: true },
            { value: "Multi-tenant", label: "Dados 100% isolados", accent: false },
            { value: "+15k", label: "Agendamentos/mês", accent: true },
            { value: "15 dias", label: "Grátis pra testar", accent: false },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="hidden sm:block w-px h-10 bg-zinc-800" />}
              <div className="text-center">
                <p className={`text-3xl font-black tracking-tighter ${item.accent ? "text-amber-500" : "text-white"}`}>
                  {item.value}
                </p>
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
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">O problema</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Gestão no improviso<br />
              <span className="text-red-400">custa caro.</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div
                key={i}
                className="bg-zinc-900/20 border border-zinc-800 p-8 rounded-3xl hover:border-red-500/20 transition-all"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-400">
                  {p.icon}
                </div>
                <h4 className="text-lg font-black uppercase mb-3 tracking-tight">{p.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Módulo administrativo</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Gerencie seu negócio<br />
              <span className="text-amber-500">sem esforço.</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiGrid className="text-amber-500 w-6 h-6" />,
                title: "Serviços customizados",
                desc: "Crie, edite e organize seu catálogo. Defina nome, preço e a duração exata de cada serviço para alimentar nossa inteligência de agenda.",
              },
              {
                icon: <FiUsers className="text-amber-500 w-6 h-6" />,
                title: "Equipe e vínculos",
                desc: "Cadastre profissionais com acessos individuais e vincule serviços específicos a cada um. Cada profissional só aparece nos serviços que realmente faz.",
              },
              {
                icon: <FiShield className="text-amber-500 w-6 h-6" />,
                title: "Controle de folgas",
                desc: "Bloqueie horários por profissional — dia todo ou período parcial. A agenda trava automaticamente e o cliente não vê horários indisponíveis.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl hover:border-amber-400/20 transition-all"
              >
                <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h4 className="text-xl font-black uppercase mb-4 tracking-tight">{card.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD (placeholder para prints reais) ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          {/* Visual */}
          <div className="flex-1 w-full">
            <DashboardImage />
          </div>
          {/* Copy */}
          <div className="flex-1">
            <h3 className="text-4xl font-black tracking-tighter mb-6">
              Dashboard <span className="text-amber-500">poderoso.</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              O dono visualiza faturamento total, ocupação por profissional e todos
              os agendamentos do período. Cada profissional acessa apenas a própria
              agenda — sem acesso a dados do negócio.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <FiActivity />, text: "Status em tempo real — pendente, finalizado, faltou" },
                { icon: <FiTrendingUp />, text: "Métricas de ocupação total e por profissional" },
                { icon: <FiBarChart2 />, text: "Faturamento filtrável por período e por profissional" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300">
                  <span className="text-amber-500 shrink-0">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── AGENDAMENTO INTELIGENTE ── */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Agenda com <span className="text-amber-500">cérebro.</span>
          </h3>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Nada de horários encavalados. O sistema calcula o tempo do serviço
            contra o espaço livre do profissional. Se não cabe, não aparece. Simples assim.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-3xl hover:border-amber-400/20 transition-all">
            <FiClock className="text-amber-500 w-10 h-10 mb-6" />
            <h4 className="text-2xl font-black uppercase mb-4">Cálculo de slot real</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              O profissional tem 15 minutos livres. O cliente escolhe um serviço de 30 min.
              O sistema identifica a falta de espaço e remove esse horário das opções —
              o profissional nunca atrasa, o cliente nunca espera.
            </p>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-3xl hover:border-amber-400/20 transition-all">
            <FiSmartphone className="text-amber-500 w-10 h-10 mb-6" />
            <h4 className="text-2xl font-black uppercase mb-4">Portal do cliente</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              O cliente acessa pelo celular, digita o telefone e vê todo o histórico.
              Pode editar ou cancelar o próprio agendamento sem precisar de login —
              sem atrito, sem app para baixar.
            </p>
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="precos" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Planos</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
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
                    ? "bg-amber-500 border-amber-400 text-black shadow-2xl shadow-amber-400/20 md:-mt-4"
                    : "bg-zinc-900/30 border-zinc-800 text-white hover:border-zinc-600"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-amber-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-400/30 whitespace-nowrap">
                    Mais popular
                  </div>
                )}
                <div className="mb-6">
                  <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black tracking-tighter">R$ {plan.price}</span>
                    <span className={`text-sm font-bold mb-1 ${plan.highlight ? "text-black/60" : "text-zinc-500"}`}>/mês</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? "text-black/70" : "text-zinc-500"}`}>
                    {plan.desc}
                  </p>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold">
                      <FiCheck className={`shrink-0 w-4 h-4 ${plan.highlight ? "text-white" : "text-amber-500"}`} />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <li key={`no-${j}`} className={`flex items-center gap-3 text-sm line-through ${plan.highlight ? "text-amber-300/40" : "text-zinc-600"}`}>
                      <FiX className="shrink-0 w-4 h-4 opacity-30" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastrar"
                  className={`w-full py-4 rounded-2xl font-black uppercase text-xs text-center transition-all hover:scale-105 block ${
                    plan.highlight
                      ? "bg-white text-amber-600 hover:bg-amber-50"
                      : "bg-amber-500 text-white hover:bg-amber-400"
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
      <section id="faq" className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Dúvidas</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
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
      <section className="py-32 px-6 border-t border-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full -z-10" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-zinc-500">
          Sem cartão · Sem burocracia · 15 dias grátis
        </p>
        <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
          Pronto para o<br />
          <span className="text-amber-500">próximo nível?</span>
        </h3>
        <Link
          href="/cadastrar"
          className="inline-flex items-center gap-3 bg-amber-500 text-white font-black px-16 py-6 rounded-2xl uppercase text-sm hover:bg-amber-400 hover:scale-105 transition-all shadow-xl shadow-amber-400/20"
        >
          Cadastrar-se <FiArrowRight />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-zinc-900 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <FiCalendar className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-white">Scheduly</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">
            © 2026 — Agendamento inteligente para negócios de serviços
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="/login" className="hover:text-white transition-colors">Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}