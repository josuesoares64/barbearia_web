"use client";

interface RegisterPayload {
  username: string;
  email: string;
  senha: string;
}

export async function registerUser(payload: RegisterPayload) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Erro ao registrar usuário");
  }

  return res.json();
}