/** Any valid UUID (8-4-4-4-12 hex). Backend/DB use UUID for userId. */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Returns true only when the value is a valid UUID.
 * Use this before calling APIs that require userId (e.g. fichajes, tasks)
 * so placeholder values like "current-user-id" are not sent.
 */
export function isValidUserId(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '' && UUID_REGEX.test(value.trim());
}
