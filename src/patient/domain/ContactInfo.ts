import { ValueObject } from '@shared/domain/ValueObject';

/**
 * VALUE OBJECT — ContactInfo
 * Encapsulates all contact-related data for a Patient.
 */
export interface ContactInfoProps {
  email: string;
  phone: string;
  address: string;
}

export class ContactInfo extends ValueObject<ContactInfoProps> {
  static create(props: ContactInfoProps): ContactInfo {
    if (!props.email.includes('@')) throw new Error('Invalid email in ContactInfo');
    return new ContactInfo(props);
  }

  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get address() { return this.props.address; }
}
