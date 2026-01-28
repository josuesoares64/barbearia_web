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

const StepDateTime = ({
  booking,
  setBooking,
  onNext,
}: StepDateTimeProps) => {
  const router = useRouter();
  const { slug } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [closedDays, setClosedDays] = useState<number[]>([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // --- LÓGICA PRESERVADA (SEM ALTERAÇÕES) ---
  useEffect(() => {
    const fetchBusinessHours = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/barbershops/${slug}/hours`);
        if (response.ok) {
          const data: BusinessHours[] = await response.json();
          setBusinessHours(data);
          const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
          const workingDays = [...new Set(data.map(hour => hour.weekday))];
          const closed = allWeekdays.filter(day => !workingDays.includes(day));
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

  useEffect(() => {
    const getTodayWithoutTimezone = (): string => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const addDaysWithoutTimezone = (dateStr: string, days: number): string => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day + days);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const today = getTodayWithoutTimezone();
    setMinDate(today);
    setMaxDate(addDaysWithoutTimezone(today, 60));
  }, []);

  const getWeekdayFromDateString = (dateStr: string): number => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date.getDay();
  };

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-').map(Number);
    const weekday = getWeekdayFromDateString(dateStr);
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} (${getWeekdayName(weekday)})`;
  };

  const isPastDate = (dateStr: string): boolean => dateStr < minDate;

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    if (isPastDate(selectedDate)) {
      alert("⚠️ Não é possível agendar para datas passadas!");
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    const weekday = getWeekdayFromDateString(selectedDate);
    if (closedDays.includes(weekday)) {
      alert(`⚠️ A barbearia não funciona às ${getWeekdayName(weekday)}s!`);
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    setBooking((prev: any) => ({ ...prev, date: selectedDate }));
  }

  const getWeekdayName = (weekday: number): string => {
    return ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][weekday] || "";
  };
  // --- FIM DA LÓGICA PRESERVADA ---

  // RENDERIZAR HORÁRIOS COM VISUAL PREMIUM
  const renderBusinessHours = () => {
    if (businessHours.length === 0) return null;
    const hoursByDay: Record<number, BusinessHours[]> = {};
    businessHours.forEach(hour => {
      if (!hoursByDay[hour.weekday]) hoursByDay[hour.weekday] = [];
      hoursByDay[hour.weekday].push(hour);
    });

    return (
      <div className="mt-8 pt-6 border-t border-zinc-900">
        <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 mb-4 italic">Expediente</h3>
        <div className="space-y-2">
          {Object.keys(hoursByDay).map(Number).sort().map(weekday => (
            <div key={weekday} className="flex justify-between items-center py-2 border-b border-zinc-900/50">
              <span className="text-[11px] font-bold uppercase tracking-tight text-zinc-400">{getWeekdayName(weekday)}</span>
              <div className="text-right text-[11px] font-mono text-zinc-500">
                {hoursByDay[weekday].map((h, i) => (
                  <span key={h.id}>{h.open_time.slice(0, 5)} - {h.close_time.slice(0, 5)}{i < hoursByDay[weekday].length - 1 && " / "}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* BOTÕES SUPERIORES MINIMALISTAS */}
      <div className="flex gap-3">
        <button 
          onClick={() => router.push(`/${slug}/meus-agendamentos`)}
          className="flex-1 text-[9px] font-black tracking-[0.2em] bg-zinc-950 text-zinc-500 border border-zinc-900 py-4 uppercase italic hover:text-white hover:border-zinc-700 transition-all"
        >
          Meus Agendamentos
        </button>
        <button 
          onClick={() => router.push(`/login`)}
          className="flex-1 text-[9px] font-black tracking-[0.2em] bg-zinc-950 text-zinc-500 border border-zinc-900 py-4 uppercase italic hover:text-white hover:border-zinc-700 transition-all"
        >
          Área Profissional
        </button>
      </div>

      <div className="relative flex justify-center items-center py-4">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-900"></span></div>
        <span className="relative bg-[#050505] px-4 text-[9px] uppercase font-black tracking-[0.4em] text-zinc-700 italic">Reserva de Horário</span>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600 animate-pulse italic">Sincronizando Agenda</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 ml-1 italic block">
                Selecione a Data
              </label>
              
              <div className="relative group">
                <input
                  type="date"
                  value={booking.date || ""}
                  onChange={handleDateChange}
                  onClick={(e) => e.currentTarget.showPicker()}
                  min={minDate}
                  max={maxDate}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-zinc-950 border border-zinc-900 text-white p-5 rounded-none uppercase font-black italic tracking-widest focus:border-amber-500 focus:outline-none transition-all cursor-pointer appearance-none"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity">
                  📅
                </div>
              </div>
              
              {booking.date && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 text-center animate-in zoom-in-95 duration-300">
                  <p className="text-[11px] text-amber-500 font-black uppercase italic tracking-[0.2em]">
                    ✅ {formatDateForDisplay(booking.date)}
                  </p>
                </div>
              )}

              {/* INFO DE PERÍODO */}
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-none">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
                  <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 italic">
                    Agenda disponível até {formatDateForDisplay(maxDate).split(' ')[0]}
                  </p>
                </div>
              </div>
            </div>
            
            {closedDays.length > 0 && (
               <div className="bg-zinc-950 p-4 border-l-2 border-amber-900/30 italic">
                  <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Nota da Casa:</p>
                  <p className="text-[10px] text-zinc-500">Estamos fechados aos {closedDays.map(d => getWeekdayName(d)).join(", ")}s.</p>
               </div>
            )}
            
            {renderBusinessHours()}
          </>
        )}

        {/* BOTÃO DE PRÓXIMO PASSO */}
        <button
          type="button"
          disabled={!booking.date}
          onClick={onNext}
          className={`w-full py-5 font-black uppercase italic tracking-[0.3em] transition-all relative overflow-hidden group mt-10
            ${booking.date 
              ? "bg-amber-500 text-black hover:bg-white active:scale-[0.98] shadow-lg shadow-amber-500/10" 
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50"
            }`}
        >
          <span className="relative z-10">{booking.date ? "Próximo Passo →" : "Aguardando Data"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>
    </div>
  );
};

export default StepDateTime;