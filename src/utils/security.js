const SUSPICIOUS_HTML_PATTERN = /<\s*\/?\s*(script|iframe|object|embed|svg|math|style|link|meta)[^>]*>/gi;
const GENERIC_HTML_TAG_PATTERN = /<[^>]+>/g;
const INLINE_EVENT_PATTERN = /\bon\w+\s*=/gi;
const JS_PROTOCOL_PATTERN = /javascript:/gi;
const DATA_HTML_PATTERN = /data\s*:\s*text\/html/gi;
const HTML_BRACKET_PATTERN = /[<>]/g;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SQLI_PATTERN =
  /(?:\bunion\b\s+\bselect\b|\bdrop\b\s+\btable\b|\binsert\b\s+\binto\b|\bdelete\b\s+\bfrom\b|\bupdate\b\s+\w+\s+\bset\b|(?:^|[\s'"`;])or\s+['"\d]+\s*=\s*['"\d]+|(?:^|[\s'"`;])and\s+['"\d]+\s*=\s*['"\d]+|\bxp_cmdshell\b|\binformation_schema\b|\bsleep\s*\(|\bbenchmark\s*\(|\/\*|\*\/)/gi;
const NOSQL_PATTERN = /\$(?:ne|gt|gte|lt|lte|regex|where)\b/gi;
const TEMPLATE_INJECTION_PATTERN = /(?:\{\{[\s\S]*\}\}|\$\{[\s\S]*\})/g;
const SUSPICIOUS_HTML_CHECK = /<\s*\/?\s*(script|iframe|object|embed|svg|math|style|link|meta)[^>]*>/i;
const GENERIC_HTML_TAG_CHECK = /<[^>]+>/i;
const INLINE_EVENT_CHECK = /\bon\w+\s*=/i;
const JS_PROTOCOL_CHECK = /javascript:/i;
const DATA_HTML_CHECK = /data\s*:\s*text\/html/i;
const HTML_BRACKET_CHECK = /[<>]/;
const SQLI_CHECK =
  /(?:\bunion\b\s+\bselect\b|\bdrop\b\s+\btable\b|\binsert\b\s+\binto\b|\bdelete\b\s+\bfrom\b|\bupdate\b\s+\w+\s+\bset\b|(?:^|[\s'"`;])or\s+['"\d]+\s*=\s*['"\d]+|(?:^|[\s'"`;])and\s+['"\d]+\s*=\s*['"\d]+|\bxp_cmdshell\b|\binformation_schema\b|\bsleep\s*\(|\bbenchmark\s*\(|\/\*|\*\/)/i;
const NOSQL_CHECK = /\$(?:ne|gt|gte|lt|lte|regex|where)\b/i;
const TEMPLATE_INJECTION_CHECK = /(?:\{\{[\s\S]*\}\}|\$\{[\s\S]*\})/i;
const CONTROL_CHAR_CHECK = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,60}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function stripUnsafeFragments(value = "") {
  return String(value)
    .replace(SUSPICIOUS_HTML_PATTERN, "")
    .replace(GENERIC_HTML_TAG_PATTERN, "")
    .replace(INLINE_EVENT_PATTERN, "")
    .replace(JS_PROTOCOL_PATTERN, "")
    .replace(DATA_HTML_PATTERN, "")
    .replace(SQLI_PATTERN, "")
    .replace(NOSQL_PATTERN, "")
    .replace(TEMPLATE_INJECTION_PATTERN, "")
    .replace(CONTROL_CHAR_PATTERN, "");
}

export function normalizeTextInput(value = "") {
  return stripUnsafeFragments(value)
    .replace(/[<>]/g, "")
    .replace(/\s{3,}/g, "  ")
    .trim();
}

export function containsForbiddenInput(value = "") {
  const raw = String(value);
  return (
    SUSPICIOUS_HTML_CHECK.test(raw) ||
    GENERIC_HTML_TAG_CHECK.test(raw) ||
    INLINE_EVENT_CHECK.test(raw) ||
    JS_PROTOCOL_CHECK.test(raw) ||
    DATA_HTML_CHECK.test(raw) ||
    HTML_BRACKET_CHECK.test(raw) ||
    SQLI_CHECK.test(raw) ||
    NOSQL_CHECK.test(raw) ||
    TEMPLATE_INJECTION_CHECK.test(raw) ||
    CONTROL_CHAR_CHECK.test(raw)
  );
}

export function validateRequiredText(value, { min = 1, max = 3000 } = {}) {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) {
    return "Este campo es obligatorio";
  }

  if (cleanValue.length < min) {
    return `Este campo debe tener al menos ${min} caracteres`;
  }

  if (cleanValue.length > max) {
    return `Este campo no puede superar ${max} caracteres`;
  }

  return "";
}

export function validateName(value, label = "El nombre") {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) return `${label} es obligatorio`;
  if (!NAME_PATTERN.test(cleanValue)) return `${label} contiene caracteres no permitidos`;

  return "";
}

export function validateUsername(value) {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) return "El nombre de usuario es obligatorio";
  if (!USERNAME_PATTERN.test(cleanValue)) return "El nombre de usuario solo permite letras, numeros, punto, guion y guion bajo";

  return "";
}

export function validateEmail(value) {
  const cleanValue = normalizeTextInput(value).toLowerCase();

  if (!cleanValue) return "El correo electronico es obligatorio";
  if (!EMAIL_PATTERN.test(cleanValue)) return "El correo electronico no es valido";

  return "";
}

export function sanitizeSessionUser(user) {
  if (!user) return null;

  const {
    contrasena_hash,
    password,
    accessToken,
    refreshToken,
    ...safeUser
  } = user;

  return safeUser;
}

export function maskSecret(secret = "") {
  const trimmed = String(secret).trim();
  if (!trimmed) return undefined;

  return `masked_${trimmed.length}_chars`;
}

export function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, skewSeconds = 30) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return Number(payload.exp) <= nowInSeconds + skewSeconds;
}
