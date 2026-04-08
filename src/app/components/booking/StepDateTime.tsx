"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "@/app/types/Booking";
import { useRouter, useParams } from "next/navigation";

type StepDateTimeProps = {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>> | any;
  onNext: () => void;
};

type BusinessHours = {
  id: string;
  weekday: number;
  open_time: string;
  close_time: string;
  barbershop_id: string;
};

const StepDateTime = ({ booking, setBooking, onNext }: StepDateTimeProps) => {
  const router = useRouter();
  const { slug } = useParams();

  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [closedDays, setClosedDays] = useState<number[]>([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // 1. CARREGAR HORÁRIOS DA API
  useEffect(() => {
    const fetchBusinessHours = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours`
        );
        if (response.ok) {
          const data: BusinessHours[] = await response.json();
          setBusinessHours(data);
          const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
          const workingDays = [...new Set(data.map((hour) => hour.weekday))];
          const closed = allWeekdays.filter((day) => !workingDays.includes(day));
          setClosedDays(closed);
        }
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinessHours();
  }, [slug]);

  // 2. CONFIGURAR DATAS
  useEffect(() => {
    const getTodayWithoutTimezone = (): string => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const addDaysWithoutTimezone = (dateStr: string, days: number): string => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day + days);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const today = getTodayWithoutTimezone();
    setMinDate(today);
    setMaxDate(addDaysWithoutTimezone(today, 60));
  }, []);

  const getWeekdayFromDateString = (dateStr: string): number => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0).getDay();
  };

  const getWeekdayName = (weekday: number): string => {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return days[weekday] || `Dia ${weekday}`;
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year} (${getWeekdayName(getWeekdayFromDateString(dateStr))})`;
  };

  const isPastDate = (dateStr: string): boolean => dateStr < minDate;

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    if (isPastDate(selectedDate)) {
      alert("Não é possível agendar para datas passadas.");
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    const weekday = getWeekdayFromDateString(selectedDate);
    if (closedDays.includes(weekday)) {
      alert(`A barbearia não funciona às ${getWeekdayName(weekday)}s.`);
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    setBooking((prev: any) => ({ ...prev, date: selectedDate }));
  }

  // Agrupar horários por dia
  const hoursByDay: Record<number, BusinessHours[]> = {};
  businessHours.forEach((hour) => {
    if (!hoursByDay[hour.weekday]) hoursByDay[hour.weekday] = [];
    hoursByDay[hour.weekday].push(hour);
  });
  const sortedDays = Object.keys(hoursByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-4 pb-24">

      {/* ── Botões superiores ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push(`/${slug}/meus-agendamentos`)}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl border border-zinc-700 transition-all"
        >
          🔍 Meus agendamentos
        </button>
        <button
          type="button"
          onClick={() => router.push(`/login?from=${slug}`)}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl border border-zinc-700 transition-all"
        >
          👤 Área profissional
        </button>
      </div>

      {/* ── Divisor ── */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-black px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            ou agende um horário
          </span>
        </div>
      </div>

      {/* ── Escolha a data ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-black uppercase tracking-tight text-white">
          Escolha a data
        </h2>

        {loading ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            <p className="text-zinc-500 text-sm">Carregando horários...</p>
          </div>
        ) : (
          <>
            {/* Input de data */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Selecione uma data disponível
              </label>
              <input
                type="date"
                value={booking.date || ""}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
                className="w-full bg-zinc-900 border border-zinc-700 text-white p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Data selecionada */}
            {booking.date && (
              <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                <span className="text-amber-500 text-lg">✓</span>
                <div>
                  <p className="text-amber-400 font-black text-sm">{formatDateForDisplay(booking.date)}</p>
                  <p className="text-amber-600 text-xs mt-0.5">Clique em "Próximo" para continuar</p>
                </div>
              </div>
            )}

            {/* Período disponível */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Período disponível
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                {formatDateForDisplay(minDate)} → {formatDateForDisplay(maxDate)}
              </div>
              {closedDays.length > 0 && (
                <div className="flex items-start gap-2 text-sm text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>
                    Fechado às{" "}
                    {closedDays
                      .sort((a, b) => a - b)
                      .map((d) => getWeekdayName(d))
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Horários de funcionamento */}
            {sortedDays.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    Horários de funcionamento
                  </p>
                </div>
                <div className="divide-y divide-zinc-800/60">
                  {sortedDays.map((weekday) => (
                    <div
                      key={weekday}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-sm font-bold text-white">
                        {getWeekdayName(weekday)}
                      </span>
                      <div className="flex flex-col items-end gap-0.5">
                        {hoursByDay[weekday].map((hour) => (
                          <span key={hour.id} className="text-xs text-amber-500 font-bold">
                            {hour.open_time.slice(0, 5)} – {hour.close_time.slice(0, 5)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Botão próximo (fixo no fundo) ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-sm border-t border-zinc-800">
        <button
          type="button"
          disabled={!booking.date}
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${
            booking.date
              ? "bg-amber-500 text-black hover:bg-amber-400 active:scale-95"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {booking.date ? "Próximo →" : "Selecione uma data"}
        </button>
      </div>
    </div>
  );
};

export default StepDateTime;