import { Fichaje } from '../../domain/entities/Fichaje';
import { FichajeEntity } from '../persistence/entities/fichajes/FichajeEntity';

export class FichajeMapper {
  public static toDomain(entity: FichajeEntity): Fichaje {
    return new Fichaje(
      entity.id,
      entity.userId,
      entity.date,
      entity.startTime,
      entity.status,
      entity.endTime,
      entity.pauses,
      entity.location,
      entity.totalTime,
      entity.fueraHorario,
      entity.createdAt,
      entity.updatedAt
    );
  }

  public static toPersistence(domain: Fichaje): FichajeEntity {
    const entity = new FichajeEntity();
    if (domain.id) entity.id = domain.id;
    entity.userId = domain.userId;
    entity.date = domain.date;
    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    entity.status = domain.status;
    entity.pauses = domain.pauses;
    entity.location = domain.location;
    entity.totalTime = domain.totalTime;
    // fueraHorario is calculated/queried often, but stored in DB if column exists
    // FichajeEntity has totalTime, pauses, location.
    return entity;
  }
}
