import { create } from 'zustand';
import { odontogramRepository } from '@odontogram/infrastructure/SupabaseOdontogramRepository';
import { OdontogramEntry } from '@odontogram/domain/OdontogramEntry';

interface OdontogramEntryDto {
  id: string;
  patientId: string;
  toothNumber: string;
  surface?: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  date: string;
  dentistId: string;
}

interface OdontogramStore {
  entries: OdontogramEntryDto[];
  isLoading: boolean;
  loadByPatient: (patientId: string) => Promise<void>;
  addEntry: (entry: Omit<OdontogramEntryDto, 'id'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const useOdontogramStore = create<OdontogramStore>((set) => ({
  entries: [],
  isLoading: false,

  loadByPatient: async (patientId) => {
    set({ isLoading: true });
    const raw = await odontogramRepository.findByPatient(patientId);
    set({ entries: raw.map((e) => e.toPlain()), isLoading: false });
  },

  addEntry: async (dto) => {
    const id = `odo-${Date.now()}`;
    const entry = OdontogramEntry.create(id, { ...dto });
    await odontogramRepository.save(entry);
    set((s) => ({ entries: [...s.entries, entry.toPlain()] }));
  },

  removeEntry: async (id) => {
    await odontogramRepository.deleteById(id);
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },
}));

