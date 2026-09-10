'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { PrescriptionPreview } from '@prescription/presentation/components/PrescriptionPreview';
import { PrescriptionResponseDto } from '@prescription/application/dtos/PrescriptionDtos';
import { PrescriptionStatusType } from '@prescription/domain/PrescriptionStatus';
import { FileText, Clock, CheckCircle2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, cn } from '@shared/lib/utils';

const STATUS_CONFIG: Record<PrescriptionStatusType, { label: string; color: string; icon: React.ElementType }> = {
  sent:      { label: 'Nueva',      color: 'text-blue-600 bg-blue-50 border-blue-200',     icon: Clock },
  viewed:    { label: 'Vista',      color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  completed: { label: 'Completada', color: 'text-gray-500 bg-gray-100 border-gray-200',    icon: CheckCircle2 },
  draft:     { label: 'Borrador',   color: 'text-amber-600 bg-amber-50 border-amber-200',  icon: Clock },
};

function PrescriptionCard({ rx }: { rx: PrescriptionResponseDto }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[rx.status];
  const Icon = cfg.icon;
  return (
    <div className="card-base overflow-hidden animate-fade-in">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', cfg.color)}>
                <Icon className="w-3 h-3" />{cfg.label}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(rx.createdAt, 'd MMM yyyy')}</span>
            </div>
            <h3 className="font-semibold text-foreground">{rx.diagnosis}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{rx.dentistName}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button title="Descargar PDF" className="p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition-all text-muted-foreground hover:text-primary">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-accent transition-all text-muted-foreground hover:text-primary">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rx.medications.map((m, i) => (
            <span key={i} className="text-[11px] bg-accent text-primary/80 border border-primary/10 px-2 py-0.5 rounded-full font-medium">{m.name} {m.dose}</span>
          ))}
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border px-5 py-4 bg-slate-50/50">
          <PrescriptionPreview prescription={rx} />
        </div>
      )}
    </div>
  );
}

export default function PatientPrescriptionsPage() {
  const { user } = useAuthStore();
  const { getByPatient } = usePrescriptionStore();
  const { selected, selectByAuthUserId } = usePatientStore();
  const [rxs, setRxs] = useState<PrescriptionResponseDto[]>([]);

  useEffect(() => {
    if (user?.id) selectByAuthUserId(user.id);
  }, [user?.id]);

  useEffect(() => {
    // Una vez que tenemos el expediente real del paciente, cargamos sus recetas
    if (selected?.id) getByPatient(selected.id).then(setRxs);
  }, [selected?.id]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Mis Recetas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {rxs.length > 0 ? `${rxs.length} receta${rxs.length !== 1 ? 's' : ''} emitidas` : 'Aún no tienes recetas'}
          </p>
        </div>
      </div>
      {rxs.length === 0 ? (
        <div className="card-base p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-3"><FileText className="w-6 h-6 text-primary" /></div>
          <h3 className="font-semibold text-foreground mb-1">Sin recetas aún</h3>
          <p className="text-sm text-muted-foreground">Cuando tu dentista emita una receta, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">{rxs.map(rx => <PrescriptionCard key={rx.id} rx={rx} />)}</div>
      )}
    </div>
  );
}
