# 🎓 Guía Técnica: Explicaciones para tu Profesor

## 📚 Índice Rápido
1. [React y Hooks](#react-y-hooks)
2. [Librerías Principales](#librerías-principales)
3. [Patrones de Arquitectura](#patrones-de-arquitectura)
4. [Flujo de Datos](#flujo-de-datos)
5. [Seguridad](#seguridad)
6. [Manejo de Estado](#manejo-de-estado)
7. [WebSockets](#websockets)
8. [Ruteo y Protección](#ruteo-y-protección)

---

# React y Hooks

## ¿Por qué React?

**React** es una librería para construir interfaces de usuario con componentes reutilizables.

### Ventajas que usamos:
```
1. Virtual DOM → Las actualizaciones son eficientes
2. Componentes reutilizables → DRY (Don't Repeat Yourself)
3. Unidirectional data flow → Los datos fluyen en una dirección, fácil de debuggear
4. Comunidad grande → Muchas librerías disponibles
```

## Hooks: El Corazón de React Moderno

### useState
```javascript
const [estado, setEstado] = useState(valorInicial);
```
**¿Qué hace?** Permite que componentes funcionales tengan estado local.

**Ejemplo en nuestro proyecto:**
```javascript
const [formData, setFormData] = useState({
  nombre: "",
  email: ""
});

// Cada vez que llamamos setFormData(), el componente se re-renderiza
const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

**¿Por qué "...prev"?** Porque no modificamos directo el estado, lo reemplazamos. Esto es crucial para que React detecte cambios.

---

### useEffect
```javascript
useEffect(() => {
  // Código que se ejecuta DESPUÉS de renderizar
  return () => {
    // Cleanup (se ejecuta al desmontar o antes del siguiente effect)
  };
}, [dependencias]);
```

**¿Qué hace?** Ejecuta efectos secundarios (API calls, suscripciones, etc.)

**Ejemplo en nuestro proyecto:**
```javascript
useEffect(() => {
  let cancelled = false;

  async function loadData() {
    try {
      const data = await userService.getById(id);
      if (!cancelled) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadData();
  
  return () => {
    cancelled = true; // Si el componente se desmonta, cancelar
  };
}, [id]); // Se ejecuta solo cuando 'id' cambia
```

**¿Por qué "cancelled"?** Si el usuario navega a otro componente antes de que la API responda, evitamos actualizar un componente que ya no existe (memory leak).

---

### useContext
```javascript
const auth = useContext(AuthContext);
```

**¿Qué hace?** Accede a datos compartidos entre componentes sin "prop drilling".

**Prop drilling = pasar props a través de 10 componentes solo para que el 11° acceda a ellas. ¡Es horrible!**

**Nuestro ejemplo:**
```javascript
// En AuthContext.jsx creamos contexto
export const AuthContext = createContext();

// En App.jsx lo proveemos
<AuthContext.Provider value={authValue}>
  <Routes />
</AuthContext.Provider>

// En cualquier componente accedemos así
const { user, isAuthenticated, logout } = useContext(AuthContext);
```

---

### useMemo
```javascript
const memoizedValue = useMemo(() => {
  return expensiveComputation(a, b);
}, [a, b]);
```

**¿Qué hace?** Cachea el resultado de un cálculo costoso y solo lo recalcula si las dependencias cambian.

**Nuestro ejemplo:**
```javascript
const selectedArea = useMemo(
  () => normalizedAreaOptions.find((option) => option.value === formData.area_id),
  [formData.area_id, normalizedAreaOptions]
);
```

Sin `useMemo`, cada render buscaría en el array. Con `useMemo`, solo busca si `area_id` o `normalizedAreaOptions` cambian. **Optimización de performance.**

---

# Librerías Principales

## 1. React Router DOM

**¿Qué es?** Navegación entre páginas sin recargar la página (SPA - Single Page Application).

```javascript
// En AppRouter.jsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

**¿Por qué?** En lugar de hacer requests HTTP a `/login.html`, `/dashboard.html`, etc., React Router:
1. Cambia la URL en el navegador
2. Renderiza el componente correspondiente
3. Todo sin recargar la página → **Más rápido y mejor UX**

---

## 2. Axios

**¿Qué es?** Cliente HTTP para hacer requests al backend.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**¿Por qué Axios en lugar de fetch()?**
- Más simple de usar
- Interceptores integrados
- Auto-transforma JSON
- Mejor manejo de errores
- Soporte para request/response

---

## 3. Sonner (Toasts)

**¿Qué es?** Notificaciones emergentes que desaparecen automáticamente.

```javascript
import { toast } from 'sonner';

// Mostrar notificación
toast.success("Usuario creado exitosamente");
toast.error("Error al guardar");
toast.loading("Cargando...");
```

**¿Por qué?** Así el usuario sabe que su acción funcionó sin salir de la página.

---

## 4. Tailwind CSS

**¿Qué es?** Framework CSS basado en clases utilitarias.

```html
<!-- En lugar de escribir CSS, usamos clases predefinidas -->
<button class="px-4 py-2 bg-purple-electric rounded-xl text-white hover:opacity-90">
  Guardar
</button>
```

**Ventajas:**
- Consistencia visual automática
- Cambios rápidos sin abrir otro archivo CSS
- Responsive con prefijos (md:, lg:)
- Menos CSS que escribir

---

## 5. @stomp/stompjs y sockjs-client (WebSockets)

**¿Qué es?** Conexión bidireccional en tiempo real con el servidor.

```javascript
const client = new StompClient();
client.configure({
  brokerURL: `${wsUrl}/connect`,
  // ...
});

client.onConnect = () => {
  // Cuando conectamos, nos suscribimos a tópicos
  client.subscribe('/user/queue/updates', (message) => {
    console.log('Notificación recibida:', JSON.parse(message.body));
  });
};

client.activate();
```

**¿Qué diferencia hay con HTTP normal?**

| HTTP | WebSocket |
|------|-----------|
| Cliente pregunta servidor | Servidor puede enviar sin que cliente pregunte |
| "¿Hay mensajes?" | Servidor: "¡Hey, tienes un nuevo comentario!" |
| Cada pregunta = header HTTP | Una conexión, muchos mensajes |
| Slow / Overhead | Rápido / Eficiente |

---

# Patrones de Arquitectura

## Patrón MVC (adaptado a frontend)

Nuestro proyecto sigue este patrón:

```
PAGES (View Controller)
    ↓
SERVICES (Model)
    ↓
API / Backend
    ↑
CONTEXT (Global State)
    ↑
COMPONENTS (View)
```

### Ejemplo: Flujo de crear usuario

```
1. NuevoUsuarioPage.jsx (Página)
   ↓ (al hacer submit)
2. handleSubmit() llama userService.create()
   ↓ (el servicio hace HTTP POST)
3. userService.create() → api.post('/usuarios', data)
   ↓ (respuesta del backend)
4. Datos se normalizan en apiMappers
   ↓ (si hay contexto global, se actualiza)
5. AuthContext o estado local se actualiza
   ↓ (React se da cuenta del cambio)
6. Componentes se re-renderizan
   ↓ (usuario ve que el formulario se limpió)
7. Se muestra toast: "¡Usuario creado!"
```

---

## Patrón Context API para Estado Global

**Problema:** ¿Cómo compartir datos entre componentes lejanos sin pasar props 10 veces?

**Solución:** Context API

```javascript
// 1. Crear contexto
export const AuthContext = createContext();

// 2. Crear Provider (componente que provee datos)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    const { user, token } = await authService.login(email, password);
    sessionStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Usar en cualquier componente descendiente
function MyComponent() {
  const { user, logout } = useContext(AuthContext);
  return <p>Hola {user.nombre}, <button onClick={logout}>Logout</button></p>;
}
```

---

## Separación de Responsabilidades: Services

**¿Por qué services separados?**

```javascript
// ❌ MALO: Lógica HTTP en el componente
export function UsuariosPage() {
  useEffect(() => {
    // Mezclar datos, lógica y renderizado = confuso
    axios.get(`${API_URL}/usuarios`)
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message));
  }, []);
}

// ✅ BUENO: Lógica en service
export const userService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return normalizeUsers(response.data);
  }
};

export function UsuariosPage() {
  useEffect(() => {
    userService.getAll().then(setUsers);
  }, []);
}
```

**Ventajas:**
1. **Testeable**: Puedo testear `userService` sin React
2. **Reutilizable**: Otro componente puede usar `userService.getAll()`
3. **Mantenible**: Si el backend cambia, cambio solo el service
4. **Legible**: La página solo se enfoca en renderizar

---

# Flujo de Datos

## De Usuario a Base de Datos

```
1. Usuario escribe en input
   ↓
2. onChange → handleChange() actualiza estado local
   ↓
3. handleChange(): setFormData({...formData, nombre: value})
   ↓
4. React re-renderiza con nuevo valor (input.value = state.nombre)
   ↓
5. Usuario hace click "Guardar"
   ↓
6. handleSubmit():
   a) Validar (¿el email es válido? ¿campos requeridos?)
   b) Mostrar modal de confirmación
   ↓
7. Usuario confirma en el modal
   ↓
8. handleConfirmSave() llama:
   userService.create(formData)
   ↓
9. Service hace: api.post('/usuarios', formData)
   ↓
10. Interceptor de axios agrega token automáticamente
   ↓
11. Backend recibe POST /usuarios con datos
   ↓
12. Backend valida y guarda a BD
   ↓
13. Backend responde con { success: true, usuario: {...} }
   ↓
14. Frontend recibe respuesta
   ↓
15. Componente local actualiza estado (navigate('/usuarios'))
   ↓
16. Usuario ve mensaje: "¡Usuario creado!"
   ↓
17. Página navega a /usuarios (lista)
```

---

# Seguridad

## 1. Sanitización de Entrada

```javascript
// En security.js
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Email inválido";
};

export const containsForbiddenInput = (input) => {
  const forbidden = ['<script', 'javascript:', 'onerror=', '<img'];
  return forbidden.some(str => input.toLowerCase().includes(str));
};

// En el componente
if (containsForbiddenInput(formData.nombre)) {
  setError("Contenido sospechoso detectado");
  return;
}
```

**¿Por qué?** Si el usuario entra `<img src=x onerror="alert('hacked')">`, queremos bloquearlo antes de enviar al backend.

---

## 2. Token y Autenticación

```javascript
// En api.js
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cada request HTTP automáticamente tiene el token en el header
// GET /usuarios
// Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**¿Por qué sessionStorage y no localStorage?**

| sessionStorage | localStorage |
|---|---|
| Se borra al cerrar tab | Persiste años |
| Menos riesgos | Si hace XSS, toman token años |
| Para web normales | Solo si es muy importante |

---

## 3. Manejo de Sesión Expirada

```javascript
// En api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expirado
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**¿Qué pasa?**
1. Usuario hace request
2. Backend: "Ese token está expirado, devuelvo 401"
3. Frontend intercepta el 401
4. Frontend limpia toda la sesión
5. Frontend lo redirige a login
6. Usuario no puede hacer nada sin autenticarse de nuevo

---

## 4. Ofuscación de IDs en URLs

```javascript
// En cryptoUtils.js
export const encodeId = (id) => {
  // "123" → "SVRTdXBwb3J0MTIz" (Base64 con salt)
  const salt = "ITSupportSec2024!";
  return btoa(salt + id);
};

export const decodeId = (encoded) => {
  // "SVRTdXBwb3J0MTIz" → "123"
  const salt = "ITSupportSec2024!";
  const decoded = atob(encoded);
  return parseInt(decoded.replace(salt, ''));
};

// En tabla:
<button onClick={() => navigate(`/usuarios/editar/${encodeId(usuario.id)}`)}>
  Editar
</button>

// En página de edición:
const { id: encodedId } = useParams();
const id = decodeId(encodedId);
// Ahora llamamos API con el ID real
await userService.getById(id);
```

**¿Por qué?**
- URL `/usuarios/1` → Los usuarios ven que hay IDs secuenciales
- URL `/usuarios/SVRTdXBwb3J0MTIz` → No saben si hay otros IDs

**¿Es cripto seguro?** No, Base64 es fácil de reversar. Pero hace que los URLs se vean raros y frena atacantes casuales.

---

# Manejo de Estado

## Estado Local vs Global

### Estado Local (useState en componente)
```javascript
// En UsuarioForm.jsx
const [formData, setFormData] = useState({...});
const [errors, setErrors] = useState({});
const [showSaveModal, setShowSaveModal] = useState(false);
```

**Se usa para:**
- Datos que solo ese componente necesita
- Estado temporal de formulario
- Visibilidad de modales

**Ventaja:** Rápido, no afecta a otros componentes

---

### Estado Global (Context)
```javascript
// En AuthContext.jsx
const [user, setUser] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

**Se usa para:**
- Usuario actual conectado
- Token de autenticación
- Rol para mostrar/ocultar menú

**Ventaja:** Todos los componentes acceden sin pasar props

---

## Flujo Completo de Estado

```
┌─ Usuario actualiza input
│
└─ onChange → handleChange() 
   └─ setFormData() actualiza state LOCAL
   
   ↓ (React re-renderiza)
   
   input.value ahora muestra el nuevo valor
   
   ↓ (Usuario hace submit)
   
   handleConfirmSave()
   └─ userService.create(formData)
   └─ API responde
   └─ setUser() actualiza estado LOCAL DE LA PÁGINA
   
   ↓ (O si fuera al contexto:)
   
   setUser(newUser) en AuthContext
   └─ TodoS los componentes que usan AuthContext se actualizan
```

---

# WebSockets

## ¿Problema que resuelven?

**Escenario sin WebSocket:**
```
10:00 - Usuario abre lista de tickets
10:01 - Otro usuario comenta un ticket
10:02 - Usuario 1 aún ve el comentario VACÍO (no sabe que hay nuevo)
10:10 - Usuario 1 hace F5 para refrescar
10:10 - Ahora ve el comentario (demasiado tarde!)
```

**Escenario con WebSocket:**
```
10:00 - Usuario 1 abre ticket. WebSocket conecta.
10:01 - Otro usuario comenta.
10:01 - Servidor: "¡Hey cliente, hay nuevo comentario!"
10:01 - Cliente recibe por socket: { tipo: 'comment', data: {...} }
10:01 - Frontend actualiza la lista de comentarios en real-time
10:01 - Usuario 1 ve el comentario INMEDIATAMENTE
```

---

## Cómo implementamos

```javascript
// En WebSocketContext.jsx
useEffect(() => {
  const client = new StompClient();
  
  client.configure({
    brokerURL: wsUrl(import.meta.env.VITE_WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    // Suscribirse a actualizaciones de tickets
    client.subscribe('/topic/tickets', (message) => {
      const updatedTicket = JSON.parse(message.body);
      // Actualizar estado local
      setNotification(updatedTicket);
    });
  };

  client.activate();
  
  return () => client.deactivate();
}, [token]);
```

**¿Qué sucede?**
1. WebSocket se conecta al servidor
2. Frontend se suscribe a `/topic/tickets`
3. Si algo cambia en tickets en el backend:
   - Servidor envía a todos los clientes conectados
   - Frontend recibe en tiempo real
   - Se actualiza la UI

---

# Ruteo y Protección

## Rutas Públicas vs Protegidas

```javascript
// En AppRouter.jsx
<Routes>
  {/* Pública */}
  <Route path="/login" element={<LoginPage />} />
  
  {/* Protegida por autenticación */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  
  {/* Protegida por rol */}
  <Route path="/usuarios" element={
    <ProtectedRoute requiredRole="admin">
      <UsuariosPage />
    </ProtectedRoute>
  } />
</Routes>
```

## ProtectedRoute: La Guardiana

```javascript
export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Si no está autenticado, enviar a login
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Si se requiere rol específico y no lo tiene, acceso denegado
    return <Navigate to="/acceso-denegado" />;
  }

  // Si todo está bien, renderizar el componente
  return children;
}
```

**¿Cómo funciona?**
1. Usuario intenta acceder a `/usuarios`
2. ProtectedRoute comprueba `isAuthenticated`
3. Si es falso → Redirige a `/login` (no llega a la página)
4. Si es true pero rol ≠ admin → Redirige a `/acceso-denegado`
5. Si todo bien → Renderiza UsuariosPage

---

## Sidebar Adaptable por Rol

```javascript
export function Sidebar() {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', visible: true },
    { label: 'Usuarios', path: '/usuarios', visible: user?.rol === 'admin' },
    { label: 'Mis Tickets', path: '/tickets', visible: user?.rol === 'tecnico' },
  ];

  return (
    <nav>
      {menuItems
        .filter(item => item.visible)
        .map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}
    </nav>
  );
}
```

**Resultado:**
- Admin ve: Dashboard, Usuarios, Áreas, Sucursales
- Técnico ve: Dashboard, Mis Tickets, Tickets Disponibles
- Encargado ve: Dashboard, Mis Tickets, Estadísticas

---

# 🎯 Preguntas que tu Profesor Podría Hacer

## 1. "¿Por qué usas Context API en lugar de Redux?"

**Respuesta:**
```
Redux es overkill para proyectos pequeños-medianos.
Context API es más simple y tiene menos boilerplate.
Usamos Context para:
- Autenticación (usuario, token)
- WebSocket (notificaciones)

Si tuviéramos 50+ acciones y estado muy complejo,
entonces sí usaríamos Redux.
```

## 2. "¿Cómo evitas que un usuario sin token acceda a rutas?"

**Respuesta:**
```
Tenemos 3 capas de defensa:

1. Frontend:
   - ProtectedRoute verifica AuthContext
   - Si no hay token, redirige a /login
   
2. Backend:
   - TODAS las rutas verifican JWT
   - Si no hay token o está vencido, devuelve 401
   
3. Axios Interceptor:
   - Si backend devuelve 401, limpios token
   - Redirige a login de nuevo
   
El backend es la autoridad real. Frontend solo es barrera visual.
```

## 3. "¿Qué es el Virtual DOM?"

**Respuesta:**
```
React NO actualiza el DOM real directamente (sería lento).

1. Cuando estado cambia, React crea un "Virtual DOM" (objeto JS en memoria)
2. Compara nuevo Virtual DOM con el anterior (diff)
3. Encuentra qué cambió (ej: un <p> de rojo a verde)
4. Actualiza SOLO eso en el DOM real
5. El navegador renderiza solo ese cambio

Resultado: Más rápido que actualizar todo el DOM.
```

## 4. "¿Por qué "const [state, setState] = useState()"?"

**Respuesta:**
```
Es desestructuración de array.

useState() devuelve: [valorActual, funcionParaActualizar]

const [count, setCount] = useState(0);

Es equivalente a:
const array = useState(0);
const count = array[0];
const setCount = array[1];

Los nombres count/setCount son por convención.
Los podrías llamar cualquier cosa:
const [x, updateX] = useState(0);
```

## 5. "¿Qué es un interceptor en Axios?"

**Respuesta:**
```
Es código que intercepta TODAS las requests/responses.

Caso de uso: Agregar token automáticamente

Sin interceptor:
api.post('/usuarios', data, {
  headers: { Authorization: `Bearer ${token}` }
});

Con interceptor en cada request:
api.post('/usuarios', data); // ¡Token agregado automáticamente!

Otros usos:
- Agregar headers personalizados
- Manejo de errores global
- Logging de requests
- Refresh automático de token
```

## 6. "¿Cómo haces validación de emails?"

**Respuesta:**
```
// Regex que valida estructura básica de email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Email inválido (ej: user@domain.com)";
  }
};

Valida que:
- Haya algo antes de @
- Haya @ y algo después
- Haya . y algo después

⚠️ No valida si el email EXISTE (eso solo puede hacerlo backend)

¿Por qué necesitamos ambas?

Frontend: Feedback rápido al usuario (antes de enviar)
Backend: Seguridad verdadera (el usuario podría hackear frontend)
```

## 7. "¿Cuál es la diferencia entre 'estado al renderizar' vs 'estado después de renderizar'?"

**Respuesta:**
```
useEffect se ejecuta DESPUÉS de renderizar.

Flujo:
1. setState(newValue) 
2. React re-renderiza componente ← AQUÍ cambios visuales
3. useEffect se ejecuta ← AQUÍ APIs, suscripciones, side effects

Ejemplo:
setCount(5);
console.log(count); // Aún es 4 (el estado viejo)

// En el mismo render
return <p>{count}</p>; // Muestra 5 (React lo actualizó)

// DESPUÉS del render, en useEffect:
useEffect(() => {
  console.log(count); // Ahora es 5
}, [count]);
```

## 8. "¿Qué es el 'cleanup' en useEffect?"

**Respuesta:**
```
El return de useEffect se ejecuta antes del siguiente effect o al desmontar.

Usa use cases:

// Suscripción a WebSocket
useEffect(() => {
  socket.connect();
  
  return () => {
    socket.disconnect(); // ← Cleanup
  };
}, []);

// Timer
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => {
    clearInterval(timer); // ← Cleanup
  };
}, []);

Sin cleanup:
- WebSocket se conectaría cada render (infinitas conexiones!)
- Timers se acumularían (infinitos logs!)

Con cleanup:
- Se desconecta antes de conectar de nuevo
- Se limpia el timer viejo antes de crear uno nuevo
```

## 9. "¿Cómo funcionan los modales?"

**Respuesta:**
```
Modal es estado + condicional + estilos.

const [showModal, setShowModal] = useState(false);

return (
  <>
    <button onClick={() => setShowModal(true)}>Abrir</button>
    
    {showModal && (
      <div className="fixed inset-0 z-50 bg-black/70">
        <div className="absolute top-1/2 left-1/2 bg-white p-6">
          <p>¡Confirma antes de borrar!</p>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
          <button onClick={handleDelete}>Borrar</button>
        </div>
      </div>
    )}
  </>
);
```

¿Cómo funciona?
1. Estado `showModal` es falso
2. El `{showModal && <Modal/>}` no renderiza nada
3. Usuario hace click → `setShowModal(true)`
4. React re-renderiza
5. Ahora `showModal` es true → Modal aparece
6. Usuario hace click "Borrar" → handleDelete() + setShowModal(false)
7. Modal desaparece
```

## 10. "¿Qué pasa con la seguridad si el usuario abre DevTools?"

**Respuesta:**
```
Si hace click derecho → Inspeccionar → Console:

Usuario PUEDE:
❌ Ver y editar el token (sessionStorage.getItem('token'))
❌ Cambiar variables de estado
❌ Ver el DOM completo

Usuario NO PUEDE:
✅ Hacer requests sin token (token está verificado en backend)
✅ Acceder a datos que backend no le permite
✅ Cambiar otro usuario (backend verifica ID)

Conclusión:
Frontend es decoración.
La seguridad REAL está en el backend.

Si frontend verifica "eres admin", pero backend no:
Usuario edita HTML → Se ve como admin → HACKED.

El backend SIEMPRE debe verificar permisos.
```

---

# 📋 Resumen de Conceptos Clave

| Concepto | ¿Qué es? | ¿Por qué lo usamos? |
|----------|----------|-------------------|
| **React** | Librería para UI | Componentes reutilizables, Virtual DOM |
| **useState** | Hook para estado local | Datos que cambian en el componente |
| **useEffect** | Hook para side effects | APIs, suscripciones |
| **useContext** | Hook para estado global | Datos compartidos (usuario, token) |
| **React Router** | Navegación SPA | URLs sin recargar página |
| **Axios** | Cliente HTTP | Requests al backend |
| **Context API** | Estado global | Autenticación, WebSocket |
| **Tailwind** | CSS utility-first | Estilos rápidos y consistentes |
| **WebSocket** | Conexión bidireccional | Actualizaciones en tiempo real |
| **Interceptores** | Middleware en requests | Token automático, manejo de errores |

---

# 🚀 Tips para la Defensa

1. **Sé honesto**: Si algún concepto no está completamente claro, dilo. Los profesores valoran la honestidad.

2. **Usa el proyecto**: "En nuestro proyecto usamos Context API aquí [muestra código]..."

3. **Explica el por qué**: No solo "usamos React", sino "usamos React porque nos permite componentes reutilizables".

4. **El backend es la autoridad**: Siempre menciona que la seguridad verdadera está en el backend.

5. **Muestra el flujo completo**: Del usuario a la BD y viceversa.

6. **Pregunta si no entiendes**: "¿Te refieres a X o a Y?" es mejor que adivinar.

7. **Ten clara la arquitectura**: Service → API → Backend. No mezcles responsabilidades.

---

**Nota final:** Este proyecto está **muy bien estructurado** para un proyecto educativo. Deberías estar orgulloso. 🎓
