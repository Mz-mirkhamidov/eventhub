export type UserRole = "CLIENT" | "ARTIST" | "VENUE" | "BUSINESS" | "BLOGGER" | "ADMIN";

export interface AuthResponse {
  token: string;
  userId: string;
  role: UserRole;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface StoredAuth {
  token: string;
  userId: string;
  role: UserRole;
  fullName: string;
}
