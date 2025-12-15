"use client";

import { useEffect, useState } from "react";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepService from "@/app/components/booking/StepService";
import StepProfessional from "@/app/components/booking/StepProfessional";
import StepTime from "@/app/components/booking/StepTime";
import StepClient from "@/app/components/booking/StepClient";
import StepSummary from "@/app/components/booking/StepSummary";

export default function AgendamentoPage() {
  // Controla em qual passo o usuário está
  const [step, setStep] = useState(1);

  // Guarda TODOS os dados do agendamento
  const [booking, setBooking] = useState({
    date: "",
    service: "",
    professional: "",
    time: "",
    name: "",
    phone: "",
  });

  // Dados que virão do backend futuramente
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  // Horários disponíveis (por enquanto fixos)
  const availableTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

  // Simula chamada ao backend
  useEffect(() => {
    function loadData() {
      const servicesData = [
        { id: 1, name: "Corte", duration: 30 },
        { id: 2, name: "Barba", duration: 20 },
        { id: 3, name: "Corte + Barba", duration: 50 },
      ];

      const professionalsData = [
        { id: 1, name: "João" },
        { id: 2, name: "Carlos" },
        { id: 3, name: "Marcos" },
      ];

      setServices(servicesData);
      setProfessionals(professionalsData);
    }

    loadData();
  }, []);

  return (
    <main className="max-w-xl mx-auto pt-24 p-4">
      {/* PASSO 1 - DATA */}
      {step === 1 && (
        <StepDateTime
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(2)}
        />
      )}

      {/* PASSO 2 - SERVIÇO */}
      {step === 2 && (
        <StepService
          services={services}
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(3)}
        />
      )}

      {/* PASSO 3 - PROFISSIONAL */}
      {step === 3 && (
        <StepProfessional
          professionals={professionals}
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(4)}
        />
      )}

      {/* PASSO 4 - HORÁRIO */}
      {step === 4 && (
        <StepTime
          times={availableTimes}
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(5)}
        />
      )}

      {/* PASSO 5 - CLIENTE */}
      {step === 5 && (
        <StepClient
          booking={booking}
          setBooking={setBooking}
          onBack={() => setStep(4)}
          onFinish={() => setStep(6)}
        />
      )}

      {/* PASSO 6 - RESUMO */}
      {step === 6 && (
        <StepSummary
          booking={booking}
          onBack={() => setStep(5)}
          onConfirm={() => {
            console.log("AGENDAMENTO CONFIRMADO:", booking);
          }}
        />
      )}

      {/* DEBUG - VISUALIZAR DADOS
      <pre className="mt-8 bg-gray-100 p-3 text-xs rounded">
        {JSON.stringify(booking, null, 2)}
      </pre> */}
    </main>
  );
}
