"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FiTag,
} from "react-icons/fi";
import Image from "next/image";

// ─────────────────────────────────────────────
// HOOK: Intersection Observer para scroll animations
// ─────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─────────────────────────────────────────────
// HOOK: Counter animado
// ─────────────────────────────────────────────

function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

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
    price: 89.0,
    promoPrice: 44.5,
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
    price: 159.5,
    promoPrice: 79.5,
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
    promoPrice: 119.5,
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
// ANIMATION WRAPPER
// ─────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT COUNTER
// ─────────────────────────────────────────────

function StatCounter({
  value,
  label,
  accent,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  accent: boolean;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(value, 1600, inView);
  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p
        className={`text-3xl font-black tracking-tighter ${accent ? "text-amber-500" : "text-white"}`}
      >
        {prefix}
        {count}
        {suffix}
      </p>
      <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ ITEM
// ─────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-zinc-800 rounded-2xl overflow-hidden"
      style={{ transition: "border-color 0.3s ease" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(113,113,122,0.6)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgb(39,39,42)")
      }
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="font-bold text-sm uppercase tracking-wider text-white">
          {q}
        </span>
        <FiChevronDown
          className="text-amber-500 shrink-0"
          style={{
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 pt-4">
          {a}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD IMAGE
// ─────────────────────────────────────────────

function DashboardImage() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-zinc-700/60"
      style={{
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.06)",
        transition: "box-shadow 0.4s ease, transform 0.4s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px) scale(1.01)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 60px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0) scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.06)";
      }}
    >
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
// LAUNCH BANNER
// ─────────────────────────────────────────────

function LaunchBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="fixed top-0 w-full z-[60] flex items-center justify-center gap-3 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-black"
      style={{
        background: "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
        backgroundSize: "200% 100%",
        animation: "shimmer 3s linear infinite",
      }}
    >
      <FiTag className="w-3.5 h-3.5 shrink-0" />
      <span>
        🚀 Oferta de lançamento · 50% off em todos os planos · Por tempo
        limitado
      </span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fechar"
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-400/30">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(-4px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.05); }
        }
        @keyframes badge-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes card-hover-shimmer {
          from { left: -100%; }
          to { left: 200%; }
        }
        .animate-hero-1 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .animate-hero-2 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .animate-hero-3 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .animate-hero-4 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .animate-hero-5 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s both; }
        .animate-hero-6 { animation: hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.85s both; }
        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
          transition: left 0.6s ease;
        }
        .card-shine:hover::after {
          left: 200%;
        }
        .promo-badge {
          animation: badge-bounce 2s ease-in-out infinite;
        }
      `}</style>

      {/* ── LAUNCH BANNER ── */}
      <LaunchBanner />

      {/* ── NAVBAR ── */}
      <header>
        <nav
          className="fixed w-full z-50 border-b"
          style={{
            top: "40px",
            background: navScrolled
              ? "rgba(0,0,0,0.92)"
              : "rgba(0,0,0,0.4)",
            borderColor: navScrolled
              ? "rgba(39,39,42,0.8)"
              : "rgba(39,39,42,0.3)",
            backdropFilter: "blur(20px)",
            transition: "background 0.4s ease, border-color 0.4s ease",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div
                className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center"
                style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1) rotate(-5deg)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 20px rgba(245,158,11,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1) rotate(0deg)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <FiCalendar className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">Scheduly</span>
            </div>
            <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {[
                { label: "Como funciona", href: "#como-funciona" },
                { label: "Preços", href: "#precos" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative group"
                  style={{ transition: "color 0.2s ease" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "#f59e0b")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "")
                  }
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px bg-amber-500"
                    style={{
                      width: "0%",
                      transition: "width 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLSpanElement).style.width = "100%")
                    }
                  />
                </a>
              ))}
              <Link
                href="/login"
                className="bg-amber-500 text-white px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest"
                style={{ transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#fbbf24";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(245,158,11,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#f59e0b";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                Entrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-56 pb-32 px-6 overflow-hidden">
        {/* Glow animado */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full -z-10"
          style={{
            background: "radial-gradient(ellipse, rgba(245,158,11,0.10) 0%, transparent 70%)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
        {/* Partículas decorativas */}
        <div
          className="absolute top-40 left-[8%] w-2 h-2 rounded-full bg-amber-500/30"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <div
          className="absolute top-60 right-[10%] w-1.5 h-1.5 rounded-full bg-amber-400/20"
          style={{ animation: "float 8s ease-in-out 1s infinite" }}
        />
        <div
          className="absolute bottom-24 left-[15%] w-1 h-1 rounded-full bg-amber-500/20"
          style={{ animation: "float 7s ease-in-out 2s infinite" }}
        />

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-hero-1 inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <FiZap className="w-3 h-3" style={{ animation: "badge-bounce 1.5s ease-in-out infinite" }} />
            15 dias grátis · Sem burocracia
          </div>

          {/* Headline */}
          <h1 className="animate-hero-2 text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Agendamento inteligente
            <br />
            <span className="text-amber-500">para quem vende serviço.</span>
          </h1>

          <p className="animate-hero-3 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
            Gestão completa de equipe, faturamento por profissional e um fluxo
            de agendamento que pensa por você. Para qualquer negócio de
            serviços.
          </p>

          {/* Segmentos */}
          <div className="animate-hero-4 flex flex-wrap items-center justify-center gap-2 mb-12">
            {segments.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{
                  transition: "border-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
                  animationDelay: `${i * 80}ms`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.borderColor = "rgba(245,158,11,0.4)";
                  el.style.color = "#f59e0b";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.borderColor = "";
                  el.style.color = "";
                  el.style.transform = "";
                }}
              >
                <span>{s.icon}</span> {s.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="animate-hero-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastrar"
              className="w-full sm:w-auto bg-amber-500 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-3"
              style={{
                transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
                boxShadow: "0 0 0 rgba(245,158,11,0)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#fbbf24";
                el.style.transform = "scale(1.05) translateY(-2px)";
                el.style.boxShadow = "0 16px 40px rgba(245,158,11,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "#f59e0b";
                el.style.transform = "scale(1) translateY(0)";
                el.style.boxShadow = "0 0 0 rgba(245,158,11,0)";
              }}
            >
              Cadastrar-se <FiArrowRight />
            </Link>
            <a
              href="#como-funciona"
              className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-2"
              style={{ transition: "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "rgb(39,39,42)";
                el.style.borderColor = "rgba(113,113,122,0.6)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "";
                el.style.borderColor = "";
                el.style.transform = "";
              }}
            >
              <FiLayers className="w-4 h-4" /> Ver como funciona
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            className="animate-hero-6 mt-16 flex flex-col items-center gap-2 text-zinc-600"
            style={{ animation: "hero-in 0.9s cubic-bezier(0.22,1,0.36,1) 0.85s both" }}
          >
            <div
              className="w-px h-10 bg-gradient-to-b from-transparent to-zinc-700"
              style={{ animation: "float 2s ease-in-out infinite" }}
            />
            <span className="text-[9px] uppercase tracking-widest font-black">scroll</span>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-8 px-6 border-y border-zinc-900 bg-zinc-900/30 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          <StatCounter value={300} prefix="+" label="Negócios ativos" accent delay={0} />
          <div className="hidden sm:block w-px h-10 bg-zinc-800" />
          <FadeUp delay={100} className="text-center">
            <p className="text-3xl font-black tracking-tighter text-white">Multi-tenant</p>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-1">Dados 100% isolados</p>
          </FadeUp>
          <div className="hidden sm:block w-px h-10 bg-zinc-800" />
          <StatCounter value={15000} prefix="+" suffix="/mês" label="Agendamentos/mês" accent delay={150} />
          <div className="hidden sm:block w-px h-10 bg-zinc-800" />
          <FadeUp delay={200} className="text-center">
            <p className="text-3xl font-black tracking-tighter text-white">15 dias</p>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mt-1">Grátis pra testar</p>
          </FadeUp>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">
              O problema
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Gestão no improviso
              <br />
              <span className="text-red-400">custa caro.</span>
            </h3>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <FadeUp key={i} delay={i * 120} className="card-shine">
                <div
                  className="bg-zinc-900/20 border border-zinc-800 p-8 rounded-3xl h-full"
                  style={{
                    transition: "border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(239,68,68,0.25)";
                    el.style.transform = "translateY(-6px)";
                    el.style.background = "rgba(239,68,68,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "";
                    el.style.transform = "";
                    el.style.background = "";
                  }}
                >
                  <div
                    className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-400"
                    style={{ transition: "transform 0.3s ease, background 0.3s ease" }}
                  >
                    {p.icon}
                  </div>
                  <h4 className="text-lg font-black uppercase mb-3 tracking-tight">{p.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section
        id="como-funciona"
        className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20"
      >
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">
              Módulo administrativo
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Gerencie seu negócio
              <br />
              <span className="text-amber-500">sem esforço.</span>
            </h3>
          </FadeUp>
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
              <FadeUp key={i} delay={i * 130} className="card-shine">
                <div
                  className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl h-full"
                  style={{
                    transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(245,158,11,0.3)";
                    el.style.transform = "translateY(-6px)";
                    el.style.boxShadow = "0 20px 50px rgba(245,158,11,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "";
                    el.style.transform = "";
                    el.style.boxShadow = "";
                  }}
                >
                  <div
                    className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center mb-6"
                    style={{ transition: "background 0.3s ease, transform 0.3s ease" }}
                  >
                    {card.icon}
                  </div>
                  <h4 className="text-xl font-black uppercase mb-4 tracking-tight">
                    {card.title}
                  </h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <FadeIn delay={0} className="flex-1 w-full">
            <DashboardImage />
          </FadeIn>
          <FadeUp delay={200} className="flex-1">
            <h3 className="text-4xl font-black tracking-tighter mb-6">
              Dashboard{" "}
              <span className="text-amber-500">poderoso.</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              O dono visualiza faturamento total, ocupação por profissional e
              todos os agendamentos do período. Cada profissional acessa apenas
              a própria agenda — sem acesso a dados do negócio.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: <FiActivity />,
                  text: "Status em tempo real — pendente, finalizado, faltou",
                },
                {
                  icon: <FiTrendingUp />,
                  text: "Métricas de ocupação total e por profissional",
                },
                {
                  icon: <FiBarChart2 />,
                  text: "Faturamento filtrável por período e por profissional",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300"
                  style={{
                    opacity: 0,
                    animation: `hero-in 0.6s ease ${300 + i * 120}ms both`,
                  }}
                >
                  <span
                    className="text-amber-500 shrink-0 w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center"
                    style={{ transition: "transform 0.2s ease, background 0.2s ease" }}
                  >
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── AGENDAMENTO INTELIGENTE ── */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20">
        <FadeUp className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Agenda com{" "}
            <span className="text-amber-500">cérebro.</span>
          </h3>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Nada de horários encavalados. O sistema calcula o tempo do serviço
            contra o espaço livre do profissional. Se não cabe, não aparece.
            Simples assim.
          </p>
        </FadeUp>
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <FiClock className="text-amber-500 w-10 h-10 mb-6" />,
              title: "Cálculo de slot real",
              desc: "O profissional tem 15 minutos livres. O cliente escolha um serviço de 30 min. O sistema identifica a falta de espaço e remove esse horário das opções — o profissional nunca atrasa, o cliente nunca espera.",
              delay: 0,
            },
            {
              icon: <FiSmartphone className="text-amber-500 w-10 h-10 mb-6" />,
              title: "Portal do cliente",
              desc: "O cliente acessa pelo celular, digita o telefone e vê todo o histórico. Pode editar ou cancelar o próprio agendamento sem precisar de login — sem atrito, sem app para baixar.",
              delay: 150,
            },
          ].map((card, i) => (
            <FadeUp key={i} delay={card.delay} className="card-shine">
              <div
                className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-3xl h-full"
                style={{
                  transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(245,158,11,0.3)";
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 24px 60px rgba(245,158,11,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "";
                  el.style.transform = "";
                  el.style.boxShadow = "";
                }}
              >
                {card.icon}
                <h4 className="text-2xl font-black uppercase mb-4">{card.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="precos" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">
              Planos
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Simples e{" "}
              <span className="text-amber-500">transparente.</span>
            </h3>
            <p className="text-zinc-500 text-sm">
              Pagamento manual · Sem cartão de crédito · 15 dias grátis
            </p>
          </FadeUp>

          {/* Promo faixa */}
          <FadeUp delay={100} className="mb-8">
            <div
              className="max-w-2xl mx-auto flex items-center justify-center gap-3 border border-amber-400/30 rounded-2xl px-6 py-4 text-sm font-bold text-amber-400"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))",
              }}
            >
              <FiTag className="w-4 h-4 shrink-0" />
              <span>
                🚀{" "}
                <span className="font-black text-amber-500">
                  Oferta de lançamento:
                </span>{" "}
                todos os planos com{" "}
                <span className="text-white font-black">50% de desconto</span>.
                O preço cheio volta em breve.
              </span>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <FadeUp key={i} delay={i * 120}>
                <div
                  className={`relative rounded-3xl p-8 border flex flex-col card-shine ${
                    plan.highlight
                      ? "bg-amber-500 border-amber-400 text-black md:-mt-4"
                      : "bg-zinc-900/30 border-zinc-800 text-white"
                  }`}
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    boxShadow: plan.highlight
                      ? "0 20px 60px rgba(245,158,11,0.2)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-6px)";
                    el.style.boxShadow = plan.highlight
                      ? "0 30px 80px rgba(245,158,11,0.35)"
                      : "0 20px 60px rgba(245,158,11,0.08)";
                    if (!plan.highlight) el.style.borderColor = "rgba(113,113,122,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = plan.highlight ? "" : "";
                    el.style.boxShadow = plan.highlight
                      ? "0 20px 60px rgba(245,158,11,0.2)"
                      : "none";
                    if (!plan.highlight) el.style.borderColor = "";
                  }}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-amber-500 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-400/30 whitespace-nowrap">
                      Mais popular
                    </div>
                  )}

                  {/* Promo badge */}
                  <div className="absolute -top-3 right-4 promo-badge">
                    <div
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        plan.highlight
                          ? "bg-black text-amber-400 border border-amber-400/40"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      50% off
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4
                      className={`text-xs font-black uppercase tracking-widest mb-3 ${
                        plan.highlight ? "text-black/60" : "text-zinc-500"
                      }`}
                    >
                      {plan.name}
                    </h4>

                    {/* Preço com promo */}
                    <div className="mb-2">
                      {/* Preço original riscado */}
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-bold line-through ${
                            plan.highlight ? "text-black/40" : "text-zinc-600"
                          }`}
                        >
                          R$ {plan.price.toFixed(2).replace(".", ",")}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            plan.highlight
                              ? "bg-black/15 text-black/70"
                              : "bg-amber-500/15 text-amber-500"
                          }`}
                        >
                          preço normal
                        </span>
                      </div>
                      {/* Preço promo */}
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black tracking-tighter">
                          R$ {plan.promoPrice.toFixed(2).replace(".", ",")}
                        </span>
                        <span
                          className={`text-sm font-bold mb-1 ${
                            plan.highlight ? "text-black/60" : "text-zinc-500"
                          }`}
                        >
                          /mês
                        </span>
                      </div>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        plan.highlight ? "text-black/70" : "text-zinc-500"
                      }`}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-3 text-sm font-bold"
                        style={{
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLLIElement).style.transform = "translateX(4px)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLLIElement).style.transform = "")
                        }
                      >
                        <FiCheck
                          className={`shrink-0 w-4 h-4 ${
                            plan.highlight ? "text-white" : "text-amber-500"
                          }`}
                        />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f, j) => (
                      <li
                        key={`no-${j}`}
                        className={`flex items-center gap-3 text-sm line-through ${
                          plan.highlight
                            ? "text-amber-300/40"
                            : "text-zinc-600"
                        }`}
                      >
                        <FiX className="shrink-0 w-4 h-4 opacity-30" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/cadastrar"
                    className={`w-full py-4 rounded-2xl font-black uppercase text-xs text-center block ${
                      plan.highlight
                        ? "bg-white text-amber-600"
                        : "bg-amber-500 text-white"
                    }`}
                    style={{
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.transform = "scale(1.03)";
                      el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
                      if (plan.highlight) el.style.background = "#fef9c3";
                      else el.style.background = "#fbbf24";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.transform = "";
                      el.style.boxShadow = "";
                      el.style.background = "";
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Nota sobre preço futuro */}
          <FadeUp delay={400} className="mt-8 text-center">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider">
              ⚠️ Os preços promocionais são válidos apenas durante o período de lançamento.
              Ao atingir os primeiros clientes, os valores retornam ao normal.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="py-24 px-6 border-t border-zinc-900 bg-zinc-900/20"
      >
        <div className="max-w-3xl mx-auto">
          <FadeUp className="mb-16 text-center">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">
              Dúvidas
            </h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
              Perguntas{" "}
              <span className="text-amber-500">frequentes.</span>
            </h3>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FadeUp key={i} delay={i * 60}>
                <FAQItem q={f.q} a={f.a} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 px-6 border-t border-zinc-900 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(245,158,11,0.025)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full -z-10"
          style={{
            background: "radial-gradient(ellipse, rgba(245,158,11,0.12), transparent 70%)",
            animation: "pulse-glow 4s ease-in-out 1s infinite",
          }}
        />
        <FadeUp>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-zinc-500">
            Sem cartão · Sem burocracia · 15 dias grátis
          </p>
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
            Pronto para o
            <br />
            <span className="text-amber-500">próximo nível?</span>
          </h3>
          <Link
            href="/cadastrar"
            className="inline-flex items-center gap-3 bg-amber-500 text-white font-black px-16 py-6 rounded-2xl uppercase text-sm"
            style={{
              transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.2s ease",
              boxShadow: "0 20px 50px rgba(245,158,11,0.2)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "scale(1.06) translateY(-3px)";
              el.style.boxShadow = "0 30px 70px rgba(245,158,11,0.35)";
              el.style.background = "#fbbf24";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "";
              el.style.boxShadow = "0 20px 50px rgba(245,158,11,0.2)";
              el.style.background = "#f59e0b";
            }}
          >
            Cadastrar-se <FiArrowRight />
          </Link>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16 border-t border-zinc-900 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center"
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "rotate(-10deg) scale(1.1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.transform = "")
              }
            >
              <FiCalendar className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-white">
              Scheduly
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">
            © 2026 — Agendamento inteligente para negócios de serviços
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            {[
              { label: "Instagram", href: "#" },
              { label: "Preços", href: "#precos" },
              { label: "Login", href: "/login" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{ transition: "color 0.2s ease" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "")
                }
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}