/**
 * Mock de @biosstel/platform para Storybook (Link sin Next.js).
 */
import type { ReactNode, AnchorHTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

export const Link = ({ href, children, ...rest }: LinkProps) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

export const useRouter = () => ({ push: () => {} });
export const usePathname = () => '';
export const redirect = () => {};
export const useLocale = () => 'es';

export function logUserAction(_action: string, _payload?: unknown): void {}
export function logFormSubmit(_form: string, _payload?: unknown, _extra?: unknown): void {}
export function logFlow(_kind: string, _payload?: unknown): void {}
export function logNavigation(_to: string, _payload?: unknown): void {}
export function logApiRequest(_label: string, _payload?: unknown): void {}
export function logApiResponse(_label: string, _payload?: unknown): void {}
export function logApiError(_label: string, _payload?: unknown): void {}
export function logError(_message: string, _payload?: unknown): void {}
export function getFlowLog(): unknown[] { return []; }
export function clearFlowLog(): void {}
export function getFlowLogAsContext(): Record<string, unknown> { return {}; }
export function exposeFlowLogOnWindow(): void {}

export function canFichar(_role?: string | null): boolean {
  return true;
}
export function canManageFichajes(_role?: string | null): boolean {
  return true;
}
export function canAccessPath(_path: string, _role?: string | null): boolean {
  return true;
}
export function normalizePath(_path: string): string {
  return _path;
}
export const PATHS = {} as Record<string, string>;
export function getReturnPath(): string { return '/'; }
export const AUTH_PATHS = {} as Record<string, string>;
export const SHELL_HOME_PATH = '/home';
export const ROUTE_PERMISSIONS = {} as Record<string, unknown>;
export const API_BASE_URL = '';
export function getAuthHeaders(): HeadersInit { return {}; }
export function handleResponse(): void {}
export function setUnauthorizedHandler(): void {}
export function setApiErrorHandler(): void {}
export function DevFlowLoggerInit(): null { return null; }
