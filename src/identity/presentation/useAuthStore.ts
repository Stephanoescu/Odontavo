'use client';

import { create } from 'zustand';
import {
  SupabaseAuthRepository,
  AuthUser,
  AuthResult,
} from '@identity/infrastructure/SupabaseAuthRepository';

const authRepo = new SupabaseAuthRepository();

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /** Iniciar sesion con email y contrasena. Devuelve { success, error } compatible con UI. */
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Cerrar sesion */
  logout: () => Promise<void>;
  /** Registrar nuevo dentista */
  register: (
    email: string,
    password: string,
    meta?: { name?: string; role?: 'dentist' | 'patient'; licenseNumber?: string; clinicName?: string; dateOfBirth?: string }
  ) => Promise<AuthResult>;
  /** Cargar sesion activa (llamar en el layout raiz) */
  loadSession: () => Promise<void>;
  /** Limpiar errores */
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Empezar en true para que la UI de carga espere a loadSession
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const result = await authRepo.login(email, password);
    if (result.success && result.user) {
      set({ user: result.user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false, error: result.error ?? 'Error desconocido' });
    }
    return result;
  },

  logout: async () => {
    set({ isLoading: true });
    await authRepo.logout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  register: async (email, password, meta) => {
    set({ isLoading: true, error: null });
    const result = await authRepo.register(email, password, meta);
    if (result.success && result.user) {
      set({ user: result.user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false, error: result.error ?? 'Error desconocido' });
    }
    return result;
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const user = await authRepo.getSession();
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (e) {
      console.error('Error al cargar sesion:', e);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
