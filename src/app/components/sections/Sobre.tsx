"use client";
import Image from "next/image";

interface SobreProps {
  text?: string;
  shopName: string;
}

const Sobre = ({ text, shopName }: SobreProps) => {
  return (
    <section id="sobre" className="px-6 py-20 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Título Centralizado */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h2 className="font-black text-3xl md:text-4xl uppercase tracking-[0.3em]">
            Sobre
          </h2>
          <div className="w-12 h-1 bg-amber-500 mt-2"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
          
          {/* Lado da Imagem */}
          <div className="w-full md:w-1/2 relative group">
            {/* Moldura Decorativa (Apenas Desktop) */}
            <div className="absolute -inset-2 border border-amber-500/20 rounded-lg translate-x-4 translate-y-4 hidden md:block group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/ilustrativa-sobre.jpg"
                alt={`Sobre a ${shopName}`}
                width={800}
                height={500}
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
          </div>

          {/* Lado do Texto */}
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <h3 className="text-amber-500 font-black uppercase text-xs tracking-[0.2em]">
              Nossa História
            </h3>
            
            <div className="text-zinc-400 text-sm md:text-base lg:text-lg leading-relaxed">
              {text ? (
                <p className="whitespace-pre-line italic font-light">
                  {text}
                </p>
              ) : (
                <div className="space-y-4">
                  <p>
                    Na <span className="text-white font-bold">{shopName}</span>, unimos tradição e modernidade para oferecer
                    uma experiência completa em cuidados masculinos.
                  </p>
                  <p>
                    Nosso compromisso é entregar mais que um corte: queremos que cada
                    cliente se sinta confiante, valorizado e bem recebido.
                  </p>
                  <p>
                    Trabalhamos com técnicas atualizadas, produtos de qualidade e um
                    atendimento que coloca <span className="text-amber-500 font-bold">você em primeiro lugar</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Divisor Visual Final */}
            <div className="pt-6 border-t border-zinc-900">
               <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                  Compromisso com a sua melhor versão
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;