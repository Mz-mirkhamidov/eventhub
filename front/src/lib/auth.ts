import { API_BASE_URL } from "@/lib/config";
import { getDashboardPathForRole } from "@/lib/dashboard";
import type { AuthResponse, LoginRequest, RegisterRequest, StoredAuth } from "@/types/auth";

export { getDashboardPathForRole };

const AUTH_STORAGE_KEY = "eventhub_auth";

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getToken(): string | null {
  return getStoredAuth()?.token ?? null;
}

function saveAuthResponse(data: AuthResponse): StoredAuth {
  const stored: StoredAuth = {
    token: data.token,
    userId: data.userId,
    role: data.role,
    fullName: data.fullName,
  };
  setStoredAuth(stored);
  return stored;
}

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    if (body.errors) {
      return Object.values(body.errors).join(", ");
    }
    return body.message ?? "So'rov bajarilmadi";
  } catch {
    return "So'rov bajarilmadi";
  }
}

export async function login(request: LoginRequest): Promise<StoredAuth> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = (await res.json()) as AuthResponse;
  return saveAuthResponse(data);
}

export async function register(request: RegisterRequest): Promise<StoredAuth> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  const data = (await res.json()) as AuthResponse;
  return saveAuthResponse(data);
}
