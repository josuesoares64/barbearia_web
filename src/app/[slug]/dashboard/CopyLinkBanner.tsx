"use client";

export function CopyLinkBanner({ slug }: { slug: string }) {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}/agendamento`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert("Link copiado!");
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest mb-1">
          Link de agendamento
        </p>
        <p className="text-zinc-300 text-xs font-mono break-all">{link}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black px-6 py-2.5 rounded-lg uppercase transition-all"
      >
        Copiar Link
      </button>
    </div>
  );
}