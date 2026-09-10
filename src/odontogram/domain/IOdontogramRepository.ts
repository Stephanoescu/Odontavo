import { OdontogramEntry } from './OdontogramEntry';

/**
 * PORT — IOdontogramRepository
 * Contract for all odontogram entry persistence implementations.
 */
export interface IOdontogramRepository {
  findByPatient(patientId: string): Promise<OdontogramEntry[]>;
  save(entry: OdontogramEntry): Promise<void>;
  deleteById(id: string): Promise<void>;
}
