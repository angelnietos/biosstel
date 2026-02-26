/**
 * @biosstel/api-fichajes - Application Layer: Fichajes Management Use Case
 * Implements fichaje business logic using the domain repositories.
 */

import { Injectable, Inject } from '@nestjs/common';
import { I_FICHAJE_REPOSITORY } from '../../../domain/repositories/fichajes/IFichajeRepository';
import type { IFichajeRepository } from '../../../domain/repositories/fichajes/IFichajeRepository';
import type { Fichaje } from '../../../domain/entities/fichajes/Fichaje';

@Injectable()
export class FichajesManagementUseCase {
  constructor(
    @Inject(I_FICHAJE_REPOSITORY) private readonly fichajeRepository: IFichajeRepository
  ) {}

  /** Lists all fichajes for a given user. */
  async listByUserId(userId: string): Promise<Fichaje[]> {
    return this.fichajeRepository.findByUserId(userId);
  }

  /** Returns the current active fichaje for a user, or null. */
  async getCurrentFichaje(userId: string): Promise<Fichaje | null> {
    return this.fichajeRepository.findCurrentByUserId(userId);
  }

  /** Legacy compatibility: returns a message for un-parameterised calls. */
  async list(): Promise<{ message: string }> {
    return { message: 'Fichajes API — use listByUserId(userId) for real data.' };
  }
}
