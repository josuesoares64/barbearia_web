"use client";
import React from "react";

export default function StepService({ services, booking, setBooking, onNext, onBack }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o serviço</h2>
      <div className="grid gap-3">
        {services.map((s: any) => {
          const isSelected = booking.service_id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setBooking((prev: any) => ({
                ...prev,
                service_id: s.id,
                service_name: s.name
              }))}
              className={`p-4 border rounded-md text-left transition ${isSelected ? "border-black bg-gray-100" : "border-gray-300"}`}
            >
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-500">Duração: {s.duration_minutes || s.duration} min</p>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="w-1/2 border border-black py-2 rounded-md">Voltar</button>
        <button disabled={!booking.service_id} onClick={onNext} className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50">Continuar</button>
      </div>
    </div>
  );
}