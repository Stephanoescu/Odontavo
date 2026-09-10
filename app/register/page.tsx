'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, Eye, EyeOff, CheckCircle2, AlertCircle, UserRound } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useAuthStore } from '@identity/presentation/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    dateOfBirth: '', password: '', confirm: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name = 'El nombre es requerido';
    if (!form.email.includes('@')) e.email = 'Email inválido';
    if (!form.dateOfBirth) e.dateOfBirth = 'La fecha de nacimiento es requerida';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    const result = await register(form.email, form.password, {
      name: form.name,
      role: 'patient',
      dateOfBirth: form.dateOfBirth,
    });
    setIsLoading(false);
    if (!result.success) {
      setServerError(result.error ?? 'Error al crear la cuenta');
      return;
    }
    setSubmitted(true);
    // Si el email confirmation está desactivado en Supabase, redirigir al login
    setTimeout(() => router.push('/login'), 3000);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: '' }));
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">¡Registro Exitoso!</h2>
          <p className="text-muted-foreground text-sm">Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
            <UserRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Portal de Pacientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Crea tu cuenta para ver tu expediente y citas</p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">

          {serverError && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-destructive/5 border border-destructive/20 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Nombre completo *
            </label>
            <input
              type="text"
              placeholder="Juan Pérez García"
              {...field('name')}
              className={cn(
                'w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                errors.name ? 'border-destructive' : 'border-input'
              )}
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Correo electrónico *
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              {...field('email')}
              className={cn(
                'w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                errors.email ? 'border-destructive' : 'border-input'
              )}
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Date of birth + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Fecha de nacimiento *
              </label>
              <input
                type="date"
                {...field('dateOfBirth')}
                className={cn(
                  'w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                  errors.dateOfBirth ? 'border-destructive' : 'border-input'
                )}
              />
              {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="+52 55 0000 0000"
                {...field('phone')}
                className="w-full h-10 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                {...field('password')}
                className={cn(
                  'w-full h-10 border rounded-lg px-3 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                  errors.password ? 'border-destructive' : 'border-input'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Confirmar contraseña *
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              {...field('confirm')}
              className={cn(
                'w-full h-10 border rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                errors.confirm ? 'border-destructive' : 'border-input'
              )}
            />
            {errors.confirm && <p className="text-destructive text-xs mt-1">{errors.confirm}</p>}
          </div>

          <p className="text-xs text-muted-foreground">
            Al registrarte aceptas nuestros{' '}
            <span className="text-primary hover:underline cursor-pointer">Términos de Servicio</span> y{' '}
            <span className="text-primary hover:underline cursor-pointer">Política de Privacidad</span>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creando cuenta…</>
            ) : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
