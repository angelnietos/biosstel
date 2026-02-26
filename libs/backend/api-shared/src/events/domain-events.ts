/**
 * Domain event payloads - shared contract for event-driven features.
 * Emitters and subscribers depend on these types only (no cross-feature imports).
 */

/** User domain */
export interface UserCreatedEvent {
  userId: string;
  email: string;
  occurredAt: string; // ISO
}

export interface UserUpdatedEvent {
  userId: string;
  occurredAt: string;
}

export interface UserDeletedEvent {
  userId: string;
  occurredAt: string;
}

export interface UserLoggedInEvent {
  userId: string;
  email: string;
  occurredAt: string;
}

/** Fichajes domain */
export interface FichajeStartedEvent {
  fichajeId: string;
  userId: string;
  startTime: string;
  occurredAt: string;
}

export interface FichajeEndedEvent {
  fichajeId: string;
  userId: string;
  endTime: string;
  occurredAt: string;
}

export interface FichajePausedEvent {
  fichajeId: string;
  userId: string;
  occurredAt: string;
}

export interface FichajeResumedEvent {
  fichajeId: string;
  userId: string;
  occurredAt: string;
}

/** Event name constants for type-safe publish/subscribe */
export const DomainEvents = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_LOGGED_IN: 'user.logged_in',
  FICHAJE_STARTED: 'fichaje.started',
  FICHAJE_ENDED: 'fichaje.ended',
  FICHAJE_PAUSED: 'fichaje.paused',
  FICHAJE_RESUMED: 'fichaje.resumed',
} as const;
