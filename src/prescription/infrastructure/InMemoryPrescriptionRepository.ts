import { Prescription } from '@prescription/domain/Prescription';
import { Medication } from '@prescription/domain/Medication';
import { PrescriptionStatus } from '@prescription/domain/PrescriptionStatus';
import { IPrescriptionRepository } from '@prescription/domain/IPrescriptionRepository';

const SEED: Prescription[] = [
  Prescription.create('rx-001', {
    patientId: 'patient-001', patientName: 'Sofía Romero Vega',
    patientEmail: 'sofia.romero@gmail.com',
    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz',
    dentistLicense: 'CDMX-ODO-2847', clinicName: 'Clínica Dental Integral Martínez',
    diagnosis: 'Periodontitis moderada generalizada — Estado post-curetaje',
    medications: [
      Medication.create({ name: 'Amoxicilina', dose: '500mg', frequency: 'Cada 8 horas', duration: '7 días', instructions: 'Tomar con alimentos.' }),
      Medication.create({ name: 'Metronidazol', dose: '500mg', frequency: 'Cada 8 horas', duration: '7 días', instructions: 'No consumir alcohol.' }),
      Medication.create({ name: 'Clorhexidina 0.12%', dose: '15ml', frequency: 'Dos veces al día', duration: '14 días', instructions: 'No enjuagar con agua después.' }),
    ],
    additionalInstructions: 'Evitar alimentos duros. Cepillado suave. Control en 2 semanas.',
    createdAt: '2024-12-10T10:30:00Z', expiresAt: '2025-01-10T00:00:00Z',
    status: PrescriptionStatus.VIEWED, sentVia: ['whatsapp', 'email'],
  }),
  Prescription.create('rx-002', {
    patientId: 'patient-001', patientName: 'Sofía Romero Vega',
    patientEmail: 'sofia.romero@gmail.com',
    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz',
    dentistLicense: 'CDMX-ODO-2847', clinicName: 'Clínica Dental Integral Martínez',
    diagnosis: 'Alveolitis seca post-extracción — Molar 36',
    medications: [
      Medication.create({ name: 'Ketorolaco', dose: '10mg', frequency: 'Cada 6 horas', duration: '3 días', instructions: 'Máximo 5 días.' }),
      Medication.create({ name: 'Clindamicina', dose: '300mg', frequency: 'Cada 8 horas', duration: '5 días', instructions: '' }),
    ],
    additionalInstructions: 'Dieta blanda. Hielo en mejilla el primer día.',
    createdAt: '2024-11-05T14:15:00Z', expiresAt: '2024-12-05T00:00:00Z',
    status: PrescriptionStatus.COMPLETED, sentVia: ['pdf'],
  }),
  Prescription.create('rx-003', {
    patientId: 'patient-002', patientName: 'Miguel Torres Guzmán',
    patientEmail: 'miguel.torres@gmail.com',
    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz',
    dentistLicense: 'CDMX-ODO-2847', clinicName: 'Clínica Dental Integral Martínez',
    diagnosis: 'Pulpitis irreversible — Seguimiento post-conductos #21',
    medications: [
      Medication.create({ name: 'Ibuprofeno', dose: '600mg', frequency: 'Cada 8 horas', duration: '5 días', instructions: 'Tomar con alimentos.' }),
      Medication.create({ name: 'Paracetamol', dose: '1g', frequency: 'Según el dolor', duration: '5 días', instructions: 'No exceder 4g/día.' }),
    ],
    additionalInstructions: 'No masticar del lado tratado. Próxima cita para corona.',
    createdAt: '2024-11-28T09:00:00Z', expiresAt: '2024-12-28T00:00:00Z',
    status: PrescriptionStatus.SENT, sentVia: ['whatsapp'],
  }),
  Prescription.create('rx-004', {
    patientId: 'patient-003', patientName: 'Lucía Méndez Castillo',
    patientEmail: 'lucia.mendez@hotmail.com',
    dentistId: 'dentist-001', dentistName: 'Dr. Carlos Martínez Ruiz',
    dentistLicense: 'CDMX-ODO-2847', clinicName: 'Clínica Dental Integral Martínez',
    diagnosis: 'Gingivitis ulcerativa necrotizante aguda (GUNA) — Estadio II',
    medications: [
      Medication.create({ name: 'Metronidazol', dose: '500mg', frequency: 'Cada 8 horas', duration: '7 días', instructions: 'Sin alcohol.' }),
      Medication.create({ name: 'Paracetamol', dose: '500mg', frequency: 'Cada 6 horas', duration: '5 días', instructions: '' }),
      Medication.create({ name: 'Clorhexidina 0.2%', dose: '10ml', frequency: 'Tres veces al día', duration: '14 días', instructions: 'Después de cada comida.' }),
    ],
    additionalInstructions: 'Reposo relativo. Dieta suave y fría. Control en 72 horas.',
    createdAt: '2024-12-20T11:45:00Z', expiresAt: '2025-01-20T00:00:00Z',
    status: PrescriptionStatus.VIEWED, sentVia: ['email', 'pdf'],
  }),
];

export class InMemoryPrescriptionRepository implements IPrescriptionRepository {
  private store: Prescription[] = [...SEED];

  async findAll(): Promise<Prescription[]> {
    return [...this.store].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findById(id: string): Promise<Prescription | null> {
    return this.store.find((r) => r.id === id) ?? null;
  }

  async findByPatientId(patientId: string): Promise<Prescription[]> {
    return this.store
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async save(prescription: Prescription): Promise<void> {
    this.store.unshift(prescription);
  }

  async update(prescription: Prescription): Promise<void> {
    const idx = this.store.findIndex((r) => r.id === prescription.id);
    if (idx !== -1) this.store[idx] = prescription;
  }
}

// Singleton — one instance shared by all use cases in this context
export const prescriptionRepository = new InMemoryPrescriptionRepository();
