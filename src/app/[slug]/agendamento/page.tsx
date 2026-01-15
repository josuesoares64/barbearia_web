"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepService from "@/app/components/booking/StepService";
import StepProfessional from "@/app/components/booking/StepProfessional";
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
  name: string;
  phone: string;
};

export default function AgendamentoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug; 

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [booking, setBooking] = useState<Booking>({
    date: "",
    service_id: null,
    service_name: "",
    barber_id: null,
    barber_name: "",
    time: "",
    name: "",
    phone: "",
  });

  // Carrega dados iniciais
  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const [resS, resB] = await Promise.all([
          fetch(`http://localhost:3000/barbershops/${slug}/services`),
          fetch(`http://localhost:3000/barbershops/${slug}/barbers`)
        ]);
        setServices(await resS.json());
        setProfessionals(await resB.json());
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    loadData();
  }, [slug]);

  // Busca disponibilidade conforme escolhe serviço/barbeiro/data
  useEffect(() => {
    async function fetchAvailability() {
      if (booking.barber_id && booking.date && booking.service_id) {
        try {
          const url = `http://localhost:3000/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
          const res = await fetch(url);
          const times = await res.json();
          setAvailableTimes(Array.isArray(times) ? times : []);
        } catch (err) { console.error(err); }
      }
    }
    fetchAvailability();
  }, [booking.barber_id, booking.date, booking.service_id, slug]);

  // FINALIZAR AGENDAMENTO
const handleFinalizeBooking = async () => {
  try {
    // 1. Montamos o objeto EXATAMENTE como você pediu
    const payload = {
      barber_id: booking.barber_id,        // UUID-DO-BARBEIRO
      service_id: booking.service_id,      // UUID-DO-SERVICO
      data: booking.date,                  // "2026-01-20"
      appointment_time: booking.time       // "14:00"
    };

    console.log("Enviando para o banco:", payload);

    // 2. Chamamos a sua rota específica
    const response = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload), // Envia apenas os 4 campos necessários
    });

    if (response.ok) {
      alert("Agendamento realizado com sucesso!");
      router.push(`/${slug}`);
    } else {
      // Se der erro, vamos tentar ler o que o banco respondeu de errado
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro do servidor:", errorData);
      alert(`Erro ao salvar no banco: ${errorData.message || "Verifique os dados"}`);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro de conexão com o servidor.");
  }
};

  return (
    <main className="max-w-xl mx-auto pt-24 p-4">
      {step === 1 && <StepDateTime booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />}
      {step === 2 && <StepService services={services} booking={booking} setBooking={setBooking} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepProfessional professionals={professionals} booking={booking} setBooking={setBooking} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepTime times={availableTimes} booking={booking} setBooking={setBooking} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <StepClient booking={booking} setBooking={setBooking} onBack={() => setStep(4)} onFinish={() => setStep(6)} />}
      {step === 6 && <StepSummary booking={booking} onBack={() => setStep(5)} onConfirm={handleFinalizeBooking} />}
    </main>
  );
}