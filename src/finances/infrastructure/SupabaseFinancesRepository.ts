import { createClient } from '@shared/lib/supabase/client';
import { IFinancesRepository } from '@finances/domain/IFinancesRepository';
import { Transaction } from '@finances/domain/Transaction';

/**
 * INFRASTRUCTURE — SupabaseFinancesRepository
 * Implements IFinancesRepository using Supabase.
 */

interface TransactionRow {
  id: string;
  dentist_id: string;
  patient_id: string | null;
  patient_name: string;
  concept: string;
  amount: number;
  type: 'ingreso' | 'gasto' | 'presupuesto';
  status: 'pagado' | 'pendiente' | 'cancelado';
  date: string;
  method?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  notes?: string;
}

function rowToTransaction(row: TransactionRow): Transaction {
  return Transaction.create(row.id, {
    patientId: row.patient_id ?? '',
    patientName: row.patient_name,
    concept: row.concept,
    amount: Number(row.amount),
    type: row.type,
    status: row.status,
    date: row.date,
    method: row.method,
    notes: row.notes,
  });
}

export class SupabaseFinancesRepository implements IFinancesRepository {
  private supabase = createClient();

  async findAll(): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as TransactionRow[]).map(rowToTransaction);
  }

  async findByPatient(patientId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as TransactionRow[]).map(rowToTransaction);
  }

  async save(transaction: Transaction): Promise<void> {
    const plain = transaction.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id;

    const { error } = await this.supabase.from('transactions').insert({
      id: plain.id,
      dentist_id: dentistId,
      patient_id: plain.patientId || null,
      patient_name: plain.patientName,
      concept: plain.concept,
      amount: plain.amount,
      type: plain.type,
      status: plain.status,
      date: plain.date,
      method: plain.method ?? null,
      notes: plain.notes ?? null,
    });

    if (error) throw new Error(error.message);
  }

  async updateStatus(id: string, status: 'pagado' | 'pendiente' | 'cancelado'): Promise<void> {
    const { error } = await this.supabase
      .from('transactions')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const financesRepository = new SupabaseFinancesRepository();
