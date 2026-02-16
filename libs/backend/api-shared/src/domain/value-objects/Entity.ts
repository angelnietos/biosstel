/**
 * @biosstel/api-shared - Domain Layer: Base Entity
 * 
 * Base class for all entities in the domain layer.
 * Provides common functionality like id comparison.
 */

export abstract class Entity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this._id === entity._id;
  }
}
