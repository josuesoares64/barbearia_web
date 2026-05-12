import { ProductForm } from "../ProductForm";

export default async function DashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-8">
        <h2 className="text-white text-3xl font-bold text-center">Produtos</h2>
        <ProductForm slug={slug} />
      </div>
    </main>
  );
}