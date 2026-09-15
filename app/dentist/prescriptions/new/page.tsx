'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusCircle, Trash2, Send, FileDown, MessageCircle,
  Mail, AlertCircle, ChevronLeft, Pill, User, Stethoscope, CalendarDays, CheckCircle2,
} from 'lucide-react';
import { prescriptionSchema, PrescriptionFormValues } from '@prescription/presentation/validations/prescriptionSchema';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { MEDICATIONS_DB, FREQUENCIES, DURATIONS } from '@ui/constants/medications';
import { PrescriptionPreview } from '@prescription/presentation/components/PrescriptionPreview';
import { cn } from '@shared/lib/utils';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { create, send } = usePrescriptionStore();
  const { patients, loadAll } = usePatientStore();

  const [savedId, setSavedId]           = useState<string | null>(null);
  const [isSending, setIsSending]       = useState<('whatsapp' | 'email' | 'pdf') | null>(null);
  const [successActions, setSuccessActions] = useState<Set<string>>(new Set());
  const [medSearch, setMedSearch]       = useState<string[]>([]);

  useEffect(() => { loadAll(); }, []);

  const { register, control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<PrescriptionFormValues>({
      resolver: zodResolver(prescriptionSchema),
      defaultValues: {
        patientId: '', diagnosis: '',
        medications: [{ name: '', dose: '', frequency: '', duration: '', instructions: '' }],
        additionalInstructions: '',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });
  const watchedValues  = watch();
  const selectedPatient = patients.find((p) => p.id === watchedValues.patientId);

  // Live preview object from form state
  const livePrescription = {
    id: savedId ?? 'preview',
    patientId:   watchedValues.patientId,
    patientName: selectedPatient?.name ?? '—',
    patientEmail: selectedPatient?.email ?? '',
    dentistId:    user?.id ?? '',
    dentistName:  user?.name ?? '',
    dentistLicense: user?.licenseNumber ?? '',
    clinicName:   user?.clinicName ?? 'Clínica Odontavo',
    diagnosis:    watchedValues.diagnosis,
    medications:  watchedValues.medications ?? [],
    additionalInstructions: watchedValues.additionalInstructions,
    createdAt:    new Date().toISOString(),
    expiresAt:    watchedValues.expiresAt ? `${watchedValues.expiresAt}T00:00:00Z` : '',
    status: 'draft' as const,
    sentVia: [] as ('whatsapp' | 'email' | 'pdf')[],
  };

  const onSave = async (data: PrescriptionFormValues) => {
    const patient = patients.find((p) => p.id === data.patientId)!;
    const rx = await create({
      patientId:    data.patientId,
      patientName:  patient.name,
      patientEmail: patient.email,
      dentistId:    user?.id ?? '',
      dentistName:  user?.name ?? '',
      dentistLicense: user?.licenseNumber ?? '',
      clinicName:   user?.clinicName ?? 'Clínica Odontavo',
      diagnosis:    data.diagnosis,
      medications:  data.medications,
      additionalInstructions: data.additionalInstructions,
      expiresAt:    `${data.expiresAt}T00:00:00Z`,
    });
    if (rx) setSavedId(rx.id);
    return rx;
  };

  const handleAction = async (action: 'whatsapp' | 'email' | 'pdf', data: PrescriptionFormValues) => {
    setIsSending(action);
    let id = savedId;
    if (!id) { const rx = await onSave(data); id = rx?.id ?? null; }
    await new Promise((r) => setTimeout(r, 1200));
    if (id) await send(id, [action]);
    setIsSending(null);
    setSuccessActions((prev) => new Set(prev).add(action));
  };

  const suggestions = (index: number) => {
    const q = medSearch[index] ?? '';
    if (q.length < 2) return [];
    return MEDICATIONS_DB.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 animate-fade-in">
      {/* Sub-header */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-6 h-14 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-semibold text-foreground text-sm">Nueva Receta Digital</h1>
          <p className="text-[11px] text-muted-foreground">La vista previa se actualiza en tiempo real</p>
        </div>
        {savedId && (
          <div className="ml-auto flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="w-4 h-4" />Receta guardada
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-56px)]">
        {/* LEFT — Form */}
        <div className="w-[55%] overflow-y-auto px-6 py-6 border-r border-border">
          <form id="rx-form" onSubmit={handleSubmit(onSave)} noValidate className="space-y-6 max-w-xl">
            {/* Patient */}
            <section>
              <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-primary" /><h2 className="font-semibold text-foreground text-sm">Datos del Paciente</h2></div>
              <select {...register('patientId')}
                className={cn('w-full h-10 px-3 rounded-lg border text-sm bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30',
                  errors.patientId ? 'border-destructive' : 'border-input hover:border-primary/50 focus:border-primary')}>
                <option value="">— Elige un paciente —</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.dateOfBirth.split('-')[0]}</option>)}
              </select>
              {errors.patientId && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.patientId.message}</p>}
              {selectedPatient?.allergies.length ? (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Alergias:</strong> {selectedPatient.allergies.join(', ')}</span>
                </div>
              ) : null}
            </section>

            {/* Diagnosis */}
            <section>
              <div className="flex items-center gap-2 mb-3"><Stethoscope className="w-4 h-4 text-primary" /><h2 className="font-semibold text-foreground text-sm">Diagnóstico</h2></div>
              <textarea {...register('diagnosis')} rows={2} placeholder="Ej: Periodontitis moderada generalizada — Estado post-curetaje"
                className={cn('w-full px-3 py-2.5 rounded-lg border text-sm bg-background resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30',
                  errors.diagnosis ? 'border-destructive' : 'border-input hover:border-primary/50 focus:border-primary')} />
              {errors.diagnosis && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.diagnosis.message}</p>}
            </section>

            {/* Medications */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Pill className="w-4 h-4 text-primary" /><h2 className="font-semibold text-foreground text-sm">Medicamentos</h2></div>
                <button type="button" onClick={() => append({ name: '', dose: '', frequency: '', duration: '', instructions: '' })}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium">
                  <PlusCircle className="w-3.5 h-3.5" />Agregar
                </button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const sugg = suggestions(index);
                  const match = MEDICATIONS_DB.find(m => m.name.toLowerCase() === (watchedValues.medications?.[index]?.name ?? '').toLowerCase());
                  return (
                    <div key={field.id} className="card-base p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Medicamento {index + 1}</span>
                        {fields.length > 1 && (
                          <button type="button" onClick={() => remove(index)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="relative mb-2">
                        <input {...register(`medications.${index}.name`)} placeholder="Nombre del medicamento…" autoComplete="off"
                          onChange={(e) => { const s = [...medSearch]; s[index] = e.target.value; setMedSearch(s); setValue(`medications.${index}.name`, e.target.value); }}
                          className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                        {sugg.length > 0 && (
                          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                            {sugg.map((med) => (
                              <button key={med.name} type="button"
                                onClick={() => { setValue(`medications.${index}.name`, med.name); if (med.commonDoses[0]) setValue(`medications.${index}.dose`, med.commonDoses[0]); const s = [...medSearch]; s[index] = ''; setMedSearch(s); }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-xs text-muted-foreground">{med.category}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Dosis</label>
                          {match ? (
                            <Controller control={control} name={`medications.${index}.dose`} render={({ field }) => (
                              <select {...field} className="w-full h-9 px-2 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                                <option value="">Seleccionar…</option>
                                {match.commonDoses.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            )} />
                          ) : (
                            <input {...register(`medications.${index}.dose`)} placeholder="500mg" className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          )}
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Frecuencia</label>
                          <Controller control={control} name={`medications.${index}.frequency`} render={({ field }) => (
                            <select {...field} className="w-full h-9 px-2 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <option value="">Seleccionar…</option>
                              {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                          )} />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Duración</label>
                          <Controller control={control} name={`medications.${index}.duration`} render={({ field }) => (
                            <select {...field} className="w-full h-9 px-2 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                              <option value="">Seleccionar…</option>
                              {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          )} />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted-foreground mb-1 block">Indicaciones</label>
                          <input {...register(`medications.${index}.instructions`)} placeholder="Tomar con alimentos…"
                            className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Indicaciones adicionales</label>
              <textarea {...register('additionalInstructions')} rows={3} placeholder="Dieta blanda, reposo, cuidados post-operatorios…"
                className="w-full px-3 py-2.5 rounded-lg border border-input text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/50 transition-colors" />
            </section>

            <section>
              <div className="flex items-center gap-2 mb-1.5"><CalendarDays className="w-4 h-4 text-primary" />
                <label className="text-xs font-medium text-muted-foreground">Fecha de vencimiento <span className="text-destructive">*</span></label>
              </div>
              <input type="date" {...register('expiresAt')}
                className={cn('w-full h-10 px-3 rounded-lg border text-sm bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30',
                  errors.expiresAt ? 'border-destructive' : 'border-input hover:border-primary/50 focus:border-primary')} />
            </section>
          </form>
        </div>

        {/* RIGHT — Preview */}
        <div className="w-[45%] overflow-y-auto bg-slate-100/60 px-6 py-6">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Vista previa del paciente</p>
          <PrescriptionPreview prescription={livePrescription} isPreview />

          <div className="mt-4 space-y-2.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Enviar / Guardar</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                { action: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle, hover: 'hover:border-green-400 hover:bg-green-50 hover:text-green-700', spin: 'border-green-400' },
                { action: 'email',    label: 'Email',    Icon: Mail,           hover: 'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700',   spin: 'border-blue-400' },
                { action: 'pdf',      label: 'PDF',      Icon: FileDown,       hover: 'hover:border-red-400 hover:bg-red-50 hover:text-red-700',      spin: 'border-red-400' },
              ] as const).map(({ action, label, Icon, hover, spin }) => (
                <button key={action} type="button" disabled={!!isSending || isSubmitting}
                  onClick={handleSubmit((d) => handleAction(action, d))}
                  className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-150',
                    successActions.has(action)
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : `border-border bg-white text-foreground shadow-sm ${hover}`)}>
                  {isSending === action
                    ? <div className={`w-5 h-5 border-2 ${spin} border-t-transparent rounded-full animate-spin`} />
                    : successActions.has(action) ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Icon className="w-5 h-5" />}
                  {label}
                </button>
              ))}
            </div>
            {!savedId && (
              <button type="submit" form="rx-form" disabled={isSubmitting}
                className="w-full h-10 flex items-center justify-center gap-2 border border-primary text-primary rounded-xl text-sm font-medium hover:bg-accent transition-all">
                {isSubmitting ? <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                Guardar receta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
