"use client";
import { useEffect, useState } from "react";

export function ProductList({ slug }: { slug: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function loadProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products`
        );
        const data = await res.json();

        // 👇 só produtos ativos
        const ativos = data.filter((p: any) => p.is_active);

        setProducts(ativos);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug]);

  // ⛔ não renderiza NADA
  if (loading || products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-white font-bold text-xl mb-6">
        Produtos disponíveis
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <h3 className="text-white font-semibold">{product.name}</h3>
            <p className="text-amber-400 font-bold mt-1">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <p className="text-xs text-zinc-500 mt-2">
              Estoque: {product.stock_quantity}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
