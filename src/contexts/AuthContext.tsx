"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  role: string;
  slug: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  cadastrar: (dados: { username: string; email: string; senha: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("barber.token");
    const savedUser = Cookies.get("barber.user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro no login");

    const token = data.accessToken;
    const decoded: any = jwtDecode(token);
    const slug = data.slug || decoded.slug || "";

    const userData: User = {
      id: decoded.id,
      email: decoded.email,
      role: (decoded.role || "").toLowerCase(),
      slug: slug,
    };

    Cookies.set("barber.token", token, { expires: 7 });
    Cookies.set("barber.user", JSON.stringify(userData), { expires: 7 });
    setUser(userData);

    // Redirecionamento inteligente
    if (!slug) {
      router.push("/criar-barbearia");
    } else {
      router.push(`/${slug}/dashboard`);
    }
  };

  const cadastrar = async ({ username, email, senha }: any) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, senha }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Erro ao criar conta");
  };

  const logout = () => {
    Cookies.remove("barber.token");
    Cookies.remove("barber.user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, cadastrar, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);