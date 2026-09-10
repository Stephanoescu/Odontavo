import { create } from 'zustand';
import { treatmentRepository } from '@settings/infrastructure/SupabaseTreatmentRepository';
import { TreatmentCategory } from '@settings/domain/Treatment';

export interface TreatmentDto {
  id: string;
  name: string;
  category: TreatmentCategory;
  price: number;
  duration: number;
  description?: string;
  active: boolean;
}

interface SettingsStore {
  treatments: TreatmentDto[];
  isLoading: boolean;
  loadAll: () => Promise<void>;
  updatePrice: (id: string, price: number) => Promise<void>;
  createTreatment: (dto: Omit<TreatmentDto, 'id' | 'active'>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  treatments: [],
  isLoading: false,

  loadAll: async () => {
    set({ isLoading: true });
    const raw = await treatmentRepository.findAll();
    set({ treatments: raw.map((t) => t.toPlain()), isLoading: false });
  },

  updatePrice: async (id, price) => {
    await treatmentRepository.update(id, price);
    set((s) => ({
      treatments: s.treatments.map((t) =>
        t.id === id ? { ...t, price } : t
      ),
    }));
  },

  createTreatment: async (dto) => {
    set({ isLoading: true });
    // dynamic import of domain just for creation
    const { Treatment } = await import('@settings/domain/Treatment');
    const id = `t-${Date.now()}`;
    const tx = Treatment.create(id, { ...dto, active: true });
    await treatmentRepository.save(tx);
    
    const raw = await treatmentRepository.findAll();
    set({ treatments: raw.map(t => t.toPlain()), isLoading: false });
  },
}));

