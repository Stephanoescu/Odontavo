import { IPrescriptionRepository } from '@prescription/domain/IPrescriptionRepository';
import { PrescriptionResponseDto } from './dtos/PrescriptionDtos';
import { Result, ok } from '@shared/lib/result';

export class GetPatientPrescriptionsUseCase {
  constructor(private readonly repo: IPrescriptionRepository) {}

  async execute(patientId: string): Promise<Result<PrescriptionResponseDto[]>> {
    const rxs = await this.repo.findByPatientId(patientId);
    return ok(rxs.map((r) => r.toPlain()));
  }
}
