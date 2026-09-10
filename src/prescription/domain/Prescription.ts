import { Entity } from '@shared/domain/Entity';
import { Medication, MedicationProps } from './Medication';
import { PrescriptionStatus, PrescriptionStatusType } from './PrescriptionStatus';

/**
 * AGGREGATE ROOT — Prescription
 */
export interface PrescriptionProps {
  patientId: string;
  patientName: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  dentistLicense: string;
  clinicName: string;
  diagnosis: string;
  medications: Medication[];
  additionalInstructions: string;
  createdAt: string;
  expiresAt: string;
  status: PrescriptionStatus;
  sentVia?: ('whatsapp' | 'email' | 'pdf')[];
}

export class Prescription extends Entity<string> {
  private props: PrescriptionProps;

  private constructor(id: string, props: PrescriptionProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: PrescriptionProps): Prescription {
    return new Prescription(id, props);
  }

  // Getters
  get patientId()              { return this.props.patientId; }
  get patientName()            { return this.props.patientName; }
  get patientEmail()           { return this.props.patientEmail; }
  get dentistId()              { return this.props.dentistId; }
  get dentistName()            { return this.props.dentistName; }
  get dentistLicense()         { return this.props.dentistLicense; }
  get clinicName()             { return this.props.clinicName; }
  get diagnosis()              { return this.props.diagnosis; }
  get medications()            { return this.props.medications; }
  get additionalInstructions() { return this.props.additionalInstructions; }
  get createdAt()              { return this.props.createdAt; }
  get expiresAt()              { return this.props.expiresAt; }
  get status()                 { return this.props.status; }
  get sentVia()                { return this.props.sentVia ?? []; }

  // Domain behavior
  markAsSent(via: ('whatsapp' | 'email' | 'pdf')[]): void {
    this.props = { ...this.props, status: PrescriptionStatus.SENT, sentVia: via };
  }

  markAsViewed(): void {
    this.props = { ...this.props, status: PrescriptionStatus.VIEWED };
  }

  toPlain() {
    return {
      id: this._id,
      patientId:              this.props.patientId,
      patientName:            this.props.patientName,
      patientEmail:           this.props.patientEmail,
      dentistId:              this.props.dentistId,
      dentistName:            this.props.dentistName,
      dentistLicense:         this.props.dentistLicense,
      clinicName:             this.props.clinicName,
      diagnosis:              this.props.diagnosis,
      medications:            this.props.medications.map((m) => m.toPlain()),
      additionalInstructions: this.props.additionalInstructions,
      createdAt:              this.props.createdAt,
      expiresAt:              this.props.expiresAt,
      status:                 this.props.status.toPlain() as PrescriptionStatusType,
      sentVia:                this.props.sentVia ?? [],
    };
  }
}
