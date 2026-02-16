/**
 * @biosstel/shared-types
 * Shared TypeScript types for Biosstel monorepo
 * 
 * All types shared between frontend and backend should be here.
 */

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive: boolean;
  organizationId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AuthUser extends User {
  roles: Role[];
  organization?: Organization;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

// ============================================
// User Management Types
// ============================================

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organizationId?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  password?: string;
  organizationId?: string;
}

// ============================================
// Auth Types
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User | AuthUser;
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface AuthCode {
  id: string;
  code: string;
  userId: string;
  expiresAt: Date;
  usedAt?: Date;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  newPassword: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Alias for consistency (some places use PaginatedResult)
export type PaginatedResult<T> = PaginatedResponse<T>;

// ============================================
// Dashboard Types
// ============================================

export type DashboardObjectiveAccent = 'maroon' | 'teal' | 'blue' | 'purple';

export interface DashboardObjective {
  id: string;
  title: string;
  achieved: number;
  objective: number;
  unit?: string;
  accent?: DashboardObjectiveAccent;
  href?: string;
}

export interface DashboardAlert {
  id: string;
  usuario: string;
  departamento: string;
  centroTrabajo: string;
  rol?: string;
  estado: string;
  statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';
}

export interface DashboardHomeResponse {
  objectives: DashboardObjective[];
  alerts: DashboardAlert[];
}

export interface TerminalObjectivesHeader {
  id: string;
  title: string;
  rangeLabel: string;
  achieved: number;
  objective: number;
  pct: number;
}

export interface TerminalAssignmentRow {
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
  header: TerminalObjectivesHeader | null;
  departmentCards: TerminalAssignmentCard[];
  peopleCards: TerminalAssignmentCard[];
}

// ============================================
// Repository Interface (for backend)
// ============================================

export interface IUserRepository {
  findAll(page?: number, pageSize?: number): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}

// ============================================
// Error Codes
// ============================================

export const ErrorCodes = {
  // Auth errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  
  // Database errors
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================
// Environment Types
// ============================================

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}
