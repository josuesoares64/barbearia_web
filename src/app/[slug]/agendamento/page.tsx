"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepProfessional from "@/app/components/booking/StepProfessional";
import StepService from "@/app/components/booking/StepService";
import StepTime from "@/app/components/booking/StepTime";
import StepClient from "@/app/components/booking/StepClient";
import StepSummary from "@/app/components/booking/StepSummary";

export type Booking = {
  date: string;
  service_id: number | null;
  service_name: string;
  barber_id: number | null;
  barber_name: string;
  time: string;
  first_name: string;
  last_name: string;
  phone: string;
  name: string;
};

function AgendamentoContent() {
  const { slug } = useParams();

  const [step, setStep] = useState(1);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<any[]>([]);

  const [booking, setBooking] = useState<Booking>({
    date: "",
    service_id: null,
    service_name: "",
    barber_id: null,
    barber_name: "",
    time: "",
    first_name: "",
    last_name: "",
    name: "",
    phone: "",
  });

  /* ===============================
     🔥 PRELOAD AUTOMÁTICO (EDITAR)
     Agora começa no STEP 1
  =============================== */
  useEffect(() => {
    const stored = localStorage.getItem("edit_booking");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    setBooking({
      date: parsed.date,
      service_id: parsed.service_id,
      service_name: parsed.service_name,
      barber_id: parsed.barber_id,
      barber_name: parsed.barber_name,
      time: parsed.time,
      first_name: parsed.first_name || "",
      last_name: parsed.last_name || "",
      phone: parsed.phone,
      // ADICIONE ESTA LINHA ABAIXO PARA MATAR O ERRO
      name: parsed.name || `${parsed.first_name || ""} ${parsed.last_name || ""}`.trim(),
    });

    setStep(1);
    localStorage.removeItem("edit_booking");
  }, []);

  /* ===============================
     PROFISSIONAIS
  =============================== */
  useEffect(() => {
    async function loadProfessionals() {
      if (!slug) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers`
      );
      const data = await res.json();
      setProfessionals(data);
    }
    loadProfessionals();
  }, [slug]);

  /* ===============================
     HORÁRIOS DISPONÍVEIS
  =============================== */
  useEffect(() => {
    async function fetchAvailability() {
      if (!booking.barber_id || !booking.date || !booking.service_id) return;

      const url = `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
      const res = await fetch(url);
      const times = await res.json();
      setAvailableTimes(Array.isArray(times) ? times : []);
    }

    fetchAvailability();
  }, [booking.barber_id, booking.date, booking.service_id, slug]);

  const handleFinalizeBooking = async () => {
  const payload = {
  barber_id: booking.barber_id,
  service_id: booking.service_id,
  appointment_date: booking.date,   // 🔥 MAPEAMENTO
  appointment_time: booking.time,   // 🔥 MAPEAMENTO
  client_name: `${booking.first_name} ${booking.last_name}`.trim(),
  client_phone: booking.phone.replace(/\D/g, ""),
};


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/appointment`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error("Erro ao criar agendamento:", error);
    alert(error.message || "Erro ao criar agendamento");
    return;
  }

  window.location.href = `/${slug}/meus-agendamentos`;
};


  return (
    <div className="min-h-screen bg-black text-white">
    <main className="max-w-xl mx-auto pt-24 p-4">
      {step === 1 && (
        <StepDateTime
          booking={booking as any}
          setBooking={setBooking}
          onNext={() => setStep(2)}
        />
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
          slug={slug as string}
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
    </main>
    </div>
  );
}

export default function AgendamentoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AgendamentoContent />
    </Suspense>
  );
}
