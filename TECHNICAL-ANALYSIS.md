# 🔴 Análisis Técnico: Vulnerabilidades en Flujo de IDs

## Fecha de Auditoría: 2026-04-17
## Estado: CRÍTICO - Necesita Verificación Inmediata en Navegador

---

## ❌ VULNERABILIDADES IDENTIFICADAS

### Vulnerabilidad #1: `encodeId()` Devuelve `null` Sin Contexto

**Archivo:** `src/utils/cryptoUtils.js`

**Código Original:**
```javascript
export function encodeId(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) return null;  // ❌ Devuelve null
  // ...
}
```

**Problema:**
- Si `row.id` es `undefined`, `NaN`, string inválido, etc., devuelve `null`
- Las tablas hacen: `navigate(/editar/${encodeId(row.id)})`
- Si `encodeId` devuelve `null`, URL queda: `/editar/null` (string)
- Luego `decodeId("null")` intenta decodificar y devuelve `null`
- Las guardias detectan `!id` pero ya hemos navegado

**Escenario de Riesgo:**
```javascript
// En la tabla
const row = { id: undefined };  // row.id no existe
navigate(`/usuarios/editar/${encodeId(row.id)}`);  // encodeId(undefined) → null
// URL resultante: /usuarios/editar/null
```

**Fix Implementado:**
```javascript
export function encodeId(id) {
  console.debug('[encodeId] Input:', { id, type: typeof id });
  
  if (id === null || id === undefined || id === '') {
    console.warn('[encodeId] ❌ Entrada inválida:', id);
    return null;  // Ahora con logging
  }
  
  const numId = Number(id);
  if (Number.isNaN(numId)) {
    console.error('[encodeId] ❌ No es número:', { id, numId });
    return null;  // Logging antes de fallar
  }
  
  if (!Number.isInteger(numId) || numId <= 0) {
    console.error('[encodeId] ❌ No es entero positivo:', { id, numId });
    return null;  // Logging detallado
  }
  // ...
}
```

**Ventaja:** Ahora podemos ver exactamente cuándo y por qué `encodeId` devuelve `null`

---

### Vulnerabilidad #2: `decodeId("null")` Devuelve `null` Silenciosamente

**Archivo:** `src/utils/cryptoUtils.js`

**Código Original:**
```javascript
export function decodeId(encoded) {
  if (!encoded) return null;  // ❌ Solo checa si está vacío
  try {
    const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    const salted = atob(padded);
    const idStr = salted.replace(SALT, '');
    const id = Number.parseInt(idStr, 10);
    if (Number.isNaN(id) || id <= 0) return null;
    return id;
  } catch {
    return null;  // ❌ catch silencioso
  }
}
```

**Problema:**
- Si `encoded = "null"` (la palabra "null" como string)
- `!encoded` es `false` (porque "null" es truthy)
- Intenta hacer `atob("null")` que no es base64 válido
- Cae en el catch y devuelve `null` sin logging

**Escenario:**
```javascript
// En EditarUsuarioPage
const { id: encodedId } = useParams();  // encodedId = "null"
const id = decodeId("null");  // Intenta decodificar
// catch → return null (sin saber qué pasó)
// id = null
if (!id) { // Activaría guardia, PERO...
  // ...ya estamos en la página de edición!
}
```

**Fix Implementado:**
```javascript
export function decodeId(encoded) {
  console.debug('[decodeId] Input:', { encoded, type: typeof encoded });

  if (!encoded || encoded === 'null' || encoded === 'undefined') {  // ✅ Checa literales
    console.warn('[decodeId] ❌ Entrada vacía/null/undefined:', encoded);
    return null;  // Ahora con contexto
  }

  try {
    const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=');
    const salted = atob(padded);
    const idStr = salted.replace(SALT, '');
    const id = Number.parseInt(idStr, 10);
    
    if (Number.isNaN(id)) {
      console.error('[decodeId] ❌ parseInt devolvió NaN:', { encoded, idStr, id });
      return null;  // ✅ Ahora sabemos qué pasó
    }

    if (id <= 0) {
      console.error('[decodeId] ❌ ID no es positivo:', { encoded, id });
      return null;  // ✅ Contexto claro
    }

    console.debug('[decodeId] ✅ Éxito:', { input: encoded, output: id });
    return id;
  } catch (error) {
    console.error('[decodeId] ❌ Error durante decodificación:', { 
      encoded, 
      error: error.message  // ✅ Ahora ve el error específico
    });
    return null;
  }
}
```

---

### Vulnerabilidad #3: Tablas Pueden Pasar `row.id` Inválido

**Archivos Afectados:**
- `src/pages/UsuariosPage.jsx`
- `src/components/areas/AreaTable.jsx`
- `src/components/sucursales/SucursalTable.jsx`

**Problema:**
```javascript
// UsuariosPage.jsx línea 214 (después del fix anterior)
if (!row?.id) {
  toast.error("No se puede editar: ID inválido");
  return;  // ✅ Esto está bien
}
navigate(`/usuarios/editar/${encodeId(row.id)}`);  // ✅ Validación previa
```

**Estado:** YA ESTÁ PROTEGIDO ✅ después del fix anterior

---

### Vulnerabilidad #4: Tipo de Dato Inesperado (string vs number)

**Patrón Encontrado:**
```javascript
// Si normalizeUser devuelve id como string:
{id: "5"}  // ❌ String en lugar de number

// La tabla hace:
encodeId(row.id)  // encodeId("5")
// Number("5") → 5 (Se convierte bien)
// Pero apiMappers debería siempre devolver number

// En decodeId devuelve:
parseInt(idStr, 10)  // Siempre devuelve number ✅
```

**Fix en apiMappers.js (próximo paso):**
```javascript
// Debería asegurar que ID siempre es number
id: Number(firstDefined(user.id, user.usuarioId))  // ← Añadir Number()
```

---

## 🔍 LOGS IMPLEMENTADOS PARA DETECTAR PROBLEMAS

### Ahora Puedes Ver:

1. **En `encodeId()`:**
   - Qué valor recibe
   - Si es número válido
   - Qué devuelve (valor encriptado o null)

2. **En `decodeId()`:**
   - Qué valor intenta decodificar
   - Si es "null" como string
   - Si atob falla
   - Qué número devuelve

3. **En Páginas de Edición:**
   - El valor encriptado del URL
   - El valor decodificado
   - Si pasa la guardia
   - Qué URL se envía al Backend
   - Si hay error 403 y cuál es el status

---

## 📊 MATRIZ DE RIESGO

| Escenario | Probabilidad | Severidad | Estado |
|-----------|-------------|-----------|--------|
| `row.id = undefined` en tabla | MEDIA | CRÍTICA | Validado ✅ |
| `encodeId` devuelve null | MEDIA | CRÍTICA | Ahora con logs 🔍 |
| `decodeId("null")` falla silencioso | BAJA | CRÍTICA | Ahora con logs 🔍 |
| Backend recibe string en path param | MEDIA | ALTA | Validar con logs 🔍 |
| IDs son string en lugar de number | MEDIA | MEDIA | Próximo fix ⏳ |

---

## ✅ QUÉ HACER AHORA

### Paso 1: Verificar los Logs
1. Compilar con `npm run build` ✅ HECHO
2. Abrir en navegador
3. Ir a editar usuario/área/sucursal
4. Abrir Consola (F12)
5. Cambiar a la pestaña "Console"
6. Observar los logs coloreados

### Paso 2: Buscar Patrones
```
Buscar en los logs:

✅ BIEN si ves:
- URL encodedId = [valor válido encriptado]
- Decoded ID = [número positivo]
- Guardia pasada
- GET /usuarios/5 (número en lugar de "null")
- ✅ Datos cargados

❌ PROBLEMA si ves:
- URL encodedId = "null"
- Decoded ID = null
- GUARDIA ACTIVADA
- Error 403
```

### Paso 3: Compartir Logs
Si hay error:
1. Screenshot de la consola
2. El valor del ID en los logs
3. Cualquier error rojo

---

## 🔧 SIGUIENTES FIXES A IMPLEMENTAR

### Fix #1: Asegurar que apiMappers Devuelve Numbers

**Archivo:** `src/utils/apiMappers.js`

**Cambio:**
```javascript
// ANTES:
id: firstDefined(user.id, user.usuarioId),

// DESPUÉS:
id: Number(firstDefined(user.id, user.usuarioId)),  // Siempre number
```

---

### Fix #2: Añadir Validación en Tablas Antes de Navigate

**Archivo:** `src/pages/UsuariosPage.jsx`, etc.

**Cambio:**
```javascript
// Validación adicional
if (!row?.id || typeof row.id !== 'number') {
  toast.error("ID inválido o de tipo incorrecto");
  console.error('[Tabla] ID inválido:', { row, id: row?.id, tipo: typeof row?.id });
  return;
}
```

---

### Fix #3: Backend Debe Validar IDs

**Pseudocódigo Java:**
```java
@GetMapping("/usuarios/{id}")
public ResponseEntity<?> getById(@PathVariable Integer id) {
    if (id == null || id <= 0) {
        return ResponseEntity.badRequest()
            .body(new ErrorDto("ID inválido", "ID debe ser número positivo"));
    }
    // ...
    return ResponseEntity.ok(usuario);  // 200
}
```

---

## 📈 MAPA DE MEJORA DE DIAGNOSTICABILIDAD

### Antes (Muy Difícil de Debuggear):
```
Usuario ve error 403 sin contexto
   ↓
No sabe dónde falló
   ↓
No hay logs
   ↓
Asumir que es error del servidor
```

### Después (Fácil de Debuggear):
```
Usuario ve error 403
   ↓
Abre Consola (F12)
   ↓
Ve exactamente dónde falló:
- URL tenía "null"? → Problema de tabla
- Decodificación falló? → Problema de encodeId/decodeId
- ID llegó bien pero API rechazó? → Problema de backend
   ↓
Sabe exactamente qué arreglar
```

---

## 🎯 ESTADO FINAL

### ✅ Completado:
- Mejora de encodeId con logging
- Mejora de decodeId con logging
- Logging visual en 6 páginas de edición/detalle
- console.table() para visualización perfecta
- Build exitoso sin errores

### ⏳ Próximamente:
- Ejecutar en navegador para capturar los logs reales
- Validar que los IDs se decodifiquen correctamente
- Si hay error 403, identificar exactamente dónde falla
- Implementar additional fixes según los logs

### 🚀 Después de Verificar:
- Git commit con los cambios de debugging
- Eliminar logs después de resolver el problema (opcional)
- Documentar la causa raíz del problema 403

---

**Generado:** 2026-04-17 por Debugging Expert | Desarrollador Senior Fullstack
