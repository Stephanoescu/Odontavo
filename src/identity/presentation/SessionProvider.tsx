'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';

/**
 * SessionProvider — Monta en el layout raíz.
 * Llama loadSession() una sola vez al inicio para hidratar el store
 * con la sesión activa de Supabase y evitar el flash de redirección a /login.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const loadSession = useAuthStore((s) => s.loadSession);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return <>{children}</>;
}
