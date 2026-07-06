"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

interface AuthContextType {
  isAuth: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMounted = useRef(true);

  useEffect(() => {
    const checkAuthOnMount = async () => {
      try {
        const RESPONSE = await fetch("/api/authentication/is-auth", {
          method: "POST",
        });
        if (isMounted.current) {
          setIsAuth(RESPONSE.status === 200);
        }
      } catch {
        if (isMounted.current) {
          setIsAuth(false);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    checkAuthOnMount();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const RESPONSE = await fetch("/api/authentication/is-auth", {
        method: "POST",
      });
      if (isMounted.current) {
        setIsAuth(RESPONSE.status === 200);
      }
    } catch {
      if (isMounted.current) {
        setIsAuth(false);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, checkAuth }}>
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
