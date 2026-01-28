"use client";
import { useEffect, useState } from "react";

interface ServicoProps {
    id: string;
    name: string;
    duration_minutes: number;
    price: number;
}

const CardServico = ({ servico, slug }: { servico: ServicoProps, slug: string }) => {
    const precoFormatado = Number(servico.price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <a 
            href={`/${slug}/agendamento`} 
            className="group relative block bg-zinc-950 border border-zinc-900 p-8 transition-all duration-500 hover:border-amber-500/50"
        >
            {/* Detalhe estético no canto do card */}
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-transparent group-hover:border-amber-500 transition-all duration-500"></div>

            <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-4 block">
                    Serviço Profissional
                </span>
                
                <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter mb-2 group-hover:text-amber-500 transition-colors">
                    {servico.name}
                </h3>
                
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed font-light">
                    Qualidade e precisão garantida para o seu estilo único.
                </p>
            </div>
            
            <div className="flex justify-between items-end pt-6 border-t border-zinc-900 mt-4 relative z-10">
                <div>
                    <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-1">Duração</p>
                    <div className="flex items-center gap-2 text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className="font-semibold text-sm">{servico.duration_minutes} min</span>
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Investimento</p>
                    <p className="text-3xl font-black text-white group-hover:text-amber-500 transition-colors tracking-tighter">
                        {precoFormatado}
                    </p>
                </div>
            </div>

            {/* Efeito de preenchimento no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </a>
    );
};

const Servicos = ({ slug }: { slug: string }) => {
    const [listaServicos, setListaServicos] = useState<ServicoProps[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/services`)
            .then(res => res.json())
            .then(data => setListaServicos(data))
            .catch(err => console.error("Erro ao carregar serviços", err));
    }, [slug]);

    return (
        <section id="servicos" className="py-24 bg-black px-6">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                
                {/* Cabeçalho da Seção */}
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter text-center">
                        Nossos Serviços
                    </h2>
                    <div className="w-16 h-1 bg-amber-500 mt-4"></div>
                </div>
                
                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {listaServicos.length > 0 ? (
                        listaServicos.map((servico) => (
                            <CardServico key={servico.id} servico={servico} slug={slug} /> 
                        ))
                    ) : (
                        <p className="text-zinc-500 text-center col-span-full">Carregando serviços...</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Servicos;