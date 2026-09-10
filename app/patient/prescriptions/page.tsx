'use client';

import { useEffect } from 'react';
import { FileText, Eye, CheckCircle2, Clock, Pill } from 'lucide-react';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { formatDate, cn } from '@shared/lib/utils';

const STATUS_CFG = {
  sent:      { label: 'Enviada',    cls: 'bg-blue-50 text-blue-700 border-blue-100',    icon: Clock },
  viewed:    { label: 'Vista',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Eye },
  completed: { label: 'Completada', cls: 'bg-gray-100 text-gray-600 border-gray-200',   icon: CheckCircle2 },
  draft:     { label: 'Borrador',   cls: 'bg-amber-50 text-amber-700 border-amber-100', icon: FileText },
} as const;

export default function PatientPrescriptionsPage() {
  const { prescriptions, loadAll } = usePrescriptionStore();
  const { user }                   = useAuthStore();

  useEffect(() => { loadAll(); }, []);

  // Filter prescriptions for the logged-in patient
  const myPrescriptions = prescriptions.filter((rx) =>
    user ? rx.patientId === user.id : true
  );

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mis Recetas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Historial de recetas médicas emitidas por tu dentista.
        </p>
      </div>

      {myPrescriptions.length === 0 ? (
        <div className="card-base p-16 flex flex-col items-center justify-center text-muted-foreground">
          <FileText className="w-14 h-14 mb-4 opacity-20" />
          <p className="font-medium">Sin recetas registradas</p>
          <p className="text-sm mt-1">Tu dentista aún no ha emitido recetas para ti.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPrescriptions.map((rx) => {
            const cfg = STATUS_CFG[rx.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={rx.id} className="card-base p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{rx.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        Dr. {rx.dentistName} · {formatDate(rx.createdAt, 'd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shrink-0',
                    cfg.cls
                  )}>
                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>

                {/* Medications */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-muted/40 border-b border-border flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Medicamentos ({rx.medications.length})
                    </p>
                  </div>
                  <div className="divide-y divide-border">
                    {rx.medications.map((med, i) => (
                      <div key={i} className="px-4 py-3">
                        <p className="font-medium text-foreground text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {med.dose} · {med.frequency} · {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-xs text-amber-600 mt-1 italic">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {rx.additionalInstructions && (
                  <p className="text-xs text-muted-foreground mt-3 italic border-t border-border pt-3">
                    Instrucciones: {rx.additionalInstructions}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
