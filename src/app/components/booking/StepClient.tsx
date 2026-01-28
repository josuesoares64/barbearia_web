"use client";
import React from "react";

const StepClient = ({ booking, setBooking, onNext, onBack }: any) => {
  
  // Garante apenas a primeira letra maiúscula (ex: JOSUÉ -> Josué)
  const formatName = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Máscara de Telefone: (88) 9 8118-5172
  const maskPhone = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, ""); 
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); 
    value = value.replace(/(\d{1})(\d{4})(\d)/, "$1 $2-$3"); 
    return value.substring(0, 16); 
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setBooking({ ...booking, phone: masked });
  };

  const handleNameChange = (field: string, value: string) => {
    // Aplica a formatação apenas na primeira letra
    setBooking({ ...booking, [field]: formatName(value) });
  };

  const canContinue = 
    booking.first_name?.trim() && 
    booking.last_name?.trim() && 
    booking.phone?.length >= 14;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500/80 mb-2 italic">
          Identification
        </span>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Seus <span className="text-amber-500">Dados</span>
        </h2>
      </div>

      <div className="space-y-5">
        {/* NOME */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-black tracking-widest text-zinc-500 ml-1 italic">Nome</label>
          <input
            placeholder="Nome"
            className="w-full bg-zinc-950 border border-zinc-900 text-white p-4 rounded-none font-bold italic tracking-widest focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-800"
            value={booking.first_name || ""}
            onChange={(e) => handleNameChange("first_name", e.target.value)}
          />
        </div>

        {/* SOBRENOME */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-black tracking-widest text-zinc-500 ml-1 italic">Sobrenome</label>
          <input
            placeholder="Sobrenome"
            className="w-full bg-zinc-950 border border-zinc-900 text-white p-4 rounded-none font-bold italic tracking-widest focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-800"
            value={booking.last_name || ""}
            onChange={(e) => handleNameChange("last_name", e.target.value)}
          />
        </div>

        {/* TELEFONE */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-black tracking-widest text-zinc-500 ml-1 italic">Telefone</label>
          <input
            type="tel"
            placeholder="(00) 0 0000-0000"
            className="w-full bg-zinc-950 border border-zinc-900 text-amber-500 p-4 rounded-none font-mono font-bold tracking-[0.1em] focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-800"
            value={booking.phone || ""}
            onChange={handlePhoneChange}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-6">
        <button 
          disabled={!canContinue}
          onClick={onNext} 
          className={`w-full py-5 font-black uppercase italic tracking-[0.3em] transition-all relative overflow-hidden group
            ${canContinue 
              ? "bg-amber-500 text-black hover:bg-white active:scale-[0.98] shadow-lg shadow-amber-500/10" 
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50"
            }`}
        >
          <span className="relative z-10">{canContinue ? "Revisar Reserva →" : "Preencha os dados"}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>

        <button 
          onClick={onBack} 
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-400 transition-colors italic border-t border-zinc-900/50 mt-2"
        >
          ← Voltar para Horário
        </button>
      </div>

      <p className="text-center text-[8px] uppercase font-bold text-zinc-700 tracking-[0.2em]">
        Dados protegidos pela política de privacidade da barbearia.
      </p>
    </div>
  );
};

export default StepClient;