// cryptoUtils.js - Ofuscación IDs en URLs Frontend-only
const SALT = 'ITSupportSec2024!'; // Secreto frontend, cambiar en builds

export function encodeId(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) return null;
  const strId = numId.toString();
  const salted = strId + SALT;
  try {
    const encoded = btoa(salted);
    return encoded.replace(/=/g, '');
  } catch {
    return null;
  }
}

export function decodeId(encoded) {
  if (!encoded) return null;
  try {
    const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    const salted = atob(padded);
    const idStr = salted.replace(SALT, '');
    const id = Number.parseInt(idStr, 10);
    if (Number.isNaN(id) || id <= 0) return null;
    return id;
  } catch {
    return null;
  }
}

// Test (borrar en prod)
console.log('Test cryptoUtils:', encodeId(1), decodeId(encodeId(1)) === 1);

