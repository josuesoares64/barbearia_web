"use client";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  slug: string;
}

const Hero = ({ title, subtitle, slug }: HeroProps) => {
  return (
    <section 
      className="relative bg-[url('/imagem-hero.avif')] bg-cover bg-center mt-15 h-[calc(100vh-60px)] min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Overlay com gradiente lateral para não "afogar" a imagem no desktop */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

      <div className="relative px-6 z-10 w-full max-w-6xl mx-auto">
        <div className="max-w-4xl text-center md:text-left">
          
          {/* Badge de destaque compacta */}
          <span className="inline-block bg-amber-500 text-black text-[9px] md:text-[10px] font-black uppercase px-3 py-1 mb-4 tracking-[0.2em] rounded-sm">
            Experiência Premium
          </span>

          {/* Título: Ajustado para não estourar no Desktop */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-black uppercase italic leading-[0.95] tracking-tighter">
            {title || "A Arte da Navalha & Estilo Atemporal"}
          </h1>

          {/* Subtítulo: Limite de largura para não esticar demais em telas ultra-wide */}
          <p className="text-zinc-300 text-sm md:text-lg mt-6 max-w-lg leading-relaxed font-medium">
            {subtitle || "Muito mais que um corte. Uma experiência de cuidado masculino com ambiente exclusivo no coração da cidade."}
          </p>
          
          {/* Botões: Mais compactos e alinhados */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            
            <Link 
              href={`/${slug}/agendamento`} 
              className="relative bg-amber-500 px-8 py-3.5 overflow-hidden font-black text-black rounded-sm group text-center transition-transform active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              <span className="relative text-[11px] md:text-xs uppercase tracking-widest">
                Agendar seu Horário
              </span>
            </Link>

            <Link 
              href="#servicos" 
              className="relative px-8 py-3.5 overflow-hidden font-black text-white rounded-sm border border-white/20 group text-center backdrop-blur-sm transition-transform active:scale-95"
            >
              <span className="absolute inset-0 w-full h-full bg-white translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              <span className="relative text-white group-hover:text-black transition-colors text-[11px] md:text-xs uppercase tracking-widest">
                Nossos Serviços
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Seta decorativa sutil no rodapé */}
      <div className="absolute bottom-8 left-6 hidden md:flex flex-col items-center gap-2">
        <span className="text-[9px] text-zinc-500 uppercase font-black rotate-90 origin-left translate-y-10">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;