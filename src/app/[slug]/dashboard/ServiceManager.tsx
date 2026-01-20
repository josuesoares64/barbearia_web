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
        // Filtrar barbeiros E donos (ambos podem prestar serviços)
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

  // Buscar serviços de um prestador específico (barbeiro ou dono)
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

  // Funcionalidades de atribuição de serviços a prestadores (barbeiros E donos)
  const assignServiceToBarber = async (serviceId: string) => {
    if (!selectedBarber) {
      alert("Selecione um prestador primeiro");
      return;
    }

    setAssigningService(serviceId);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/barberservices/`;
      
      const payload = {
        barber_id: selectedBarber,
        service_id: serviceId
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText.substring(0, 100)}`);
        }
      }

      await fetchBarberServices(selectedBarber);
      alert("Serviço vinculado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao vincular serviço:", error);
      alert(`Erro ao vincular serviço: ${error.message}`);
    } finally {
      setAssigningService(null);
    }
  };

  const removeServiceFromBarber = async (barberServiceId: string, serviceId: string) => {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText.substring(0, 100)}`);
      }

      setBarberServices(prev => prev.filter(bs => bs.id !== barberServiceId));
      alert("Serviço removido com sucesso!");
    } catch (error: any) {
      console.error("Erro:", error);
      alert(`Erro ao remover serviço: ${error.message}`);
    } finally {
      setUnassigningId(null);
    }
  };

  // Serviços disponíveis para atribuir ao prestador selecionado
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

  // Função auxiliar para garantir que temos os dados do serviço
  const getServiceInfo = (barberService: BarberService) => {
    if (barberService.service) {
      return {
        name: barberService.service.name,
        price: barberService.service.price,
        duration: barberService.service.duration_minutes
      };
    }
    
    const service = services.find(s => s.id === barberService.service_id);
    if (service) {
      return {
        name: service.name,
        price: service.price,
        duration: service.duration_minutes
      };
    }
    
    return {
      name: "Serviço não encontrado",
      price: "0.00",
      duration: 0
    };
  };

  // Renderizar conteúdo do dono
  const renderOwnerContent = () => {
    if (activeTab === "services") {
      return (
        <>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">
                Nome do Serviço *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Corte de Cabelo"
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">
                Preço (R$) *
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ex: 35,00"
                className="bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
              <p className="text-[9px] text-zinc-500">Use vírgula para centavos</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">
                Duração (min) *
              </label>
              <input
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                placeholder="Ex: 30"
                min="1"
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
                {loading
                  ? "Salvando..."
                  : isEditing
                  ? "Atualizar Serviço"
                  : "Adicionar Serviço"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white text-[10px] font-black px-4 py-2.5 rounded uppercase transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div>
            <h4 className="text-white text-xs font-bold mb-2 uppercase">Serviços Cadastrados</h4>
            {services.length === 0 ? (
              <p className="text-zinc-500 text-[10px]">Nenhum serviço cadastrado ainda.</p>
            ) : (
              <div className="grid gap-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center hover:bg-zinc-800/70 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-white text-xs font-bold">{service.name}</h5>
                        {service.is_active === false && (
                          <span className="bg-red-500/20 text-red-400 text-[8px] px-2 py-0.5 rounded">
                            INATIVO
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <span className="text-amber-500 text-[10px] font-bold">
                          {formatPriceDisplay(service.price)}
                        </span>
                        <span className="text-zinc-500 text-[10px]">
                          {service.duration_minutes} min
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-amber-500 hover:text-amber-400 text-xs px-2 py-1 rounded transition-colors"
                        disabled={deletingId === service.id}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                        className="text-red-500 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        {deletingId === service.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    } else if (activeTab === "assignments") {
      return (
        <div className="space-y-4">
          <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4">
            <label className="block text-zinc-500 text-[10px] uppercase font-bold mb-2">
              Selecione o Prestador
            </label>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded p-2 text-xs text-white outline-none focus:border-amber-500"
            >
              <option value="">Escolha um prestador</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.username} 
                  <span className="text-amber-500">
                    {barber.role.toLowerCase() === "dono" ? " 👑 (Dono)" : " ✂️ (Barbeiro)"}
                  </span>
                  {barber.is_active === false && " (Inativo)"}
                </option>
              ))}
            </select>
            
            {barbers.length === 0 && (
              <div className="mt-2">
                <p className="text-amber-500/80 text-[10px] animate-pulse">
                  Carregando prestadores...
                </p>
              </div>
            )}
          </div>

          {selectedBarber && barbers.length > 0 ? (
            <>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-amber-400 text-xs font-bold">
                  Prestador selecionado: {getSelectedBarberName()}
                </p>
              </div>

              <div>
                <h4 className="text-white text-xs font-bold mb-2">
                  Serviços Atribuídos
                </h4>
                {barberServices.length === 0 ? (
                  <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 text-center">
                    <p className="text-zinc-400 text-[10px]">
                      Este prestador ainda não tem serviços atribuídos.
                    </p>
                    <p className="text-zinc-500 text-[9px] mt-1">
                      Selecione serviços da lista abaixo para adicionar.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {barberServices.map(bs => {
                      const serviceInfo = getServiceInfo(bs);
                      return (
                        <div
                          key={bs.id}
                          className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center"
                        >
                          <div>
                            <h5 className="text-white text-xs font-bold">
                              {serviceInfo.name}
                            </h5>
                            <div className="flex gap-3 mt-1">
                              <span className="text-amber-500 text-[10px] font-bold">
                                {formatPriceDisplay(serviceInfo.price)}
                              </span>
                              <span className="text-zinc-500 text-[10px]">
                                {serviceInfo.duration} min
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeServiceFromBarber(bs.id, bs.service_id)}
                            disabled={unassigningId === bs.id}
                            className="text-red-500 hover:text-red-400 text-xs px-3 py-1 rounded border border-red-500/30 hover:border-red-500/50 transition-colors disabled:opacity-50"
                          >
                            {unassigningId === bs.id ? "Removendo..." : "Remover"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {availableServices.length > 0 && (
                <div>
                  <h4 className="text-white text-xs font-bold mb-2">
                    Adicionar Serviços Disponíveis
                  </h4>
                  <div className="grid gap-2">
                    {availableServices.map(service => (
                      <div
                        key={service.id}
                        className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-3 flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                      >
                        <div>
                          <h5 className="text-white text-xs font-bold">{service.name}</h5>
                          <div className="flex gap-3 mt-1">
                            <span className="text-amber-500 text-[10px] font-bold">
                              {formatPriceDisplay(service.price)}
                            </span>
                            <span className="text-zinc-500 text-[10px]">
                              {service.duration_minutes} min
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => assignServiceToBarber(service.id)}
                          disabled={assigningService === service.id}
                          className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {assigningService === service.id ? "Vinculando..." : "Vincular"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableServices.length === 0 && barberServices.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                  <p className="text-amber-400 text-[10px]">
                    ✅ Todos os serviços disponíveis já foram atribuídos a este prestador.
                  </p>
                </div>
              )}
            </>
          ) : barbers.length === 0 ? (
            <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-zinc-400 text-[10px]">
                Nenhum prestador cadastrado nesta barbearia.
              </p>
              <p className="text-zinc-500 text-[9px] mt-1">
                Adicione barbeiros antes de atribuir serviços.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-4 text-center">
              <p className="text-zinc-400 text-[10px]">
                👆 Selecione um prestador na lista acima para ver e gerenciar seus serviços.
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  // ⭐⭐ APENAS O RETURN DO DONO (simples e direto)
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">
            Gerenciar Serviços
          </h3>
          <p className="text-zinc-500 text-[10px]">
            Crie serviços e atribua aos prestadores
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black px-3 py-2 rounded uppercase transition-all"
        >
          {isOpen ? "Fechar" : "Gerenciar"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
          {/* Abas de navegação */}
          <div className="flex border-b border-zinc-800 mb-4">
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                activeTab === "services"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                activeTab === "assignments"
                  ? "text-amber-500 border-b-2 border-amber-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Atribuições
            </button>
          </div>

          {/* Conteúdo do dono */}
          {renderOwnerContent()}
        </div>
      )}
    </div>
  );
}