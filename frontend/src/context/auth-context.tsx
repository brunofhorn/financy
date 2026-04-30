/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe } from "../lib/api";
import { ApiError } from "../lib/graphql";
import type { AuthPayload, User } from "../lib/types";

const TOKEN_KEY = "financy.token";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setSession: (payload: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [sessionUser, setSessionUser] = useState<User | null>(null);

  const meQuery = useQuery({
    queryKey: ["me", token],
    queryFn: () => getMe(token as string),
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.code === "UNAUTHENTICATED") {
        return false;
      }

      return failureCount < 1;
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setSessionUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.code === "UNAUTHENTICATED") {
      queueMicrotask(logout);
    }
  }, [logout, meQuery.error]);

  const setSession = useCallback(
    (payload: AuthPayload) => {
      localStorage.setItem(TOKEN_KEY, payload.token);
      setToken(payload.token);
      setSessionUser(payload.user);
      queryClient.setQueryData(["me", payload.token], payload.user);
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: sessionUser ?? meQuery.data ?? null,
      isAuthenticated: Boolean(token),
      isLoadingUser: meQuery.isLoading,
      setSession,
      logout,
    }),
    [logout, meQuery.data, meQuery.isLoading, sessionUser, setSession, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
