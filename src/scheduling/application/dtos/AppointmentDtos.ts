import { Appointment } from '@scheduling/domain/Appointment';

export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
}

export function appointmentToDto(a: Appointment): AppointmentDto {
  return {
    id:          a.id,
    patientId:   a.patientId,
    patientName: a.patientName,
    dentistId:   a.dentistId,
    dentistName: a.dentistName,
    date:        a.date,
    time:        a.time,
    type:        a.type,
    status:      a.status.toPlain(),
  };
}
