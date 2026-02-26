import { TerminalObjective } from '../../domain/entities/TerminalObjective';
import { TerminalObjectiveEntity } from '../persistence/entities/TerminalObjectiveEntity';

export class TerminalObjectiveMapper {
  public static toDomain(entity: TerminalObjectiveEntity): TerminalObjective {
    return new TerminalObjective(
      entity.id,
      entity.title,
      entity.achieved,
      entity.objective,
      entity.pct,
      entity.isActive,
      entity.objectiveType,
      entity.rangeLabel,
      entity.color,
      entity.period
    );
  }

  public static toPersistence(domain: TerminalObjective): TerminalObjectiveEntity {
    const entity = new TerminalObjectiveEntity();
    if (domain.id) entity.id = domain.id;
    entity.title = domain.title;
    entity.achieved = domain.achieved;
    entity.objective = domain.objective;
    entity.pct = domain.pct;
    entity.isActive = domain.isActive;
    entity.objectiveType = domain.objectiveType;
    entity.rangeLabel = domain.rangeLabel ?? '';
    entity.color = domain.color;
    entity.period = domain.period ?? null;
    return entity;
  }
}
