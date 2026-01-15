"use client";
import React from "react";

const StepSummary = ({ booking, onBack, onConfirm }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-center border-b pb-2">Resumo do agendamento</h2>
      
      <div className="space-y-2 text-sm">
        <p><strong>Data:</strong> {booking.date}</p>
        <p><strong>Horário:</strong> {booking.time}</p>
        {/* Se o nome não aparece aqui, é porque o StepService não salvou 'service_name' */}
        <p><strong>Serviço:</strong> {booking.service_name || "Não selecionado"}</p>
        <p><strong>Profissional:</strong> {booking.barber_name || "Não selecionado"}</p>
        <p><strong>Cliente:</strong> {booking.name}</p>
        <p><strong>Telefone:</strong> {booking.phone}</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="w-1/2 border border-gray-300 py-2 rounded-md">
          Voltar
        </button>
        <button
          onClick={onConfirm}
          className="w-1/2 bg-black text-white py-2 rounded-md font-bold hover:bg-green-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default StepSummary;