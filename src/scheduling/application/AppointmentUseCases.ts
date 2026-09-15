import { generateId } from '@shared/lib/utils';
import { IAppointmentRepository } from '../domain/IAppointmentRepository';
import { AppointmentDto, CreateAppointmentDto, appointmentToDto } from './dtos/AppointmentDtos';
import { Appointment } from '../domain/Appointment';
import { AppointmentStatus } from '../domain/AppointmentStatus';
import { Result, ok, fail } from '@shared/lib/result';

/**
 * USE CASE — GetAppointmentsUseCase
 * Returns all appointments for a dentist.
 */
export class GetAppointmentsUseCase {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(dentistId: string): Promise<Result<AppointmentDto[]>> {
    const appointments = await this.repo.findByDentist(dentistId);
    return ok(appointments.map(appointmentToDto));
  }
}

/**
 * USE CASE — GetPatientAppointmentsUseCase
 * Returns appointments for a specific patient.
 */
export class GetPatientAppointmentsUseCase {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(patientId: string): Promise<Result<AppointmentDto[]>> {
    const appointments = await this.repo.findByPatient(patientId);
    return ok(appointments.map(appointmentToDto));
  }
}

/**
 * USE CASE — CreateAppointmentUseCase
 */
export class CreateAppointmentUseCase {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(dto: CreateAppointmentDto): Promise<Result<AppointmentDto>> {
    const id  = generateId();
    const apt = Appointment.create(id, {
      ...dto,
      status: AppointmentStatus.PENDING,
    });
    await this.repo.save(apt);
    return ok(appointmentToDto(apt));
  }
}

/**
 * USE CASE — UpdateAppointmentStatusUseCase
 */
export class UpdateAppointmentStatusUseCase {
  constructor(private readonly repo: IAppointmentRepository) {}

  async execute(id: string, status: string): Promise<Result<void>> {
    try {
      await this.repo.updateStatus(id, status);
      return ok(undefined);
    } catch (e) {
      return fail(String(e));
    }
  }
}
