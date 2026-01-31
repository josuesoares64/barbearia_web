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
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
        console.error("Erro ao carregar usuário salvo");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch("NEXT_PUBLIC_API_URL/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erro no login");

      // 1. Decodifica o Token que o Backend gerou (com o novo campo 'slug')
      const token = data.accessToken; 
      const decoded: any = jwtDecode(token);

      // 2. Captura o slug dinâmico (prioriza o que vem no JSON, fallback para o Token)
      const slugDaBarbearia = data.slug || decoded.slug; 

      if (!slugDaBarbearia) {
        throw new Error("Erro: Unidade não identificada para este usuário.");
      }

      const userData: User = {
        id: decoded.id,
        email: decoded.email,
        // Garante que 'Dono' ou 'Barbeiro' vire 'dono' ou 'barbeiro'
        role: (decoded.role || "").toLowerCase(),
        slug: slugDaBarbearia
      };

      // 3. Persistência nos Cookies
      Cookies.set("barber.token", token, { expires: 7 });
      Cookies.set("barber.user", JSON.stringify(userData), { expires: 7 });

      setUser(userData);

      // 4. Redirecionamento Dinâmico para a barbearia correta do banco
      router.push(`/${slugDaBarbearia}/dashboard`); 
      
    } catch (error: any) {
      alert(error.message);
    }
  };

  const logout = () => {
    Cookies.remove("barber.token");
    Cookies.remove("barber.user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);