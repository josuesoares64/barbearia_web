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

  // FUNÇÃO PARA CANCELAR (SIM/NÃO)
  const handleCancel = async (appointmentId: string) => {
    const confirmar = confirm("Deseja realmente cancelar este agendamento? Esta ação não pode ser desfeita.");
    
    if (confirmar) {
      try {
        const res = await fetch(`http://localhost:3000/barbershops/${slug}/appointment/cancel/client`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id: appointmentId, 
            telefone: phone // Enviando o telefone como o seu controller espera
          }),
        });

        if (res.ok) {
          alert("Agendamento removido com sucesso!");
          // Remove da lista na tela para o usuário ver que sumiu
          setAppointments(appointments.filter((app: any) => app.id !== appointmentId));
        } else {
          const error = await res.json();
          alert(error.error || "Erro ao cancelar.");
        }
      } catch (err) {
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  // FUNÇÃO PARA EDITAR (REDIRECIONA PARA OS STEPS)
  const handleEdit = (app: any) => {
    // Aqui você pode redirecionar para a home passando os dados via query params
    // ou salvar no localStorage para o AgendamentoPage recuperar
    router.push(`/${slug}/agendamento?edit=${app.id}`);
  };

  return (
    <main className="max-w-xl mx-auto pt-24 p-4 min-h-screen bg-gray-50">
      <button onClick={() => router.back()} className="text-sm text-gray-500 mb-6 hover:text-black">
        ← Voltar
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <h1 className="text-2xl font-bold mb-4">Meus Agendamentos</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Seu telefone"
            className="flex-1 border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-black text-white px-6 rounded-xl font-bold">
            {loading ? "..." : "Buscar"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((app: any) => (
          <div key={app.id} className="bg-white border p-5 rounded-2xl shadow-sm border-l-4 border-l-black">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{app.Service?.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(app.appointment_date).toLocaleDateString('pt-BR')} às {app.appointment_time.slice(0, 5)}
                </p>
                <p className="text-xs text-gray-400">Cliente: {app.Client?.first_name} {app.Client?.last_name}</p>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded h-fit uppercase">
                {app.status}
              </span>
            </div>

            {/* BOTÕES LADO A LADO */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleEdit(app)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                EDITAR
              </button>
              <button 
                onClick={() => handleCancel(app.id)}
                className="flex-1 py-2.5 border border-red-100 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-all"
              >
                CANCELAR
              </button>
            </div>
          </div>
        ))}
        
        {searched && appointments.length === 0 && (
          <p className="text-center text-gray-500">Nenhum agendamento encontrado.</p>
        )}
      </div>
    </main>
  );
}