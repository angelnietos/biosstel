/**
 * @biosstel/api-operaciones - Operaciones Management Use Case
 * Devuelve visitas, agenda, revisión y tienda (datos integrados para el front).
 */

import { Injectable } from '@nestjs/common';
import type { OperacionesListResponse } from '@biosstel/shared-types';

@Injectable()
export class OperacionesManagementUseCase {
  async list(): Promise<OperacionesListResponse> {
    return {
      visitas: [
        { id: '1', cliente: 'Cliente A', tipo: 'nueva', fecha: '2025-02-15' },
        { id: '2', cliente: 'Cliente B', tipo: 'seguimiento', fecha: '2025-02-16' },
      ],
      agenda: [
        { id: '1', tarea: 'Llamada seguimiento', cliente: 'Cliente A', estado: 'Pendiente' },
        { id: '2', tarea: 'Enviar propuesta', cliente: 'Cliente B', estado: 'En curso' },
      ],
      revision: [
        { id: '1', contratoTarea: 'Contrato XYZ', fecha: '2025-02-14', estado: 'Pendiente validación' },
      ],
      tienda: [
        { id: '1', puntoVenta: 'Punto de venta 1', achieved: 120, objective: 500 },
        { id: '2', puntoVenta: 'Punto de venta 2', achieved: 437, objective: 500 },
      ],
    };
  }
}
