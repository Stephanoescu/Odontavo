import { IPatientRepository } from '@patient/domain/IPatientRepository';
import { PatientResponseDto } from './dtos/PatientResponseDto';
import { Result, ok, fail } from '@shared/lib/result';

export class GetPatientByIdUseCase {
  constructor(private readonly repo: IPatientRepository) {}

  async execute(id: string): Promise<Result<PatientResponseDto>> {
    const patient = await this.repo.findById(id);
    if (!patient) return fail(`Paciente con id "${id}" no encontrado`);
    return ok(patient.toPlain());
  }
}
