// cryptoUtils.js - Ofuscación IDs en URLs Frontend-only
const SALT = 'ITSupportSec2024!'; // Secreto frontend, cambiar en builds

export function encodeId(id) {
  if (!Number.isInteger(id) || id <= 0) throw new Error('ID debe ser entero positivo');
  const strId = id.toString();
  const salted = strId + SALT;
  const encoded = btoa(salted);
  return encoded.replace(/=/g, ''); // Limpia padding para URL clean
}

export function decodeId(encoded) {
  if (!encoded) throw new Error('Hash requerido');
  try {
    const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    const salted = atob(padded);
    const idStr = salted.replace(SALT, '');
    const id = Number.parseInt(idStr, 10);
    if (Number.isNaN(id) || id <= 0) throw new Error('ID inválido');
    return id;
  } catch {
    throw new Error('Hash inválido');
  }
}

// Test (borrar en prod)
console.log('Test cryptoUtils:', encodeId(1), decodeId(encodeId(1)) === 1);

