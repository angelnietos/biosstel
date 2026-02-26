/**
 * @biosstel/api-fichajes - Application Layer: Input Port
 * Input port for fichajes management operations.
 */

import type { Fichaje } from '../../../domain/entities/fichajes/Fichaje';

export interface IFichajesManagement {
  /** Lists all fichajes for a given user, ordered by date descending. */
  listByUserId(userId: string): Promise<Fichaje[]>;
  /** Gets the currently active (working/paused) fichaje for a user, if any. */
  getCurrentFichaje(userId: string): Promise<Fichaje | null>;
  /** Starts a new fichaje for a user. */
  startFichaje(userId: string, date: string, location?: { lat: number; lng: number; address?: string }): Promise<Fichaje>;
  /** Ends the current active fichaje for a user. */
  endFichaje(fichajeId: string): Promise<Fichaje>;
}
