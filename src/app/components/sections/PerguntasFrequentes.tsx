"use client";

const PerguntasFrequentes = () => {
  const faqs = [
    {
      q: "Preciso agendar um horário ou posso ser atendido por ordem de chegada?",
      a: "Recomendamos fortemente o agendamento prévio pelo site para garantir sua vaga. Clientes agendados têm prioridade total e evitam esperas desnecessárias."
    },
    {
      q: "Quanto tempo devo deixar a barba crescer antes da modelagem?",
      a: "Idealmente de 1 a 2 centímetros (cerca de 10 a 14 dias). Isso permite que nosso barbeiro tenha volume suficiente para desenhar o contorno perfeito com a navalha."
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos Pix, Cartões de Crédito, Débito e Dinheiro. O pagamento é realizado diretamente na barbearia após o serviço."
    },
    {
      q: "Vocês possuem pacotes para o Dia do Noivo?",
      a: "Sim. Oferecemos uma experiência exclusiva para noivos e padrinhos. Entre em contato pelo WhatsApp para personalizar seu pacote e reservar o espaço."
    },
    {
      q: "Os produtos usados no atendimento estão à venda?",
      a: "Sim. Pomadas, óleos e shampoos profissionais usados pelos nossos barbeiros estão disponíveis para compra na recepção para sua manutenção em casa."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-black px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabeçalho compactado e elegante */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            Dúvidas Comuns
          </h2>
          <div className="w-12 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border border-zinc-900 bg-zinc-950/50 rounded-sm overflow-hidden transition-all duration-300"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-zinc-900 transition-colors">
                <span className="text-sm md:text-base font-bold text-zinc-300 group-open:text-amber-500 uppercase tracking-tight transition-colors">
                  {faq.q}
                </span>
                <span className="text-amber-500 transition-transform duration-300 group-open:rotate-45">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </span>
              </summary>
              <div className="p-5 pt-0 text-zinc-500 text-sm md:text-base leading-relaxed font-light border-t border-zinc-900/50">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Call to Action final */}
        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-[10px] uppercase font-black tracking-[0.2em]">
            Ainda tem dúvidas? Fale conosco pelo WhatsApp
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerguntasFrequentes;