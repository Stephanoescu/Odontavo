import { IPrescriptionRepository } from '@prescription/domain/IPrescriptionRepository';
import { PrescriptionResponseDto } from './dtos/PrescriptionDtos';
import { Result, ok, fail } from '@shared/lib/result';

export class SendPrescriptionUseCase {
  constructor(private readonly repo: IPrescriptionRepository) {}

  async execute(
    prescriptionId: string,
    via: ('whatsapp' | 'email' | 'pdf')[]
  ): Promise<Result<PrescriptionResponseDto>> {
    const rx = await this.repo.findById(prescriptionId);
    if (!rx) return fail(`Receta "${prescriptionId}" no encontrada`);

    rx.markAsSent(via);
    await this.repo.update(rx);

    return ok(rx.toPlain());
  }
}
