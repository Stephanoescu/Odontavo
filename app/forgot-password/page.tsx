'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { createClient } from '@shared/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('');
  const [submitted, setSubmit]  = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Ingresa un correo válido'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: supaErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (supaErr) {
      setError(supaErr.message);
      return;
    }
    setSubmit(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {submitted ? '¡Correo enviado!' : 'Recuperar contraseña'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {submitted
              ? `Hemos enviado las instrucciones a ${email}`
              : 'Te enviaremos un enlace para restablecer tu contraseña.'
            }
          </p>
        </div>

        <div className="card-base p-6">
          {submitted ? (
            <div className="flex flex-col items-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Revisa tu bandeja de entrada. Si no ves el correo, revisa la carpeta de spam.
              </p>
              <Link
                href="/login"
                className="w-full h-10 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="tu@correo.com"
                    className={cn(
                      'w-full h-10 border rounded-lg pl-9 pr-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
                      error ? 'border-destructive' : 'border-input'
                    )}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enviando…</>
                ) : 'Enviar instrucciones'}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio de sesión
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
