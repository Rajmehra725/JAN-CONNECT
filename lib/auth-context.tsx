"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, UserProfile } from "./api";

export type UserRole = "SUPER_ADMIN" | "POLITICIAN" | "PA_STAFF" | "BOOTH_WORKER" | "CITIZEN";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (
    mobileNumber: string,
    password: string,
    captchaId?: string,
    captchaAnswer?: string
  ) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function getDashboardPath(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "POLITICIAN":
      return "/politician/dashboard";
    case "PA_STAFF":
      return "/staff/dashboard";
    case "BOOTH_WORKER":
      return "/worker/dashboard";
    case "CITIZEN":
    default:
      return "/citizen/dashboard";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (
    mobileNumber: string,
    password: string,
    captchaId?: string,
    captchaAnswer?: string
  ) => {
    try {
      const res = await authApi.login(mobileNumber, password, captchaId, captchaAnswer);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        return {
          success: true,
          message: res.message,
          role: res.data.user.role as UserRole,
        };
      }
      return {
        success: false,
        message: res.message || "लॉगिन विफल रहा।",
      };
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "सर्वर त्रुटि।",
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Hook to guard protected dashboard pages.
 * Prevents flashing private content and handles role redirection safely.
 */
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setAuthorized(false);
      router.replace("/login");
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role as UserRole)) {
        // Redirect user to their own role dashboard
        setAuthorized(false);
        router.replace(getDashboardPath(user.role));
        return;
      }
    }

    setAuthorized(true);
  }, [user, loading, allowedRoles, router]);

  return { user, loading: loading || !authorized, authorized };
}
