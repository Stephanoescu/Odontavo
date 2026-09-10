import { create } from 'zustand';
import { appointmentRepository } from '@scheduling/infrastructure/SupabaseAppointmentRepository';
import {
  GetAppointmentsUseCase,
  GetPatientAppointmentsUseCase,
  CreateAppointmentUseCase,
  UpdateAppointmentStatusUseCase,
} from '@scheduling/application/AppointmentUseCases';
import { AppointmentDto, CreateAppointmentDto } from '@scheduling/application/dtos/AppointmentDtos';

// Dependency injection â€” swap repo for ApiAppointmentRepository later
const repo                = appointmentRepository;
const getAll              = new GetAppointmentsUseCase(repo);
const getByPatient        = new GetPatientAppointmentsUseCase(repo);
const createUseCase       = new CreateAppointmentUseCase(repo);
const updateStatusUseCase = new UpdateAppointmentStatusUseCase(repo);

interface SchedulingStore {
  appointments: AppointmentDto[];
  isLoading: boolean;
  error: string | null;

  // Dentist actions
  loadByDentist: (dentistId: string) => Promise<void>;

  // Patient actions
  loadByPatient: (patientId: string) => Promise<void>;

  // Create
  createAppointment: (dto: CreateAppointmentDto) => Promise<AppointmentDto | null>;

  // Update status
  updateStatus: (id: string, status: string) => Promise<void>;

  // Derived
  upcoming: () => AppointmentDto[];
  completed: () => AppointmentDto[];
}

export const useSchedulingStore = create<SchedulingStore>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  loadByDentist: async (dentistId) => {
    set({ isLoading: true, error: null });
    const result = await getAll.execute(dentistId);
    if (result.success) set({ appointments: result.value, isLoading: false });
    else set({ isLoading: false, error: result.error });
  },

  loadByPatient: async (patientId) => {
    set({ isLoading: true, error: null });
    const result = await getByPatient.execute(patientId);
    if (result.success) set({ appointments: result.value, isLoading: false });
    else set({ isLoading: false, error: result.error });
  },

  createAppointment: async (dto) => {
    const result = await createUseCase.execute(dto);
    if (result.success) {
      set((s) => ({ appointments: [...s.appointments, result.value] }));
      return result.value;
    }
    return null;
  },

  updateStatus: async (id, status) => {
    await updateStatusUseCase.execute(id, status);
    set((s) => ({
      appointments: s.appointments.map((a) =>
        a.id === id ? { ...a, status: status as AppointmentDto['status'] } : a
      ),
    }));
  },

  upcoming: () =>
    get()
      .appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),

  completed: () =>
    get()
      .appointments.filter((a) => a.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date)),
}));

