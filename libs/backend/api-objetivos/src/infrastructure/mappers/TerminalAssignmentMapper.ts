import { TerminalAssignment } from '../../domain/entities/TerminalAssignment';
import { TerminalAssignmentEntity } from '../persistence/entities/TerminalAssignmentEntity';

export class TerminalAssignmentMapper {
  public static toDomain(entity: TerminalAssignmentEntity): TerminalAssignment {
    return new TerminalAssignment(
      entity.id,
      entity.groupType,
      entity.groupTitle,
      entity.label,
      entity.value,
      entity.total,
      entity.ok,
      entity.sortOrder
    );
  }

  public static toPersistence(domain: TerminalAssignment): TerminalAssignmentEntity {
    const entity = new TerminalAssignmentEntity();
    if (domain.id) entity.id = domain.id;
    entity.groupType = domain.groupType;
    entity.groupTitle = domain.groupTitle;
    entity.label = domain.label;
    entity.value = domain.value;
    entity.total = domain.total;
    entity.ok = domain.ok;
    entity.sortOrder = domain.sortOrder;
    return entity;
  }
}
