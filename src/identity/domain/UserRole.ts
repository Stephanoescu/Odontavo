/**
 * VALUE OBJECT — UserRole
 * Encapsulates the valid roles in the system and provides
 * type-safe guards so no invalid role can propagate.
 */
export type UserRoleType = 'dentist' | 'patient';

export class UserRole {
  private constructor(private readonly value: UserRoleType) {}

  static DENTIST = new UserRole('dentist');
  static PATIENT = new UserRole('patient');

  static from(raw: string): UserRole {
    if (raw === 'dentist') return UserRole.DENTIST;
    if (raw === 'patient') return UserRole.PATIENT;
    throw new Error(`Invalid role: "${raw}"`);
  }

  isDentist(): boolean { return this.value === 'dentist'; }
  isPatient(): boolean { return this.value === 'patient'; }

  toString(): UserRoleType { return this.value; }
  toPlain(): UserRoleType { return this.value; }

  equals(other: UserRole): boolean { return this.value === other.value; }
}
