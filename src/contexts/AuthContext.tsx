import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { AppUser } from "@/types/app";

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAuthData: (_token: string, user: AppUser) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  setAuthData: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api<{ user: AppUser }>("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      await refreshUser();
      setLoading(false);
    };

    void boot();
  }, [refreshUser]);

  const setAuthData = useCallback((_token: string, nextUser: AppUser) => {
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api<{ message: string }>("/auth/logout", { method: "POST" });
    } catch {
      // Ignore backend failure and still clear local state.
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOut, setAuthData, refreshUser }),
    [user, loading, signOut, setAuthData, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
