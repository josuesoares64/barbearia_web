import { cookies } from "next/headers";
import SlugShell from "../components/SlugShell";

async function getFullBarberData(slug: string) {
  const [resShop, resCustom, resHours] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/customization`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/hours`, { cache: 'no-store' }),
  ]);

  return {
    shop: resShop.ok ? await resShop.json() : null,
    custom: resCustom.ok ? await resCustom.json() : null,
    hours: resHours.ok ? await resHours.json() : [],
  };
}

export default async function BarberLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getFullBarberData(slug);

  const cookieStore = await cookies();
  const token = cookieStore.get("barber.token")?.value || "";

  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
      console.log("USER DECODIFICADO:", user); // 👈
    } catch (e) {
      console.error("Erro ao decodificar token", e);
    }
  } else {
    console.log("TOKEN NÃO ENCONTRADO"); // 👈
  }

  return (
    <SlugShell shop={data.shop} custom={data.custom} hours={data.hours} user={user}>
      {children}
    </SlugShell>
  );
}