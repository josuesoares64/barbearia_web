"use client";

import React from "react";
import { Booking } from "@/app/types/Booking";

type StepDateTimeProps = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
  onNext: () => void;
};

const StepDateTime = ({
  booking,
  setBooking,
  onNext,
}: StepDateTimeProps) => {
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBooking((prev: Booking) => ({
      ...prev,
      date: e.target.value,
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Escolha a data</h2>

      <input
        type="date"
        value={booking.date}
        onChange={handleDateChange}
        className="w-full border p-3 rounded-md"
      />

      <button
        disabled={!booking.date}
        onClick={onNext}
        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
      >
        Próximo
      </button>
    </div>
  );
};

export default StepDateTime;
