'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { prescriptionRepository } from '@prescription/infrastructure/SupabasePrescriptionRepository';
import { CreatePrescriptionUseCase } from '@prescription/application/CreatePrescriptionUseCase';
import { GetPatientPrescriptionsUseCase } from '@prescription/application/GetPatientPrescriptionsUseCase';
import { SendPrescriptionUseCase } from '@prescription/application/SendPrescriptionUseCase';
import { PrescriptionResponseDto, CreatePrescriptionDto } from '@prescription/application/dtos/PrescriptionDtos';

// DI: inject shared singleton repository into each use case
const createPrescription = new CreatePrescriptionUseCase(prescriptionRepository);
const getPatientPrescriptions = new GetPatientPrescriptionsUseCase(prescriptionRepository);
const sendPrescription = new SendPrescriptionUseCase(prescriptionRepository);

interface PrescriptionState {
  prescriptions: PrescriptionResponseDto[];
  isLoading: boolean;
  loadAll: () => Promise<void>;
  create: (dto: CreatePrescriptionDto) => Promise<PrescriptionResponseDto | null>;
  send: (id: string, via: ('whatsapp' | 'email' | 'pdf')[]) => Promise<void>;
  getByPatient: (patientId: string) => Promise<PrescriptionResponseDto[]>;
}

export const usePrescriptionStore = create<PrescriptionState>()(
  persist(
    (set) => ({
      prescriptions: [],
      isLoading: false,

      loadAll: async () => {
        set({ isLoading: true });
        const all = await prescriptionRepository.findAll();
        set({ prescriptions: all.map((r) => r.toPlain()), isLoading: false });
      },

      create: async (dto) => {
        const result = await createPrescription.execute(dto);
        if (!result.success) return null;
        set((state) => ({
          prescriptions: [result.value, ...state.prescriptions],
        }));
        return result.value;
      },

      send: async (id, via) => {
        await sendPrescription.execute(id, via);
        // Refresh from repository
        const all = await prescriptionRepository.findAll();
        set({ prescriptions: all.map((r) => r.toPlain()) });
      },

      getByPatient: async (patientId) => {
        const result = await getPatientPrescriptions.execute(patientId);
        return result.success ? result.value : [];
      },
    }),
    {
      name: 'odontavo-prescriptions',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ prescriptions: state.prescriptions }),
    }
  )
);

