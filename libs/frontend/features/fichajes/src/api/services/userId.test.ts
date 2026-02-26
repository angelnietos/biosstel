/**
 * @biosstel/fichajes - Unit tests: isValidUserId
 * Si alguien relaja la validación (p. ej. aceptar cualquier string), estos tests deben fallar.
 */
import { describe, it, expect } from 'vitest';
import { isValidUserId } from './userId';

const VALID_UUID = 'f2ce86c5-0406-403e-a6dc-8a55d91f480b';

describe('isValidUserId', () => {
  it('returns true only for a valid UUID string', () => {
    expect(isValidUserId(VALID_UUID)).toBe(true);
    expect(isValidUserId('e0000000-0000-0000-0000-000000000001')).toBe(true);
    expect(isValidUserId(VALID_UUID.toUpperCase())).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidUserId('')).toBe(false);
    expect(isValidUserId('   ')).toBe(false);
  });

  it('returns false for non-UUID strings (evita enviar ids inválidos al API)', () => {
    expect(isValidUserId('123')).toBe(false);
    expect(isValidUserId('user-1')).toBe(false);
    expect(isValidUserId('current-user-id')).toBe(false);
    expect(isValidUserId('1-2-3-4-5')).toBe(false);
    expect(isValidUserId('f2ce86c5-0406-403e-a6dc-8a55d91f480bX')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isValidUserId(undefined)).toBe(false);
    expect(isValidUserId(null)).toBe(false);
    expect(isValidUserId(123)).toBe(false);
  });
});
