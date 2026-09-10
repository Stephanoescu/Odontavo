/**
 * DTO — PatientResponseDto
 * Plain object returned from patient use cases to presentation.
 */
export interface PatientResponseDto {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  lastVisit: string;
  nextAppointment?: string;
  avatar?: string;
  status: 'active' | 'inactive';
}
