"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepProfessional from "@/app/components/booking/StepProfessional";
import StepService from "@/app/components/booking/StepService";
import StepTime from "@/app/components/booking/StepTime";
import StepClient from "@/app/components/booking/StepClient";
import StepSummary from "@/app/components/booking/StepSummary";

export type Booking = {
  date: string;
  service_id: string | null;
  service_name: string;
  barber_id: string | null;
  barber_name: string;
  time: string;
  first_name: string;
  last_name: string;
  phone: string;
};

function AgendamentoContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [step, setStep] = useState(1);
  const [professionals, setProfessionals] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [booking, setBooking] = useState<Booking>({
    date: "",
    service_id: null,
    service_name: "",
    barber_id: null,
    barber_name: "",
    time: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const totalSteps = 6;

  // --- LÓGICA PRESERVADA (SEM ALTERAÇÕES) ---
  useEffect(() => {
    async function loadProfessionals() {
      if (!slug) return;
      try {
        const res = await fetch(`http://localhost:3000/barbershops/${slug}/barbers`);
        const data = await res.json();
        setProfessionals(data);
      } catch (err) {
        console.error("Erro profissionais:", err);
      }
    }
    loadProfessionals();
  }, [slug]);

  useEffect(() => {
    async function fetchAvailability() {
      if (booking.barber_id && booking.date && booking.service_id) {
        try {
          const url = `http://localhost:3000/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
          const res = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
          });
          if (!res.ok) return;
          const times = await res.json();
          setAvailableTimes(Array.isArray(times) ? times : []);
        } catch (err) {
          console.error("Erro na requisição de disponibilidade:", err);
        }
      }
    }
    fetchAvailability();
  }, [booking.barber_id, booking.date, booking.service_id, slug]);

  const handleFinalizeBooking = async () => {
    const payload = {
      barber_id: booking.barber_id,
      service_id: booking.service_id,
      appointment_date: booking.date,
      appointment_time: booking.time,
      client_name: `${booking.first_name} ${booking.last_name}`.trim(),
      client_phone: booking.phone,
    };
    const url = `http://localhost:3000/barbershops/${slug}/appointment`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        window.location.href = `/${slug}/meus-agendamentos`;
      }
    } catch (e) { console.error(e); }
  };
  // --- FIM DA LÓGICA PRESERVADA ---

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 antialiased selection:bg-amber-500 selection:text-black">
      {/* EFEITO CINEMATOGRÁFICO DE FUNDO */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-amber-500/[0.02] blur-[150px] rounded-full pointer-events-none" />
      
      <main className="relative z-10 max-w-xl mx-auto pt-32 pb-20 px-8">
        
        {/* HEADER: ELIMINADO RUÍDO, FOCO NA EXPERIÊNCIA */}
        <header className="mb-14 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-[0.6em] text-amber-500/50 mb-2">
              Appointment Flow
            </span>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Reserva <span className="text-amber-500">Privada</span>
            </h1>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950 text-[11px] font-black italic tracking-tighter">
              {step}<span className="text-zinc-600 ml-0.5">/6</span>
            </div>
          </div>
        </header>

        {/* PROGRESS BAR: LINHA DE LUZ MINIMALISTA */}
        <div className="relative h-[1px] w-full bg-zinc-900 mb-20">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* CONTAINER DINÂMICO DOS COMPONENTES */}
        <section className="min-h-[400px]">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
            {step === 1 && (
              <StepDateTime booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />
            )}

            {step === 2 && (
              <StepProfessional
                professionals={professionals}
                booking={booking}
                setBooking={setBooking}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <StepService
                services={[]}
                slug={slug}
                booking={booking}
                setBooking={setBooking}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && (
              <StepTime
                times={availableTimes}
                booking={booking}
                setBooking={setBooking}
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <StepClient 
                booking={booking} 
                setBooking={setBooking} 
                onBack={() => setStep(4)} 
                onNext={() => setStep(6)} 
              />
            )}

            {step === 6 && (
              <StepSummary 
                booking={booking} 
                onBack={() => setStep(5)} 
                onConfirm={handleFinalizeBooking} 
              />
            )}
          </div>
        </section>

        {/* FOOTER: REFINAMENTO FINAL */}
        <footer className="mt-24 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 w-full max-w-[200px]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
            <div className="w-1 h-1 bg-amber-500/40 rotate-45" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>
          <p className="text-[9px] text-zinc-700 uppercase font-black tracking-[0.7em] text-center">
            The Gentlemen's Choice
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function AgendamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-zinc-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          </div>
          <span className="text-[8px] uppercase tracking-[0.6em] text-zinc-600 animate-pulse">
            Carregando Experiência
          </span>
        </div>
      </div>
    }>
      <AgendamentoContent />
    </Suspense>
  );
}