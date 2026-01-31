"use client";
import { useState, useEffect } from "react";

export function ServiceManager({ slug, token }: { slug: string; token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("services");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barberServices, setBarberServices] = useState<BarberService[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_minutes: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [assigningService, setAssigningService] = useState<string | null>(null);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  const [isCreatingBarber, setIsCreatingBarber] = useState(false);
  const [barberFormData, setBarberFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Barbeiro"
  });

  const [togglingBarberId, setTogglingBarberId] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockFormData, setBlockFormData] = useState({
    barber_id: "",
    date: "",
    start_time: "08:00",
    end_time: "19:00",
    is_full_day: true
  });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsOwner(payload.role?.toLowerCase() === "dono");
      } catch (e) { console.error(e); }
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && slug) {
      fetchServices();
      fetchBarbersAndOwners();
      if (activeTab === "offtimes") fetchBlockedTimes();
    }
  }, [isOpen, slug, activeTab]);

  useEffect(() => {
    if (selectedBarber && activeTab === "assignments") {
      fetchBarberServices(selectedBarber);
    }
  }, [selectedBarber, activeTab]);

  const fetchServices = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setServices(await response.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleanPrice = formData.price.replace(/\./g, "").replace(",", ".");
      const payload = {
        name: formData.name,
        price: parseFloat(cleanPrice).toFixed(2),
        duration_minutes: parseInt(formData.duration_minutes),
      };
      const url = isEditing && editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        resetForm();
        fetchServices();
      }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    setDeletingId(id);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
    setDeletingId(null);
  };

  const handleEdit = (service: Service) => {
    setFormData({ name: service.name, price: service.price, duration_minutes: service.duration_minutes.toString() });
    setEditingId(service.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", duration_minutes: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  const fetchBarbersAndOwners = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers?include_inactive=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setBarbers(data.filter((u: any) => u.role.toLowerCase() === "barbeiro" || u.role.toLowerCase() === "dono"));
    }
  };

  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingBarber(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(barberFormData),
    });
    if (response.ok) {
      setBarberFormData({ username: "", email: "", password: "", role: "Barbeiro" });
      fetchBarbersAndOwners();
    }
    setIsCreatingBarber(false);
  };

  const handleToggleBarberStatus = async (barberId: string, currentStatus: boolean) => {
    if (!confirm(`Deseja realmente ${currentStatus ? "demitir" : "reativar"} este profissional?`)) return;
    setTogglingBarberId(barberId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers/${barberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (response.ok) {
        setBarbers(prev => prev.map(b => b.id === barberId ? { ...b, is_active: !currentStatus } : b));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTogglingBarberId(null);
    }
  };

  const fetchBarberServices = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/barbers/${id}/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) setBarberServices(await response.json());
  };

  const assignService = async (serviceId: string) => {
    setAssigningService(serviceId);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ barber_id: selectedBarber, service_id: serviceId }),
    });
    fetchBarberServices(selectedBarber);
    setAssigningService(null);
  };

  const removeService = async (bsId: string) => {
    setUnassigningId(bsId);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/${bsId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    fetchBarberServices(selectedBarber);
    setUnassigningId(null);
  };

  const fetchBlockedTimes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/blocked-times`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setBlockedTimes(await res.json());
    } catch (error) {
      console.error("Erro ao carregar bloqueios:", error);
    }
  };

  const handleBlockTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockFormData.date || !blockFormData.barber_id) {
      alert("Preencha barbeiro e data");
      return;
    }

    setLoading(true);
    const payload = {
      date: blockFormData.date,
      start_time: blockFormData.is_full_day ? "00:00" : blockFormData.start_time,
      end_time: blockFormData.is_full_day ? "23:59" : blockFormData.end_time,
      is_full_day: blockFormData.is_full_day
    };

    try {
      if (editingBlockId) {
        // EDIÇÃO
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/blocked-times/${editingBlockId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else if (blockFormData.barber_id === "ALL") {
        // CRIAÇÃO COLETIVA
        await Promise.all(
          barbers.map(b =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers/${b.id}/blocked-times`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload),
            })
          )
        );
      } else {
        // CRIAÇÃO INDIVIDUAL
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers/${blockFormData.barber_id}/blocked-times`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.error || "Erro ao criar bloqueio.");
        }
      }

      setBlockFormData({ barber_id: "", date: "", start_time: "08:00", end_time: "19:00", is_full_day: true });
      setEditingBlockId(null);
      fetchBlockedTimes();
    } catch (error) {
      console.error("Erro no bloqueio:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Gerenciar Unidade</h3>
          <p className="text-zinc-500 text-[10px]">Configurações Gerais</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-amber-500 text-black text-[10px] font-black px-3 py-2 rounded uppercase">{isOpen ? "Fechar" : "Gerenciar"}</button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex border-b border-zinc-800 mb-6">
            <button onClick={() => setActiveTab("services")} className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${activeTab === "services" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"}`}>Serviços</button>
            <button onClick={() => setActiveTab("assignments")} className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${activeTab === "assignments" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"}`}>Equipe</button>
            <button onClick={() => setActiveTab("offtimes")} className={`flex-1 py-2 text-xs font-bold uppercase transition-all ${activeTab === "offtimes" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"}`}>Folgas</button>
          </div>

          {activeTab === "services" && (
            <>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <input type="text" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none" required />
                <input type="text" placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none" required />
                <input type="number" placeholder="Minutos" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: e.target.value})} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none" required />
                <button type="submit" className="md:col-span-3 bg-amber-500 text-black text-[10px] font-black py-2.5 rounded uppercase">{isEditing ? "Atualizar" : "Adicionar"}</button>
              </form>
              <div className="grid gap-2">
                {services.map(s => (
                  <div key={s.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center text-xs">
                    <div><p className="text-white font-bold">{s.name}</p><p className="text-amber-500 text-[10px]">R$ {s.price} | {s.duration_minutes}min</p></div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(s)} className="text-amber-500 uppercase font-bold text-[10px]">Editar</button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 uppercase font-bold text-[10px]">{deletingId === s.id ? "..." : "Excluir"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "assignments" && (
            <div className="space-y-6">
              <form onSubmit={handleCreateBarber} className="bg-zinc-800/20 p-4 rounded border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Nome" value={barberFormData.username} onChange={e => setBarberFormData({...barberFormData, username: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white" />
                <input type="email" placeholder="Email" value={barberFormData.email} onChange={e => setBarberFormData({...barberFormData, email: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white" />
                <input type="password" placeholder="Senha" value={barberFormData.password} onChange={e => setBarberFormData({...barberFormData, password: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white" />
                <button type="submit" disabled={isCreatingBarber} className="bg-amber-500 text-black text-[10px] font-black py-2 rounded uppercase">{isCreatingBarber ? "..." : "Cadastrar"}</button>
              </form>
              <div className="space-y-2">
                {barbers.map(b => (
                  <div key={b.id} className={`p-3 rounded border ${selectedBarber === b.id ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-800 bg-black/40'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white text-xs font-bold uppercase">{b.username} {!b.is_active && <span className="text-red-500 text-[8px]">(Inativo)</span>}</span>
                      <div className="flex gap-4">
                        <button onClick={() => handleToggleBarberStatus(b.id, b.is_active)} className="text-zinc-500 text-[10px] font-bold uppercase hover:text-red-500">
                          {togglingBarberId === b.id ? "..." : (b.is_active ? "Demitir" : "Reativar")}
                        </button>
                        <button onClick={() => setSelectedBarber(b.id)} className="text-amber-500 text-[10px] font-bold uppercase">Selecionar</button>
                      </div>
                    </div>
                    {selectedBarber === b.id && (
                      <div className="mt-4 pt-4 border-t border-zinc-800 grid md:grid-cols-2 gap-4">
                        <div><h5 className="text-amber-500 text-[9px] font-bold uppercase mb-2">Serviços Atuais</h5>
                          {barberServices.map(bs => (
                            <div key={bs.id} className="flex justify-between text-white text-[10px] bg-black/20 p-2 mb-1 rounded"><span>{services.find(s => s.id === bs.service_id)?.name}</span><button onClick={() => removeService(bs.id)} className="text-red-500 uppercase">{unassigningId === bs.id ? "..." : "Remover"}</button></div>
                          ))}
                        </div>
                        <div><h5 className="text-amber-500 text-[9px] font-bold uppercase mb-2">Adicionar</h5>
                          {services.filter(s => !barberServices.some(bs => bs.service_id === s.id)).map(s => (
                            <div key={s.id} className="flex justify-between text-white text-[10px] bg-black/20 p-2 mb-1 rounded"><span>{s.name}</span><button onClick={() => assignService(s.id)} className="text-amber-500 uppercase">{assigningService === s.id ? "..." : "Vincular"}</button></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "offtimes" && (
            <div className="space-y-4">
              <form onSubmit={handleBlockTime} className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-700 grid gap-3">
                <select className="bg-black border border-zinc-700 p-2 text-xs text-white" value={blockFormData.barber_id} onChange={e => setBlockFormData({...blockFormData, barber_id: e.target.value})} required disabled={!!editingBlockId}>
                  <option value="">Selecione o Prestador...</option>
                  <option value="ALL" className="text-amber-500 font-bold">🚩 TODA A EQUIPE (FERIADO)</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.username}</option>)}
                </select>
                <input type="date" value={blockFormData.date} onChange={e => setBlockFormData({...blockFormData, date: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white outline-none bg-black text-white border-zinc-800 
  [&::-webkit-calendar-picker-indicator]:invert" required />
                <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase"><input type="checkbox" checked={blockFormData.is_full_day} onChange={e => setBlockFormData({...blockFormData, is_full_day: e.target.checked})} /><span>Dia Inteiro</span></div>
                {!blockFormData.is_full_day && (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" value={blockFormData.start_time} onChange={e => setBlockFormData({...blockFormData, start_time: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white" />
                    <input type="time" value={blockFormData.end_time} onChange={e => setBlockFormData({...blockFormData, end_time: e.target.value})} className="bg-black border border-zinc-700 p-2 text-xs text-white" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 bg-amber-500 text-black text-[10px] font-black py-2.5 rounded uppercase">{loading ? "Processando..." : (editingBlockId ? "Salvar Alteração" : "Bloquear Agenda")}</button>
                  {editingBlockId && (
                    <button type="button" onClick={() => { setEditingBlockId(null); setBlockFormData({ barber_id: "", date: "", start_time: "08:00", end_time: "19:00", is_full_day: true }); }} className="bg-zinc-700 text-white text-[10px] font-black px-4 rounded uppercase">Cancelar</button>
                  )}
                </div>
              </form>
              <div className="space-y-2">
                {blockedTimes.map(block => (
  <div key={block.id} className={`bg-black/40 border border-zinc-800 p-3 rounded flex justify-between items-center text-[10px] ${block.isPast ? 'opacity-40 grayscale' : ''}`}>
    <span className="text-zinc-300">
      <strong className="text-amber-500 mr-2">
        {barbers.find(b => b.id === block.barber_id)?.username || "Equipe"}:
      </strong>
      {block.date} | {block.start_time.slice(0, 5)}h - {block.end_time.slice(0, 5)}h
    </span>

    <div className="flex gap-3">
      {block.isPast ? (
        <span className="text-zinc-500 font-black uppercase">Finalizado</span>
      ) : (
        <>
          <button 
            onClick={() => {
              setEditingBlockId(block.id);
              setBlockFormData({
                barber_id: block.barber_id,
                date: block.date,
                start_time: block.start_time.slice(0, 5),
                end_time: block.end_time.slice(0, 5),
                is_full_day: block.start_time.slice(0, 5) === "00:00" && block.end_time.slice(0, 5) === "23:59"
              });
            }} 
            className="text-amber-500 font-bold uppercase"
          >
            Editar
          </button>
          
          <button 
            onClick={async () => {
              if(!confirm("Remover bloqueio?")) return;
              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/blocked-times/${block.id}`, { 
                method: 'DELETE', 
                headers: { Authorization: `Bearer ${token}` } 
              });
              fetchBlockedTimes();
            }} 
            className="text-red-500 font-bold uppercase"
          >
            Remover
          </button>
        </>
      )}
    </div>
  </div>
))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Service { id: string; name: string; price: string; duration_minutes: number; }
interface Barber { id: string; username: string; email: string; role: string; is_active: boolean; }
interface BarberService { id: string; barber_id: string; service_id: string; }
type TabType = "services" | "assignments" | "offtimes";