import { IPatientRepository } from '@patient/domain/IPatientRepository';
import { PatientResponseDto } from './dtos/PatientResponseDto';
import { Result, ok } from '@shared/lib/result';

export class GetAllPatientsUseCase {
  constructor(private readonly repo: IPatientRepository) {}

  async execute(): Promise<Result<PatientResponseDto[]>> {
    const patients = await this.repo.findAll();
    return ok(patients.map((p) => p.toPlain()));
  }
}
