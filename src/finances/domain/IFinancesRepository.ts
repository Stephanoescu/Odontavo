import { Transaction, TransactionStatus } from './Transaction';

/**
 * PORT - IFinancesRepository
 * Contract for all financial transaction persistence implementations.
 */
export interface IFinancesRepository {
  findAll(): Promise<Transaction[]>;
  findByPatient(patientId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
}
