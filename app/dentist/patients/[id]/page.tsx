'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, User, FileText, Grid3X3, Image, CreditCard,
  AlertCircle, Phone, Mail, MapPin, Heart, PlusCircle,
  Trash2, Calendar, Clock, CheckCircle2
} from 'lucide-react';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { useOdontogramStore } from '@odontogram/presentation/useOdontogramStore';
import { useFinancesStore } from '@finances/presentation/useFinancesStore';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { formatDate, cn } from '@shared/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@ui/components/ui/Tabs';
import { FDI_TEETH, ALL_FDI_TEETH } from '@odontogram/domain/OdontogramEntry';

// ─── Diagnosis / Treatment options ───────────────────────────────────────────
const DIAGNOSES = [
  'Caries incipiente', 'Caries media', 'Caries profunda', 'Caries profunda con afección pulpar',
  'Fractura coronaria', 'Fractura radicular', 'Abrasión cervical', 'Erosión dental',
  'Periodontitis', 'Gingivitis', 'Recesión gingival', 'Bolsa periodontal',
  'Diente ausente', 'Diente retenido', 'Diente supernumerario', 'Movilidad dental',
  'Lesión de furca', 'Absceso periapical', 'Quiste radicular', 'Sano',
];

const TREATMENTS = [
  'Resina compuesta', 'Amalgama', 'Incrustación cerámica', 'Corona metal-cerámica', 'Corona zirconia',
  'Endodoncia unirradicular', 'Endodoncia multirradicular', 'Retratamiento endodóntico',
  'Extracción simple', 'Extracción quirúrgica', 'Cirugía periapical',
  'Raspado y alisado radicular', 'Cirugía periodontal', 'Injerto óseo',
  'Implante dental', 'Prótesis fija', 'Prótesis removible', 'Puente fijo',
  'Sellador de fisuras', 'Observación', 'Sin tratamiento requerido',
];

// ─── Status color map ─────────────────────────────────────────────────────────
const TX_STATUS: Record<string, { label: string; cls: string }> = {
  pagado:    { label: 'Pagado',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  pendiente: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-100' },
  cancelado: { label: 'Cancelado', cls: 'bg-red-50 text-red-700 border-red-100' },
};

// ─── Tab: Perfil ──────────────────────────────────────────────────────────────
function TabPerfil({ patient }: { patient: any }) {
  return (
    <div className="space-y-5 pt-5">
      {/* Allergies alert */}
      {patient.allergies.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">⚠ Alergias documentadas</p>
            <p className="text-sm text-red-700 mt-0.5">{patient.allergies.join(' · ')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact */}
        <div className="card-base p-5 space-y-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Datos de Contacto
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <a href={`tel:${patient.phone}`} className="hover:text-primary transition-colors">{patient.phone}</a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <a href={`mailto:${patient.email}`} className="hover:text-primary transition-colors">{patient.email}</a>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Medical summary */}
        <div className="card-base p-5 space-y-3">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" /> Resumen Médico
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Nacimiento</p>
              <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tipo de Sangre</p>
              <p className="font-bold text-lg text-primary">{patient.bloodType}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Última visita</p>
              <p className="font-medium">{formatDate(patient.lastVisit)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Próxima cita</p>
              <p className="font-medium">{patient.nextAppointment ? formatDate(patient.nextAppointment) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical history */}
      <div className="card-base p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Historia Médica</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{patient.medicalHistory || 'Sin antecedentes registrados.'}</p>
      </div>

      {/* Emergency contact */}
      <div className="card-base p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Contacto de Emergencia</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Nombre</p><p className="font-medium">{patient.emergencyContact.name}</p></div>
          <div><p className="text-xs text-muted-foreground">Relación</p><p className="font-medium">{patient.emergencyContact.relationship}</p></div>
          <div><p className="text-xs text-muted-foreground">Teléfono</p><p className="font-medium">{patient.emergencyContact.phone}</p></div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Historia Clínica ────────────────────────────────────────────────────
function TabHistoria({ patient, onSaveNote }: { patient: any, onSaveNote: (note: string) => Promise<void> }) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!notes.trim()) return;
    setIsSaving(true);
    await onSaveNote(notes);
    setNotes('');
    setIsSaving(false);
  };

  return (
    <div className="space-y-5 pt-5">
      <div className="card-base p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Anamnesis Médica</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">
          {patient.medicalHistory || 'Sin antecedentes médicos registrados.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Enfermedades sistémicas', value: patient.medicalHistory?.includes('Diabetes') ? 'Diabetes tipo 2, Hipertensión' : 'Ninguna reportada' },
            { label: 'Medicamentos actuales', value: patient.medicalHistory?.includes('Losartán') ? 'Losartán 50mg, Metformina' : 'Ninguno' },
            { label: 'Hábitos', value: patient.medicalHistory?.includes('Fumador') ? 'Fumador ocasional' : 'Ninguno reportado' },
            { label: 'Alergias', value: patient.allergies.length > 0 ? patient.allergies.join(', ') : 'NKDA' },
          ].map((item) => (
            <div key={item.label} className="bg-muted/40 rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-base p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3">Notas Clínicas</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Escribe tus notas clínicas de la consulta de hoy..."
          rows={5}
          className="w-full text-sm border border-input rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !notes.trim()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Nota'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Odontograma ─────────────────────────────────────────────────────────
function TabOdontograma({ patientId, dentistId }: { patientId: string; dentistId: string }) {
  const { entries, isLoading, loadByPatient, addEntry, removeEntry } = useOdontogramStore();

  const [form, setForm] = useState({
    toothNumber: '',
    surface: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadByPatient(patientId); }, [patientId]);

  const handleSubmit = async () => {
    if (!form.toothNumber || !form.diagnosis || !form.treatment) return;
    await addEntry({
      patientId,
      dentistId,
      date: new Date().toISOString().split('T')[0],
      toothNumber: form.toothNumber,
      surface: form.surface || undefined,
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      notes: form.notes || undefined,
    });
    setForm({ toothNumber: '', surface: '', diagnosis: '', treatment: '', notes: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-5 pt-5">
      {/* FDI Table */}
      <div className="card-base overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-border gap-3">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Odontograma — Nomenclatura FDI</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Cuadrantes superiores: 1 (der) y 2 (izq) · Inferiores: 4 (der) y 3 (izq)</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> {showForm ? 'Ocultar Formulario' : 'Nuevo Registro'}
          </button>
        </div>

        {/* New entry form (MOVED UP FOR BETTER UX) */}
        {showForm && (
          <div className="p-5 border-b border-border bg-primary/5 animate-fade-in">
            <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-primary" /> Registrar Hallazgo / Tratamiento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Pieza Dental (FDI) *</label>
                <select
                  value={form.toothNumber}
                  onChange={(e) => setForm((f) => ({ ...f, toothNumber: e.target.value }))}
                  className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar pieza...</option>
                  {Object.entries(FDI_TEETH).map(([quadrant, teeth]) => (
                    <optgroup key={quadrant} label={quadrant}>
                      {teeth.map((t) => <option key={t} value={t}>Pieza {t}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Superficie</label>
                <select
                  value={form.surface}
                  onChange={(e) => setForm((f) => ({ ...f, surface: e.target.value }))}
                  className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">— Opcional —</option>
                  {['Oclusal','Mesial','Distal','Vestibular','Palatino/Lingual','Cervical','Ocluso-mesial','Ocluso-distal','Toda la corona'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Diagnóstico *</label>
                <select
                  value={form.diagnosis}
                  onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
                  className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar diagnóstico...</option>
                  {DIAGNOSES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Tratamiento a realizar *</label>
                <select
                  value={form.treatment}
                  onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
                  className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Seleccionar tratamiento...</option>
                  {TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Notas adicionales</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Observaciones clínicas relevantes..."
                  className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.toothNumber || !form.diagnosis || !form.treatment}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" /> Guardar Registro
              </button>
            </div>
          </div>
        )}

        {/* Quadrant grid */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(FDI_TEETH).map(([quadrant, teeth]) => {
            const quadrantEntries = entries.filter((e) => teeth.includes(e.toothNumber));
            return (
              <div key={quadrant} className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/40 px-4 py-2.5 border-b border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{quadrant}</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground w-16">Pieza</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Diagnóstico</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Tratamiento</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {teeth.map((tooth) => {
                      const entry = quadrantEntries.find((e) => e.toothNumber === tooth);
                      return (
                        <tr key={tooth} className={cn('transition-colors', entry ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/20')}>
                          <td className="px-3 py-2.5">
                            <span className={cn(
                              'inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold',
                              entry ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            )}>
                              {tooth}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            {entry ? (
                              <div>
                                <p className="font-medium text-foreground text-xs">{entry.diagnosis}</p>
                                {entry.surface && <p className="text-muted-foreground text-[11px]">{entry.surface}</p>}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 hidden sm:table-cell">
                            {entry ? (
                              <span className="text-xs text-foreground">{entry.treatment}</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </td>
                          <td className="px-2">
                            {entry && (
                              <button
                                onClick={() => removeEntry(entry.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* New entry form */}
      {showForm && (
        <div className="card-base p-5 border-primary/30 border-2 animate-fade-in">
          <h3 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" /> Registrar Hallazgo / Tratamiento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Pieza Dental (FDI) *</label>
              <select
                value={form.toothNumber}
                onChange={(e) => setForm((f) => ({ ...f, toothNumber: e.target.value }))}
                className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Seleccionar pieza...</option>
                {Object.entries(FDI_TEETH).map(([quadrant, teeth]) => (
                  <optgroup key={quadrant} label={quadrant}>
                    {teeth.map((t) => <option key={t} value={t}>Pieza {t}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Superficie</label>
              <select
                value={form.surface}
                onChange={(e) => setForm((f) => ({ ...f, surface: e.target.value }))}
                className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">— Opcional —</option>
                {['Oclusal','Mesial','Distal','Vestibular','Palatino/Lingual','Cervical','Ocluso-mesial','Ocluso-distal','Toda la corona'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Diagnóstico *</label>
              <select
                value={form.diagnosis}
                onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
                className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Seleccionar diagnóstico...</option>
                {DIAGNOSES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Tratamiento a realizar *</label>
              <select
                value={form.treatment}
                onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
                className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Seleccionar tratamiento...</option>
                {TREATMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1">Notas adicionales</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Observaciones clínicas relevantes..."
                className="w-full h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.toothNumber || !form.diagnosis || !form.treatment}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" /> Guardar Registro
            </button>
          </div>
        </div>
      )}

      {/* Entries list */}
      {entries.length > 0 && (
        <div className="card-base overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm">Hallazgos Registrados ({entries.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <div key={entry.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {entry.toothNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{entry.diagnosis}</p>
                    {entry.surface && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{entry.surface}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">→ {entry.treatment}</p>
                  {entry.notes && <p className="text-xs text-amber-600 italic mt-0.5">{entry.notes}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">{formatDate(entry.date, 'd MMM yyyy')}</p>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="mt-1 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && !isLoading && (
        <div className="card-base p-10 flex flex-col items-center justify-center text-muted-foreground">
          <Grid3X3 className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-medium">Sin registros odontológicos</p>
          <p className="text-sm mt-1">Usa el botón "Nuevo Registro" para agregar el primer hallazgo.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Radiografías ────────────────────────────────────────────────────────
function TabRadiografias() {
  return (
    <div className="pt-5">
      <div className="card-base p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Archivo Radiográfico</h3>
          <button className="flex items-center gap-2 border border-primary text-primary px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary/5 transition-colors">
            <PlusCircle className="w-3.5 h-3.5" /> Subir Imagen
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: 'Panorámica', date: '2024-12-10', type: 'Panorámica' },
            { label: 'Periapical 16', date: '2024-12-10', type: 'Periapical' },
            { label: 'Bitewing Der.', date: '2024-11-01', type: 'Bitewing' },
          ].map((xray) => (
            <div key={xray.label} className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="h-24 bg-slate-900 flex items-center justify-center">
                <Image className="w-8 h-8 text-slate-600 group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-foreground truncate">{xray.label}</p>
                <p className="text-[11px] text-muted-foreground">{xray.type} · {formatDate(xray.date, 'd MMM')}</p>
              </div>
            </div>
          ))}
          <div className="border border-dashed border-border rounded-xl h-[105px] flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
            <PlusCircle className="w-6 h-6 mb-1.5" />
            <p className="text-xs font-medium">Agregar</p>
          </div>
        </div>
      </div>
      <div className="card-base p-5 border-dashed">
        <p className="text-xs text-muted-foreground text-center italic">
          La integración con almacenamiento de archivos (Google Drive, S3, etc.) se configurará en la siguiente fase.
        </p>
      </div>
    </div>
  );
}

// ─── Tab: Estado de Cuenta ────────────────────────────────────────────────────
function TabEstadoCuenta({ patientId }: { patientId: string }) {
  const { transactions, isLoading, loadByPatient } = useFinancesStore();

  useEffect(() => { loadByPatient(patientId); }, [patientId]);

  const totalPagado   = transactions.filter((t) => t.status === 'pagado').reduce((s, t) => s + t.amount, 0);
  const totalPendiente = transactions.filter((t) => t.status === 'pendiente').reduce((s, t) => s + t.amount, 0);

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

  return (
    <div className="space-y-5 pt-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Pagado',    value: fmt(totalPagado),    cls: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Saldo Pendiente', value: fmt(totalPendiente), cls: 'text-amber-600',   bg: 'bg-amber-50' },
          { label: 'Total General',   value: fmt(totalPagado + totalPendiente), cls: 'text-primary', bg: 'bg-accent' },
        ].map((s) => (
          <div key={s.label} className={cn('rounded-xl p-4 border border-border', s.bg)}>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-1', s.cls)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="card-base overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">Historial de Transacciones</h3>
          <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <PlusCircle className="w-3.5 h-3.5" /> Nuevo cargo
          </button>
        </div>
        {transactions.length > 0 ? (
          <div className="divide-y divide-border">
            {transactions.map((tx) => {
              const stCfg = TX_STATUS[tx.status];
              return (
                <div key={tx.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    tx.type === 'ingreso' ? 'bg-emerald-50' : tx.type === 'presupuesto' ? 'bg-blue-50' : 'bg-red-50'
                  )}>
                    <CreditCard className={cn('w-4 h-4', tx.type === 'ingreso' ? 'text-emerald-600' : tx.type === 'presupuesto' ? 'text-blue-600' : 'text-red-600')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{tx.concept}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.date, 'd MMM yyyy')} {tx.method && `· ${tx.method}`}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn('font-bold text-sm', tx.type === 'ingreso' ? 'text-emerald-600' : 'text-foreground')}>
                      {tx.type === 'ingreso' ? '+' : ''}{fmt(tx.amount)}
                    </p>
                    <span className={cn('text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border', stCfg.cls)}>
                      {stCfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Sin transacciones registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PatientDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params?.id as string;

  const { patients, loadAll } = usePatientStore();
  const { user }              = useAuthStore();

  useEffect(() => { loadAll(); }, []);

  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Paciente no encontrado.</p>
          <button onClick={() => router.back()} className="mt-3 text-primary text-sm hover:underline">← Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button
          onClick={() => router.push('/dentist/patients')}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground mt-1 shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white text-xl font-bold flex items-center justify-center shrink-0">
            {patient.avatar ?? patient.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
              <span className={cn(
                'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                patient.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-muted text-muted-foreground'
              )}>
                {patient.status === 'active' ? '● Activo' : '● Inactivo'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {patient.bloodType} · Nac. {formatDate(patient.dateOfBirth)} · {patient.email}
            </p>
            {patient.allergies.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <p className="text-xs text-red-600 font-medium">Alergia: {patient.allergies.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil"       icon={<User />}>Perfil</TabsTrigger>
          <TabsTrigger value="historia"     icon={<FileText />}>Historia Clínica</TabsTrigger>
          <TabsTrigger value="odontograma"  icon={<Grid3X3 />}>Odontograma</TabsTrigger>
          <TabsTrigger value="radiografias" icon={<Image />}>Radiografías</TabsTrigger>
          <TabsTrigger value="cuenta"       icon={<CreditCard />}>Estado de Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <TabPerfil patient={patient} />
        </TabsContent>
        <TabsContent value="historia">
          <TabHistoria patient={patient} onSaveNote={async (note) => { await usePatientStore.getState().updateMedicalHistory(patient.id, note); }} />
        </TabsContent>
        <TabsContent value="odontograma">
          <TabOdontograma patientId={id} dentistId={user?.id ?? 'dentist-001'} />
        </TabsContent>
        <TabsContent value="radiografias">
          <TabRadiografias />
        </TabsContent>
        <TabsContent value="cuenta">
          <TabEstadoCuenta patientId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
