"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MeusAgendamentos() {
  const { slug } = useParams();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/check/${phone}`);
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : [data]);
      setSearched(true);
    } catch (err) {
      alert("Erro ao buscar agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    const confirmar = confirm("Deseja realmente cancelar este agendamento?");
    if (confirmar) {
      try {
        const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/cancel/client`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telefone: phone }),
        });

        if (res.ok) {
          alert("Agendamento cancelado com sucesso!");
          setAppointments((prev) => prev.filter((app: any) => app.id !== appointmentId));
        } else {
          const data = await res.json();
          alert(data.error || "Erro ao cancelar.");
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  const handleEdit = (app: any) => {
    // MAPEAMENTO EXATO: Pegamos o que vem do banco e jogamos no formato do seu state 'booking'
    const bookingToEdit = {
      isEditing: true,
      appointment_id: app.id,
      barber_id: app.barber_id,
      barber_name: app.Barber?.name,
      service_id: app.service_id,
      service_name: app.Service?.name,
      date: app.appointment_date, // Formato YYYY-MM-DD que o input date usa
      time: app.appointment_time.slice(0, 5),
      first_name: app.Client?.first_name,
      last_name: app.Client?.last_name,
      phone: phone,
    };

    // Salvamos no LocalStorage
    localStorage.setItem("edit_booking", JSON.stringify(bookingToEdit));
    
    // Redireciona para a página onde estão os Steps
    router.push(`/${slug}/agendamento`);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-900 p-6 md:p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
        
        <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-8 hover:text-amber-500 italic flex items-center gap-2">
          ← Voltar
        </button>

        <header className="mb-10">
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic block">Control Panel</span>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
            Meus <span className="text-amber-500">Agendamentos</span>
          </h1>
        </header>

        <div className="bg-black border border-zinc-900 p-2 mb-10 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Telefone de busca"
            className="flex-1 bg-transparent p-4 font-mono font-bold text-amber-500 outline-none placeholder:text-zinc-800"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-amber-500 text-black px-10 py-4 font-black uppercase italic text-xs hover:bg-white transition-all">
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((app: any) => (
            <div key={app.id} className="bg-black border border-zinc-900 p-6 hover:border-amber-500/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div>
                  <h3 className="font-black text-xl text-white uppercase italic tracking-tighter">{app.Service?.name}</h3>
                  <p className="text-sm font-mono text-amber-500 mt-1">
                    {new Date(app.appointment_date).toLocaleDateString('pt-BR')} às {app.appointment_time.slice(0, 5)}
                  </p>
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black px-3 py-1 uppercase tracking-widest border border-amber-500/20 text-amber-500">
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleEdit(app)} className="flex-1 py-4 bg-zinc-900 text-zinc-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black italic border border-zinc-800">
                  Editar
                </button>
                <button onClick={() => handleCancel(app.id)} className="flex-1 py-4 border border-zinc-900 text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em] hover:text-red-500 hover:border-red-500/20 italic">
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}