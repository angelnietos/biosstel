/**
 * @biosstel/platform - Unit tests: canAccessPath, normalizePath
 */
import { describe, it, expect } from 'vitest';
import { canAccessPath, normalizePath } from './routesPermissions';

describe('normalizePath', () => {
  it('strips locale prefix', () => {
    expect(normalizePath('/es/home')).toBe('/home');
    expect(normalizePath('/en/fichajes')).toBe('/fichajes');
  });

  it('keeps path without locale', () => {
    expect(normalizePath('/home')).toBe('/home');
    expect(normalizePath('/login')).toBe('/login');
  });

  it('handles root', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('/es')).toBe('/');
  });
});

describe('canAccessPath', () => {
  it('returns true when userRole is null/empty (no restriction)', () => {
    expect(canAccessPath('/users', null)).toBe(true);
    expect(canAccessPath('/users', '')).toBe(true);
  });

  it('ADMIN can access any path', () => {
    expect(canAccessPath('/users', 'ADMIN')).toBe(true);
    expect(canAccessPath('/empresa', 'ADMIN')).toBe(true);
    expect(canAccessPath('/reports', 'ADMIN')).toBe(true);
  });

  it('COORDINADOR can access users, empresa, reports', () => {
    expect(canAccessPath('/users', 'COORDINADOR')).toBe(true);
    expect(canAccessPath('/empresa', 'COORDINADOR')).toBe(true);
    expect(canAccessPath('/reports', 'COORDINADOR')).toBe(true);
  });

  it('COMERCIAL cannot access /users', () => {
    expect(canAccessPath('/users', 'COMERCIAL')).toBe(false);
  });

  it('COMERCIAL can access /home, /fichajes, /objetivos', () => {
    expect(canAccessPath('/home', 'COMERCIAL')).toBe(true);
    expect(canAccessPath('/fichajes', 'COMERCIAL')).toBe(true);
    expect(canAccessPath('/objetivos', 'COMERCIAL')).toBe(true);
  });

  it('normalizes role from label', () => {
    expect(canAccessPath('/users', 'Administrador')).toBe(true);
    expect(canAccessPath('/users', 'Comercial')).toBe(false);
  });

  it('prefix match: /fichajes/control-jornada uses /fichajes rules', () => {
    expect(canAccessPath('/fichajes/control-jornada', 'COMERCIAL')).toBe(true);
    expect(canAccessPath('/fichajes/control-jornada', 'ADMIN')).toBe(true);
  });

  it('path with locale is normalized', () => {
    expect(canAccessPath('/es/users', 'COORDINADOR')).toBe(true);
    expect(canAccessPath('/en/users', 'COMERCIAL')).toBe(false);
  });
});
