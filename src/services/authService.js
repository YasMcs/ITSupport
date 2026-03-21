import axios from "axios";
import {
  enrichMockUser,
  getMockUserById,
  mockUserCredentials,
} from "../utils/mockUsers";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const USE_DUMMIES = import.meta.env.DEV && import.meta.env.VITE_USE_DUMMIES !== "false";

/**
 * Busca un usuario mock por email y password
 */
function findDummyUser(email, password) {
  const credentials = mockUserCredentials.find(
    (item) => item.email === email && item.password === password
  );

  if (credentials) {
    const user = enrichMockUser(getMockUserById(credentials.user_id));

    // Simular delay de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user,
          token: `dummy-token-${user.id}`,
        });
      }, 500);
    });
  }
  return Promise.reject(new Error("Credenciales inválidas"));
}

export const authService = {
  async login(credentials) {
    // En desarrollo, usar datos dummy si están habilitados
    if (USE_DUMMIES) {
      try {
        return await findDummyUser(credentials.email, credentials.password);
      } catch (error) {
        // Si no se encuentra en dummies, intentar con el backend
        // Solo si el backend está disponible
      }
    }

    // Llamada al backend real
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
      return data;
    } catch (error) {
      // Si falla el backend y estamos en desarrollo, intentar con dummies como fallback
      if (import.meta.env.DEV) {
        try {
          return await findDummyUser(credentials.email, credentials.password);
        } catch (dummyError) {
          // Si tampoco está en dummies, lanzar el error original del backend
          throw error;
        }
      }
      throw error;
    }
  },
  async logout() {
    // Implementar según backend
  },
};
