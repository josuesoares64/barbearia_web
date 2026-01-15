"use client";
import React from "react";

const StepClient = ({ booking, setBooking, onNext, onBack }: any) => {
  // Verifica se todos os campos estão preenchidos para liberar o botão
  const canContinue = 
    booking.first_name?.trim() && 
    booking.last_name?.trim() && 
    booking.phone?.trim();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Seus dados</h2>
      <div className="space-y-3">
        <input
          placeholder="Nome"
          className="w-full border p-2 rounded-md"
          value={booking.first_name || ""}
          onChange={(e) => setBooking({ ...booking, first_name: e.target.value })}
        />
        <input
          placeholder="Sobrenome"
          className="w-full border p-2 rounded-md"
          value={booking.last_name || ""}
          onChange={(e) => setBooking({ ...booking, last_name: e.target.value })}
        />
        <input
          placeholder="Telefone"
          className="w-full border p-2 rounded-md"
          value={booking.phone || ""}
          onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="w-1/2 border py-2 rounded-md">
          Voltar
        </button>
        <button 
          disabled={!canContinue}
          onClick={onNext} 
          className={`w-1/2 py-2 rounded-md transition-all ${
            canContinue ? "bg-black text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Revisar
        </button>
      </div>
    </div>
  );
};

export default StepClient;