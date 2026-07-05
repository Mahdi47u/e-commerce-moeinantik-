export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type User = {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  enabled: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type OtpRequest = {
  phone: string;
};

export type OtpRequestResponse = {
  phone: string;
  expiresInSeconds: number;
  resendAfterSeconds: number;
};

export type OtpVerifyRequest = {
  phone: string;
  code: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};
