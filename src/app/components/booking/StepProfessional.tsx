// StepProfessional.tsx
"use client";
import React from "react";

export default function StepProfessional({ 
  professionals, 
  booking, 
  setBooking, 
  onNext, 
  onBack,
  slug 
}: any) {
  const handleSelectProfessional = (p: any) => {
    setBooking((prev: any) => ({
      ...prev,
      barber_id: p.id,
      barber_name: p.username || p.name,
      service_id: null, // Reseta o serviço ao mudar de profissional
      service_name: ""
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o profissional</h2>
      
      <div className="grid gap-3">
        {professionals.map((p: any) => {
          const isSelected = booking.barber_id === p.id;
          const displayName = p.username || p.name;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectProfessional(p)}
              className={`p-4 border rounded-md text-left transition ${
                isSelected ? "border-black bg-gray-100" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <p className="font-semibold">{displayName}</p>
              <p className="text-sm text-gray-500">
                {p.role === 'dono' ? '👑 Dono' : '✂️ Barbeiro'}
              </p>
            </button>
          );
        })}
      </div>
      
      <div className="flex gap-3 pt-4">
        <button 
          onClick={onBack} 
          className="w-1/2 border border-black py-2 rounded-md hover:bg-gray-50 transition"
        >
          Voltar
        </button>
        <button 
          disabled={!booking.barber_id} 
          onClick={onNext} 
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}