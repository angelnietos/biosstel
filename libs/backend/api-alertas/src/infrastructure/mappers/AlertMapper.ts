import { Alert } from '../../domain/entities/Alert';
import type { DashboardAlertEntity } from '@biosstel/api-objetivos';

type AlertStatusType = 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';

export class AlertMapper {
  public static toDomain(entity: DashboardAlertEntity): Alert {
    return new Alert(
      entity.id,
      entity.usuario,
      entity.departamento,
      entity.centroTrabajo,
      entity.estado,
      entity.isActive,
      entity.rol,
      entity.marca,
      entity.statusType as AlertStatusType | undefined,
      entity.sortOrder
    );
  }

  public static toPersistence(domain: Alert): Partial<DashboardAlertEntity> {
    return {
      id: domain.id,
      usuario: domain.usuario,
      departamento: domain.departamento,
      centroTrabajo: domain.centroTrabajo,
      estado: domain.estado,
      isActive: domain.isActive,
      rol: domain.rol,
      marca: domain.marca,
      statusType: domain.statusType,
      sortOrder: domain.sortOrder,
    };
  }
}
