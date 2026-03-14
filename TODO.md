# TODO - Alineación Frontend con DB Schema

## Plan Aprobado - Pasos Pendientes:

### 1. [x] Crear src/types.ts
   - Interfaces CreateUsuario, CreateTicket con snake_case, tipos correctos (area_id?: number|null).

### 2. [ ] Actualizar Constantes
   - [x] src/constants/ticketStatus.js: Agregar ANULADO, valores UPPER ('ABIERTO', etc.)
   - [x] src/constants/ticketPrioridad.js: Valores UPPER ('ALTA', etc.)
   - [x] src/constants/roles.js: Confirmar valores DB ('admin', 'responsable', 'tecnico')

### 3. [ ] src/components/usuarios/UsuarioForm.jsx
   - [ ] Renombrar password → contrasena_hash
   - [ ] ROL_OPTIONS incluir admin/tecnico
   - [ ] Lógica condicional area_id (NULL para admin/tecnico)
   - [ ] onSubmit snake_case payload

### 4. [ ] src/components/tickets/TicketForm.jsx
   - [ ] Selects para area_id, sucursal_id, responsable_id
   - [ ] onSubmit snake_case con IDs

### 5. [ ] Actualizar Mocks
   - [ ] src/utils/mockTickets.js: snake_case, IDs, UPPER enums
   - [ ] src/utils/dummies.json si aplica

### 6. [ ] Services
   - [ ] src/services/userService.js: add create/update
   - [ ] src/services/ticketService.js: similar

### 7. [ ] Test & Verify
   - Forms validation
   - Payloads match DB

Progreso: 1/7 completado (Constantes ✅)
