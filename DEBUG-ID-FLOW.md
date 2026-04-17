# 🔍 Guía de Debugging: Flujo de IDs en Edición

## ¿Qué se ha implementado?

Se agregó **logging exhaustivo** en 6 páginas críticas para rastrear exactamente qué sucede con los IDs:

### Páginas con Debugging Activado:
1. ✅ `EditarUsuarioPage.jsx`
2. ✅ `UsuarioDetallePage.jsx`
3. ✅ `EditarAreaPage.jsx`
4. ✅ `AreaDetallePage.jsx`
5. ✅ `EditarSucursalPage.jsx`
6. ✅ `SucursalDetallePage.jsx`

---

## 🚀 Cómo Verificar el Debugging

### PASO 1: Abrir la Consola del Navegador
1. En el navegador (Chrome, Firefox, Safari)
2. Presiona **F12** o Ctrl+Shift+I
3. Ve a la pestaña **"Console"** (Consola)

### PASO 2: Navegar a una Página de Edición
1. Ve a **Usuarios** → Click en el botón **Editar** de cualquier usuario
2. O ve a **Áreas** → Click en el botón **Editar** de cualquier área
3. O ve a **Sucursales** → Click en el botón **Editar** de cualquier sucursal

### PASO 3: Observar la Consola

Deberías ver un **grupo de logs coloreado** como este:

```
[EditarUsuarioPage - DEBUG]  (color amarillo/rojo)

URL encodedId         |  "x7k2mP9qL"
Tipo de encodedId     |  "string"
Es null o undefined   |  false
Valor es "null"       |  false
Valor es "undefined"  |  false
---
Decoded ID            |  5
Tipo de ID decodificado | "number"
¿Es Number?           |  true
Es null?              |  false
Es NaN?               |  false
Es positivo?          |  true
Valor es string "null"|  false
---
✅ Guardia pasada - ID válido, llamando API con: {id: 5, tipo: "number"}
📡 GET /usuarios/5
✅ Datos cargados correctamente
```

---

## 📊 Qué Significa Cada Columna

### Primera Tabla: ID Encriptado de la URL
| Campo | Qué Significa |
|-------|---------------|
| `URL encodedId` | El valor encriptado del ID en la URL (ej: `x7k2mP9qL`) |
| `Tipo de encodedId` | Siempre debe ser `"string"` |
| `Es null o undefined` | Debe ser `false` |
| `Valor es "null"` | Debe ser `false` ❌ Si es `true`, hay un problema |
| `Valor es "undefined"` | Debe ser `false` ❌ Si es `true`, el ID se perdió |

### Segunda Tabla: ID Decodificado
| Campo | Esperado | Si es Diferente = Problema |
|-------|----------|---------------------------|
| `Decoded ID` | Número (ej: `5`, `42`, etc) | ❌ Si es `null`, la decodificación falló |
| `Tipo de ID decodificado` | `"number"` | ❌ Si es `"string"`, hay un error de tipo |
| `¿Es Number?` | `true` | ❌ Si es `false`, no es un número válido |
| `Es null?` | `false` | ❌ Indica problema crítico |
| `Es NaN?` | `false` | ❌ Si es `true`, parseInt falló |
| `Es positivo?` | `true` | ❌ Si es `false`, ID inválido |

---

## ⚠️ Escenarios de Error y Sus Soluciones

### Escenario 1: `Decoded ID = null`
```
Decoded ID          | null
Es null?            | true  ❌ PROBLEMA
```

**Causa Posible:** La decodificación falló
**Solución:** 
- Revisar que `encodeId()` en la tabla no devolvió `null`
- Check: En la consola (en la tabla), mira si `URL encodedId` es válido
- Si todo allá estaba bien, hay un problema en `decodeId()`

**Verificar:** Entraactualmente abre la consola y ejecuta:
```javascript
// Reemplaza 'x7k2mP9qL' con el valor real de tu URL
const { decodeId } = await import('./src/utils/cryptoUtils.js');
decodeId('x7k2mP9qL')  // Debería devolver un número, no null
```

---

### Escenario 2: `URL encodedId = "null"` (la palabra null como string)
```
URL encodedId       | "null"  ❌ PROBLEMA
Valor es "null"     | true    ❌ PROBLEMA
```

**Causa:** En la tabla, `encodeId(row.id)` devolvió `null` y se mostró como "null" en la URL
**Solución:**
- El problema está en la tabla, NO en la página de edición
- `row.id` probablemente es `null` o no válido
- Verifica en UsuariosPage/AreaTable que la validación `if (!row?.id)` esté funcionando

**Verificar (en la tabla):** Añade este log antes de navegar:
```javascript
console.log('Row antes de encodeId:', row);
console.log('row.id:', row.id, 'tipo:', typeof row.id);
console.log('encodeId(row.id):', encodeId(row.id));
```

---

### Escenario 3: `¿Es Number? = false` y `Tipo = "string"`
```
Tipo de ID decodificado | "string"  ❌ PROBLEMA
¿Es Number?             | false     ❌ PROBLEMA
```

**Causa:** `decodeId()` devolvió un string en lugar de número
**Solución:** Hay un bug en `decodeId()` - revisar la lógica de `parseInt()`

**Verificar en Consola:**
```javascript
// Copiar desde el log el valor de 'Decoded ID'
typeof decodedValue  // Debe ser "number", no "string"
```

---

### Escenario 4: Pasa Guardia pero Recibe Error 403
```
✅ Guardia pasada - ID válido, llamando API con: {id: 5, tipo: "number"}
❌ Error al cargar usuario con status: 403
```

**Esto significa:**
- ✅ El ID está bien decodificado como número
- ✅ El ID pasó la validación
- ❌ El Backend rechazó la solicitud (403 Forbidden)

**Posibles Causas en Backend:**
1. El Backend no reconoce que el ID es válido (validación backend)
2. El usuario no tiene permisos (pero sería 401)
3. El endpoint en el backend necesita validar mejor

**Solución Frontend INMEDIATA:**
- Copia el valor de `id` del log (ej: `5`)
- Abre el Network tab en DevTools (F12 → Network)
- El request debería ser: `GET /usuarios/5`
- Si ve `GET /usuarios/null`, el problema es de encoding

---

## 🧪 Test Manual en Consola

Abre la Consola (F12) y ejecuta esto mientras estés en una página de edición:

```javascript
// Ver todos los logs que se generaron
console.log(performance.memory);  // Opcional, para ver más detalles

// Ver si el ID está en alguna variable global (si es necesario)
window.lastDecodedId  // (Si la página lo guarda)
```

---

## 📝 Formato de Logs que Verás

Cada página tiene un formato consistente:

```
[EditarUsuarioPage - DEBUG]        ← Nombre de la página
    (tabla coloreada 1)
    (tabla coloreada 2)
✅ Guardia pasada...               ← Verde = todo bien
📡 GET /usuarios/5                 ← Petición HTTP
✅ Datos cargados correctamente    ← Verde = éxito

O

❌ GUARDIA ACTIVADA - ID Inválido  ← Rojo = problema
❌ Error al cargar usuario          ← Rojo = problema del Backend
```

---

## 🔎 ¿Dónde Está el Problema? Checklist

```
¿Ves "GUARDIA ACTIVADA"?
├─ SÍ  → ID es null/undefined antes de API → Problema en tabla
│       Solución: Verifcaa que row.id existe
│
└─ NO  → Guardia pasó, ID válido
    ├─ ¿Ves "✅ Datos cargados"?
    │   ├─ SÍ  → TODO BIEN! ✅
    │   │
    │   └─ NO  → Ve el error de la API
    │       ├─ ¿Error 403?  → Backend no valida bien
    │       ├─ ¿Error 401?  → No autenticado
    │       └─ Otro error   → Revisa message en el log
    │
    └─ ¿ves "Decoded ID = null"?
        └─ Problema en decodeId() → Revisar cryptoUtils.js
```

---

## 💡 Ejemplo de Log Exitoso

```
[EditarUsuarioPage - DEBUG]
┌─────────────────────────────┬──────────────────┐
│ (index)                     │ Values           │
├─────────────────────────────┼──────────────────┤
│ URL encodedId               │ 'x7k2mP9qL'     │
│ Tipo de encodedId           │ 'string'         │
│ Es null o undefined         │ false            │
│ Valor es "null"             │ false            │
│ Valor es "undefined"        │ false            │
├─────────────────────────────┼──────────────────┤
│ Decoded ID                  │ 5                │
│ Tipo de ID decodificado     │ 'number'         │
│ ¿Es Number?                 │ true             │
│ Es null?                    │ false            │
│ Es NaN?                     │ false            │
│ Es positivo?                │ true             │
│ Valor es string "null"      │ false            │
└─────────────────────────────┴──────────────────┘

✅ Guardia pasada - ID válido, llamando API con: {id: 5, tipo: 'number'}
📡 GET /usuarios/5
✅ Datos cargados correctamente {userData: {...}, areaCount: 3}
```

---

## 📞 Si Necesitas Compartir Logs

Si aún hay problemas, comparte:
1. **Print de la consola** cuando hagas click en Editar
2. **El valor completo de ambas tablas**
3. **El error exacto que ves (Network tab → request)**
4. **La URL de la página (ej: `http://localhost:5173/usuarios/editar/x7k2mP9qL`)**

---

## ✅ Resumen de Cambios

### cryptoUtils.js
- ✅ Agregado logging en `encodeId()` y `decodeId()`
- ✅ Mensajes de error más descriptivos
- ✅ Validaciones más claras

### Páginas de Edición/Detalle
- ✅ `console.group()` con tablas visuales
- ✅ Logs coloreados por página (rojo=Usuario, amarillo=Área, púrpura=Sucursal)
- ✅ Logs en cada paso: entrada URL → decodificación → guardia → API
- ✅ Error handling mejorado con detalles

### Build
- ✅ Compilación exitosa: `npm run build`
- ✅ 1970 módulos transformados sin errores

---

## 🚨 PRÓXIMOS PASOS

1. **Abre la app en el navegador**
2. **Ve a editar un Usuario/Área/Sucursal**
3. **Abre la Consola (F12 → Console)**
4. **Toma un screenshot de los logs**
5. **Si hay error 403:**
   - Copia el valor de `Decoded ID`
   - Verifica en el Network tab que se envía correctamente al Backend
   - Comparte los logs conmigo

---

Generated: 2026-04-17 by Debugging Expert
