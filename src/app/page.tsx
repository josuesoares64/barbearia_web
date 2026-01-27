"use client";
import React from 'react';
import Link from 'next/link';
import { 
  FiScissors, FiCalendar, FiUsers, FiTrendingUp, 
  FiCheckCircle, FiShield, FiSearch, FiArrowRight, 
  FiClock, FiFilter, FiActivity, FiSmartphone 
} from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-amber-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <FiScissors className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Barber<span className="text-amber-500">SaaS</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <a href="#gestao" className="hover:text-amber-500 transition-colors">Gestão</a>
            <a href="#agendamento" className="hover:text-amber-500 transition-colors">Agendamento</a>
            <Link href="/login" className="bg-white text-black px-6 py-3 rounded-full hover:bg-amber-500 transition-all font-black uppercase text-[10px] tracking-widest">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            A Inteligência que <br />
            <span className="text-amber-500">sua cadeira merece.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Gestão completa de unidades, controle de faturamento individualizado e um fluxo de agendamento que pensa por você.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-amber-500 text-black font-black px-12 py-5 rounded-2xl uppercase text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all">
              Cadastrar Minha Barbearia <FiArrowRight />
            </button>
            <button className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs hover:bg-zinc-800 transition-colors">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: GESTÃO DA UNIDADE (AS 3 ABAS) */}
      <section id="gestao" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-zinc-500 font-black uppercase text-xs tracking-[0.3em] mb-4">Módulo Administrativo</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Gerencie sua unidade <br /><span className="text-amber-500">sem esforço.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <FiScissors className="text-amber-500 w-6 h-6" />
              </div>
              <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Serviços Customizados</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Crie, edite e organize seu catálogo. Defina nome, preço e o tempo exato de cada execução para alimentar nossa inteligência de agenda.</p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <FiUsers className="text-amber-500 w-6 h-6" />
              </div>
              <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Equipe & Vínculos</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Cadastre barbeiros com acessos individuais e vincule serviços específicos a cada profissional de forma dinâmica.</p>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <FiShield className="text-amber-500 w-6 h-6" />
              </div>
              <h4 className="text-xl font-black uppercase mb-4 tracking-tight">Controle de Folgas</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Bloqueie horários para a equipe toda em feriados ou defina períodos de folga por profissional. A agenda trava na hora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: DASHBOARD E FILTROS */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 order-2 md:order-1">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-2 overflow-hidden shadow-2xl shadow-amber-500/5">
              <div className="bg-black rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-4">
                    <div className="h-10 w-32 bg-zinc-900 rounded-lg border border-zinc-800 flex items-center px-3 text-[10px] font-bold text-zinc-500 uppercase"><FiFilter className="mr-2"/> 01/01 - 31/01</div>
                    <div className="h-10 w-24 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center px-3 text-[10px] font-bold text-amber-500 uppercase italic">Toda Equipe</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-900/50 p-4 rounded-xl">
                    <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Faturamento Total</p>
                    <p className="text-xl font-black text-amber-500 tracking-tighter">R$ 12.450,00</p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-xl">
                    <p className="text-[9px] text-zinc-500 uppercase font-black mb-1">Ocupação</p>
                    <p className="text-xl font-black text-white tracking-tighter">87%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-zinc-900/30 rounded flex items-center justify-between px-4 text-[9px] font-bold text-zinc-400 uppercase"><span>Corte Navalhado</span><span>Finalizado</span></div>
                  <div className="h-8 w-full bg-zinc-900/30 rounded flex items-center justify-between px-4 text-[9px] font-bold text-zinc-400 uppercase"><span>Barba Terapia</span><span className="text-red-500">Faltou</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 order-1 md:order-2">
            <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-6">Dashboard <span className="text-amber-500">Poderoso.</span></h3>
            <p className="text-zinc-400 leading-relaxed mb-8">
              O coração do seu negócio alimentado por um **filtro inteligente**. Donos visualizam o faturamento global e a performance de cada cadeira. Barbeiros acessam apenas sua própria produtividade.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300"><FiActivity className="text-amber-500" /> Status em tempo real (Pendente/Finalizado/Faltou)</li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300"><FiTrendingUp className="text-amber-500" /> Métricas de ocupação total e individual</li>
              <li className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-300"><FiSearch className="text-amber-500" /> Gestão de agendamentos com botões de ação rápida</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: AGENDAMENTO INTELIGENTE */}
      <section id="agendamento" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-6">Agenda com <span className="text-amber-500">Cérebro.</span></h3>
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

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-amber-500 text-black text-center">
        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8">Pronto para o Próximo Nível?</h3>
        <button className="bg-black text-white font-black px-16 py-6 rounded-2xl uppercase text-sm hover:scale-105 transition-all shadow-xl">
          Quero usar na minha barbearia
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-zinc-900 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2">
            <FiScissors className="text-amber-500 w-6 h-6" />
            <span className="text-lg font-black tracking-tighter uppercase text-white">BarberSaaS</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest">© 2026 - O Sistema Definitivo de Barbearias</p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Login Dono</a>
          </div>
        </div>
      </footer>
    </div>
  );
}