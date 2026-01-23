"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepProfessional from "@/app/components/booking/StepProfessional"; // Passo 2
import StepService from "@/app/components/booking/StepService";           // Passo 3
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
  const editId = searchParams.get("edit");

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

  // 1. Carregar Profissionais (Já carrega no início para o Passo 2)
  useEffect(() => {
    async function loadProfessionals() {
      if (!slug) return;
      try {
        const res = await fetch(`http://localhost:3000/barbershops/${slug}/barbers`);
        setProfessionals(await res.json());
      } catch (err) { console.error("Erro profissionais:", err); }
    }
    loadProfessionals();
  }, [slug]);

  // 2. Buscar Horários Disponíveis (Dispara quando completa Passo 1, 2 e 3)
  useEffect(() => {
    async function fetchAvailability() {
      if (booking.barber_id && booking.date && booking.service_id) {
        try {
          const url = `http://localhost:3000/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
          const res = await fetch(url);
          const times = await res.json();
          setAvailableTimes(Array.isArray(times) ? times : []);
        } catch (err) { console.error("Erro disponibilidade:", err); }
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

    const url = editId 
      ? `http://localhost:3000/barbershops/${slug}/appointment/${editId}` 
      : `http://localhost:3000/barbershops/${slug}/appointment/`;
    
    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push(`/${slug}/meus-agendamentos`);
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) { alert("Erro de conexão"); }
  };

  return (
    <main className="max-w-xl mx-auto pt-24 p-4">
      {/* 1. DATA */}
      {step === 1 && (
        <StepDateTime booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />
      )}

      {/* 2. PROFISSIONAL */}
      {step === 2 && (
        <StepProfessional 
          professionals={professionals} 
          booking={booking} 
          setBooking={setBooking} 
          onNext={() => setStep(3)} 
          onBack={() => setStep(1)} 
        />
      )}

      {/* 3. SERVIÇO (Busca serviços do barbeiro selecionado) */}
      {step === 3 && (
        <StepService 
          services={[]} // O próprio componente busca via API interna
          slug={slug}
          booking={booking} 
          setBooking={setBooking} 
          onNext={() => setStep(4)} 
          onBack={() => setStep(2)} 
        />
      )}

      {/* 4. HORÁRIO */}
      {step === 4 && (
        <StepTime 
          times={availableTimes} 
          booking={booking} 
          setBooking={setBooking} 
          onNext={() => setStep(5)} 
          onBack={() => setStep(3)} 
        />
      )}

      {/* 5. CLIENTE */}
      {step === 5 && (
        <StepClient booking={booking} setBooking={setBooking} onBack={() => setStep(4)} onNext={() => setStep(6)} />
      )}

      {/* 6. RESUMO */}
      {step === 6 && (
        <StepSummary booking={booking} onBack={() => setStep(5)} onConfirm={handleFinalizeBooking} />
      )}
    </main>
  );
}

export default function AgendamentoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AgendamentoContent />
    </Suspense>
  );
}