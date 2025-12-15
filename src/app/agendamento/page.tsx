"use client";

import { useEffect, useState } from "react";

import StepDateTime from "@/app/components/booking/StepDateTime";
import StepService from "@/app/components/booking/StepService";
import StepProfessional from "@/app/components/booking/StepProfessional";
import StepTime from "@/app/components/booking/StepTime";
import StepClient from "@/app/components/booking/StepClient";
import StepSummary from "@/app/components/booking/StepSummary";

/* =======================
   TIPOS (IMPORTANTES)
======================= */
type Service = {
  id: number;
  name: string;
  duration: number;
};

type Professional = {
  id: number;
  name: string;
};

type Booking = {
  date: string;
  service: string;
  professional: string;
  time: string;
  name: string;
  phone: string;
};

export default function AgendamentoPage() {
  /* =======================
     CONTROLE DE PASSO
  ======================= */
  const [step, setStep] = useState<number>(1);

  /* =======================
     ESTADO DO AGENDAMENTO
  ======================= */
  const [booking, setBooking] = useState<Booking>({
    date: "",
    service: "",
    professional: "",
    time: "",
    name: "",
    phone: "",
  });

  /* =======================
     DADOS (VIRÃO DO BACK)
  ======================= */
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  /* =======================
     HORÁRIOS DISPONÍVEIS
     (depois virão do back)
  ======================= */
  const availableTimes: string[] = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
  ];

  /* =======================
     SIMULA BACKEND
  ======================= */
  useEffect(() => {
    function loadData() {
      const servicesData: Service[] = [
        { id: 1, name: "Corte", duration: 30 },
        { id: 2, name: "Barba", duration: 20 },
        { id: 3, name: "Corte + Barba", duration: 50 },
      ];

      const professionalsData: Professional[] = [
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
          onBack={() => setStep(1)}
        />
      )}

      {/* PASSO 3 - PROFISSIONAL */}
      {step === 3 && (
        <StepProfessional
          professionals={professionals}
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {/* PASSO 4 - HORÁRIO */}
      {step === 4 && (
        <StepTime
          times={availableTimes}
          booking={booking}
          setBooking={setBooking}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
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
    </main>
  );
}
