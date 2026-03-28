import { api } from "./api";

const TOKEN_STORAGE_KEY = "token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function login(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    const token = response.data?.token;

    if (token) {
      setAuthToken(token);
    }

    return response.data;
  } catch (error) {
    console.error("[Auth] Falha no login:", error.message);
    throw error;
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("[Auth] Falha no logout:", error.message);
    throw error;
  } finally {
    clearAuthToken();
  }
}
