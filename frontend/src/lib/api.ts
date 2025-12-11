const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getApiUrl(path: string) {
  return `${API_URL}${path}`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gym_token");
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gym_token");
}

export async function authFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(getApiUrl(path), {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data as any).message || "Request failed";
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  return data as T;
}
