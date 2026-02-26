/**
 * @biosstel/api-fichajes - Application Layer: Fichajes Management Use Case
 * Placeholder use case for fichajes.
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class FichajesManagementUseCase {
  async list(): Promise<{ message: string }> {
    // TODO: implement list fichajes
    return { message: 'Fichajes API placeholder' };
  }
}
