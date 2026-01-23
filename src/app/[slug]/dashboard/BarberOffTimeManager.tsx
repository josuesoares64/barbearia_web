"use client";
import { useState, useEffect } from "react";

interface BlockedTime {
  id: string;
  barber_id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  barber?: { username: string }; // Útil para listar quem está de folga
}

export function BarberOffTimeManager({ slug, token, barbers }: { slug: string; token: string; barbers: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  
  const [formData, setFormData] = useState({
    barber_id: "",
    date: "",
    start_time: "08:00",
    end_time: "19:00",
    is_full_day: true,
    reason: "Folga/Ausência"
  });

  const fetchBlockedTimes = async () => {
    try {
      // Ajuste na URL para pegar todos os bloqueios da barbearia
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/blocked-times`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setBlockedTimes(await res.json());
    } catch (err) {
      console.error("Erro ao carregar bloqueios", err);
    }
  };

  const handleBlockTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.barber_id || !formData.date) return alert("Preencha barbeiro e data");

    setLoading(true);

    // Ajustamos os horários se for "Dia Inteiro" para o Back-end entender
    const payload = {
      date: formData.date,
      start_time: formData.is_full_day ? "00:00" : formData.start_time,
      end_time: formData.is_full_day ? "23:59" : formData.end_time,
      reason: formData.reason
    };

    try {
      // A URL precisa do barber_id conforme sua rota no Express
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers/${formData.barber_id}/blocked-times`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Horário bloqueado com sucesso!");
        fetchBlockedTimes();
        setFormData({ ...formData, date: "", is_full_day: true }); // Reset parcial
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlock = async (id: string) => {
    if (!confirm("Remover bloqueio e liberar horários?")) return;
    
    // Note: Verifique se sua rota de DELETE no back-end também exige o barber_id na URL
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/blocked-times/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBlockedTimes();
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Folgas e Ausências</h3>
          <p className="text-zinc-500 text-[10px]">Bloqueie horários específicos por barbeiro</p>
        </div>
        <button
          onClick={() => { setIsOpen(!isOpen); if(!isOpen) fetchBlockedTimes(); }}
          className="bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-black px-3 py-2 rounded uppercase"
        >
          {isOpen ? "Fechar" : "Gerenciar Folgas"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
          <form onSubmit={handleBlockTime} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Barbeiro</label>
              <select 
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white"
                value={formData.barber_id}
                onChange={e => setFormData({...formData, barber_id: e.target.value})}
                required
              >
                <option value="">Selecione...</option>
                {barbers.filter(b => b.is_active !== false).map(b => (
                  <option key={b.id} value={b.id}>{b.name || b.username}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Data da Ausência</label>
              <input 
                type="date" 
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2 py-2">
              <input 
                type="checkbox" 
                id="fullDay"
                checked={formData.is_full_day}
                onChange={e => setFormData({...formData, is_full_day: e.target.checked})}
              />
              <label htmlFor="fullDay" className="text-xs text-white cursor-pointer">Dia Inteiro</label>
            </div>

            {!formData.is_full_day && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Início</label>
                  <input 
                    type="time" 
                    className="bg-black border border-zinc-700 rounded p-2 text-xs text-white" 
                    value={formData.start_time}
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold">Fim</label>
                  <input 
                    type="time" 
                    className="bg-black border border-zinc-700 rounded p-2 text-xs text-white" 
                    value={formData.end_time}
                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="md:col-span-2 bg-amber-500 disabled:bg-zinc-700 text-black text-[10px] font-black py-2 rounded uppercase transition-colors">
              {loading ? "Processando..." : "Confirmar Bloqueio"}
            </button>
          </form>

          <div className="mt-4">
            <h4 className="text-white text-xs font-bold mb-2 uppercase">Bloqueios Ativos</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {blockedTimes.length === 0 && <p className="text-zinc-600 text-[10px]">Nenhum bloqueio para os próximos dias.</p>}
              {blockedTimes.map(block => (
                <div key={block.id} className="flex justify-between items-center bg-black/40 p-2 rounded border border-zinc-800">
                  <div className="text-[10px]">
                    <p className="text-white font-bold">
                      {/* Corrigindo a exibição da data para não foder com fuso horário no front */}
                      {block.date.split('-').reverse().join('/')} 
                    </p>
                    <p className="text-zinc-500">
                      {block.start_time.substring(0,5)} - {block.end_time.substring(0,5)}
                    </p>
                  </div>
                  <button onClick={() => deleteBlock(block.id)} className="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold transition-colors">Remover</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}