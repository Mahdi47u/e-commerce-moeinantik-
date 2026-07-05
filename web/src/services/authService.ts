import { apiFetch } from "@/lib/api";
import type { AuthResponse, LoginRequest, OtpRequest, OtpRequestResponse, OtpVerifyRequest, RegisterRequest, User } from "@/types/auth";

export function login(data: LoginRequest) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function requestOtp(data: OtpRequest) {
  return apiFetch<OtpRequestResponse>("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyOtp(data: OtpVerifyRequest) {
  return apiFetch<AuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser(token: string) {
  return apiFetch<User>("/users/me", {
    token,
  });
}
