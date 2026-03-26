"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";

export default function CriarBarbearia() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  // DESTREVAR TELA AO CARREGAR
  useEffect(() => {
    document.body.style.pointerEvents = "auto";
    document.body.style.overflow = "auto";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = Cookies.get("barber.token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, slug, phone, address }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao criar barbearia");

      // Atualiza o cookie do usuário com o novo slug
      if (user) {
        const updatedUser = { ...user, slug: data.slug };
        Cookies.set("barber.user", JSON.stringify(updatedUser), { expires: 7 });
      }

      router.push(`/${data.slug}/dashboard`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    setSlug(generated);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Configure sua Unidade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Nome da Barbearia" value={name} onChange={(e) => handleNameChange(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" required />
          <input placeholder="Slug (Link)" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 outline-none focus:ring-2 focus:ring-amber-500" required />
          <input placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" required />
          <input placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500" required />
          <button type="submit" disabled={isLoading} className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-3 rounded-lg transition-all">
            {isLoading ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </form>
      </div>
    </main>
  );
}