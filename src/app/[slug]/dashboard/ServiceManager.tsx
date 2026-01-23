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
  
  // Estados para a aba de atribuição
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [assigningService, setAssigningService] = useState<string | null>(null);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  // Estados para criação de barbeiro
  const [isCreatingBarber, setIsCreatingBarber] = useState(false);
  const [barberFormData, setBarberFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Barbeiro"
  });

  // Estado para controle de desativação de barbeiro
  const [togglingBarberId, setTogglingBarberId] = useState<string | null>(null);

  // Estados do usuário atual
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isOwner, setIsOwner] = useState(false);
  const [isBarber, setIsBarber] = useState(false);


  // Buscar dados ao abrir o manager
  useEffect(() => {
    if (isOpen && slug) {
      fetchServices();
      if (activeTab === "assignments") {
        fetchBarbersAndOwners();
      }
    }
  }, [isOpen, slug, activeTab]);

  // Buscar serviços atribuídos quando mudar o barbeiro/dono selecionado
  useEffect(() => {
    if (selectedBarber && activeTab === "assignments") {
      fetchBarberServices(selectedBarber);
    } else {
      setBarberServices([]);
    }
  }, [selectedBarber, activeTab]);

  // Buscar serviços
  const fetchServices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar serviços");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao carregar serviços");
    }
  };


interface Service {
  id: string;
  name: string;
  price: string;
  duration_minutes: number;
  is_active?: boolean;
  description?: string;
  barbershop_id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Barber {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active?: boolean;
}

interface BarberService {
  id: string;
  barber_id: string;
  service_id: string;
  barbershop_id: string;
  service?: Service;
  barber?: Barber;
}

type TabType = "services" | "assignments";


  // Decodificar token para saber permissões
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || "");
        setUserId(payload.userId || payload.id || "");
        setIsOwner(payload.role?.toLowerCase() === "dono");
        setIsBarber(payload.role?.toLowerCase() === "barbeiro");
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }, [token]);

  // ⭐⭐ LINHA SIMPLES: Se não for dono, não mostra NADA
  if (!isOwner) {
    return null;
  }

  
  // Buscar barbeiros E donos (prestadores de serviço)
  const fetchBarbersAndOwners = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Filtramos apenas quem pode prestar serviço
        const serviceProviders = data.filter((user: any) => 
          user.role.toLowerCase() === "barbeiro" || 
          user.role.toLowerCase() === "dono"
        );
        setBarbers(serviceProviders);
      }
    } catch (error) {
      console.error("Erro ao buscar prestadores:", error);
    }
  };

  // Buscar serviços de um prestador específico
  const fetchBarberServices = async (barberId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/barbers/${barberId}/services`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setBarberServices(data);
      } else {
        setBarberServices([]);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços do prestador:", error);
      setBarberServices([]);
    }
  };

  // CRUD de Serviços
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

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao salvar serviço");
      }

      resetForm();
      await fetchServices();
      alert(isEditing ? "Serviço atualizado com sucesso!" : "Serviço adicionado com sucesso!");
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao salvar serviço");
    } finally {
      setLoading(false);
    }
  };

  // Função para criar barbeiro
  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingBarber(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(barberFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar barbeiro");
      }

      alert("Barbeiro cadastrado com sucesso!");
      setBarberFormData({ username: "", email: "", password: "", role: "Barbeiro" });
      await fetchBarbersAndOwners();
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao cadastrar barbeiro");
    } finally {
      setIsCreatingBarber(false);
    }
  };

  // NOVA: Função para desativar/ativar barbeiro
  const toggleBarberStatus = async (barber: Barber) => {
    const action = barber.is_active ? "desativar" : "reativar";
    if (!confirm(`Deseja realmente ${action} o acesso de ${barber.username}?`)) return;

    setTogglingBarberId(barber.id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barbers/${barber.id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !barber.is_active }),
      });

      if (!response.ok) throw new Error(`Erro ao ${action} barbeiro`);

      await fetchBarbersAndOwners();
      alert(`Barbeiro ${barber.is_active ? "desativado" : "ativado"} com sucesso!`);
    } catch (error: any) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao alterar status do barbeiro");
    } finally {
      setTogglingBarberId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao excluir serviço");
      setServices(prev => prev.filter(service => service.id !== id));
      alert("Serviço excluído com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir serviço");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      price: service.price,
      duration_minutes: service.duration_minutes.toString(),
    });
    setEditingId(service.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", duration_minutes: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBarberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBarberFormData(prev => ({ ...prev, [name]: value }));
  };

  const assignServiceToBarber = async (serviceId: string) => {
    if (!selectedBarber) {
      alert("Selecione um prestador primeiro");
      return;
    }

    setAssigningService(serviceId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          barber_id: selectedBarber,
          service_id: serviceId
        }),
      });

      if (!response.ok) throw new Error("Erro ao vincular serviço");

      await fetchBarberServices(selectedBarber);
      alert("Serviço vinculado com sucesso!");
    } catch (error: any) {
      console.error("Erro:", error);
      alert(`Erro ao vincular serviço: ${error.message}`);
    } finally {
      setAssigningService(null);
    }
  };

  const removeServiceFromBarber = async (barberServiceId: string) => {
    if (!confirm("Remover este serviço do prestador?")) return;

    setUnassigningId(barberServiceId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/${barberServiceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao remover serviço");

      setBarberServices(prev => prev.filter(bs => bs.id !== barberServiceId));
      alert("Serviço removido com sucesso!");
    } catch (error: any) {
      console.error("Erro:", error);
      alert(`Erro ao remover serviço: ${error.message}`);
    } finally {
      setUnassigningId(null);
    }
  };

  const availableServices = services.filter(
    service => !barberServices.some(bs => bs.service_id === service.id)
  );

  const formatPriceDisplay = (priceString: string) => {
    if (!priceString) return "R$ 0,00";
    return `R$ ${priceString.replace(".", ",")}`;
  };

  const getSelectedBarberName = () => {
    const barber = barbers.find(b => b.id === selectedBarber);
    return barber ? `${barber.username} (${barber.role === 'dono' ? '👑 Dono' : '✂️ Barbeiro'})` : "Selecione um prestador";
  };

  const getServiceInfo = (barberService: BarberService) => {
    if (barberService.service) {
      return {
        name: barberService.service.name,
        price: barberService.service.price,
        duration: barberService.service.duration_minutes
      };
    }
    const service = services.find(s => s.id === barberService.service_id);
    return {
      name: service?.name || "Serviço não encontrado",
      price: service?.price || "0.00",
      duration: service?.duration_minutes || 0
    };
  };

  const renderOwnerContent = () => {
    if (activeTab === "services") {
      return (
        <>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Nome do Serviço *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Preço (R$) *</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Duração (min) *</label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex gap-2 items-end md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black py-2.5 rounded uppercase transition-all disabled:opacity-50"
              >
                {loading ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-zinc-700 text-white text-[10px] font-black px-4 py-2.5 rounded uppercase">
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div>
            <h4 className="text-white text-xs font-bold mb-2 uppercase">Serviços Cadastrados</h4>
            <div className="grid gap-2">
              {services.map((service) => (
                <div key={service.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex-1">
                    <h5 className="text-white text-xs font-bold">{service.name}</h5>
                    <div className="flex gap-3 text-[10px]">
                      <span className="text-amber-500 font-bold">{formatPriceDisplay(service.price)}</span>
                      <span className="text-zinc-500">{service.duration_minutes} min</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(service)} className="text-amber-500 text-xs px-2 py-1">Editar</button>
                    <button onClick={() => handleDelete(service.id)} className="text-red-500 text-xs px-2 py-1">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      );
    } else if (activeTab === "assignments") {
      return (
        <div className="space-y-4">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-2">
            <h4 className="text-white text-xs font-bold mb-3 uppercase">Adicionar Novo Barbeiro</h4>
            <form onSubmit={handleCreateBarber} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="username" placeholder="Nome" value={barberFormData.username} onChange={handleBarberInputChange} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500" required />
              <input type="email" name="email" placeholder="E-mail" value={barberFormData.email} onChange={handleBarberInputChange} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500" required />
              <input type="password" name="password" placeholder="Senha" value={barberFormData.password} onChange={handleBarberInputChange} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500" required />
              <select name="role" value={barberFormData.role} onChange={handleBarberInputChange} className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500">
                <option value="Barbeiro">Barbeiro</option>
                <option value="Dono">Dono</option>
              </select>
              <button type="submit" disabled={isCreatingBarber} className="md:col-span-2 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black py-2 rounded uppercase disabled:opacity-50">
                {isCreatingBarber ? "Cadastrando..." : "Cadastrar Prestador"}
              </button>
            </form>
          </div>

          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
            <label className="block text-zinc-500 text-[10px] uppercase font-bold mb-3">Gerenciar Equipe e Atribuições</label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto mb-4 pr-1">
              {barbers.map(barber => (
                <div key={barber.id} className="flex items-center justify-between bg-black/40 p-2 rounded border border-zinc-800">
                   <div className="flex flex-col">
                      <span className={`text-xs font-bold ${barber.is_active === false ? 'text-zinc-600 line-through' : 'text-white'}`}>
                        {barber.username} {barber.role.toLowerCase() === 'dono' ? '👑' : '✂️'}
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase">{barber.is_active === false ? 'Inativo' : 'Ativo'}</span>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedBarber(barber.id)}
                        className={`text-[9px] px-2 py-1 rounded border uppercase font-bold ${selectedBarber === barber.id ? 'bg-amber-500 text-black border-amber-500' : 'text-zinc-400 border-zinc-700'}`}
                      >
                        Selecionar
                      </button>
                      <button 
                        onClick={() => toggleBarberStatus(barber)}
                        disabled={togglingBarberId === barber.id}
                        className={`text-[9px] px-2 py-1 rounded border uppercase font-bold transition-colors ${barber.is_active === false ? 'bg-green-600/20 text-green-500 border-green-500/50 hover:bg-green-600/40' : 'bg-red-600/20 text-red-500 border-red-500/50 hover:bg-red-600/40'}`}
                      >
                        {togglingBarberId === barber.id ? '...' : barber.is_active === false ? 'Ativar' : 'Desativar'}
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {selectedBarber && (
            <>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-amber-400 text-xs font-bold uppercase">Prestador: {getSelectedBarberName()}</p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold mb-2 uppercase">Serviços Atribuídos</h4>
                <div className="grid gap-2">
                  {barberServices.map(bs => {
                    const info = getServiceInfo(bs);
                    return (
                      <div key={bs.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <h5 className="text-white text-xs font-bold">{info.name}</h5>
                          <span className="text-amber-500 text-[10px] font-bold">{formatPriceDisplay(info.price)}</span>
                        </div>
                        <button onClick={() => removeServiceFromBarber(bs.id)} disabled={unassigningId === bs.id} className="text-red-500 text-xs px-3 py-1 border border-red-500/30 rounded">
                          {unassigningId === bs.id ? "..." : "Remover"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold mb-2 uppercase">Adicionar Disponíveis</h4>
                <div className="grid gap-2">
                  {availableServices.map(service => (
                    <div key={service.id} className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-3 flex justify-between items-center">
                      <h5 className="text-white text-xs font-bold">{service.name}</h5>
                      <button onClick={() => assignServiceToBarber(service.id)} disabled={assigningService === service.id} className="bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded">
                        {assigningService === service.id ? "..." : "Vincular"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">Gerenciar Serviços</h3>
          <p className="text-zinc-500 text-[10px]">Crie serviços e atribua aos prestadores</p>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black px-3 py-2 rounded uppercase">
          {isOpen ? "Fechar" : "Gerenciar"}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex border-b border-zinc-800 mb-4">
            <button onClick={() => setActiveTab("services")} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === "services" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"}`}>Serviços</button>
            <button onClick={() => setActiveTab("assignments")} className={`flex-1 py-2 text-xs font-bold uppercase ${activeTab === "assignments" ? "text-amber-500 border-b-2 border-amber-500" : "text-zinc-500"}`}>Atribuições</button>
          </div>
          {renderOwnerContent()}
        </div>
      )}
    </div>
  );
}