import React from 'react';

// --- 1. DADOS (JSON CORRIGIDO) ---
// Removido o array extra para que o mapeamento funcione corretamente.
// Adicionado o campo 'link' para que o card seja clicável.
const servicos = [
    {
        "id": 1,
        "nome": "O Ritual da Barba Clássica",
        "tag_destaque": "Experiência Premium",
        "descricao_curta": "Barbear com navalha, toalhas quentes e frias, e massagem facial. Precisão e relaxamento garantidos.",
        "duracao_minutos": 50,
        "preco": 65.00,
        "link": "#agendamento"
    },
    {
        "id": 2,
        "nome": "Fade (Degradê) Master",
        "tag_destaque": "Técnica Avançada",
        "descricao_curta": "Corte moderno focado na transição perfeita do volume. Inclui lavagem e estilização final.",
        "duracao_minutos": 45,
        "preco": 55.00,
        "link": "#agendamento"
    },
    {
        "id": 3,
        "nome": "Corte e Estilização Executiva",
        "tag_destaque": "Visual Profissional",
        "descricao_curta": "Corte personalizado à máquina e tesoura, adaptado ao seu rosto. Inclui lavagem com massagem e consultoria de produtos.",
        "duracao_minutos": 60,
        "preco": 70.00,
        "link": "#agendamento"
    },
    {
        "id": 4,
        "nome": "Combo 'O Cavalheiro Completo'",
        "tag_destaque": "Mais Vendido!",
        "descricao_curta": "A união perfeita: Corte Executivo + Modelagem de Barba com navalha. Economize tempo e garanta um visual harmonioso.",
        "duracao_minutos": 90,
        "preco": 110.00,
        "link": "#agendamento"
    },
    {
        "id": 5,
        "nome": "Tratamento Revigorante da Pele",
        "tag_destaque": "Cuidado Facial",
        "descricao_curta": "Limpeza profunda com esfoliação e máscara facial detox (carvão/argila) para reduzir oleosidade e impurezas.",
        "duracao_minutos": 20,
        "preco": 35.00,
        "link": "#agendamento"
    },
    {
        "id": 6,
        "nome": "Disfarce de Grisalhos Express",
        "tag_destaque": "Rejuvenescimento Sutil",
        "descricao_curta": "Tonalização semi-permanente discreta e rápida para disfarçar fios brancos de forma natural, sem tingimento completo.",
        "duracao_minutos": 30,
        "preco": 40.00,
        "link": "#agendamento"
    }
];

// --- 2. COMPONENTE CARD (Para facilitar a organização) ---

// Componente individual do card, recebe um objeto 'servico' como prop.
const CardServico = ({ servico }) => {
    // Para formatação de preço em Real (R$)
    const precoFormatado = servico.preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    // Se estiver usando Next.js, substitua 'a' por 'Link' e ajuste a importação.
    return (
        <a 
            href={servico.link} 
            className="block group transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl 
                       bg-white rounded-xl shadow-lg overflow-hidden p-6 h-full 
                       flex flex-col justify-between border-t-4 border-amber-600 hover:border-gray-900"
        >
            
            {/* Conteúdo Principal do Card */}
            <div>
                {/* Tag Destaque */}
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full inline-block mb-2">
                    {servico.tag_destaque}
                </span>

                {/* Nome do Serviço */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{servico.nome}</h3>
                
                {/* Descrição Curta */}
                <p className="text-gray-600 text-sm mb-4">{servico.descricao_curta}</p>
            </div>
            
            {/* Rodapé: Preço e Duração */}
            <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                
                {/* Duração */}
                <div>
                    <p className="text-gray-500 text-xs">Duração Média:</p>
                    <p className="font-semibold text-sm text-gray-700">{servico.duracao_minutos} min</p>
                </div>
                
                {/* Preço */}
                <div className="text-right">
                    <p className="text-sm font-light text-gray-500">Valor:</p>
                    <p className="text-3xl font-extrabold text-amber-700 hover:text-gray-900">{precoFormatado}</p>
                </div>
            </div>
        </a>
    );
};

// --- 3. COMPONENTE PRINCIPAL ---

const Servicos = () => {
    // Adicionei uma variável para pegar o primeiro elemento do array principal
    const servicosUnico = servicos[0]; 

    return (
        <section id="servicos" className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h2 className="text-4xl font-bold mb-12 text-gray-800">Nossos Serviços</h2>
            
            {/* GRID: Garante a organização 3x2 em telas grandes e 1x6 em celulares */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                
                {/* Mapeamento (Iteração) dos serviços */}
                {servicos.map((servico) => ( // Corrigido a sintaxe do arrow function (servico =>)
                    // Renderiza o componente CardServico para cada item no array
                    <CardServico key={servico.id} servico={servico} />
                ))}
            </div>
        </section>
    );
};

export default Servicos;