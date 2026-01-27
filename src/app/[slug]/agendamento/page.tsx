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

  // 1. Carregar Profissionais
  useEffect(() => {
    async function loadProfessionals() {
      if (!slug) return;
      try {
        // ROTA CORRETA: Esta já está certa
        const res = await fetch(`http://localhost:3000/barbershops/${slug}/barbers`);
        const data = await res.json();
        setProfessionals(data);
      } catch (err) {
        console.error("Erro profissionais:", err);
      }
    }
    loadProfessionals();
  }, [slug]);

  // 2. Buscar Horários Disponíveis
useEffect(() => {
  async function fetchAvailability() {
    // Verifique se todos os IDs estão presentes
    if (booking.barber_id && booking.date && booking.service_id) {
      try {
        // Ajuste 1: Removi a barra extra antes da '?' 
        // Ajuste 2: Mudei o parâmetro de 'date' para 'data' para bater com seu teste do Postman
        const url = `http://localhost:3000/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
        
        console.log("🔍 Chamando API:", url);
        
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Se a API retornar erro de sintaxe (como o que vimos no Postman), 
        // esse check vai evitar que o código quebre tentando dar .json() no erro
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Erro na resposta da API:", errorText);
          return;
        }

        const times = await res.json();
        console.log("📅 Horários recebidos:", times);
        
        setAvailableTimes(Array.isArray(times) ? times : []);
      } catch (err) {
        console.error("Erro na requisição de disponibilidade:", err);
      }
    }
  }
  fetchAvailability();
}, [booking.barber_id, booking.date, booking.service_id, slug]);

  const handleFinalizeBooking = async () => {
  // FORCE isEditing a ser false para garantir que caia no POST / (CREATE)
  const isEditing = false; 

  const payload = {
    barber_id: booking.barber_id,
    service_id: booking.service_id,
    appointment_date: booking.date,
    appointment_time: booking.time,
    client_name: `${booking.first_name} ${booking.last_name}`.trim(),
    client_phone: booking.phone,
  };

  // Sem o ID no final da URL
  const url = `http://localhost:3000/barbershops/${slug}/appointment`;

  try {
    const response = await fetch(url, {
      method: "POST", // FORCE POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("RESPOSTA DO CREATE:", result);

    if (response.ok) {
       alert("Agora sim! Criou um novo.");
       window.location.href = `/${slug}/meus-agendamentos`;
    }
  } catch (e) { console.error(e); }
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

      {/* 3. SERVIÇO */}
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