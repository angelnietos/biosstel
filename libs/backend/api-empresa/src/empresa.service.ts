/**
 * @biosstel/api-empresa - Empresa Service
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class EmpresaService {
  getPlaceholder(): string {
    return 'Empresa service placeholder';
  }
}
