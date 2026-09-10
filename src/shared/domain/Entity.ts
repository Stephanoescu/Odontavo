/**
 * Base class for all Domain Entities.
 * An Entity has a unique identity that persists over time.
 */
export abstract class Entity<TId = string> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  equals(other: Entity<TId>): boolean {
    if (!(other instanceof Entity)) return false;
    return this._id === other._id;
  }
}
