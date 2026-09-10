import { MedicationProps } from '@prescription/domain/Medication';
import { PrescriptionStatusType } from '@prescription/domain/PrescriptionStatus';

export interface CreatePrescriptionDto {
  patientId: string;
  patientName: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  dentistLicense: string;
  clinicName: string;
  diagnosis: string;
  medications: MedicationProps[];
  additionalInstructions: string;
  expiresAt: string;
}

export interface PrescriptionResponseDto {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  dentistLicense: string;
  clinicName: string;
  diagnosis: string;
  medications: MedicationProps[];
  additionalInstructions: string;
  createdAt: string;
  expiresAt: string;
  status: PrescriptionStatusType;
  sentVia: ('whatsapp' | 'email' | 'pdf')[];
}
