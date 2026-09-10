import { create } from 'zustand';
import { financesRepository } from '@finances/infrastructure/SupabaseFinancesRepository';
import { Transaction, TransactionType, TransactionStatus } from '@finances/domain/Transaction';

export interface TransactionDto {
  id: string;
  patientId: string | null;
  patientName: string;
  concept: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
  method?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  notes?: string;
}

interface FinancesStore {
  transactions: TransactionDto[];
  isLoading: boolean;
  loadAll: () => Promise<void>;
  loadByPatient: (patientId: string) => Promise<void>;
  totalIncome: () => number;
  totalPending: () => number;
  createTransaction: (dto: Omit<TransactionDto, 'id' | 'patientName'> & { patientName: string }) => Promise<void>;
}

export const useFinancesStore = create<FinancesStore>((set, get) => ({
  transactions: [],
  isLoading: false,

  loadAll: async () => {
    set({ isLoading: true });
    const raw = await financesRepository.findAll();
    set({ transactions: raw.map((t) => t.toPlain()), isLoading: false });
  },

  loadByPatient: async (patientId) => {
    set({ isLoading: true });
    const raw = await financesRepository.findByPatient(patientId);
    set({ transactions: raw.map((t) => t.toPlain()), isLoading: false });
  },

  createTransaction: async (dto: Omit<TransactionDto, 'id' | 'patientName'> & { patientName: string }) => {
    set({ isLoading: true });
    const id = `tx-${Date.now()}`;
    const tx = Transaction.create(id, {
      ...dto,
      date: dto.date || new Date().toISOString().split('T')[0],
    });
    await financesRepository.save(tx);
    const raw = await financesRepository.findAll();
    set({ transactions: raw.map(t => t.toPlain()), isLoading: false });
  },

  totalIncome: () =>
    get()
      .transactions.filter((t) => t.type === 'ingreso' && t.status === 'pagado')
      .reduce((acc, t) => acc + t.amount, 0),

  totalPending: () =>
    get()
      .transactions.filter((t) => t.status === 'pendiente')
      .reduce((acc, t) => acc + t.amount, 0),
}));

