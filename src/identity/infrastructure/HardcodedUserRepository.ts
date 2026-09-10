import { IUserRepository } from '@identity/domain/IUserRepository';
import { User } from '@identity/domain/User';
import { UserRole } from '@identity/domain/UserRole';

/**
 * ADAPTER — HardcodedUserRepository
 * Infrastructure implementation of IUserRepository.
 * Uses in-memory hardcoded users. Replace with API/DB call in production.
 */

const USERS: User[] = [
  User.create('dentist-001', {
    email: 'dr.martinez@odontavo.com',
    passwordHash: 'dental2024',
    role: UserRole.DENTIST,
    name: 'Dr. Carlos Martínez Ruiz',
    avatar: 'CM',
    clinicName: 'Consultorio Dental Martínez',
    licenseNumber: 'CDMX-ODO-2847',
  }),
  User.create('patient-001', {
    email: 'sofia.romero@gmail.com',
    passwordHash: 'paciente2024',
    role: UserRole.PATIENT,
    name: 'Sofía Romero Vega',
    avatar: 'SR',
  }),
  User.create('patient-002', {
    email: 'miguel.torres@gmail.com',
    passwordHash: 'paciente2024',
    role: UserRole.PATIENT,
    name: 'Miguel Torres Guzmán',
    avatar: 'MT',
  }),
  User.create('patient-003', {
    email: 'lucia.mendez@hotmail.com',
    passwordHash: 'paciente2024',
    role: UserRole.PATIENT,
    name: 'Lucía Méndez Castillo',
    avatar: 'LM',
  }),
];

export class HardcodedUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return USERS.find((u) => u.id === id) ?? null;
  }
}
