import Header from "../components/Header";
import Footer from "../components/Footer";

async function getFullBarberData(slug: string) {
  const [resShop, resCustom, resHours] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours`, { cache: 'no-store' })
  ]);

  return {
    shop: resShop.ok ? await resShop.json() : null,
    custom: resCustom.ok ? await resCustom.json() : null,
    hours: resHours.ok ? await resHours.json() : []
  };
}

export default async function BarberLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const data = await getFullBarberData(slug);

  return (
    <div className="flex flex-col min-h-screen bg-whati">
      {/* Aqui eles aparecem apenas para o que estiver dentro da pasta [slug] */}
      <Header shop={data.shop} custom={data.custom} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer shop={data.shop} custom={data.custom} hours={data.hours} />
    </div>
  );
}