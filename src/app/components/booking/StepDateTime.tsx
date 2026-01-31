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
  weekday: number; // API: 0 = Domingo, 1 = Segunda, etc.
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
          
          // Determinar quais dias da semana estão FECHADOS
          const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
          const workingDays = [...new Set(data.map(hour => hour.weekday))];
          const closed = allWeekdays.filter(day => !workingDays.includes(day));
          
          setClosedDays(closed);
          console.log("API - Dias que trabalha:", workingDays);
          console.log("API - Dias FECHADOS:", closed);
        }
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessHours();
  }, [slug]);

  // 2. CONFIGURAR DATAS MÍNIMA E MÁXIMA
  useEffect(() => {
    // ⭐ FUNÇÃO CORRETA: Obter data atual sem problemas de fuso
    const getTodayWithoutTimezone = (): string => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // ⭐ FUNÇÃO CORRETA: Adicionar dias sem problemas de fuso
    const addDaysWithoutTimezone = (dateStr: string, days: number): string => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day + days);
      
      const newYear = date.getFullYear();
      const newMonth = String(date.getMonth() + 1).padStart(2, '0');
      const newDay = String(date.getDate()).padStart(2, '0');
      
      return `${newYear}-${newMonth}-${newDay}`;
    };

    const today = getTodayWithoutTimezone();
    const maxDateStr = addDaysWithoutTimezone(today, 60);
    
    setMinDate(today);
    setMaxDate(maxDateStr);
    
    console.log("Datas configuradas:", { min: today, max: maxDateStr });
  }, []);

  // ⭐ 3. FUNÇÃO CORRETA: Obter dia da semana de uma string YYYY-MM-DD
  const getWeekdayFromDateString = (dateStr: string): number => {
    // Divide a string YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    
    // Cria data no meio-dia para evitar problemas de fuso
    const date = new Date(year, month - 1, day, 12, 0, 0);
    
    // Retorna o dia da semana: 0=Domingo, 6=Sábado
    return date.getDay();
  };

  // ⭐ 4. FUNÇÃO CORRETA: Formatar data para exibição
  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
    const weekday = getWeekdayFromDateString(dateStr);
    const weekdayName = getWeekdayName(weekday);
    
    return `${formattedDay}/${formattedMonth}/${year} (${weekdayName})`;
  };

  // ⭐ 5. FUNÇÃO CORRETA: Validar se é data passada
  const isPastDate = (dateStr: string): boolean => {
    const todayStr = minDate; // minDate já é "hoje" no formato YYYY-MM-DD
    
    // Comparação simples de strings YYYY-MM-DD
    return dateStr < todayStr;
  };

  // 6. FUNÇÃO PARA BLOQUEAR DIAS FECHADOS
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = e.target.value;
    
    if (!selectedDate) {
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    
    console.log("Data selecionada (raw):", selectedDate);
    
    // Verificar se é data PASSADA
    if (isPastDate(selectedDate)) {
      alert("⚠️ Não é possível agendar para datas passadas! Escolha uma data futura.");
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    
    // Obter dia da semana CORRETAMENTE
    const weekday = getWeekdayFromDateString(selectedDate);
    console.log("Dia da semana calculado:", {
      date: selectedDate,
      weekday: weekday,
      weekdayName: getWeekdayName(weekday)
    });
    
    // Verificar se é um dia FECHADO
    if (closedDays.includes(weekday)) {
      alert(`⚠️ A barbearia não funciona às ${getWeekdayName(weekday)}s!`);
      setBooking((prev: any) => ({ ...prev, date: "" }));
      return;
    }
    
    // Se passou nas validações, atualiza o estado
    setBooking((prev: any) => ({
      ...prev,
      date: selectedDate,
    }));
    
    console.log("Data válida selecionada:", {
      date: selectedDate,
      display: formatDateForDisplay(selectedDate)
    });
  }

  // 7. FUNÇÕES AUXILIARES
  const getWeekdayName = (weekday: number): string => {
    const days = [
      "Domingo", "Segunda", "Terça", "Quarta", 
      "Quinta", "Sexta", "Sábado"
    ];
    return days[weekday] || `Dia ${weekday}`;
  };

  // 8. RENDERIZAR DIAS FECHADOS
  const renderClosedDaysInfo = () => {
    if (closedDays.length === 0) return null;
    
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm font-medium text-red-800 mb-2">
          ⚠️ Dias da semana fechados:
        </p>
        <ul className="text-sm text-red-700 space-y-1">
          {closedDays
            .sort((a, b) => a - b)
            .map(day => (
              <li key={day} className="flex items-center">
                <span className="mr-2">•</span>
                {getWeekdayName(day)}-feira
              </li>
            ))}
        </ul>
      </div>
    );
  };

  // 9. RENDERIZAR HORÁRIOS DE FUNCIONAMENTO
  const renderBusinessHours = () => {
    if (businessHours.length === 0) return null;
    
    const hoursByDay: Record<number, BusinessHours[]> = {};
    businessHours.forEach(hour => {
      if (!hoursByDay[hour.weekday]) {
        hoursByDay[hour.weekday] = [];
      }
      hoursByDay[hour.weekday].push(hour);
    });
    
    const sortedDays = Object.keys(hoursByDay)
      .map(Number)
      .sort((a, b) => a - b);
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Horários de Funcionamento</h3>
        <div className="space-y-2">
          {sortedDays.map(weekday => (
            <div key={weekday} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-medium">{getWeekdayName(weekday)}</span>
              <div className="text-right">
                {hoursByDay[weekday].map((hour, index) => (
                  <div key={hour.id} className="text-sm text-gray-600">
                    {hour.open_time.slice(0, 5)} - {hour.close_time.slice(0, 5)}
                    {index < hoursByDay[weekday].length - 1 && " e "}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Botões Superiores */}
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => router.push(`/${slug}/meus-agendamentos`)}
          className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md border border-gray-300 transition-all"
        >
          🔍 MEUS AGENDAMENTOS
        </button>
        <button 
          type="button"
          onClick={() => router.push(`/login`)}
          className="flex-1 flex items-center justify-center gap-2 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md border border-gray-300 transition-all"
        >
          👤 ÁREA PROFISSIONAL
        </button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">
            Ou agende um horário
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Escolha a data</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-3 text-gray-600">Carregando horários...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione uma data disponível:
              </label>
              
              {/* INPUT COM DATAS CORRETAS */}
              <input
                type="date"
                value={booking.date || ""}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-black outline-none"
              />
              
              {/* EXIBIÇÃO CORRETA DA DATA SELECIONADA */}
              <div className="mt-3 space-y-2">
                {booking.date && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">
                      ✅ {formatDateForDisplay(booking.date)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Clique em "Próximo" para continuar
                    </p>
                  </div>
                )}
                
                <div className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium text-blue-800 mb-2">📅 Período disponível:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>De <strong>{formatDateForDisplay(minDate)}</strong> até <strong>{formatDateForDisplay(maxDate)}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Exceto dias passados e dias fechados</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Mostrar dias fechados */}
            {renderClosedDaysInfo()}
            
            {/* Mostrar horários de funcionamento */}
            {renderBusinessHours()}
          </>
        )}

        <button
          type="button"
          disabled={!booking.date}
          onClick={onNext}
          className={`w-full py-3 rounded-md font-bold transition-all mt-6 ${
            booking.date
              ? "bg-black text-white cursor-pointer hover:bg-gray-800" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
          }`}
        >
          {booking.date ? "Próximo →" : "Selecione uma data"}
        </button>
      </div>
    </div>
  );
};

export default StepDateTime;