'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { Calendar, Clock, CheckCircle2, Phone } from 'lucide-react';
import { formatDate } from '@shared/lib/utils';

export default function PatientAppointmentsPage() {
  const { user } = useAuthStore();
  const { selected, selectById } = usePatientStore();

  useEffect(() => { if (user?.id) selectById(user.id); }, [user?.id]);

  const APPOINTMENTS = [
    { id: 1, date: selected?.nextAppointment ?? '2025-01-20', time: '09:00', type: 'Control y revisión', dentist: 'Dr. Carlos Martínez Ruiz', clinic: 'Clínica Dental Integral Martínez', status: 'confirmed' },
    { id: 2, date: '2024-12-10', time: '10:00', type: 'Curetaje periodontal', dentist: 'Dr. Carlos Martínez Ruiz', clinic: 'Clínica Dental Integral Martínez', status: 'completed' },
    { id: 3, date: '2024-11-05', time: '11:30', type: 'Extracción molar 36',  dentist: 'Dr. Carlos Martínez Ruiz', clinic: 'Clínica Dental Integral Martínez', status: 'completed' },
  ];

  const [next] = APPOINTMENTS.filter(a => a.status === 'confirmed');
  const past    = APPOINTMENTS.filter(a => a.status === 'completed');

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-xl font-bold text-foreground">Mis Citas</h1>
      {next && (
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">Próxima Cita</p>
          <h2 className="text-2xl font-bold mb-1">{formatDate(next.date)}</h2>
          <div className="flex items-center gap-2 text-sm opacity-90 mb-3"><Clock className="w-4 h-4" />{next.time} hrs · {next.type}</div>
          <div className="flex items-center gap-4">
            <div><p className="text-xs opacity-70">Especialista</p><p className="font-medium">{next.dentist}</p></div>
            <div><p className="text-xs opacity-70">Clínica</p><p className="font-medium">{next.clinic}</p></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium"><Phone className="w-4 h-4" />Llamar clínica</button>
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm font-medium"><Calendar className="w-4 h-4" />Reprogramar</button>
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3 text-sm">Historial de Citas</h2>
          <div className="card-base overflow-hidden divide-y divide-border">
            {past.map(a => (
              <div key={a.id} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                <div className="flex-1"><p className="font-medium text-foreground text-sm">{a.type}</p><p className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.time} hrs</p></div>
                <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Completada</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
