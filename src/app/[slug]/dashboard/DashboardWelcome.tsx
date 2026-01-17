"use client";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardWelcome() {
  const { user } = useAuth();
  
  // Lógica para extrair apenas o primeiro nome, limpando pontos do e-mail se necessário
  const obterPrimeiroNome = () => {
    if (user?.username) {
      return user.username.split(' ')[0]; // Retorna 'Josué' do 'Josué Soares'
    }
    
    if (user?.email) {
      // Pega o que vem antes do @ e depois separa por ponto, caso seja 'josue.soares'
      const parteEmail = user.email.split('@')[0];
      return parteEmail.split('.')[0]; // Retorna 'josue' do 'josue.soares'
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