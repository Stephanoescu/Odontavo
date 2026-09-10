import { ValueObject } from '@shared/domain/ValueObject';

/**
 * VALUE OBJECT — MedicalRecord
 * Encapsulates clinical and medical background of a Patient.
 */
export interface MedicalRecordProps {
  bloodType: string;
  allergies: string[];
  history: string;
}

export class MedicalRecord extends ValueObject<MedicalRecordProps> {
  static create(props: MedicalRecordProps): MedicalRecord {
    return new MedicalRecord({
      bloodType: props.bloodType,
      allergies: [...props.allergies],
      history: props.history,
    });
  }

  get bloodType() { return this.props.bloodType; }
  get allergies() { return [...this.props.allergies]; }
  get history() { return this.props.history; }
  get hasAllergies() { return this.props.allergies.length > 0; }
}
