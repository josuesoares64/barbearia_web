"use client";

import { useState, useCallback } from "react";
import { PlanError, AuthError } from "./fetchWithAuth";
import { useRouter } from "next/navigation";

interface UsePlanErrorReturn {
  planoBloqueado: boolean;
  mensagemPlano: string;
  executar: <T>(fn: () => Promise<T>) => Promise<T | null>;
  limpar: () => void;
}

export function usePlanError(): UsePlanErrorReturn {
  const [planoBloqueado, setPlanoBloqueado] = useState(false);
  const [mensagemPlano, setMensagemPlano] = useState("");
  const router = useRouter();

  const executar = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof PlanError) {
        setPlanoBloqueado(true);
        setMensagemPlano(err.message);
        return null;
      }
      if (err instanceof AuthError) {
        router.push("/login");
        return null;
      }
      // Erro genérico — relança para o componente tratar
      throw err;
    }
  }, [router]);

  const limpar = useCallback(() => {
    setPlanoBloqueado(false);
    setMensagemPlano("");
  }, []);

  return { planoBloqueado, mensagemPlano, executar, limpar };
}