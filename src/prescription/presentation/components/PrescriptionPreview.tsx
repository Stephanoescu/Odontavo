'use client';

import { PrescriptionResponseDto } from '@prescription/application/dtos/PrescriptionDtos';
import { formatDate } from '@shared/lib/utils';
import { Stethoscope, Shield, Calendar, User, Pill } from 'lucide-react';

interface Props {
  prescription: Partial<PrescriptionResponseDto> & { status?: string };
  isPreview?: boolean;
}

export function PrescriptionPreview({ prescription: rx, isPreview = false }: Props) {
  const hasMeds = (rx.medications ?? []).some((m) => m.name);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden text-[13px] leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-4 h-4 opacity-80" />
              <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
                Receta Digital
              </span>
            </div>
            <h3 className="font-bold text-base leading-tight">
              {rx.clinicName || 'Clínica Odontológica'}
            </h3>
            {rx.dentistName && <p className="text-xs opacity-80 mt-0.5">{rx.dentistName}</p>}
            {rx.dentistLicense && <p className="text-[11px] opacity-70">Cédula: {rx.dentistLicense}</p>}
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-70 uppercase tracking-wide">Odontavo</div>
            <div className="text-[11px] opacity-80 font-mono mt-0.5">
              #{(rx.id ?? 'preview').slice(-6).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Patient + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <User className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Paciente</p>
              <p className="font-semibold text-foreground text-sm">
                {rx.patientName || <span className="text-muted-foreground italic">Sin seleccionar</span>}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Fecha</p>
              <p className="font-medium text-foreground">
                {rx.createdAt ? formatDate(rx.createdAt, 'd MMM yyyy') : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-dashed border-border" />

        {/* Diagnosis */}
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1.5">Diagnóstico</p>
          <p className="text-foreground font-medium">
            {rx.diagnosis || <span className="text-muted-foreground italic">—</span>}
          </p>
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-3.5 h-3.5 text-primary" />
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Medicamentos</p>
          </div>
          {!hasMeds ? (
            <p className="text-muted-foreground italic text-xs pl-5">Sin medicamentos añadidos…</p>
          ) : (
            <div className="space-y-2">
              {(rx.medications ?? [])
                .filter((m) => m.name)
                .map((med, i) => (
                  <div key={i} className="rounded-lg bg-accent/60 border border-primary/10 px-3.5 py-3">
                    <p className="font-semibold text-foreground text-sm">
                      {i + 1}. {med.name}
                      {med.dose && <span className="font-normal text-muted-foreground ml-1.5">{med.dose}</span>}
                    </p>
                    {(med.frequency || med.duration) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[med.frequency, med.duration].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {med.instructions && (
                      <p className="text-xs text-foreground/70 mt-1 italic bg-white/80 rounded px-2 py-1 border border-border/50">
                        ℹ️ {med.instructions}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Additional instructions */}
        {rx.additionalInstructions && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-3">
            <p className="text-[10px] text-amber-800 font-semibold uppercase tracking-wide mb-1">
              Indicaciones adicionales
            </p>
            <p className="text-xs text-amber-900">{rx.additionalInstructions}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-dashed border-border pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Receta digital verificada · Odontavo</span>
          </div>
          {rx.expiresAt && (
            <div className="text-[11px] text-muted-foreground">
              Vence: <span className="font-medium">{formatDate(rx.expiresAt, 'd MMM yyyy')}</span>
            </div>
          )}
        </div>

        {isPreview && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-center">
            <p className="text-[11px] text-primary font-medium">
              👁️ Vista previa — Así verá el paciente su receta
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
