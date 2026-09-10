import { Prescription } from './Prescription';

/** PORT — IPrescriptionRepository */
export interface IPrescriptionRepository {
  findAll(): Promise<Prescription[]>;
  findById(id: string): Promise<Prescription | null>;
  findByPatientId(patientId: string): Promise<Prescription[]>;
  save(prescription: Prescription): Promise<void>;
  update(prescription: Prescription): Promise<void>;
}
