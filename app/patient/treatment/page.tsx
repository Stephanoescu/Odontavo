'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { useOdontogramStore } from '@odontogram/presentation/useOdontogramStore';
import { CheckCircle2, Activity, AlertCircle } from 'lucide-react';
import { formatDate } from '@shared/lib/utils';

export default function PatientTreatmentPage() {
  const { user } = useAuthStore();
  const { selected, selectByAuthUserId } = usePatientStore();
  const { entries, loadByPatient } = useOdontogramStore();

  useEffect(() => {
    if (user?.id) selectByAuthUserId(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (selected?.id) loadByPatient(selected.id);
  }, [selected?.id]);

  // Sort by date descending
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Mi Tratamiento</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Historial de tus procedimientos y diagnósticos dentales</p>
      </div>

      <div className="card-base p-5">
        <h2 className="font-semibold text-foreground text-sm mb-5">Procedimientos realizados</h2>
        {sortedEntries.length === 0 ? (
          <div className="text-center p-6 text-sm text-muted-foreground">
            Aún no hay procedimientos registrados en tu expediente.
          </div>
        ) : (
          <div className="relative space-y-0">
            {sortedEntries.map((step, i) => {
              const isLast = i === sortedEntries.length - 1;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 flex-1 my-1 bg-emerald-200 min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {step.treatment} {step.toothNumber && `(Diente ${step.toothNumber})`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Diagnóstico: {step.diagnosis}</p>
                        {step.notes && <p className="text-xs text-muted-foreground mt-0.5">Nota: {step.notes}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-muted-foreground mt-1">{formatDate(step.date, 'd MMM yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Recomendación general</p>
          <p className="text-xs text-amber-700 mt-1">
            Mantén el cepillado suave 3 veces al día y usa hilo dental. 
            La constancia en el cuidado en casa es fundamental para el éxito del tratamiento.
          </p>
        </div>
      </div>
    </div>
  );
}
