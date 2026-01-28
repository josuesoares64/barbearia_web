"use client";
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { FaPhone, FaSquareInstagram, FaLocationDot, FaClock } from 'react-icons/fa6';

const weekDaysMap = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const Footer = ({ shop, custom, hours }: any) => {
    // Dados Dinâmicos vindos do Banco (Sequelize)
    const whatsapp = custom?.whatsapp_url || ""; 
    const email = custom?.email_contato || shop?.email || "contato@barbersaas.com"; 
    const instagram = custom?.instagram_url || "#";
    const address = shop?.address || "Endereço não informado";

    // Link direto para o Gmail (Web) para facilitar o envio
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

    const renderHours = () => {
        if (!hours || hours.length === 0) return <p className="text-zinc-500 text-[10px]">Horários não informados</p>;
        const grouped = hours.reduce((acc: any, curr: any) => {
            if (!acc[curr.weekday]) acc[curr.weekday] = [];
            acc[curr.weekday].push(`${curr.open_time.slice(0, 5)} - ${curr.close_time.slice(0, 5)}`);
            return acc;
        }, {});
        return Object.keys(grouped).sort().map((dayIndex: any) => (
            <p key={dayIndex} className="text-zinc-400">
                <span className="font-bold text-zinc-200">{weekDaysMap[Number(dayIndex)]}:</span> {grouped[dayIndex].join(' / ')}
            </p>
        ));
    };

    return (
        <footer id='contato' className="w-full bg-black text-white border-t border-zinc-900">
            <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                
                {/* 1. Nome da Barbearia (Sem logo por enquanto) */}
                <div className="flex flex-col items-start space-y-4">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                        {shop?.name || "Barbearia"}
                    </h2>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-tight">
                        A melhor experiência de <br /> cuidado masculino. <br />
                        © 2026 — GESTÃO PROFISSIONAL.
                    </p>
                </div>

                {/* 2. Contato com link direto Gmail */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-amber-500 mb-4">Contato</h3>
                    <a 
                        className="flex items-center space-x-2 text-zinc-400 hover:text-white transition text-xs" 
                        href={gmailLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <MdEmail className="text-amber-500 text-sm" />
                        <p>{email}</p>
                    </a>
                    <a 
                        className="flex items-center space-x-2 text-zinc-400 hover:text-white transition text-xs" 
                        href={`https://wa.me/55${whatsapp.replace(/\D/g,'')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaPhone className="text-amber-500 text-sm" />
                        <p>{whatsapp || "Não informado"}</p>
                    </a>
                    {custom?.instagram_url && (
                        <a className="flex items-center space-x-2 text-zinc-400 hover:text-white transition text-xs" href={instagram} target="_blank" rel="noopener noreferrer">
                            <FaSquareInstagram className="text-amber-500 text-sm" />
                            <p>Instagram</p>
                        </a>
                    )}
                </div>

                {/* 3. Localização */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-amber-500 mb-4">Localização</h3>
                    <div className="flex space-x-2 text-zinc-400 text-xs">
                        <FaLocationDot className="text-amber-500 flex-shrink-0 text-sm" />
                        <p>{address}</p>
                    </div>
                </div>

                {/* 4. Horários */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase text-amber-500 mb-4 flex items-center space-x-2">
                        <FaClock />
                        <span>Horários</span>
                    </h3>
                    <div className="text-[11px] space-y-1">
                        {renderHours()}
                    </div>
                </div>
            </div>
            
            <div className="w-full border-t border-zinc-900 py-6 text-center">
                 <a href="https://josuesoaresdev.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest hover:text-amber-500 transition">
                        Powered by Josué Soares Dev
                    </p>
                </a>
            </div>
        </footer>
    );
};

export default Footer;