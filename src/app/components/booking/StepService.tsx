"use client";
import React, { useState, useEffect } from "react";

interface StepServiceProps {
  booking: any;
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
  slug: string;
}

export default function StepService({ booking, setBooking, onNext, onBack, slug }: StepServiceProps) {
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!booking.barber_id || !slug) return;

    const fetchProfessionalServices = async () => {
      setLoading(true);
      try {
        // ROTA QUE VOCÊ CONFIRMOU:
        const url = `http://localhost:3000/barbershops/${slug}/barberservices/barbers/${booking.barber_id}/services`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          // Mapeia extraindo o objeto 'service'
          const professionalServices = data.map((item: any) => item.service).filter(Boolean);
          setFilteredServices(professionalServices);
        }
      } catch (error) {
        console.error("Erro fetch serviços:", error);
      } finally { setLoading(false); }
    };

    fetchProfessionalServices();
  }, [booking.barber_id, slug]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o serviço</h2>
      {loading ? (
        <p>Carregando serviços...</p>
      ) : (
        <div className="grid gap-3">
          {filteredServices.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setBooking((prev: any) => ({ ...prev, service_id: s.id, service_name: s.name }));
              }}
              className={`p-4 border rounded-lg text-left ${
                booking.service_id === s.id ? "bg-black text-white" : "bg-white"
              }`}
            >
              {s.name} - R$ {s.price}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-3 pt-4 border-t">
        <button onClick={onBack} className="w-1/2 border border-black py-2 rounded-md font-medium">Voltar</button>
        <button disabled={!booking.service_id} onClick={onNext} className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-40">Continuar</button>
      </div>
    </div>
  );
}