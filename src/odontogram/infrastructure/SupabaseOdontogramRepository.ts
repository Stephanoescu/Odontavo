import { createClient } from '@shared/lib/supabase/client';
import { IOdontogramRepository } from '@odontogram/domain/IOdontogramRepository';
import { OdontogramEntry } from '@odontogram/domain/OdontogramEntry';

/**
 * INFRASTRUCTURE — SupabaseOdontogramRepository
 * Implements IOdontogramRepository using Supabase.
 */

interface OdontogramRow {
  id: string;
  dentist_id: string;
  patient_id: string;
  tooth_number: string;
  surface: string | null;
  diagnosis: string;
  treatment: string;
  status: 'diagnostico' | 'planificado' | 'completado';
  notes: string | null;
  date: string;
}

function rowToEntry(row: OdontogramRow): OdontogramEntry {
  return OdontogramEntry.create(row.id, {
    patientId: row.patient_id,
    toothNumber: row.tooth_number,
    surface: row.surface ?? undefined,
    diagnosis: row.diagnosis,
    treatment: row.treatment,
    status: row.status ?? 'completado',
    notes: row.notes ?? undefined,
    date: row.date,
    dentistId: row.dentist_id,
  });
}

export class SupabaseOdontogramRepository implements IOdontogramRepository {
  private supabase = createClient();

  async findByPatient(patientId: string): Promise<OdontogramEntry[]> {
    const { data, error } = await this.supabase
      .from('odontogram_entries')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as OdontogramRow[]).map(rowToEntry);
  }

  async save(entry: OdontogramEntry): Promise<void> {
    const plain = entry.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id ?? plain.dentistId;

    const { error } = await this.supabase.from('odontogram_entries').insert({
      id: plain.id,
      dentist_id: dentistId,
      patient_id: plain.patientId,
      tooth_number: plain.toothNumber,
      surface: plain.surface ?? null,
      diagnosis: plain.diagnosis,
      treatment: plain.treatment,
      status: plain.status,
      notes: plain.notes ?? null,
      date: plain.date,
    });

    if (error) throw new Error(error.message);
  }

  async deleteById(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('odontogram_entries')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const odontogramRepository = new SupabaseOdontogramRepository();
