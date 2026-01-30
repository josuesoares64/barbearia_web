"use client";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardWelcome() {
  // CORREÇÃO: Forçamos o tipo para 'any' para o TypeScript aceitar o .username
  const { user } = useAuth() as { user: any }; 
  
  const obterPrimeiroNome = () => {
    // 1. Tenta pegar o nome real (Josué Soares -> Josué)
    if (user?.username) {
      return user.username.split(' ')[0];
    }
    
    // 2. Tenta o nome vindo do Google/Provider se existir
    if (user?.name) {
      return user.name.split(' ')[0];
    }

    // 3. Fallback para o email (josue.soares@... -> josue)
    if (user?.email) {
      const parteEmail = user.email.split('@')[0];
      return parteEmail.split('.')[0].charAt(0).toUpperCase() + parteEmail.split('.')[0].slice(1);
    }
    
    return 'Barbeiro';
  };

  const nomeParaExibir = obterPrimeiroNome();

  return (
    <section>
      <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">
        Olá, <span className="text-amber-500">{nomeParaExibir}!</span>
      </h1>
      <p className="text-zinc-500 text-sm">Gerencie o faturamento e a agenda da sua unidade.</p>
    </section>
  );
}