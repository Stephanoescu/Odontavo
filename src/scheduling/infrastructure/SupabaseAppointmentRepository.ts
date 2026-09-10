import { createClient } from '@shared/lib/supabase/client';
import { IAppointmentRepository } from '@scheduling/domain/IAppointmentRepository';
import { Appointment } from '@scheduling/domain/Appointment';
import { AppointmentStatus } from '@scheduling/domain/AppointmentStatus';

/**
 * INFRASTRUCTURE — SupabaseAppointmentRepository
 * Implements IAppointmentRepository using Supabase.
 */

interface AppointmentRow {
  id: string;
  dentist_id: string;
  patient_id: string;
  patient_name: string;
  dentist_name: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

function rowToAppointment(row: AppointmentRow): Appointment {
  return Appointment.create(row.id, {
    patientId: row.patient_id,
    patientName: row.patient_name,
    dentistId: row.dentist_id,
    dentistName: row.dentist_name,
    date: row.date,
    time: row.time,
    type: row.type,
    status: AppointmentStatus.from(row.status),
  });
}

export class SupabaseAppointmentRepository implements IAppointmentRepository {
  private supabase = createClient();

  async findByDentist(dentistId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('dentist_id', dentistId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as AppointmentRow[]).map(rowToAppointment);
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as AppointmentRow[]).map(rowToAppointment);
  }

  async findUpcoming(dentistId: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .eq('dentist_id', dentistId)
      .in('status', ['confirmed', 'pending'])
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw new Error(error.message);
    return (data as AppointmentRow[]).map(rowToAppointment);
  }

  async save(appointment: Appointment): Promise<void> {
    const plain = appointment.toPlain();
    const { data: sessionData } = await this.supabase.auth.getSession();
    const dentistId = sessionData.session?.user.id;

    const { error } = await this.supabase.from('appointments').insert({
      id: plain.id,
      dentist_id: dentistId,
      patient_id: plain.patientId,
      patient_name: plain.patientName,
      dentist_name: plain.dentistName,
      date: plain.date,
      time: plain.time,
      type: plain.type,
      status: plain.status,
    });

    if (error) throw new Error(error.message);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await this.supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const appointmentRepository = new SupabaseAppointmentRepository();
