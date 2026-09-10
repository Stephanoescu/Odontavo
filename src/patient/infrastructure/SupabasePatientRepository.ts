import { createClient } from '@shared/lib/supabase/client';
import { IPatientRepository } from '@patient/domain/IPatientRepository';
import { Patient } from '@patient/domain/Patient';
import { ContactInfo } from '@patient/domain/ContactInfo';
import { MedicalRecord } from '@patient/domain/MedicalRecord';

/**
 * INFRASTRUCTURE — SupabasePatientRepository
 * Implements IPatientRepository using Supabase (PostgreSQL + RLS).
 * Maps snake_case DB rows ↔ Patient domain entities.
 */

interface PatientRow {
  id: string;
  dentist_id: string;
  auth_user_id: string | null;
  name: string;
  date_of_birth: string;
  contact: { email: string; phone: string; address: string };
  medical: { bloodType: string; allergies: string[]; history: string };
  emergency_contact: { name: string; phone: string; relationship: string };
  last_visit: string | null;
  next_appointment: string | null;
  avatar: string | null;
  status: 'active' | 'inactive';
}

function rowToPatient(row: PatientRow): Patient {
  return Patient.create(row.id, {
    name: row.name,
    dateOfBirth: row.date_of_birth,
    contact: ContactInfo.create({
      email: row.contact.email,
      phone: row.contact.phone,
      address: row.contact.address,
    }),
    medical: MedicalRecord.create({
      bloodType: row.medical.bloodType,
      allergies: row.medical.allergies ?? [],
      history: row.medical.history ?? '',
    }),
    emergencyContact: row.emergency_contact,
    lastVisit: row.last_visit ?? '',
    nextAppointment: row.next_appointment ?? undefined,
    avatar: row.avatar ?? undefined,
    status: row.status,
  });
}

export class SupabasePatientRepository implements IPatientRepository {
  private supabase = createClient();

  async findAll(): Promise<Patient[]> {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as PatientRow[]).map(rowToPatient);
  }

  async findById(id: string): Promise<Patient | null> {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return rowToPatient(data as PatientRow);
  }

  /** Busca el expediente del paciente por su auth.uid (para el portal del paciente) */
  async findByAuthUserId(authUserId: string): Promise<Patient | null> {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) return null;
    return rowToPatient(data as PatientRow);
  }

  async save(patient: Patient): Promise<void> {
    const plain = patient.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id;

    const { error } = await this.supabase.from('patients').insert({
      id: plain.id,
      dentist_id: dentistId,
      name: plain.name,
      date_of_birth: plain.dateOfBirth,
      contact: { email: plain.email, phone: plain.phone, address: plain.address },
      medical: {
        bloodType: plain.bloodType,
        allergies: plain.allergies,
        history: plain.medicalHistory,
      },
      emergency_contact: plain.emergencyContact,
      last_visit: plain.lastVisit || null,
      next_appointment: plain.nextAppointment || null,
      avatar: plain.avatar || null,
      status: plain.status,
    });

    if (error) throw new Error(error.message);
  }

  async update(patient: Patient): Promise<void> {
    const plain = patient.toPlain();

    const { error } = await this.supabase
      .from('patients')
      .update({
        name: plain.name,
        date_of_birth: plain.dateOfBirth,
        contact: { email: plain.email, phone: plain.phone, address: plain.address },
        medical: {
          bloodType: plain.bloodType,
          allergies: plain.allergies,
          history: plain.medicalHistory,
        },
        emergency_contact: plain.emergencyContact,
        last_visit: plain.lastVisit || null,
        next_appointment: plain.nextAppointment || null,
        avatar: plain.avatar || null,
        status: plain.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', plain.id);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const patientRepository = new SupabasePatientRepository();
