import { DashboardObjective } from '../../domain/entities/DashboardObjective';
import { DashboardObjectiveEntity } from '../persistence/entities/DashboardObjectiveEntity';

export class DashboardObjectiveMapper {
  public static toDomain(entity: DashboardObjectiveEntity): DashboardObjective {
    return new DashboardObjective(
      entity.id,
      entity.title,
      entity.achieved,
      entity.objective,
      entity.accent,
      entity.isActive,
      entity.unit,
      entity.href
    );
  }

  public static toPersistence(domain: DashboardObjective): DashboardObjectiveEntity {
    const entity = new DashboardObjectiveEntity();
    if (domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.achieved = domain.achieved;
    entity.objective = domain.objective;
    entity.accent = domain.accent;
    entity.isActive = domain.isActive;
    entity.unit = domain.unit;
    entity.href = domain.href;
    return entity;
  }
}
