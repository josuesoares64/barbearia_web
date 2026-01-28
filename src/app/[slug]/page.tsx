import Hero from "../components/sections/Hero";
import Servicos from "../components/sections/servicos";
import Sobre from "../components/sections/Sobre";
import Localizacao from "../components/sections/localizacao";
import PerguntasFrequentes from "../components/sections/PerguntasFrequentes";

// Funções para buscar os dados no seu backend
async function getBarbershopData(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error);
    return null;
  }
}

async function getCustomization(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar customização:", error);
    return null;
  }
}

// Em Next.js 15, params é uma Promise
export default async function Home({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. Desembrulha o slug usando await
  const { slug } = await params;

  // 2. Busca os dados em paralelo
  const [shop, customization] = await Promise.all([
    getBarbershopData(slug),
    getCustomization(slug)
  ]);

  // 3. Validação: Se não encontrou a barbearia no banco
  if (!shop || !shop.id) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-5 text-center">
        <h1 className="text-4xl font-black uppercase mb-2">404</h1>
        <p className="uppercase font-bold text-zinc-500">Barbearia "{slug}" não encontrada.</p>
        <a href="/" className="mt-6 text-amber-500 underline text-sm">Voltar para a página inicial</a>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      {/* 4. Renderização dos componentes com dados reais */}
      <Hero 
        title={customization?.hero_title || shop.name}
        subtitle={customization?.hero_subtitle}
        banner={customization?.banner_url}
        slug={slug}
      />
      
      <Sobre 
        text={customization?.about_text} 
        shopName={shop.name}
      />

      <Servicos slug={slug} />

      <PerguntasFrequentes />

      <Localizacao 
        address={shop.address}
        mapLink={customization?.google_maps_link}
        phone={shop.phone}
        instagram={customization?.instagram_url}
        whatsapp={customization?.whatsapp_url}
      />
    </main>
  );
}