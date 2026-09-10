import { Appointment } from '@scheduling/domain/Appointment';
import { AppointmentStatus } from '@scheduling/domain/AppointmentStatus';
import { IAppointmentRepository } from '@scheduling/domain/IAppointmentRepository';

const SEED: Appointment[] = [
  Appointment.create('apt-001', { patientId: 'patient-005', patientName: 'Valentina Cruz Ortega',   dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2025-01-08', time: '12:00', type: 'Profilaxis gestacional',             status: AppointmentStatus.CONFIRMED }),
  Appointment.create('apt-002', { patientId: 'patient-002', patientName: 'Miguel Torres Guzmán',    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2025-01-15', time: '10:30', type: 'Consulta post-tratamiento conductos', status: AppointmentStatus.CONFIRMED }),
  Appointment.create('apt-003', { patientId: 'patient-001', patientName: 'Sofía Romero Vega',       dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2025-01-20', time: '09:00', type: 'Control periodontal',                status: AppointmentStatus.CONFIRMED }),
  Appointment.create('apt-004', { patientId: 'patient-003', patientName: 'Lucía Méndez Castillo',   dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2025-02-05', time: '15:00', type: 'Revisión GUNA',                      status: AppointmentStatus.PENDING   }),
  Appointment.create('apt-005', { patientId: 'patient-004', patientName: 'Andrés Flores Ramírez',   dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2025-02-10', time: '16:30', type: 'Consulta general',                   status: AppointmentStatus.PENDING   }),
  Appointment.create('apt-006', { patientId: 'patient-001', patientName: 'Sofía Romero Vega',       dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2024-12-10', time: '10:00', type: 'Curetaje periodontal',                status: AppointmentStatus.COMPLETED }),
  Appointment.create('apt-007', { patientId: 'patient-002', patientName: 'Miguel Torres Guzmán',    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2024-11-28', time: '11:00', type: 'Tratamiento de conductos pieza 36',   status: AppointmentStatus.COMPLETED }),
  Appointment.create('apt-008', { patientId: 'patient-005', patientName: 'Valentina Cruz Ortega',   dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz', date: '2024-12-22', time: '09:30', type: 'Control gestacional periodontal',     status: AppointmentStatus.COMPLETED }),
];

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [...SEED];

  async findByDentist(dentistId: string) {
    return this.appointments.filter((a) => a.dentistId === dentistId);
  }

  async findByPatient(patientId: string) {
    return this.appointments
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async findUpcoming(dentistId: string) {
    return this.appointments
      .filter((a) => a.dentistId === dentistId && (a.status.isConfirmed() || a.status.toPlain() === 'pending'))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }

  async save(appointment: Appointment): Promise<void> {
    this.appointments.push(appointment);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const apt = this.appointments.find((a) => a.id === id);
    if (apt) {
      // We mutate the internal status — in production the API handles this
      (apt as any).props = { ...(apt as any).props, status: AppointmentStatus.from(status) };
    }
  }

  async delete(id: string): Promise<void> {
    this.appointments = this.appointments.filter((a) => a.id !== id);
  }
}

export const appointmentRepository = new InMemoryAppointmentRepository();
