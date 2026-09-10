import { createClient } from '@shared/lib/supabase/client';

/**
 * AuthUser — campos que la UI consume en componentes y stores.
 * Los campos extendidos (name, licenseNumber, clinicName, role)
 * se guardan en Supabase Auth como user_metadata durante el registro.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'dentist' | 'patient';
  licenseNumber?: string;
  clinicName?: string;
  dateOfBirth?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * INFRASTRUCTURE — SupabaseAuthRepository
 * Handles authentication via Supabase Auth (email/password).
 * User metadata (name, role, licenseNumber, clinicName) is stored in
 * Supabase user_metadata at registration time.
 */
export class SupabaseAuthRepository {
  private supabase = createClient();

  private mapUser(supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AuthUser {
    const meta = supabaseUser.user_metadata ?? {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name: (meta.name as string) ?? supabaseUser.email ?? 'Doctor',
      role: (meta.role as 'dentist' | 'patient') ?? 'dentist',
      licenseNumber: (meta.licenseNumber as string) ?? undefined,
      clinicName: (meta.clinicName as string) ?? undefined,
      dateOfBirth: (meta.dateOfBirth as string) ?? undefined,
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message ?? 'Error al iniciar sesion',
      };
    }

    return {
      success: true,
      user: this.mapUser(data.user),
    };
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getSession(): Promise<AuthUser | null> {
    const { data } = await this.supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;
    return this.mapUser(user);
  }

  async register(
    email: string,
    password: string,
    meta?: {
      name?: string;
      role?: 'dentist' | 'patient';
      licenseNumber?: string;
      clinicName?: string;
      dateOfBirth?: string;
    }
  ): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: meta?.name ?? email,
          role: meta?.role ?? 'dentist',
          licenseNumber: meta?.licenseNumber ?? '',
          clinicName: meta?.clinicName ?? 'Consultorio Dental',
          dateOfBirth: meta?.dateOfBirth ?? '',
        },
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message ?? 'Error al registrar usuario',
      };
    }

    return {
      success: true,
      user: this.mapUser(data.user),
    };
  }
}
