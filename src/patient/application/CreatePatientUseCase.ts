import { IPatientRepository } from '../domain/IPatientRepository';
import { Patient } from '../domain/Patient';
import { ContactInfo } from '../domain/ContactInfo';
import { MedicalRecord } from '../domain/MedicalRecord';
import { Result, ok, fail } from '@shared/lib/result';
import { PatientResponseDto } from './dtos/PatientResponseDto';

export interface CreatePatientDto {
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];   // comma-separated string split before calling
  medicalHistory: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export class CreatePatientUseCase {
  constructor(private readonly repo: IPatientRepository) {}

  async execute(dto: CreatePatientDto): Promise<Result<PatientResponseDto>> {
    if (!dto.name.trim()) return fail('El nombre es requerido');
    if (!dto.email.includes('@')) return fail('Email inválido');

    const id = `patient-${Date.now()}`;

    const patient = Patient.create(id, {
      name: dto.name.trim(),
      dateOfBirth: dto.dateOfBirth,
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0],
      contact: ContactInfo.create({
        email: dto.email.trim(),
        phone: dto.phone.trim(),
        address: dto.address.trim(),
      }),
      medical: MedicalRecord.create({
        bloodType: dto.bloodType,
        allergies: dto.allergies.filter(Boolean),
        history: dto.medicalHistory.trim(),
      }),
      emergencyContact: {
        name: dto.emergencyContactName.trim(),
        phone: dto.emergencyContactPhone.trim(),
        relationship: dto.emergencyContactRelationship.trim(),
      },
    });

    await this.repo.save(patient);

    return ok(patient.toPlain() as PatientResponseDto);
  }
}
