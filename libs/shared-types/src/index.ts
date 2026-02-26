/**
 * @biosstel/shared-types - Shared types across frontend and backend
 */

// User & auth
export type UserRole =
  | 'ADMIN'
  | 'COORDINADOR'
  | 'TELEMARKETING'
  | 'TIENDA'
  | 'COMERCIAL'
  | 'BACKOFFICE';

export interface User {
  id: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole | string;
  roleId?: string;
  isActive?: boolean;
  emailConfirmed?: boolean;
  firstLogin?: boolean;
  deletedAt?: Date | string;
  /** ISO date string del último fichaje (para callout "no ha fichado hoy" en lista). */
  lastFichajeAt?: string;
  /** ID del departamento (empresa). */
  departmentId?: string;
  /** ID del centro de trabajo (empresa). */
  workCenterId?: string;
  /** Nombre del departamento (enriquecido en API para lista). */
  departamento?: string;
  /** Nombre del centro de trabajo (enriquecido en API para lista). */
  centroTrabajo?: string;
  [key: string]: unknown;
}

export interface AuthUser extends User {}

export type Role = UserRole | string;
export type Permission = string;

export interface Organization {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  /** Refresh token para obtener nuevo access token (caducidad larga, ej. 7 días) */
  refreshToken?: string;
  /** Tiempo de vida del access token en segundos */
  expiresIn?: number;
  [key: string]: unknown;
}

// Users CRUD
export interface CreateUserData {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  organizationId?: string;
  role?: string;
  departmentId?: string;
  workCenterId?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
  role?: string;
  departmentId?: string;
  workCenterId?: string;
}

export interface PaginatedResult<T = unknown> {
  /** List of items (preferred). */
  items: T[];
  /** Alias for items for compatibility. */
  data?: T[];
  total: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T = unknown> extends PaginatedResult<T> {}

// Fichajes & Tasks
export interface Fichaje {
  id: string;
  userId: string;
  date: string;
  startTime: Date | string;
  endTime?: Date | string;
  status: 'working' | 'paused' | 'finished';
  pauses?: { startTime: string; endTime?: string; reason?: string }[];
  location?: { lat: number; lng: number; address?: string };
  totalTime?: number;
  /** true si el fichaje está fuera del horario laboral (reloj rojo en UI). */
  fueraHorario?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface FichajeTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime?: Date | string;
  completed: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/** Agenda (one per user); tasks reference agendaId */
export interface Agenda {
  id: string;
  userId: string;
  createdBy?: string;
  updatedBy?: string;
}

// Empresa
export interface Empresa {
  id: string;
  name: string;
  cif?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Department {
  id: string;
  name: string;
  color?: string;
  status?: string;
  code?: string;
  responsibleUserId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface WorkCenter {
  id: string;
  name: string;
  address?: string;
  departmentId?: string;
}

export interface AccountingAccount {
  id: string;
  code: string;
  description?: string;
}

export interface EmpresaListResponse {
  departamentos: Department[];
  centros: WorkCenter[];
  cuentas: AccountingAccount[];
}

// Alertas (Domain/Plan)
export interface AlertaPlan {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Operaciones
export interface Operacion {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface VisitaComercial {
  id: string;
  cliente: string;
  tipo: 'nueva' | 'seguimiento';
  fecha: string;
}

export interface TareaAgenda {
  id: string;
  tarea: string;
  cliente: string;
  estado: string;
}

export interface RevisionBackoffice {
  id: string;
  contratoTarea: string;
  fecha: string;
  estado: string;
}

export interface TiendaVenta {
  id: string;
  puntoVenta: string;
  achieved: number;
  objective: number;
}

export interface OperacionesListResponse {
  visitas: VisitaComercial[];
  agenda: TareaAgenda[];
  revision: RevisionBackoffice[];
  tienda: TiendaVenta[];
}

// Dashboard / Objetivos
export type DashboardObjectiveAccent = string;

export interface DashboardObjectiveItem {
  id: string;
  title: string;
  achieved: number;
  objective: number;
  unit?: string;
  href?: string;
  accent?: string;
}

/** Alias for DashboardObjectiveItem */
export type DashboardObjective = DashboardObjectiveItem;

export interface DashboardAlert {
  id: string;
  usuario?: string;
  departamento?: string;
  centroTrabajo?: string;
  rol?: string;
  estado?: string;
  statusType?: string;
  /** Filtro por marca (opcional). */
  marca?: string;
}

export interface DashboardHomeResponse {
  objectives: DashboardObjectiveItem[];
  alerts: DashboardAlert[];
}

export interface TerminalObjectivesHeader {
  id: string;
  title: string;
  rangeLabel?: string;
  achieved: number;
  objective: number;
  pct?: number;
}

export interface TerminalAssignmentRow {
  /** Id de la asignación (para DELETE); solo presente cuando viene de API. */
  id?: string;
  label: string;
  value: number;
  total: number;
  ok: boolean;
}

export interface TerminalAssignmentCard {
  title: string;
  totalValue: number;
  totalObjective: number;
  rows: TerminalAssignmentRow[];
}

export interface TerminalObjectivesResponse {
  header: TerminalObjectivesHeader;
  departmentCards: TerminalAssignmentCard[];
  peopleCards: TerminalAssignmentCard[];
  /** Cuando no hay objetivo activo, el último inactivo para poder mostrar "Activar". */
  inactiveObjective?: { id: string; title: string };
}

// Productos
export interface Product {
  id: string;
  codigo?: string;
  nombre: string;
  name?: string;
  familia: string;
  familyId?: string;
  subfamilyId?: string;
  brandId?: string;
  estado: string;
}

export interface CreateProductData {
  codigo: string;
  nombre: string;
  familia: string;
  estado?: string;
}

export interface UpdateProductData {
  codigo?: string;
  nombre?: string;
  familia?: string;
  estado?: string;
}

export interface ProductListResponse {
  products: Product[];
}

// Inventario (listado para enlace desde Productos)
export interface InventoryItem {
  id: string;
  codigo: string;
  nombre: string;
  cantidad: number;
  ubicacion?: string;
}

export interface CreateInventoryData {
  codigo: string;
  nombre: string;
  cantidad: number;
  ubicacion?: string;
}

export interface UpdateInventoryData {
  codigo?: string;
  nombre?: string;
  cantidad?: number;
  ubicacion?: string;
}

export interface InventoryListResponse {
  items: InventoryItem[];
}

// Reports
export interface ReportSummaryItem {
  id: string;
  label: string;
  value: number;
  unit?: string;
}

export interface ReportsSummaryResponse {
  summary: ReportSummaryItem[];
  generatedAt: string;
}
