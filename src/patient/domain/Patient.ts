import { Entity } from '@shared/domain/Entity';
import { ContactInfo } from './ContactInfo';
import { MedicalRecord } from './MedicalRecord';

/**
 * AGGREGATE ROOT — Patient
 */
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PatientProps {
  name: string;
  dateOfBirth: string;
  contact: ContactInfo;
  medical: MedicalRecord;
  emergencyContact: EmergencyContact;
  lastVisit: string;
  nextAppointment?: string;
  avatar?: string;
  status: 'active' | 'inactive';
}

export class Patient extends Entity<string> {
  private readonly props: PatientProps;

  private constructor(id: string, props: PatientProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: PatientProps): Patient {
    return new Patient(id, props);
  }

  get name() { return this.props.name; }
  get dateOfBirth() { return this.props.dateOfBirth; }
  get contact() { return this.props.contact; }
  get medical() { return this.props.medical; }
  get emergencyContact() { return this.props.emergencyContact; }
  get lastVisit() { return this.props.lastVisit; }
  get nextAppointment() { return this.props.nextAppointment; }
  get avatar() { return this.props.avatar; }
  get status() { return this.props.status; }

  updateMedicalHistory(note: string, date: string): void {
    const current = this.props.medical.history;
    const newHistory = current ? `${current}\n\n[${date}]: ${note}` : `[${date}]: ${note}`;
    
    // Create new Value Object
    this.props.medical = MedicalRecord.create({
      bloodType: this.props.medical.bloodType,
      allergies: this.props.medical.allergies,
      history: newHistory
    });
  }

  toPlain() {
    return {
      id: this._id,
      name: this.props.name,
      dateOfBirth: this.props.dateOfBirth,
      email: this.props.contact.email,
      phone: this.props.contact.phone,
      address: this.props.contact.address,
      bloodType: this.props.medical.bloodType,
      allergies: this.props.medical.allergies,
      medicalHistory: this.props.medical.history,
      emergencyContact: this.props.emergencyContact,
      lastVisit: this.props.lastVisit,
      nextAppointment: this.props.nextAppointment,
      avatar: this.props.avatar,
      status: this.props.status,
    };
  }
}
