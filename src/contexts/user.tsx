import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useSWRService } from "@/services/swr";
import type { AuthenticatedUser } from "@/types/api/auth";
import { ACCESS_TOKEN_KEY, USER_KEY } from "@/constants/auth";
import { API_ENDPOINTS } from "@/constants/api";

interface UserContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: AuthenticatedUser) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const { data, isLoading, mutate } = useSWRService<AuthenticatedUser>(
    token ? API_ENDPOINTS.AUTH.CURRENT : null,
    {
      revalidateOnReconnect: true,
      onSuccess: (userData) => {
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      },
      onError: (error) => {
        console.error("Failed to fetch current user:", error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setUser(null);
      },
    }
  );

  const login = (userData: AuthenticatedUser) => {
    setUser(userData);
    localStorage.setItem(ACCESS_TOKEN_KEY, userData.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    mutate(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    mutate(undefined, false);
  };

  const value: UserContextType = {
    user: user || data || null,
    isAuthenticated: !!(user || data),
    isLoading,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
