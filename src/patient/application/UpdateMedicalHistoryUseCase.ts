import { Result, ok, fail } from '@shared/lib/result';
import { IPatientRepository } from '@patient/domain/IPatientRepository';
import { PatientResponseDto } from './dtos/PatientResponseDto';

export interface UpdateMedicalHistoryDto {
  patientId: string;
  note: string;
  date: string;
}

export class UpdateMedicalHistoryUseCase {
  constructor(private patientRepository: IPatientRepository) {}

  async execute(dto: UpdateMedicalHistoryDto): Promise<Result<PatientResponseDto>> {
    const patient = await this.patientRepository.findById(dto.patientId);
    if (!patient) {
      return fail('Patient not found');
    }

    patient.updateMedicalHistory(dto.note, dto.date);
    await this.patientRepository.update(patient);

    return ok(patient.toPlain());
  }
}
