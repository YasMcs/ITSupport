// Tipos TypeScript alineados con esquema DB (snake_case, FKs correctas)

export type RolUsuario = 'admin' | 'responsable' | 'tecnico';

export interface CreateUsuario {
  nombre: string;
  apellido: string;
  email: string;
  contrasena_hash: string;
  rol: RolUsuario;
  sucursal_id: number;
  area_id: number | null;  // NULL para admin/tecnico
}

export interface UpdateUsuario {
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: RolUsuario;
  sucursal_id?: number;
  area_id?: number | null;
}

export type PrioridadTicket = 'ALTA' | 'MEDIA' | 'BAJA';
export type EstadoTicket = 'ABIERTO' | 'EN_PROCESO' | 'CERRADO' | 'ANULADO';

export interface CreateTicket {
  titulo: string;
  descripcion: string;
  area_id: number;
  sucursal_id: number;
  responsable_id: number;
  prioridad: PrioridadTicket;
  estado?: EstadoTicket;  // Default 'ABIERTO'
  tecnico_id_asignado?: number | null;
  fecha_asignacion?: string | null;
  tipo_asignacion?: string | null;
}

export interface Ticket {
  id_ticket: number;
  titulo: string;
  descripcion: string;
  area_id: number;
  sucursal_id: number;
  responsable_id: number;
  tecnico_id_asignado: number | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  fecha_creacion: string;
  fecha_asignacion?: string;
  tipo_asignacion?: string;
  historial: Array<{fecha: string; accion: string; tecnico?: string}>;
  comentarios: Array<{autor: string; fecha: string; texto: string}>;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  sucursal_id: number;
  area_id: number | null;
  sucursal?: {id: number; nombre: string};
  area?: {id: number; nombre: string};
}
