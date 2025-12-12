import Image from "next/image";

const Sobre = () => {
  return (
    <section id="sobre" className="px-6 py-20 bg-black text-white">
      <h2 className="font-bold text-3xl text-center mb-10">Sobre</h2>

      <div className="md:flex items-center gap-10 max-w-6xl mx-auto">
        
        {/* Imagem */}
        <div className="md:w-1/2">
          <Image
            src="/ilustrativa-sobre.jpg"
            alt="Imagem sobre a barbearia"
            width={800}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Texto */}
        <div className="md:w-1/2 mt-6 md:mt-0 space-y-4 text-left">
          <p>
            Na <strong>Barbearia Shop</strong>, unimos tradição e modernidade para oferecer
            uma experiência completa em cuidados masculinos.
          </p>
          <p>
            Nosso compromisso é entregar mais que um corte: queremos que cada
            cliente se sinta confiante, valorizado e bem recebido.
          </p>
          <p>
            Trabalhamos com técnicas atualizadas, produtos de qualidade e um
            atendimento que coloca você em primeiro lugar.
          </p>
          <p>
            Aqui, cada detalhe importa — desde o ambiente confortável até o
            cuidado em entender exatamente o estilo que você busca.
          </p>
          <p>
            Seja para um corte clássico, barba alinhada ou um visual totalmente
            novo, estamos prontos para transformar sua ida à barbearia em um
            momento especial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
