import { DashboardWelcome } from "./DashboardWelcome";
import { DashboardReport } from "./DashboardReport";
import { ServiceManager } from "./ServiceManager";
import { cookies } from "next/headers";

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Resolve o slug
  const { slug } = await params;

  // 2. Resolve o token
  const cookieStore = await cookies(); 
  const token = cookieStore.get("barber.token")?.value || "";

  return (
    <main className="min-h-screen bg-zinc-950 pt-[70px]">
      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        <DashboardWelcome /> 
        
        {/* Ambos precisam das props para funcionar */}
        <ServiceManager slug={slug} token={token} />
        
        {/* ADICIONE AS PROPS AQUI: */}
        <DashboardReport slug={slug} token={token} />
      </div>
    </main>
  );
}