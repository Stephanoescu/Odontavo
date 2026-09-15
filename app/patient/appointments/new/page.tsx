'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, ChevronLeft, CheckCircle2, Stethoscope } from 'lucide-react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { cn } from '@shared/lib/utils';

const APPOINTMENT_TYPES = [
  { id: 'consulta',    label: 'Consulta General',        duration: '30 min', icon: '🩺' },
  { id: 'limpieza',    label: 'Limpieza Dental',         duration: '45 min', icon: '✨' },
  { id: 'revision',   label: 'Revisión de Tratamiento',  duration: '20 min', icon: '🔍' },
  { id: 'endodoncia',  label: 'Endodoncia',              duration: '90 min', icon: '🦷' },
  { id: 'extraccion',  label: 'Extracción',              duration: '45 min', icon: '⚕️' },
  { id: 'urgencia',    label: 'Urgencia Dental',         duration: '30 min', icon: '🚨' },
];

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
];

// Mock: already taken slots
const TAKEN_SLOTS = ['09:00','10:30','14:00','16:30'];

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [selectedType, setType]   = useState('');
  const [selectedDate, setDate]   = useState('');
  const [selectedTime, setTime]   = useState('');
  const [notes, setNotes]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    // In production: call use case to create appointment
    setSubmitted(true);
    setTimeout(() => router.push('/patient/appointments'), 2000);
  };

  if (submitted) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">¡Cita Agendada!</h2>
        <p className="text-muted-foreground text-sm text-center max-w-sm">
          Tu cita ha sido registrada. Recibirás una confirmación pronto. Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agendar Cita</h1>
          <p className="text-sm text-muted-foreground">Clínica Dental Odontavo</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
              step === s ? 'bg-primary text-white' : step > s ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
            )}>
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {s === 1 ? 'Tipo' : s === 2 ? 'Fecha y hora' : 'Confirmación'}
            </span>
            {s < 3 && <div className={cn('flex-1 h-0.5 w-8', step > s ? 'bg-emerald-500' : 'bg-border')} />}
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="font-semibold text-foreground mb-4">¿Qué tipo de cita necesitas?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {APPOINTMENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => { setType(type.id); }}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                  selectedType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40 hover:bg-muted/30'
                )}
              >
                <span className="text-2xl shrink-0">{type.icon}</span>
                <div>
                  <p className="font-medium text-foreground text-sm">{type.label}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {type.duration}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              disabled={!selectedType}
              onClick={() => setStep(2)}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="font-semibold text-foreground mb-4">Selecciona fecha y hora</h2>

          <div className="card-base p-5 mb-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Fecha de la cita
            </label>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => { setDate(e.target.value); setTime(''); }}
              className="w-full h-10 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {selectedDate && (
            <div className="card-base p-5 mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Horario disponible
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const taken = TAKEN_SLOTS.includes(slot);
                  return (
                    <button
                      key={slot}
                      disabled={taken}
                      onClick={() => setTime(slot)}
                      className={cn(
                        'h-9 rounded-lg text-xs font-medium transition-all border',
                        taken
                          ? 'border-border bg-muted text-muted-foreground/40 cursor-not-allowed line-through'
                          : selectedTime === slot
                          ? 'border-primary bg-primary text-white'
                          : 'border-border hover:border-primary hover:text-primary'
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card-base p-5 mb-5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe brevemente el motivo de tu visita o síntomas..."
              rows={3}
              className="w-full text-sm border border-input rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
            />
          </div>

          <div className="flex gap-3 justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors">
              ← Atrás
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(3)}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Revisar cita →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="font-semibold text-foreground mb-4">Confirmar cita</h2>

          <div className="card-base p-6 mb-6">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">Dr. Carlos Martínez Ruiz</p>
                <p className="text-sm text-muted-foreground">Consultorio Dental Martínez</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Tipo de cita</p>
                <p className="font-semibold text-foreground">
                  {APPOINTMENT_TYPES.find(t => t.id === selectedType)?.label}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Paciente</p>
                <p className="font-semibold text-foreground">{user?.name ?? 'Paciente'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Fecha</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {new Date(selectedDate + 'T00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Hora</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {selectedTime} hrs
                </p>
              </div>
              {notes && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Notas</p>
                  <p className="text-foreground">{notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors">
              ← Atrás
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirmar Cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
