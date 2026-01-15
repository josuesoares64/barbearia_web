"use client";

import React from "react";

type StepTimeProps = {
  times: string[]; // Horários que vieram da API (AvailabilityController)
  booking: any;
  setBooking: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
};

const StepTime = ({
  times,
  booking,
  setBooking,
  onNext,
  onBack,
}: StepTimeProps) => {
  function handleSelectTime(time: string) {
    setBooking((prev: any) => ({
      ...prev,
      time: time,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha o horário</h2>
      
      {times.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => handleSelectTime(time)}
              className={`p-3 border rounded-md text-center transition ${
                booking.time === time
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-sm">
          Não há horários disponíveis para este profissional nesta data.
        </p>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="w-1/2 border border-black py-2 rounded-md"
        >
          Voltar
        </button>

        <button
          disabled={!booking.time}
          onClick={onNext}
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default StepTime;