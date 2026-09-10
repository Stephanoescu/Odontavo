import { DomainEvent } from '@shared/domain/DomainEvent';

export class PrescriptionCreatedEvent extends DomainEvent {
  constructor(
    public readonly prescriptionId: string,
    public readonly patientId: string,
    public readonly dentistId: string,
  ) {
    super('prescription.created');
  }
}
