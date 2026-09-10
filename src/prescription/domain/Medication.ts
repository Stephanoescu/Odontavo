import { ValueObject } from '@shared/domain/ValueObject';

/**
 * VALUE OBJECT — Medication
 * Immutable. Represents one line in a prescription.
 */
export interface MedicationProps {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export class Medication extends ValueObject<MedicationProps> {
  static create(props: MedicationProps): Medication {
    if (!props.name.trim()) throw new Error('Medication name is required');
    return new Medication(props);
  }

  get name()         { return this.props.name; }
  get dose()         { return this.props.dose; }
  get frequency()    { return this.props.frequency; }
  get duration()     { return this.props.duration; }
  get instructions() { return this.props.instructions; }
}
