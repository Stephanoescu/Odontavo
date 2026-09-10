import { Treatment } from './Treatment';

/**
 * PORT — ITreatmentRepository
 * Contract for all treatment catalog persistence implementations.
 */
export interface ITreatmentRepository {
  findAll(): Promise<Treatment[]>;
  findByCategory(category: string): Promise<Treatment[]>;
  findById(id: string): Promise<Treatment | null>;
  update(id: string, price: number): Promise<void>;
  save(treatment: Treatment): Promise<void>;
}
