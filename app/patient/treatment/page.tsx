'use client';

import { Activity, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const TREATMENT_STEPS = [
  {
    id: 1,
    title: 'Diagnóstico inicial y radiografías',
    description: 'Evaluación completa del estado periodontal y endodóntico.',
    date: '2024-10-15',
    status: 'completed',
  },
  {
    id: 2,
    title: 'Curetaje periodontal — Cuadrantes 1 y 2',
    description: 'Limpieza subgingival profunda de cuadrantes superiores.',
    date: '2024-11-05',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Curetaje periodontal — Cuadrantes 3 y 4',
    description: 'Limpieza subgingival profunda de cuadrantes inferiores.',
    date: '2024-12-10',
    status: 'completed',
  },
  {
    id: 4,
    title: 'Control periodontal y reevaluación',
    description: 'Medición de bolsas periodontales, evaluación de respuesta al tratamiento.',
    date: '2025-01-20',
    status: 'upcoming',
  },
  {
    id: 5,
    title: 'Mantenimiento periodontal (cada 3 meses)',
    description: 'Protocolo de mantenimiento preventivo a largo plazo.',
    date: '2025-04-00',
    status: 'pending',
  },
];

const STATUS = {
  completed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200', line: 'bg-emerald-200' },
  upcoming: { icon: Activity, color: 'text-primary', bg: 'bg-accent border-primary/20', line: 'bg-border' },
  pending: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted border-border', line: 'bg-border' },
};

export default function PatientTreatmentPage() {
  const completed = TREATMENT_STEPS.filter((s) => s.status === 'completed').length;
  const total = TREATMENT_STEPS.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Mi Tratamiento</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Seguimiento de tu plan de tratamiento periodontal</p>
      </div>

      {/* Progress */}
      <div className="card-base p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-foreground text-sm">Progreso del plan</h2>
            <p className="text-xs text-muted-foreground">{completed} de {total} etapas completadas</p>
          </div>
          <div className="text-2xl font-bold text-primary">{progress}%</div>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Inicio: Oct 2024</span>
          <span>Estimado fin: Abr 2025</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card-base p-5">
        <h2 className="font-semibold text-foreground text-sm mb-5">Etapas del tratamiento</h2>
        <div className="relative space-y-0">
          {TREATMENT_STEPS.map((step, i) => {
            const cfg = STATUS[step.status as keyof typeof STATUS];
            const Icon = cfg.icon;
            const isLast = i === TREATMENT_STEPS.length - 1;
            return (
              <div key={step.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 my-1 ${cfg.line} min-h-[24px]`} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pb-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-medium text-sm ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {step.status === 'upcoming' && (
                        <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Próximo</span>
                      )}
                      {step.date && !step.date.includes('00') && (
                        <p className="text-[11px] text-muted-foreground mt-1">{step.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendation */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">Recomendación de tu dentista</p>
          <p className="text-xs text-amber-700 mt-1">
            Mantén el cepillado suave 3 veces al día, usa hilo dental y enjuague con clorhexidina 0.12% según indicación. 
            La constancia en el cuidado en casa es fundamental para el éxito del tratamiento periodontal.
          </p>
        </div>
      </div>
    </div>
  );
}
