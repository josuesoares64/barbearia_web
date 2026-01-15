"use client";

import React from "react";
import { Booking } from "@/app/types/Booking";
import { useRouter, useParams } from "next/navigation";

type StepDateTimeProps = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>> | any; // Ajuste para aceitar o dispatch
  onNext: () => void;
};

const StepDateTime = ({
  booking,
  setBooking,
  onNext,
}: StepDateTimeProps) => {
  const router = useRouter();
  const { slug } = useParams();

  // Verificação direta para o botão
  const hasDate = booking && booking.date && booking.date !== "";

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = e.target.value;
    setBooking((prev: any) => ({
      ...prev,
      date: selectedDate,
    }));
  }

  return (
    <div className="space-y-6">
      {/* Botões Superiores */}
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => router.push(`/${slug}/meus-agendamentos`)}
          className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md border border-gray-300 transition-all"
        >
          🔍 MEUS AGENDAMENTOS
        </button>
        <button 
          type="button"
          onClick={() => router.push(`/login`)}
          className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md border border-gray-300 transition-all"
        >
          👤 ÁREA PROFISSIONAL
        </button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">
            Ou agende um horário
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Escolha a data</h2>

        <input
          type="date"
          value={booking.date || ""}
          onChange={handleDateChange}
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-black outline-none"
        />

        <button
          type="button"
          disabled={!hasDate} // Agora a validação está mais robusta
          onClick={onNext}
          className={`w-full py-3 rounded-md font-bold transition-all ${
            hasDate 
              ? "bg-black text-white cursor-pointer" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default StepDateTime;