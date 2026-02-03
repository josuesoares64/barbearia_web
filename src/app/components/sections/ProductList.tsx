"use client";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
}

export function ProductList({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function loadProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products`
        );
        const data = await res.json();

        const ativos = data.filter((p: Product) => p.is_active);
        setProducts(ativos);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug]);

  // não renderiza nada se não tiver produtos
  if (loading || products.length === 0) return null;

  return (
    <section className="w-full py-20 mt-24">
      {/* CONTAINER INTERNO CONTROLADO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-2xl">
            Produtos disponíveis
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Itens disponíveis para compra na barbearia
          </p>
        </div>

        {/* GRID FLUIDO REAL */}
        <div
          className="
            grid
            gap-6
            [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                bg-gradient-to-b from-zinc-900 to-zinc-950
                border border-zinc-800
                rounded-2xl
                p-5
                flex
                flex-col
                justify-between
                transition
                hover:border-amber-500/40
              "
            >
              {/* INFO */}
              <div>
                <h3 className="text-white font-semibold text-base leading-tight">
                  {product.name}
                </h3>

                <p className="text-amber-400 font-bold text-lg mt-2">
                  R$ {Number(product.price).toFixed(2)}
                </p>
              </div>

              {/* FOOTER */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Estoque: {product.stock_quantity}
                </span>

                {product.stock_quantity === 0 && (
                  <span className="text-xs text-red-500 font-bold uppercase">
                    Indisponível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
