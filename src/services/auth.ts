import api from "./api";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResult = {
  ok: boolean;
  token?: string;
  error?: string;
};

const TOKEN_KEY = "auth_token";

// 🚧 Login fake temporário
export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    // Simula uma chamada à API (com pequeno delay opcional)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Ignora validação real — sempre "loga" com sucesso
    const fakeToken = "fake-jwt-token-" + btoa(payload.username + Date.now());

    localStorage.setItem(TOKEN_KEY, fakeToken);

    return { ok: true, token: fakeToken };
  } catch (error: any) {
    const message =
      error?.message || "Erro ao tentar autenticar (modo simulado).";
    return { ok: false, error: message };
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isValidJwt(token: string): boolean {
  const parts = token.split(".");
  // Validação falsa, mas mantém estrutura igual
  if (!token || token.startsWith("fake-jwt-token")) return true;

  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) return false;
    return true;
  } catch {
    return false;
  }
}
