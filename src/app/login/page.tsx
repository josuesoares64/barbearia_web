"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Componente interno (precisa do Suspense por causa do useSearchParams) ───

function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const searchParams = useSearchParams();

  // Pega o slug da query: /login?from=barbearia-do-josue
  const from = searchParams.get("from");
  const backHref = from ? `/${from}/agendamento` : "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, senha);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">

        {/* ✅ CORREÇÃO: volta para /{slug}/agendamento se vier com ?from=slug */}
        <Link
          href={backHref}
          className="absolute top-4 left-4 text-amber-500 font-bold hover:underline text-sm"
        >
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2 text-center mt-6">
          Acesso Restrito
        </h1>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Entre com suas credenciais de Barbeiro ou Dono
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
          >
            {isLoading ? "Autenticando..." : "Entrar no Painel"}
          </button>
        </form>

        <Link href="/cadastrar" className="block text-center text-sm text-amber-500 hover:underline mt-4">
          Não tem uma conta? Cadastre-se
        </Link>
      </div>
    </main>
  );
}

// ─── Export com Suspense obrigatório para useSearchParams no Next.js ─────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}