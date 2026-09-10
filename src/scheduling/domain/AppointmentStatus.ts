export type AppointmentStatusType = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export class AppointmentStatus {
  private constructor(private readonly value: AppointmentStatusType) {}

  static CONFIRMED  = new AppointmentStatus('confirmed');
  static PENDING    = new AppointmentStatus('pending');
  static COMPLETED  = new AppointmentStatus('completed');
  static CANCELLED  = new AppointmentStatus('cancelled');

  static from(raw: string): AppointmentStatus {
    const map: Record<string, AppointmentStatus> = {
      confirmed: AppointmentStatus.CONFIRMED,
      pending: AppointmentStatus.PENDING,
      completed: AppointmentStatus.COMPLETED,
      cancelled: AppointmentStatus.CANCELLED,
    };
    if (!map[raw]) throw new Error(`Invalid appointment status: "${raw}"`);
    return map[raw];
  }

  toPlain(): AppointmentStatusType { return this.value; }
  isConfirmed()  { return this.value === 'confirmed'; }
  isCompleted()  { return this.value === 'completed'; }
}
