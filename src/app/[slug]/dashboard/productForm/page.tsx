import { ProductForm } from "../ProductForm";
import { cookies } from "next/headers";

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Resolve o slug
  const { slug } = await params;

  // 2. Resolve o token
  const cookieStore = await cookies(); 
  const token = cookieStore.get("barber.token")?.value || "";

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        <h2 className="text-white text-3xl font-bold text-center">Produtos</h2>
        <ProductForm slug={slug} token={token} />
      </div>
    </main>
  );
}