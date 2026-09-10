import { OdontogramEntry } from '@odontogram/domain/OdontogramEntry';

/**
 * ADAPTER — InMemoryOdontogramRepository
 * Mock odontogram entries keyed by patient ID.
 */

const ENTRIES: OdontogramEntry[] = [
  OdontogramEntry.create('odo-001', {
    patientId: 'patient-001',
    toothNumber: '16',
    surface: 'Oclusal',
    diagnosis: 'Caries profunda',
    treatment: 'Endodoncia',
    notes: 'Conducto calcificado, requiere radiografía previa',
    date: '2024-12-10',
    dentistId: 'dentist-001',
  }),
  OdontogramEntry.create('odo-002', {
    patientId: 'patient-001',
    toothNumber: '11',
    surface: 'Mesial',
    diagnosis: 'Fractura coronaria',
    treatment: 'Resina compuesta',
    date: '2024-12-10',
    dentistId: 'dentist-001',
  }),
  OdontogramEntry.create('odo-003', {
    patientId: 'patient-001',
    toothNumber: '26',
    surface: 'Oclusal',
    diagnosis: 'Caries media',
    treatment: 'Amalgama',
    date: '2024-12-10',
    dentistId: 'dentist-001',
  }),
  OdontogramEntry.create('odo-004', {
    patientId: 'patient-002',
    toothNumber: '36',
    surface: 'Ocluso-mesial',
    diagnosis: 'Caries profunda con afección pulpar',
    treatment: 'Endodoncia + corona',
    notes: 'Paciente fumador, cicatrización lenta esperada',
    date: '2024-11-28',
    dentistId: 'dentist-001',
  }),
  OdontogramEntry.create('odo-005', {
    patientId: 'patient-002',
    toothNumber: '46',
    surface: 'Distal',
    diagnosis: 'Caries incipiente',
    treatment: 'Sellador de fisuras',
    date: '2024-11-28',
    dentistId: 'dentist-001',
  }),
  OdontogramEntry.create('odo-006', {
    patientId: 'patient-003',
    toothNumber: '12',
    surface: 'Vestibular',
    diagnosis: 'Abrasión cervical',
    treatment: 'Resina fluida',
    notes: 'Ansiedad dental, cita con sedación oral',
    date: '2024-12-20',
    dentistId: 'dentist-001',
  }),
];

export class InMemoryOdontogramRepository {
  private entries: OdontogramEntry[] = [...ENTRIES];

  async findByPatient(patientId: string): Promise<OdontogramEntry[]> {
    return this.entries.filter((e) => e.patientId === patientId);
  }

  async save(entry: OdontogramEntry): Promise<void> {
    this.entries.push(entry);
  }

  async deleteById(id: string): Promise<void> {
    this.entries = this.entries.filter((e) => e.id !== id);
  }
}

// Singleton for the app
export const odontogramRepository = new InMemoryOdontogramRepository();
