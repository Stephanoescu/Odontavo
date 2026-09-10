'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Stethoscope, AlertCircle, LogIn } from 'lucide-react';
import { loginSchema, LoginFormValues } from '@identity/presentation/validations/loginSchema';
import { useAuthStore } from '@identity/presentation/useAuthStore';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, isLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(user.role === 'dentist' ? '/dentist' : '/patient');
    }
  }, [isAuthenticated, user, router]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    const result = await login(data.email, data.password);
    if (!result.success) { setServerError(result.error ?? 'Error'); return; }
    const role = useAuthStore.getState().user?.role;
    document.cookie = `odontavo-role=${role}; path=/; max-age=86400; SameSite=Lax`;
    router.push(role === 'dentist' ? '/dentist' : '/patient');
  };

  const fillDemo = (type: 'dentist' | 'patient') => {
    if (type === 'dentist') { setValue('email', 'dr.martinez@odontavo.com'); setValue('password', 'dental2024'); }
    else                    { setValue('email', 'sofia.romero@gmail.com');    setValue('password', 'paciente2024'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(174 77% 31%) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-lg mb-4">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Odontavo</h1>
          <p className="text-muted-foreground text-sm mt-1">Tu consultorio dental, en tu bolsillo</p>
        </div>

        <div className="card-base p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Iniciar sesión</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Ingresa tus credenciales para continuar</p>
          </div>

          {serverError && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/5 border border-destructive/20 mb-5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}

          {searchParams.get('from') && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 mb-5 text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              Debes iniciar sesión para acceder a esa sección.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground block">Correo electrónico</label>
              <input id="email" type="email" autoComplete="email" placeholder="usuario@ejemplo.com"
                {...register('email')}
                className={`w-full h-10 px-3 rounded-lg border text-sm bg-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-destructive' : 'border-input hover:border-primary/50 focus:border-primary'}`}
              />
              {errors.email && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">Contraseña</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                  {...register('password')}
                  className={`w-full h-10 px-3 pr-10 rounded-lg border text-sm bg-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.password ? 'border-destructive' : 'border-input hover:border-primary/50 focus:border-primary'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
            </div>

            <button id="login-submit" type="submit" disabled={isSubmitting || isLoading}
              className="w-full h-10 flex items-center justify-center gap-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {isLoading || isSubmitting
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Verificando…</>
                : <><LogIn className="w-4 h-4" />Ingresar</>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline transition-all">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Odontavo · Hecho para dentistas independientes</p>
      </div>
    </div>
  );
}
