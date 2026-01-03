"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  FC,
} from "react";
import { User } from "@/types/auth.type";
import { clearTokens } from "@/lib/actions/token";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: (redirectPath: string) => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string | null, refresh: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{
  children: ReactNode;
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: User | null;
}> = ({
  children,
  accessToken: initialAccess,
  refreshToken: initialRefresh,
  user: initialUser,
}) => {
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(
    initialAccess ?? null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    initialRefresh ?? null
  );
  const router = useRouter();
  const isAuthenticated = useMemo(() => !!user, [user]);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
  };

  const handleLogout = async (redirectPath: string = "/login") => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push(redirectPath); // Redirect to login page on success
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error || "Unknown error");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const setTokens = (access: string | null, refresh: string | null) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      setUser: handleSetUser,
      logout: handleLogout,
      accessToken,
      refreshToken,
      setTokens,
    }),
    [user, accessToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
