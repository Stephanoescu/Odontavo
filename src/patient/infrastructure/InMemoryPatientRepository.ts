import { Patient } from '@patient/domain/Patient';
import { ContactInfo } from '@patient/domain/ContactInfo';
import { MedicalRecord } from '@patient/domain/MedicalRecord';
import { IPatientRepository } from '@patient/domain/IPatientRepository';

const PATIENTS: Patient[] = [
  Patient.create('patient-001', {
    name: 'Sofía Romero Vega',
    dateOfBirth: '1992-03-15',
    avatar: 'SR',
    status: 'active',
    lastVisit: '2024-12-10',
    nextAppointment: '2025-01-20',
    contact: ContactInfo.create({
      email: 'sofia.romero@gmail.com',
      phone: '+52 55 1234 5678',
      address: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
    }),
    medical: MedicalRecord.create({
      bloodType: 'O+',
      allergies: ['Penicilina', 'Látex'],
      history: 'Diabetes tipo 2 controlada. Hipertensión leve en tratamiento con Losartán 50mg.',
    }),
    emergencyContact: { name: 'Roberto Romero', phone: '+52 55 8765 4321', relationship: 'Esposo' },
  }),
  Patient.create('patient-002', {
    name: 'Miguel Torres Guzmán',
    dateOfBirth: '1985-07-22',
    avatar: 'MT',
    status: 'active',
    lastVisit: '2024-11-28',
    nextAppointment: '2025-01-15',
    contact: ContactInfo.create({
      email: 'miguel.torres@gmail.com',
      phone: '+52 55 9876 5432',
      address: 'Calle Durango 456, Col. Roma Norte, CDMX',
    }),
    medical: MedicalRecord.create({
      bloodType: 'A+',
      allergies: [],
      history: 'Sin antecedentes patológicos relevantes. Fumador ocasional.',
    }),
    emergencyContact: { name: 'Carmen Guzmán', phone: '+52 55 1111 2222', relationship: 'Madre' },
  }),
  Patient.create('patient-003', {
    name: 'Lucía Méndez Castillo',
    dateOfBirth: '2000-11-08',
    avatar: 'LM',
    status: 'active',
    lastVisit: '2024-12-20',
    nextAppointment: '2025-02-05',
    contact: ContactInfo.create({
      email: 'lucia.mendez@hotmail.com',
      phone: '+52 55 5555 6666',
      address: 'Privada Flores 78, Lomas de Chapultepec, CDMX',
    }),
    medical: MedicalRecord.create({
      bloodType: 'B-',
      allergies: ['Ibuprofeno'],
      history: 'Alergia a AINEs. Ansiedad dental moderada. Solicita sedación consciente.',
    }),
    emergencyContact: { name: 'Patricia Castillo', phone: '+52 55 3333 4444', relationship: 'Madre' },
  }),
  Patient.create('patient-004', {
    name: 'Andrés Flores Ramírez',
    dateOfBirth: '1978-04-30',
    avatar: 'AF',
    status: 'active',
    lastVisit: '2024-10-15',
    contact: ContactInfo.create({
      email: 'andres.flores@yahoo.com',
      phone: '+52 55 7777 8888',
      address: 'Paseo de la Reforma 2000, Col. Juárez, CDMX',
    }),
    medical: MedicalRecord.create({
      bloodType: 'AB+',
      allergies: ['Aspirina'],
      history: 'Cardiopatía isquémica. Toma anticoagulantes. Requiere protocolo especial.',
    }),
    emergencyContact: { name: 'María Flores', phone: '+52 55 9999 0000', relationship: 'Esposa' },
  }),
  Patient.create('patient-005', {
    name: 'Valentina Cruz Ortega',
    dateOfBirth: '1998-09-12',
    avatar: 'VC',
    status: 'active',
    lastVisit: '2024-12-22',
    nextAppointment: '2025-01-08',
    contact: ContactInfo.create({
      email: 'vale.cruz@gmail.com',
      phone: '+52 55 2222 3333',
      address: 'Calz. de Tlalpan 890, Col. Portales, CDMX',
    }),
    medical: MedicalRecord.create({
      bloodType: 'O-',
      allergies: [],
      history: 'Embarazo en curso (28 semanas). Gingivitis gestacional en tratamiento.',
    }),
    emergencyContact: { name: 'Javier Cruz', phone: '+52 55 4444 5555', relationship: 'Esposo' },
  }),
];

export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Patient[] = [...PATIENTS];

  async findAll(): Promise<Patient[]> {
    return this.patients;
  }

  async findById(id: string): Promise<Patient | null> {
    return this.patients.find((p) => p.id === id) ?? null;
  }

  /** Stub — no implementado en InMemory (solo en Supabase) */
  async findByAuthUserId(_authUserId: string): Promise<Patient | null> {
    return null;
  }

  async save(patient: Patient): Promise<void> {
    this.patients.push(patient);
  }

  async update(patient: Patient): Promise<void> {
    const idx = this.patients.findIndex((p) => p.id === patient.id);
    if (idx !== -1) this.patients[idx] = patient;
  }

  async delete(id: string): Promise<void> {
    this.patients = this.patients.filter((p) => p.id !== id);
  }
}

export const patientRepository = new InMemoryPatientRepository();

