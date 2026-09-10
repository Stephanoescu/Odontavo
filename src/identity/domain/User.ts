import { Entity } from '@shared/domain/Entity';
import { UserRole, UserRoleType } from './UserRole';

/**
 * AGGREGATE ROOT — User
 * Represents an authenticated actor in the system.
 * Contains identity, role, and professional data.
 */
export interface UserProps {
  email: string;
  passwordHash: string; // In this phase: plain text. Replace with bcrypt in production.
  role: UserRole;
  name: string;
  avatar?: string;
  // Dentist-specific (optional on patients)
  clinicName?: string;
  licenseNumber?: string;
}

export class User extends Entity<string> {
  private readonly props: UserProps;

  private constructor(id: string, props: UserProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: UserProps): User {
    return new User(id, props);
  }

  get email(): string { return this.props.email; }
  get role(): UserRole { return this.props.role; }
  get name(): string { return this.props.name; }
  get avatar(): string | undefined { return this.props.avatar; }
  get clinicName(): string | undefined { return this.props.clinicName; }
  get licenseNumber(): string | undefined { return this.props.licenseNumber; }

  verifyPassword(plainPassword: string): boolean {
    return this.props.passwordHash === plainPassword;
  }

  toPlain(): {
    id: string; email: string; role: UserRoleType;
    name: string; avatar?: string; clinicName?: string; licenseNumber?: string;
  } {
    return {
      id: this._id,
      email: this.props.email,
      role: this.props.role.toPlain(),
      name: this.props.name,
      avatar: this.props.avatar,
      clinicName: this.props.clinicName,
      licenseNumber: this.props.licenseNumber,
    };
  }
}
