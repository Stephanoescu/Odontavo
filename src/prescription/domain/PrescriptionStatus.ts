/** VALUE OBJECT — PrescriptionStatus */
export type PrescriptionStatusType = 'draft' | 'sent' | 'viewed' | 'completed';

export class PrescriptionStatus {
  private constructor(private readonly value: PrescriptionStatusType) {}

  static DRAFT     = new PrescriptionStatus('draft');
  static SENT      = new PrescriptionStatus('sent');
  static VIEWED    = new PrescriptionStatus('viewed');
  static COMPLETED = new PrescriptionStatus('completed');

  static from(raw: string): PrescriptionStatus {
    const map: Record<string, PrescriptionStatus> = {
      draft: PrescriptionStatus.DRAFT,
      sent: PrescriptionStatus.SENT,
      viewed: PrescriptionStatus.VIEWED,
      completed: PrescriptionStatus.COMPLETED,
    };
    if (!map[raw]) throw new Error(`Invalid prescription status: "${raw}"`);
    return map[raw];
  }

  isDraft()     { return this.value === 'draft'; }
  isSent()      { return this.value === 'sent'; }
  isViewed()    { return this.value === 'viewed'; }
  isCompleted() { return this.value === 'completed'; }

  toPlain(): PrescriptionStatusType { return this.value; }
  equals(other: PrescriptionStatus)  { return this.value === other.value; }
}
