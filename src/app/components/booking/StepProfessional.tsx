"use client";
import React from "react";

export default function StepProfessional({ professionals, booking, setBooking, onNext, onBack }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Escolha o Profissional</h2>
      <div className="grid gap-3">
        {professionals.map((p: any) => {
          const isSelected = booking.barber_id === p.id;
          const displayName = p.username || p.name;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setBooking((prev: any) => ({
                ...prev,
                barber_id: p.id,
                barber_name: displayName
              }))}
              className={`p-4 border rounded-lg text-left ${isSelected ? "bg-zinc-900 text-white" : "bg-white border-zinc-200"}`}
            >
              <p className="font-semibold">{displayName}</p>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="w-1/2 border py-2 rounded-md">Voltar</button>
        <button disabled={!booking.barber_id} onClick={onNext} className="w-1/2 bg-zinc-900 text-white py-2 rounded-md disabled:opacity-30">Próximo</button>
      </div>
    </div>
  );
}