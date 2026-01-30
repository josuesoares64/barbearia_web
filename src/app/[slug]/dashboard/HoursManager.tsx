"use client";
import { useState, useEffect } from "react";

interface HourSlot {
  id: string;
  weekday: number;
  open_time: string;
  close_time: string;
}

const WEEKDAYS = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado"
];

export function HoursManager({ slug, token }: { slug: string; token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState<HourSlot[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ADIÇÃO: Estado para controle de acesso
  const [isOwner, setIsOwner] = useState(false);

  // ADIÇÃO: Verificação do papel do usuário no token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsOwner(payload.role?.toLowerCase() === "dono");
      } catch (e) {
        console.error(e);
      }
    }
  }, [token]);

  // Form para novo horário
  const [formData, setFormData] = useState({
    weekday: "1",
    open_time: "08:00",
    close_time: "18:00"
  });

  const fetchHours = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setHours(data.sort((a: any, b: any) => a.weekday - b.weekday || a.open_time.localeCompare(b.open_time)));
    }
  };

  useEffect(() => {
    if (isOpen) fetchHours();
  }, [isOpen]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        weekday: parseInt(formData.weekday),
        open_time: formData.open_time,
        close_time: formData.close_time
      }),
    });
    if (response.ok) {
      fetchHours();
    } else {
      alert("Erro ao salvar horário. Verifique se não há conflito.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este turno de atendimento?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchHours();
  };

  // ADIÇÃO: Trava de segurança (não renderiza nada se não for dono)
  if (!isOwner) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Horários de Funcionamento</h3>
          <p className="text-zinc-500 text-[10px]">Defina os turnos da barbearia</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-zinc-800 text-white text-[10px] font-black px-3 py-2 rounded uppercase border border-zinc-700">
          {isOpen ? "Ocultar" : "Configurar"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 space-y-6">
          {/* Form para Adicionar */}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-black/40 p-4 rounded-lg border border-zinc-800">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-400 uppercase font-bold">Dia</label>
              <select 
                value={formData.weekday} 
                onChange={e => setFormData({...formData, weekday: e.target.value})}
                className="bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white outline-none"
              >
                {WEEKDAYS.map((day, idx) => <option key={day} value={idx}>{day}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-400 uppercase font-bold">Abertura</label>
              <input type="time" value={formData.open_time} onChange={e => setFormData({...formData, open_time: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-400 uppercase font-bold">Fechamento</label>
              <input type="time" value={formData.close_time} onChange={e => setFormData({...formData, close_time: e.target.value})} className="bg-zinc-900 border border-zinc-700 rounded p-2 text-xs text-white outline-none" />
            </div>
            <button type="submit" disabled={loading} className="self-end bg-amber-500 text-black text-[10px] font-black py-2.5 rounded uppercase">
              {loading ? "..." : "Adicionar Turno"}
            </button>
          </form>

          {/* Listagem por Dias */}
          <div className="grid gap-2">
            {WEEKDAYS.map((dayName, index) => {
              const daySlots = hours.filter(h => h.weekday === index);
              return (
                <div key={dayName} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-zinc-800/20 border border-zinc-800 rounded-lg gap-3">
                  <span className="text-white text-xs font-bold uppercase w-32">{dayName}</span>
                  
                  <div className="flex-1 flex flex-wrap gap-2">
                    {daySlots.length > 0 ? (
                      daySlots.map(slot => (
                        <div key={slot.id} className="bg-black border border-zinc-700 px-3 py-1.5 rounded flex items-center gap-3">
                          <span className="text-amber-500 text-[10px] font-mono">
                            {slot.open_time.slice(0, 5)} - {slot.close_time.slice(0, 5)}
                          </span>
                          <button onClick={() => handleDelete(slot.id)} className="text-red-500 hover:text-red-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-zinc-600 text-[10px] uppercase font-bold italic">Fechado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}