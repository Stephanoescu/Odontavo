import { Patient } from './Patient';

/**
 * PORT — IPatientRepository
 * Full CRUD interface. InMemory and API implementations must satisfy this contract.
 */
export interface IPatientRepository {
  findAll(): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
  findByAuthUserId(authUserId: string): Promise<Patient | null>;
  save(patient: Patient): Promise<void>;
  update(patient: Patient): Promise<void>;
  delete(id: string): Promise<void>;
}
