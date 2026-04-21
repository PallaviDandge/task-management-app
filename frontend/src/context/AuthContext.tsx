import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import api from "../api/client";
import type { AuthResponse, User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthContextValue = AuthState & {
  isReady: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const storageKey = "taskflow_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem(storageKey);

    if (savedAuth) {
      setAuth(JSON.parse(savedAuth) as AuthState);
    }

    setIsReady(true);
  }, []);

  const persistAuth = (nextAuth: AuthState) => {
    setAuth(nextAuth);
    localStorage.setItem(storageKey, JSON.stringify(nextAuth));
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    persistAuth({
      user: data.user,
      token: data.token,
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
    });

    persistAuth({
      user: data.user,
      token: data.token,
    });
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem(storageKey);
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isReady,
      isAuthenticated: Boolean(auth.token),
      login,
      register,
      logout,
    }),
    [auth, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
