"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const { cadastrar } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (email !== confirmarEmail) {
      setErro("Os emails não coincidem. Verifique e tente novamente.");
      return;
    }

    setIsLoading(true);
    try {
      const username = `${nome} ${sobrenome}`;
      await cadastrar({ username, email, senha });
      setSucesso(true);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (sucesso) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Conta criada com sucesso!
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Sua conta foi criada. Clique abaixo para fazer login e começar a
            usar o sistema.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-lg transition-all"
          >
            Ir para o login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Crie sua conta
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Junte-se a nós para gerenciar seu negócio
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              required
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-1/2 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              required
              placeholder="Sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              className="w-1/2 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="email"
            required
            placeholder="Confirme seu e-mail"
            value={confirmarEmail}
            onChange={(e) => setConfirmarEmail(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="password"
            required
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
          />

          {erro && <p className="text-red-400 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-3 rounded-lg transition-all"
          >
            {isLoading ? "Processando..." : "Criar conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
