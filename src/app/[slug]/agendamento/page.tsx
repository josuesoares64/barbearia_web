"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

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
  first_name: string; 
  last_name: string;
  phone: string;
};

// Criamos um componente interno para usar o useSearchParams com segurança
function AgendamentoContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const slug = params.slug;
  const editId = searchParams.get("edit"); // Captura o ?edit=ID da URL

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
    first_name: "", 
    last_name: "",
    phone: "",
  });

  // 1. CARREGAR DADOS DE EDIÇÃO (Caso exista editId)
  useEffect(() => {
    async function loadEditData() {
      if (!editId) return;
      try {
        const res = await fetch(`http://localhost:3000/appointments/${editId}`);
        const data = await res.json();
        
        if (res.ok) {
          setBooking({
            date: data.appointment_date,
            service_id: data.service_id,
            service_name: data.Service?.name || "",
            barber_id: data.barber_id,
            barber_name: data.User?.username || "",
            time: data.appointment_time.slice(0, 5),
            first_name: data.Client?.first_name || "",
            last_name: data.Client?.last_name || "",
            phone: data.Client?.phone || "",
          });
        }
      } catch (err) {
        console.error("Erro ao carregar dados para edição", err);
      }
    }
    loadEditData();
  }, [editId]);

  // 2. CARREGAR SERVIÇOS E PROFISSIONAIS
  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        setLoading(true);
        const [resS, resB] = await Promise.all([
          fetch(`http://localhost:3000/barbershops/${slug}/services`),
          fetch(`http://localhost:3000/barbershops/${slug}/barbers`),
        ]);
        setServices(await resS.json());
        setProfessionals(await resB.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // 3. BUSCAR DISPONIBILIDADE
  useEffect(() => {
    async function fetchAvailability() {
      if (booking.barber_id && booking.date && booking.service_id) {
        try {
          const url = `http://localhost:3000/barbershops/${slug}/availability?barber_id=${booking.barber_id}&service_id=${booking.service_id}&data=${booking.date}`;
          const res = await fetch(url);
          const times = await res.json();
          setAvailableTimes(Array.isArray(times) ? times : []);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchAvailability();
  }, [booking.barber_id, booking.date, booking.service_id, slug]);

  // 4. FINALIZAR (CRIAÇÃO OU EDIÇÃO)
  const handleFinalizeBooking = async () => {
    // Monta o objeto com os dados do formulário
    const payload = {
      barber_id: booking.barber_id,
      service_id: booking.service_id,
      appointment_date: booking.date,
      appointment_time: booking.time,
      client_name: `${booking.first_name} ${booking.last_name}`.trim(),
      client_phone: booking.phone,
    };

    // 1. DEFINIÇÃO DA URL:
    // Se editId existe, adicionamos o ID ao final da rota da barbearia.
    // Se não, usamos a rota de criação padrão.
    const url = editId 
      ? `http://localhost:3000/barbershops/${slug}/appointment/${editId}` 
      : `http://localhost:3000/barbershops/${slug}/appointment/`;
    
    // 2. DEFINIÇÃO DO MÉTODO:
    // PUT para atualizar um registro existente, POST para criar um novo.
    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editId ? "Agendamento atualizado com sucesso!" : "Agendamento realizado com sucesso!");
        
        if (editId) {
          // Se foi edição, volta para a tela de consulta do cliente
          router.push(`/${slug}/meus-agendamentos`);
        } else {
          // Se foi agendamento novo, limpa o estado e volta para o primeiro passo
          setBooking({
            date: "",
            service_id: null,
            service_name: "",
            barber_id: null,
            barber_name: "",
            time: "",
            first_name: "",
            last_name: "",
            phone: ""
          });
          setStep(1);
        }
      } else {
        // Tenta capturar a mensagem de erro vinda do seu Controller (ex: conflito de horário)
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || "Ocorreu um erro ao processar o agendamento"}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor. Verifique se o backend está rodando e se a rota está correta.");
    }
  };

  return (
    <main className="max-w-xl mx-auto pt-24 p-4">
      {step === 1 && <StepDateTime booking={booking} setBooking={setBooking} onNext={() => setStep(2)} />}
      {step === 2 && <StepService services={services} booking={booking} setBooking={setBooking} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepProfessional professionals={professionals} booking={booking} setBooking={setBooking} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <StepTime times={availableTimes} booking={booking} setBooking={setBooking} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <StepClient booking={booking} setBooking={setBooking} onBack={() => setStep(4)} onNext={() => setStep(6)} />}
      {step === 6 && <StepSummary booking={booking} onBack={() => setStep(5)} onConfirm={handleFinalizeBooking} />}
    </main>
  );
}

// Export default com Suspense para evitar erros de build com useSearchParams
export default function AgendamentoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AgendamentoContent />
    </Suspense>
  );
}