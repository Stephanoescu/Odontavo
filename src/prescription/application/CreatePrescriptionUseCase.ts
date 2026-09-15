import { IPrescriptionRepository } from '@prescription/domain/IPrescriptionRepository';
import { Prescription } from '@prescription/domain/Prescription';
import { Medication } from '@prescription/domain/Medication';
import { PrescriptionStatus } from '@prescription/domain/PrescriptionStatus';
import { CreatePrescriptionDto, PrescriptionResponseDto } from './dtos/PrescriptionDtos';
import { generateId } from '@shared/lib/utils';
import { Result, ok, fail } from '@shared/lib/result';

export class CreatePrescriptionUseCase {
  constructor(private readonly repo: IPrescriptionRepository) {}

  async execute(dto: CreatePrescriptionDto): Promise<Result<PrescriptionResponseDto>> {
    try {
      const medications = dto.medications.map((m) => Medication.create(m));

      const prescription = Prescription.create(generateId(), {
        patientId:              dto.patientId,
        patientName:            dto.patientName,
        patientEmail:           dto.patientEmail,
        dentistId:              dto.dentistId,
        dentistName:            dto.dentistName,
        dentistLicense:         dto.dentistLicense,
        clinicName:             dto.clinicName,
        diagnosis:              dto.diagnosis,
        medications,
        additionalInstructions: dto.additionalInstructions,
        createdAt:              new Date().toISOString(),
        expiresAt:              dto.expiresAt,
        status:                 PrescriptionStatus.SENT,
      });

      await this.repo.save(prescription);
      return ok(prescription.toPlain());
    } catch (e) {
      return fail(e instanceof Error ? e.message : 'Error al crear la receta');
    }
  }
}
