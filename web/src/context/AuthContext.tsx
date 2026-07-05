"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
  requestOtp as requestOtpRequest,
  verifyOtp as verifyOtpRequest,
} from "@/services/authService";
import type { AuthResponse, LoginRequest, OtpRequest, OtpRequestResponse, OtpVerifyRequest, RegisterRequest, User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  requestOtp: (data: OtpRequest) => Promise<OtpRequestResponse>;
  verifyOtp: (data: OtpVerifyRequest) => Promise<AuthResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    getCurrentUser(savedToken)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(data: LoginRequest) {
    const response = await loginRequest(data);
    persistAuth(response);
    return response;
  }

  async function register(data: RegisterRequest) {
    const response = await registerRequest(data);
    persistAuth(response);
    return response;
  }

  async function requestOtp(data: OtpRequest) {
    return requestOtpRequest(data);
  }

  async function verifyOtp(data: OtpVerifyRequest) {
    const response = await verifyOtpRequest(data);
    persistAuth(response);
    return response;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  function persistAuth(response: AuthResponse) {
    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(response.user);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, requestOtp, verifyOtp, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
