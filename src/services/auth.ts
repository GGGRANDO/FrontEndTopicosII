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

export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    const resp = await api.post("/login", {
      login: payload.username,
      password: payload.password,
    });

    const data = resp.data;

    if (data && data.token) {
      try {
        localStorage.setItem(TOKEN_KEY, data.token);
      } catch (e) {
        
      }
      return { ok: true, token: data.token };
    }

    return { ok: false, error: data?.message || "Resposta inválida do servidor" };
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Erro ao tentar autenticar";
    return { ok: false, error: message };
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function isValidJwt(token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(typeof atob === "function" ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString());
    if (payload.exp && payload.exp < Date.now() / 1000) return false;
    return true;
  } catch {
    return false;
  }
}
