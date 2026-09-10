'use client';

import { create } from 'zustand';
import { patientRepository } from '@patient/infrastructure/SupabasePatientRepository';
import { GetAllPatientsUseCase } from '@patient/application/GetAllPatientsUseCase';
import { GetPatientByIdUseCase } from '@patient/application/GetPatientByIdUseCase';
import { CreatePatientUseCase, CreatePatientDto } from '@patient/application/CreatePatientUseCase';
import { PatientResponseDto } from '@patient/application/dtos/PatientResponseDto';

// Dependency injection — swap patientRepository for ApiPatientRepository when backend is ready
const repo           = patientRepository;
const getAllPatients  = new GetAllPatientsUseCase(repo);
const getPatientById = new GetPatientByIdUseCase(repo);
const createPatient  = new CreatePatientUseCase(repo);

interface PatientState {
  patients: PatientResponseDto[];
  selected: PatientResponseDto | null;
  isLoading: boolean;
  error: string | null;

  loadAll:      () => Promise<void>;
  selectById:   (id: string) => Promise<void>;
  /** Carga el expediente del paciente usando su auth.uid (para el portal del paciente) */
  selectByAuthUserId: (authUserId: string) => Promise<void>;
  create:       (dto: CreatePatientDto) => Promise<PatientResponseDto | null>;
  updateMedicalHistory: (patientId: string, note: string) => Promise<void>;
  clearSelected: () => void;
}

export const usePatientStore = create<PatientState>()((set) => ({
  patients: [],
  selected: null,
  isLoading: false,
  error: null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    const result = await getAllPatients.execute();
    if (result.success) set({ patients: result.value, isLoading: false });
    else set({ isLoading: false, error: result.error });
  },

  selectById: async (id) => {
    const result = await getPatientById.execute(id);
    if (result.success) set({ selected: result.value });
  },

  selectByAuthUserId: async (authUserId) => {
    set({ isLoading: true, error: null });
    const patient = await repo.findByAuthUserId(authUserId);
    if (patient) {
      const plain = patient.toPlain();
      set({
        selected: {
          id: plain.id,
          name: plain.name,
          dateOfBirth: plain.dateOfBirth,
          email: plain.email,
          phone: plain.phone,
          address: plain.address,
          bloodType: plain.bloodType,
          allergies: plain.allergies,
          medicalHistory: plain.medicalHistory,
          emergencyContact: plain.emergencyContact,
          lastVisit: plain.lastVisit,
          nextAppointment: plain.nextAppointment,
          avatar: plain.avatar,
          status: plain.status,
        },
        isLoading: false,
      });
    } else {
      set({ selected: null, isLoading: false });
    }
  },

  create: async (dto) => {
    set({ isLoading: true, error: null });
    const result = await createPatient.execute(dto);
    if (result.success) {
      set((s) => ({
        patients: [...s.patients, result.value],
        isLoading: false,
      }));
      return result.value;
    }
    set({ isLoading: false, error: result.error });
    return null;
  },

  updateMedicalHistory: async (patientId: string, note: string) => {
    set({ isLoading: true, error: null });
    // Dynamic import to avoid circular dependencies in this mock MVP
    const { UpdateMedicalHistoryUseCase } = await import('@patient/application/UpdateMedicalHistoryUseCase');
    const updateUseCase = new UpdateMedicalHistoryUseCase(repo);
    const date = new Date().toISOString().split('T')[0];
    
    const result = await updateUseCase.execute({ patientId, note, date });
    if (result.success) {
      set((s) => ({
        patients: s.patients.map(p => p.id === patientId ? result.value : p),
        selected: s.selected?.id === patientId ? result.value : s.selected,
        isLoading: false,
      }));
    } else {
      set({ isLoading: false, error: result.error });
    }
  },

  clearSelected: () => set({ selected: null }),
}));

