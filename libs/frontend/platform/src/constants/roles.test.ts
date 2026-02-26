/**
 * @biosstel/platform - Unit tests: roles, normalizeRole, canFichar, canManageFichajes, hasRole, getRoleLabel
 */
import { describe, it, expect } from 'vitest';
import {
  normalizeRole,
  canFichar,
  canManageFichajes,
  hasRole,
  hasAnyRole,
  getRoleLabel,
  ALL_ROLES,
  ROLES_ADMIN_OR_COORDINADOR,
  ROLES_QUE_FICAN,
  ROLES_GESTION_FICHAJES,
} from './roles';

describe('normalizeRole', () => {
  it('returns undefined for null, undefined, empty string', () => {
    expect(normalizeRole(null)).toBeUndefined();
    expect(normalizeRole(undefined)).toBeUndefined();
    expect(normalizeRole('')).toBeUndefined();
  });

  it('returns key when already AppRole', () => {
    expect(normalizeRole('ADMIN')).toBe('ADMIN');
    expect(normalizeRole('COMERCIAL')).toBe('COMERCIAL');
  });

  it('normalizes label to key', () => {
    expect(normalizeRole('Administrador')).toBe('ADMIN');
    expect(normalizeRole('Comercial')).toBe('COMERCIAL');
  });

  it('normalizes lowercase to key', () => {
    expect(normalizeRole('comercial')).toBe('COMERCIAL');
    expect(normalizeRole('admin')).toBe('ADMIN');
  });

  it('returns undefined for unknown string', () => {
    expect(normalizeRole('UNKNOWN')).toBeUndefined();
    expect(normalizeRole('invalid')).toBeUndefined();
  });
});

describe('canFichar', () => {
  it('returns true for COMERCIAL, TIENDA, TELEMARKETING, BACKOFFICE', () => {
    expect(canFichar('COMERCIAL')).toBe(true);
    expect(canFichar('TIENDA')).toBe(true);
    expect(canFichar('TELEMARKETING')).toBe(true);
    expect(canFichar('BACKOFFICE')).toBe(true);
    expect(canFichar('Comercial')).toBe(true);
  });

  it('returns false for ADMIN, COORDINADOR', () => {
    expect(canFichar('ADMIN')).toBe(false);
    expect(canFichar('COORDINADOR')).toBe(false);
  });

  it('returns false for null/undefined/empty', () => {
    expect(canFichar(null)).toBe(false);
    expect(canFichar(undefined)).toBe(false);
    expect(canFichar('')).toBe(false);
  });
});

describe('canManageFichajes', () => {
  it('returns true for ADMIN, COORDINADOR', () => {
    expect(canManageFichajes('ADMIN')).toBe(true);
    expect(canManageFichajes('COORDINADOR')).toBe(true);
  });

  it('returns false for COMERCIAL, TIENDA, TELEMARKETING, BACKOFFICE', () => {
    expect(canManageFichajes('COMERCIAL')).toBe(false);
    expect(canManageFichajes('TIENDA')).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(canManageFichajes(null)).toBe(false);
    expect(canManageFichajes(undefined)).toBe(false);
  });
});

describe('hasRole', () => {
  it('returns true when role matches expected', () => {
    expect(hasRole('ADMIN', 'ADMIN')).toBe(true);
    expect(hasRole('Comercial', 'COMERCIAL')).toBe(true);
  });

  it('returns false when role does not match', () => {
    expect(hasRole('ADMIN', 'COMERCIAL')).toBe(false);
    expect(hasRole(null, 'ADMIN')).toBe(false);
  });
});

describe('hasAnyRole', () => {
  it('returns true when role is in list', () => {
    expect(hasAnyRole('ADMIN', ['ADMIN', 'COORDINADOR'])).toBe(true);
    expect(hasAnyRole('COMERCIAL', ['COMERCIAL', 'TIENDA'])).toBe(true);
  });

  it('returns false when role is not in list', () => {
    expect(hasAnyRole('COMERCIAL', ['ADMIN', 'COORDINADOR'])).toBe(false);
    expect(hasAnyRole(null, ['ADMIN'])).toBe(false);
    expect(hasAnyRole('ADMIN', [])).toBe(false);
  });
});

describe('getRoleLabel', () => {
  it('returns label for known role', () => {
    expect(getRoleLabel('ADMIN')).toBe('Administrador');
    expect(getRoleLabel('COMERCIAL')).toBe('Comercial');
  });

  it('returns empty string for null/undefined', () => {
    expect(getRoleLabel(null)).toBe('');
    expect(getRoleLabel(undefined)).toBe('');
  });
});

describe('constants', () => {
  it('ROLES_QUE_FICAN and ROLES_GESTION_FICHAJES are disjoint', () => {
    const intersection = ROLES_QUE_FICAN.filter((r) => ROLES_GESTION_FICHAJES.includes(r));
    expect(intersection).toHaveLength(0);
  });

  it('ALL_ROLES has 6 roles', () => {
    expect(ALL_ROLES).toHaveLength(6);
    expect(ROLES_ADMIN_OR_COORDINADOR).toEqual(['ADMIN', 'COORDINADOR']);
  });
});
