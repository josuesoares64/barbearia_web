"use client";

interface LocalizacaoProps {
    address: string;
    mapLink?: string;
    phone: string;
    instagram?: string;
    whatsapp?: string;
    hours?: any[];
}

const Localizacao = ({ address, mapLink, phone, instagram, whatsapp, hours }: LocalizacaoProps) => {
    const embedUrl = mapLink || "";

    const getBusinessDays = () => {
        if (!hours || hours.length === 0) return "Consulte nossos horários";
        const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        
        const diasIndices = hours.map(h => parseInt(h.day_of_week)).sort((a, b) => a - b);
        
        if (diasIndices.length > 0) {
            const primeiroDia = diasSemana[diasIndices[0]];
            const ultimoDia = diasSemana[diasIndices[diasIndices.length - 1]];
            return `Aberto de ${primeiroDia} a ${ultimoDia}`;
        }
        return "Consulte nossos horários";
    };

    // Formata o link do Instagram caso venha apenas o @
    const instagramHref = instagram?.startsWith('http') 
        ? instagram 
        : `https://instagram.com/${instagram?.replace('@', '')}`;

    // Limpa o número do WhatsApp (mantém apenas dígitos)
    const whatsappNumber = whatsapp?.replace(/\D/g, '');

    return (
        <section id="localizacao" className="w-full py-24 bg-black px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">
                        Onde Estamos
                    </h2>
                    <div className="w-12 h-1 bg-amber-500 mx-auto mt-4 mb-6"></div>
                    <p className="text-zinc-300 max-w-md mx-auto text-sm leading-relaxed font-medium">
                        {address}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row border border-zinc-800 rounded-sm overflow-hidden bg-zinc-950">
                    <div className="w-full lg:w-2/3 h-[400px] grayscale contrast-110 opacity-90 hover:grayscale-0 transition-all duration-700">
                        {embedUrl ? (
                            <iframe
                                src={embedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 uppercase text-xs font-black">
                                Mapa não configurado
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-1/3 p-10 flex flex-col justify-center gap-10 border-t lg:border-t-0 lg:border-l border-zinc-800">
                        <div className="space-y-2">
                            <h4 className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em]">
                                Contato Direto
                            </h4>
                            <p className="text-3xl font-black text-white tracking-tighter italic">
                                {phone || "Sem Telefone"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em]">
                                Redes Sociais
                            </h4>
                            <div className="flex gap-4">
                                {whatsapp && (
                                    <a 
                                        href={`https://wa.me/${whatsappNumber}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-zinc-800 border border-zinc-700 p-4 rounded-sm hover:bg-green-600 hover:border-green-500 transition-all duration-300 text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                                    </a>
                                )}
                                {instagram && (
                                    <a 
                                        href={instagramHref} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-zinc-800 border border-zinc-700 p-4 rounded-sm hover:bg-amber-500 hover:border-amber-400 hover:text-black transition-all duration-300 text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        <p className="text-[11px] text-zinc-400 uppercase font-black tracking-widest leading-tight border-l-2 border-amber-500 pl-4">
                            {getBusinessDays()} <br/> 
                            <span className="text-zinc-600">Horários sujeitos a agendamento</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Localizacao;