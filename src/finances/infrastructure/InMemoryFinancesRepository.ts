import { Transaction } from '@finances/domain/Transaction';

/**
 * ADAPTER — InMemoryFinancesRepository
 * Mock financial transactions for the clinic.
 */

const TRANSACTIONS: Transaction[] = [
  Transaction.create('tx-001', {
    patientId: 'patient-002',
    patientName: 'Miguel Torres Guzmán',
    concept: 'Endodoncia molar inferior',
    amount: 4500,
    type: 'ingreso',
    status: 'pagado',
    date: '2024-11-28',
    method: 'tarjeta',
  }),
  Transaction.create('tx-002', {
    patientId: 'patient-001',
    patientName: 'Sofía Romero Vega',
    concept: 'Profilaxis dental + fluoruro',
    amount: 850,
    type: 'ingreso',
    status: 'pagado',
    date: '2024-12-10',
    method: 'efectivo',
  }),
  Transaction.create('tx-003', {
    patientId: 'patient-001',
    patientName: 'Sofía Romero Vega',
    concept: 'Resina compuesta pieza 11',
    amount: 1200,
    type: 'ingreso',
    status: 'pendiente',
    date: '2024-12-10',
    method: 'transferencia',
    notes: 'Segundo pago pendiente de confirmación',
  }),
  Transaction.create('tx-004', {
    patientId: 'patient-003',
    patientName: 'Lucía Méndez Castillo',
    concept: 'Presupuesto ortodoncia completa',
    amount: 35000,
    type: 'presupuesto',
    status: 'pendiente',
    date: '2024-12-20',
  }),
  Transaction.create('tx-005', {
    patientId: 'patient-005',
    patientName: 'Valentina Cruz Ortega',
    concept: 'Tratamiento periodontal gestacional',
    amount: 2800,
    type: 'ingreso',
    status: 'pagado',
    date: '2024-12-22',
    method: 'efectivo',
  }),
  Transaction.create('tx-006', {
    patientId: 'patient-004',
    patientName: 'Andrés Flores Ramírez',
    concept: 'Extracción con protocolo especial',
    amount: 3200,
    type: 'ingreso',
    status: 'pagado',
    date: '2024-10-15',
    method: 'tarjeta',
  }),
  Transaction.create('tx-007', {
    patientId: 'patient-002',
    patientName: 'Miguel Torres Guzmán',
    concept: 'Corona cerámica pieza 36',
    amount: 8500,
    type: 'presupuesto',
    status: 'pendiente',
    date: '2024-12-01',
    notes: 'Aprobado, pendiente de fabricación',
  }),
];

export class InMemoryFinancesRepository {
  private transactions: Transaction[] = [...TRANSACTIONS];

  async findAll(): Promise<Transaction[]> {
    return [...this.transactions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findByPatient(patientId: string): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.patientId === patientId);
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }
}

export const financesRepository = new InMemoryFinancesRepository();
