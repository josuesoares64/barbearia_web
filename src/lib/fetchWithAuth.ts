import Cookies from "js-cookie";

// Erro especial para bloqueio de plano
export class PlanError extends Error {
  type = "PLAN_ERROR" as const;
  constructor(message: string) {
    super(message);
    this.name = "PlanError";
  }
}

// Erro para sessão expirada
export class AuthError extends Error {
  type = "AUTH_ERROR" as const;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = Cookies.get("barber.token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    throw new AuthError("Sessão expirada. Faça login novamente.");
  }

  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    throw new PlanError(data.error || "Seu plano não inclui esta funcionalidade.");
  }

  return res;
}