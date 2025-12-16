import React from "react";

type Booking = {
  date: string;
  service: string;
  professional: string;
  time: string;
  name: string;
  phone: string;
};

type StepClientProps = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  onBack: () => void;
  onFinish: () => void;
};

const StepClient = ({
  booking,
  setBooking,
  onBack,
  onFinish,
}: StepClientProps) => {
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((prev: Booking) => ({
      ...prev,
      name: e.target.value,
    }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((prev: Booking) => ({
      ...prev,
      phone: e.target.value,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Seus dados</h2>

      <input
        type="text"
        placeholder="Seu nome e Sobrenome"
        value={booking.name}
        onChange={handleNameChange}
        className="w-full border p-3 rounded-md"
      />

      <input
        type="tel"
        placeholder="Telefone / WhatsApp"
        value={booking.phone}
        onChange={handlePhoneChange}
        className="w-full border p-3 rounded-md"
      />

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="w-1/2 border border-black py-2 rounded-md"
        >
          Voltar
        </button>

        <button
          disabled={!booking.name || !booking.phone}
          onClick={onFinish}
          className="w-1/2 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default StepClient;
