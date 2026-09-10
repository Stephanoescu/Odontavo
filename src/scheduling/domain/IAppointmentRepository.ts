import { Appointment } from './Appointment';

/**
 * PORT — IAppointmentRepository
 * Full CRUD interface ready for backend swap.
 */
export interface IAppointmentRepository {
  findByDentist(dentistId: string): Promise<Appointment[]>;
  findByPatient(patientId: string): Promise<Appointment[]>;
  findUpcoming(dentistId: string): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
  delete(id: string): Promise<void>;
}
