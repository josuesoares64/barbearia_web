"use client";
import { useEffect, useState } from "react";

export function ProductForm({ slug, token }: { slug: string; token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isOwner, setIsOwner] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  /* ===============================
     PERMISSÃO
  =============================== */
  useEffect(() => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsOwner(payload.role?.toLowerCase() === "dono");
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  /* ===============================
     BUSCAR PRODUTOS
  =============================== */
  useEffect(() => {
    if (slug) fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setProducts(await res.json());
  };

  /* ===============================
     CREATE / UPDATE
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanPrice = formData.price.replace(/\./g, "").replace(",", ".");
      const payload = {
        name: formData.name,
        price: parseFloat(cleanPrice).toFixed(2),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      const url =
        isEditing && editingId
          ? `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products/${editingId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products`;

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchProducts();
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    setDeletingId(id);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/barbershops/${slug}/products/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchProducts();
    setDeletingId(null);
  };

  /* ===============================
     EDIT
  =============================== */
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity.toString(),
    });
    setEditingId(product.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", stock_quantity: "" });
    setEditingId(null);
    setIsEditing(false);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
      
      {/* HEADER COMPACTO */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase">
            Produtos
          </h3>
          <p className="text-zinc-500 text-[10px]">
            Estoque e venda interna
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-amber-500 text-black text-[10px] font-black px-3 py-2 rounded uppercase"
          >
            {isOpen ? "Fechar" : "Gerenciar"}
          </button>
        )}
      </div>

      {/* CONTEÚDO EXPANSÍVEL – APENAS DONO */}
      {isOwner && isOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-6">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-black border border-zinc-700 rounded p-2 text-xs text-white"
              required
            />
            <input
              type="text"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="bg-black border border-zinc-700 rounded p-2 text-xs text-white"
              required
            />
            <input
              type="number"
              placeholder="Estoque"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_quantity: e.target.value,
                })
              }
              className="bg-black border border-zinc-700 rounded p-2 text-xs text-white"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-3 bg-amber-500 text-black text-[10px] font-black py-2.5 rounded uppercase"
            >
              {loading
                ? "Processando..."
                : isEditing
                ? "Atualizar Produto"
                : "Adicionar Produto"}
            </button>
          </form>

          {/* LISTA */}
          <div className="grid gap-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="text-white font-bold">{p.name}</p>
                  <p className="text-amber-500 text-[10px]">
                    R$ {p.price} | Estoque: {p.stock_quantity}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-amber-500 uppercase font-bold text-[10px]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 uppercase font-bold text-[10px]"
                  >
                    {deletingId === p.id ? "..." : "Excluir"}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

/* ===============================
   TYPES
=============================== */
interface Product {
  id: string;
  name: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
}
