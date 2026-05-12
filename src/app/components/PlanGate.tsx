"use client";

type PlanoTipo = "trial" | "starter" | "pro" | "premium";

const hierarquia: PlanoTipo[] = ["trial", "starter", "pro", "premium"];

function temAcesso(planoAtual: PlanoTipo, planoNecessario: PlanoTipo): boolean {
  return hierarquia.indexOf(planoAtual) >= hierarquia.indexOf(planoNecessario);
}

const labelPlano: Record<PlanoTipo, string> = {
  trial: "Trial",
  starter: "Starter",
  pro: "Pro",
  premium: "Premium",
};

interface PlanGateProps {
  planoAtual: PlanoTipo;
  planoNecessario: PlanoTipo;
  children: React.ReactNode;
}

export function PlanGate({ planoAtual, planoNecessario, children }: PlanGateProps) {
  if (temAcesso(planoAtual, planoNecessario)) return <>{children}</>;

  return (
    <div className="flex flex-col gap-2">
      {/* Card discreto de upgrade */}
      <div className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-xl px-6 py-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth={1.5} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 11V7a5 5 0 0110 0v4"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              Disponível no plano{" "}
              <span className="text-amber-500">{labelPlano[planoNecessario]}</span>
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">
              Faça upgrade para desbloquear esta funcionalidade.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/8881185172?text=Quero fazer upgrade do meu plano"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-amber-500 text-black font-bold py-2 px-5 rounded-lg uppercase text-xs hover:bg-amber-400 transition-all"
        >
          Upgrade
        </a>
      </div>

      {/* Preview desfocado — instiga curiosidade */}
      <div className="pointer-events-none select-none opacity-40 blur-sm overflow-hidden rounded-xl">
        {children}
      </div>
    </div>
  );
}