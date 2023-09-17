"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { api } from "@/services/client";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

interface LoginProps {
  email: string;
  password: string;
}
interface AuthContextProps {
  login: ({ email, password }: LoginProps) => Promise<void>;
  logout: () => void;
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState(() => {
    return Cookies.get("auth_token_todo") || null;
  });
  const navigate = useRouter();
  const pathname = usePathname();

  const login = async ({ email, password }: LoginProps) => {
    const { data } = await api.post("/auth", { email, password });
    setToken(data.accessToken);
    Cookies.set("auth_token_todo", data.accessToken, {
      sameSite: "Lax",
    });
  };

  const logout = () => {
    Cookies.remove("auth_token_todo");
    setToken(null);
  };

  useEffect(() => {
    if (token === null) {
      if (
        (pathname !== "/" && pathname === "/dashboard") ||
        pathname === "/profile"
      ) {
        navigate.push("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
