import { createClient } from '@shared/lib/supabase/client';
import { IPrescriptionRepository } from '@prescription/domain/IPrescriptionRepository';
import { Prescription } from '@prescription/domain/Prescription';
import { Medication } from '@prescription/domain/Medication';
import { PrescriptionStatus } from '@prescription/domain/PrescriptionStatus';

/**
 * INFRASTRUCTURE — SupabasePrescriptionRepository
 * Implements IPrescriptionRepository using Supabase.
 * The `medications` field is stored as JSONB and mapped back to Medication VOs.
 */

interface MedicationJson {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionRow {
  id: string;
  dentist_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  dentist_name: string;
  dentist_license: string;
  clinic_name: string;
  diagnosis: string;
  medications: MedicationJson[];
  additional_instructions: string;
  created_at: string;
  expires_at: string;
  status: string;
  sent_via: string[];
}

function rowToPrescription(row: PrescriptionRow): Prescription {
  return Prescription.create(row.id, {
    patientId: row.patient_id,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    dentistId: row.dentist_id,
    dentistName: row.dentist_name,
    dentistLicense: row.dentist_license,
    clinicName: row.clinic_name,
    diagnosis: row.diagnosis,
    medications: (row.medications ?? []).map((m) => Medication.create(m)),
    additionalInstructions: row.additional_instructions ?? '',
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    status: PrescriptionStatus.from(row.status),
    sentVia: (row.sent_via ?? []) as ('whatsapp' | 'email' | 'pdf')[],
  });
}

export class SupabasePrescriptionRepository implements IPrescriptionRepository {
  private supabase = createClient();

  async findAll(): Promise<Prescription[]> {
    const { data, error } = await this.supabase
      .from('prescriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as PrescriptionRow[]).map(rowToPrescription);
  }

  async findById(id: string): Promise<Prescription | null> {
    const { data, error } = await this.supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return rowToPrescription(data as PrescriptionRow);
  }

  async findByPatientId(patientId: string): Promise<Prescription[]> {
    const { data, error } = await this.supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as PrescriptionRow[]).map(rowToPrescription);
  }

  async save(prescription: Prescription): Promise<void> {
    const plain = prescription.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id ?? plain.dentistId;

    const { error } = await this.supabase.from('prescriptions').insert({
      id: plain.id,
      dentist_id: dentistId,
      patient_id: plain.patientId,
      patient_name: plain.patientName,
      patient_email: plain.patientEmail,
      dentist_name: plain.dentistName,
      dentist_license: plain.dentistLicense,
      clinic_name: plain.clinicName,
      diagnosis: plain.diagnosis,
      medications: plain.medications,
      additional_instructions: plain.additionalInstructions,
      expires_at: plain.expiresAt,
      status: plain.status,
      sent_via: plain.sentVia ?? [],
    });

    if (error) throw new Error(error.message);
  }

  async update(prescription: Prescription): Promise<void> {
    const plain = prescription.toPlain();

    const { error } = await this.supabase
      .from('prescriptions')
      .update({
        status: plain.status,
        sent_via: plain.sentVia ?? [],
        medications: plain.medications,
        additional_instructions: plain.additionalInstructions,
      })
      .eq('id', plain.id);

    if (error) throw new Error(error.message);
  }
}

export const prescriptionRepository = new SupabasePrescriptionRepository();
