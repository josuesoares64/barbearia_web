"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function MeusAgendamentos() {
  const { slug } = useParams();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({
    barber_id: "",
    service_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  // 🔹 dados da API
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  /* ===============================
     BUSCAR AGENDAMENTOS (NÃO MEXE)
  =============================== */
  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);

    try {
      const res = await fetch(
        `NEXT_PUBLIC_API_URL/barbershops/${slug}/appointment/check/${phone}`
      );
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : [data]);
    } catch {
      alert("Erro ao buscar agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CANCELAR (NÃO MEXE)
  =============================== */
  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;

    try {
      const res = await fetch(
        `NEXT_PUBLIC_API_URL/barbershops/${slug}/appointment/cancel/client`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telefone: phone }),
        }
      );

      if (res.ok) {
        alert("Agendamento cancelado com sucesso!");
        setAppointments((prev) =>
          prev.filter((app) => app.id !== appointmentId)
        );
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao cancelar.");
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  /* ===============================
     ABRIR EDIÇÃO
  =============================== */
  const handleEdit = async (app: any) => {
    setEditingId(app.id);

    setEditData({
      barber_id: app.barber_id,
      service_id: app.service_id,
      appointment_date: app.appointment_date,
      appointment_time: app.appointment_time.slice(0, 5),
    });

    const [barbersRes, servicesRes] = await Promise.all([
      fetch(`NEXT_PUBLIC_API_URL/barbershops/${slug}/barbers`),
      fetch(`NEXT_PUBLIC_API_URL/barbershops/${slug}/services`),
    ]);

    setBarbers(await barbersRes.json());
    setServices(await servicesRes.json());
  };

  /* ===============================
     HORÁRIOS DISPONÍVEIS
  =============================== */
  useEffect(() => {
    if (
      !editData.barber_id ||
      !editData.service_id ||
      !editData.appointment_date
    )
      return;

    async function loadAvailability() {
      const res = await fetch(
        `NEXT_PUBLIC_API_URL/barbershops/${slug}/availability?barber_id=${editData.barber_id}&service_id=${editData.service_id}&data=${editData.appointment_date}`
      );

      const data = await res.json();
      setAvailableTimes(Array.isArray(data) ? data : []);
    }

    loadAvailability();
  }, [
    editData.barber_id,
    editData.service_id,
    editData.appointment_date,
    slug,
  ]);

  /* ===============================
     SALVAR EDIÇÃO (PUT)
  =============================== */
  const handleSaveEdit = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `NEXT_PUBLIC_API_URL/barbershops/${slug}/appointment/${appointmentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao editar agendamento.");
        return;
      }

      alert("Agendamento atualizado com sucesso!");

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId
            ? {
                ...app,
                barber_id: editData.barber_id,
                service_id: editData.service_id,
                appointment_date: editData.appointment_date,
                appointment_time: editData.appointment_time,
              }
            : app
        )
      );

      setEditingId(null);
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-900 p-6 md:p-12 shadow-2xl">
        <button onClick={() => router.back()} className="mb-8 text-xs">
          ← Voltar
        </button>

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefone"
          className="w-full p-4 bg-black border mb-4"
        />

        <button onClick={handleSearch}>
          {loading ? "Buscando..." : "Buscar"}
        </button>

        <div className="mt-6 space-y-4">
          {appointments.map((app) => (
            <div key={app.id} className="border p-4">
              <p>{app.Service?.name}</p>
              <p>{app.Barber?.name}</p>
              <p>
                {app.appointment_date} {app.appointment_time}
              </p>

              {editingId === app.id && (
                <div className="mt-4 space-y-3">
                  <input
                    type="date"
                    value={editData.appointment_date}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        appointment_date: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-black border text-white outline-none bg-black text-white border-zinc-800 
  [&::-webkit-calendar-picker-indicator]:invert"
                  />

                  <select
                    value={editData.barber_id}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        barber_id: e.target.value,
                      })
                    }
                    className="w-full p-2 border bg-black text-white"
                  >
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.username}
                      </option>
                    ))}
                  </select>

                  {/* ✅ AQUI FOI A CORREÇÃO */}
                  <select
                    value={editData.service_id}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        service_id: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-black border text-white"
                  >
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() =>
                          setEditData({
                            ...editData,
                            appointment_time: time,
                          })
                        }
                        className={`p-2 border ${
                          editData.appointment_time === time
                            ? "bg-white text-black"
                            : ""
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <button onClick={() => handleSaveEdit(app.id)} className="mt-2">
                    Salvar alterações
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(app)}>Editar</button>
                <button onClick={() => handleCancel(app.id)}>Cancelar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
