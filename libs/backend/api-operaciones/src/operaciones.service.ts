/**
 * @biosstel/api-operaciones - Operaciones Service
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class OperacionesService {
  getPlaceholder(): string {
    return 'Operaciones service placeholder';
  }
}
