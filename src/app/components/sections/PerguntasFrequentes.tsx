const PerguntasFrequentes = () => {
    return (
        <section className="p-4 w-full bg-black">
            <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-white text-center " >Perguntas Frequentes</h3>
            <details className="mb-4 rounded-lg bg-white shadow-md overflow-hidden faq-details">
                <summary className="p-4 font-semibold text-lg text-gray-900 border-b border-gray-100">Preciso agendar um horário ou posso ser atendido por ordem de chegada?</summary>
                <p className="p-4 pt-4 text-gray-600">Recomendamos fortemente o agendamento prévio (pelo site ou app) para garantir seu horário e barbeiro. Clientes agendados têm prioridade, e o atendimento por ordem de chegada pode resultar em tempo de espera.</p>
            </details>
            <details className="mb-4 rounded-lg bg-white shadow-md overflow-hidden faq-details">
                <summary className="p-4 font-semibold text-lg text-gray-900 border-b border-gray-100">Quanto tempo devo deixar a barba crescer antes de um serviço de Modelagem ou Barba Terapia?</summary>
                <p className="p-4 pt-4 text-gray-600">Idealmente, a barba deve ter entre 1 a 2 centímetros de comprimento (cerca de 10 a 14 dias de crescimento). Isso é crucial para garantir que possamos modelar e contornar com precisão à navalha.</p>
            </details>
            <details className="mb-4 rounded-lg bg-white shadow-md overflow-hidden faq-details">
                <summary className="p-4 font-semibold text-lg text-gray-900 border-b border-gray-100">Quais formas de pagamento são aceitas na barbearia?</summary>
                <p className="p-4 pt-4 text-gray-600">Aceitamos Cartões de Crédito, Débito, Pix e Dinheiro.</p>
            </details>
            <details className="mb-4 rounded-lg bg-white shadow-md overflow-hidden faq-details">
                <summary className="p-4 font-semibold text-lg text-gray-900 border-b border-gray-100">Vocês oferecem algum Pacote de Serviços Especiais para Noivos ou Eventos?</summary>
                <p className="p-4 pt-4 text-gray-600">Sim, oferecemos o Pacote Dia do Noivo, que inclui serviços de corte executivo, barba clássica e tratamentos de relaxamento em ambiente reservado. Entre em contato para detalhes e reservas personalizadas.</p>
            </details>
            <details className="mb-4 rounded-lg bg-white shadow-md overflow-hidden faq-details">
                <summary className="p-4 font-semibold text-lg text-gray-900 border-b border-gray-100">Posso comprar produtos (pomadas, óleos, shampoos) usados no salão?</summary>
                <p className="p-4 pt-4 text-gray-600">Sim, todos os produtos profissionais utilizados pelo seu barbeiro (pomadas, óleos, etc.) estão disponíveis para venda em nossa recepção. Seu barbeiro pode indicar os melhores para sua manutenção em casa.</p>
            </details>
            </div>
        </section>
    )
}

export default PerguntasFrequentes;