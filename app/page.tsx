'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@identity/presentation/useAuthStore';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Espera a que loadSession() (montado en SessionProvider) termine antes de redirigir
    if (isLoading) return;
    if (isAuthenticated && user) {
      router.replace(user.role === 'dentist' ? '/dentist' : '/patient');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando Odontavo…</p>
      </div>
    </div>
  );
}
