/**
 * Base class for Domain Events.
 * A Domain Event represents something meaningful that happened in the domain.
 */
export abstract class DomainEvent {
  readonly occurredAt: string;
  readonly eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
    this.occurredAt = new Date().toISOString();
  }
}
