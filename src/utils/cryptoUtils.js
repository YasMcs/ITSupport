// cryptoUtils.js - Ofuscación IDs en URLs Frontend-only
const SALT = 'ITSupportSec2024!'; // Secreto frontend, cambiar en builds

/**
 * Encripta un ID para usar en URLs
 * @param {number|string} id - El ID a encriptar
 * @returns {string} ID encriptado o null si falla
 * @throws Error si el ID es inválido
 */
export function encodeId(id) {
  // Debug logging
  console.debug('[encodeId] Input:', { id, type: typeof id, isNull: id === null, isUndefined: id === undefined });

  // Validaciones iniciales
  if (id === null || id === undefined || id === '') {
    console.warn('[encodeId] ❌ Entrada nula/indefinida/vacía:', id);
    return null;
  }

  const numId = Number(id);
  
  // Validar que sea número válido
  if (Number.isNaN(numId)) {
    console.error('[encodeId] ❌ ID no es un número válido:', { id, numId });
    return null;
  }

  // Validar que sea entero positivo
  if (!Number.isInteger(numId) || numId <= 0) {
    console.error('[encodeId] ❌ ID debe ser entero positivo:', { id, numId, isInteger: Number.isInteger(numId) });
    return null;
  }

  const strId = numId.toString();
  const salted = strId + SALT;
  
  try {
    const encoded = btoa(salted);
    const result = encoded.replace(/=/g, '');
    console.debug('[encodeId] ✅ Éxito:', { input: id, output: result, tipo: 'encoded' });
    return result;
  } catch (error) {
    console.error('[encodeId] ❌ Error en btoa:', error);
    return null;
  }
}

/**
 * Decodifica un ID desde URL
 * @param {string} encoded - El ID encriptado
 * @returns {number|null} ID decodificado o null si falla
 */
export function decodeId(encoded) {
  // Debug logging
  console.debug('[decodeId] Input:', { encoded, type: typeof encoded, length: encoded?.length, isNull: encoded === null });

  if (!encoded || encoded === 'null' || encoded === 'undefined') {
    console.warn('[decodeId] ❌ Entrada vacía/null/undefined:', encoded);
    return null;
  }

  try {
    // Restaurar padding
    const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    
    // Decodificar base64
    const salted = atob(padded);
    
    // Remover salt
    const idStr = salted.replace(SALT, '');
    
    // Convertir a número
    const id = Number.parseInt(idStr, 10);
    
    // Validar resultado
    if (Number.isNaN(id)) {
      console.error('[decodeId] ❌ parseInt devolvió NaN:', { encoded, idStr, id });
      return null;
    }

    if (id <= 0) {
      console.error('[decodeId] ❌ ID no es positivo:', { encoded, id });
      return null;
    }

    console.debug('[decodeId] ✅ Éxito:', { input: encoded, output: id, tipo: 'decoded' });
    return id;
  } catch (error) {
    console.error('[decodeId] ❌ Error durante decodificación:', { encoded, error: error.message });
    return null;
  }
}

// Test (borrar en prod)
console.log('Test cryptoUtils:', encodeId(1), decodeId(encodeId(1)) === 1);

