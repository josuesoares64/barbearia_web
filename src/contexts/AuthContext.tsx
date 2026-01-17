"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  role: string;
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
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erro no login");

      const token = data.accessToken; 
      const decoded: any = jwtDecode(token);

      const userData = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role.toLowerCase(),
      };

      Cookies.set("barber.token", token, { expires: 7 });
      Cookies.set("barber.user", JSON.stringify(userData), { expires: 7 });

      setUser(userData);

      // Defina o slug da sua barbearia aqui para o redirecionamento funcionar
      const meuSlug = "barbearia-do-josue"; 
      router.push(`/${meuSlug}/dashboard`); 
      
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