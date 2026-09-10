import { createClient } from '@shared/lib/supabase/client';
import { ITreatmentRepository } from '@settings/domain/ITreatmentRepository';
import { Treatment, TreatmentCategory } from '@settings/domain/Treatment';

/**
 * INFRASTRUCTURE — SupabaseTreatmentRepository
 * Implements ITreatmentRepository using Supabase.
 */

interface TreatmentRow {
  id: string;
  dentist_id: string;
  name: string;
  category: TreatmentCategory;
  price: number;
  duration: number;
  description: string | null;
  active: boolean;
}

function rowToTreatment(row: TreatmentRow): Treatment {
  return Treatment.create(row.id, {
    name: row.name,
    category: row.category,
    price: Number(row.price),
    duration: row.duration,
    description: row.description ?? undefined,
    active: row.active,
  });
}

export class SupabaseTreatmentRepository implements ITreatmentRepository {
  private supabase = createClient();

  async findAll(): Promise<Treatment[]> {
    const { data, error } = await this.supabase
      .from('treatments')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as TreatmentRow[]).map(rowToTreatment);
  }

  async findByCategory(category: string): Promise<Treatment[]> {
    const { data, error } = await this.supabase
      .from('treatments')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as TreatmentRow[]).map(rowToTreatment);
  }

  async findById(id: string): Promise<Treatment | null> {
    const { data, error } = await this.supabase
      .from('treatments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return rowToTreatment(data as TreatmentRow);
  }

  async update(id: string, price: number): Promise<void> {
    const { error } = await this.supabase
      .from('treatments')
      .update({ price })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async save(treatment: Treatment): Promise<void> {
    const plain = treatment.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id;

    const { error } = await this.supabase.from('treatments').insert({
      id: plain.id,
      dentist_id: dentistId,
      name: plain.name,
      category: plain.category,
      price: plain.price,
      duration: plain.duration,
      description: plain.description ?? null,
      active: plain.active,
    });

    if (error) throw new Error(error.message);
  }
}

export const treatmentRepository = new SupabaseTreatmentRepository();
