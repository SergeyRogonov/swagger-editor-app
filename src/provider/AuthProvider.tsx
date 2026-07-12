"use client";

import AsyncSleep from "@/utils/sleep/sleep";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthOnMount = async () => {
      try {
        const RESPONSE = await fetch("/api/authentication/is-auth", {
          method: "POST",
        });

        const DATA = await RESPONSE.json();
        const HTTP_STATUS = DATA.status;

        await AsyncSleep(200);

        setIsAuth(HTTP_STATUS === 200);
      } catch {
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthOnMount();
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/authentication/logout", { method: "POST" });
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
