import { api, clearAuthToken, extractData, setAuthToken } from "./api";
import { normalizeUser } from "../utils/apiMappers";
import { containsForbiddenInput } from "../utils/security";

export const authService = {
  async login(credentials) {
    if (containsForbiddenInput(credentials.email) || containsForbiddenInput(credentials.password)) {
      return Promise.reject(new Error("Deteccion de caracteres no permitidos"));
    }

    const response = await api.post("/auth/login", {
      email: credentials.email,
      correo: credentials.email,
      password: credentials.password,
      contrasena: credentials.password,
    });

    const payload = extractData(response) ?? response?.data ?? {};
    const userPayload = payload.user ?? payload.usuario ?? payload;
    const token = payload.token ?? payload.accessToken ?? payload.jwt ?? null;
    let normalizedUser = normalizeUser(userPayload);

    if (token) {
      setAuthToken(token);

      try {
        const meResponse = await api.get("/usuarios/me");
        normalizedUser = normalizeUser({
          ...userPayload,
          ...(extractData(meResponse) ?? {}),
        });
      } catch {
        normalizedUser = normalizeUser(userPayload);
      }
    }

    return {
      user: normalizedUser,
      token,
    };
  },

  async changePassword({ userId, currentPassword, newPassword }) {
    const response = await api.put(`/usuarios/${userId}/contrasena`, null, {
      params: {
        contrasenaActual: currentPassword,
        contrasenaNueva: newPassword,
      },
    });
    return extractData(response);
  },

  async getCurrentUser() {
    const response = await api.get("/usuarios/me");
    return normalizeUser(extractData(response));
  },

  async logout() {
    clearAuthToken();
  },
};
