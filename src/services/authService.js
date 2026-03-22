import {
  enrichMockUser,
  getMockUserById,
  mockUserCredentials,
} from "../utils/mockUsers";
import { containsForbiddenInput } from "../utils/security";

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
    if (containsForbiddenInput(credentials.email) || containsForbiddenInput(credentials.password)) {
      return Promise.reject(new Error("Deteccion de caracteres no permitidos"));
    }

    return findDummyUser(credentials.email, credentials.password);
  },
  async logout() {
    // Implementar según backend
  },
};
