import { DashboardAlert } from '../../domain/entities/DashboardAlert';
import { DashboardAlertEntity } from '../persistence/entities/DashboardAlertEntity';

export class DashboardAlertMapper {
  public static toDomain(entity: DashboardAlertEntity): DashboardAlert {
    return new DashboardAlert(
      entity.id,
      entity.usuario,
      entity.departamento,
      entity.centroTrabajo,
      entity.estado,
      entity.isActive,
      entity.rol,
      entity.marca,
      entity.statusType,
      entity.sortOrder
    );
  }

  public static toPersistence(domain: DashboardAlert): DashboardAlertEntity {
    const entity = new DashboardAlertEntity();
    if (domain.id) entity.id = domain.id;
    entity.usuario = domain.usuario;
    entity.departamento = domain.departamento;
    entity.centroTrabajo = domain.centroTrabajo;
    entity.estado = domain.estado;
    entity.isActive = domain.isActive;
    entity.rol = domain.rol;
    entity.marca = domain.marca;
    entity.statusType = domain.statusType;
    entity.sortOrder = domain.sortOrder;
    return entity;
  }
}
