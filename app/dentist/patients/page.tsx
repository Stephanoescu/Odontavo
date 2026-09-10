'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Phone, Mail, AlertCircle, User, ArrowUpRight } from 'lucide-react';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { PatientResponseDto } from '@patient/application/dtos/PatientResponseDto';
import { formatDate, cn } from '@shared/lib/utils';

import { UserPlus, X } from 'lucide-react';

export default function PatientsPage() {
  const { patients, loadAll, create } = usePatientStore();
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState<PatientResponseDto | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '', dateOfBirth: '', email: '', phone: '', address: '', bloodType: 'O+', allergies: '',
    medicalHistory: '', emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: ''
  });

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (patients.length && !selected) setSelected(patients[0]); }, [patients]);

  const filtered = patients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await create({
      ...newPatient,
      allergies: newPatient.allergies.split(',').map(s => s.trim()).filter(Boolean),
    });
    if (created) {
      setShowModal(false);
      setSelected(created);
      setNewPatient({ name: '', dateOfBirth: '', email: '', phone: '', address: '', bloodType: 'O+', allergies: '', medicalHistory: '', emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '' });
    }
  };

  return (
    <div className="flex h-screen animate-fade-in relative">
      {/* List */}
      <div className="w-72 border-r border-border flex flex-col bg-card shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-foreground">Pacientes</h1>
            <button onClick={() => setShowModal(true)} className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors" title="Nuevo Paciente">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border scrollbar-hide">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p)}
              className={cn('w-full text-left px-4 py-3.5 hover:bg-muted/40 transition-colors', selected?.id === p.id && 'bg-accent border-r-2 border-primary')}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">{p.avatar ?? p.name[0]}</div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-xs p-4">No se encontraron pacientes</p>}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {selected ? (
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white text-xl font-bold flex items-center justify-center shrink-0">{selected.avatar ?? selected.name[0]}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">Nacimiento: {formatDate(selected.dateOfBirth)} · Tipo sangre: {selected.bloodType}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline"><Phone className="w-3.5 h-3.5" />{selected.phone}</a>
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline"><Mail className="w-3.5 h-3.5" />{selected.email}</a>
                </div>
              </div>
            </div>
            <Link
              href={`/dentist/patients/${selected.id}`}
              className="flex items-center gap-2 w-full justify-center bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 mb-5"
            >
              <ArrowUpRight className="w-4 h-4" /> Ver expediente completo (Vista 360)
            </Link>
            {selected.allergies.length > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mb-5">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Alergias Documentadas</p>
                  <p className="text-sm text-red-700 mt-0.5">{selected.allergies.join(', ')}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="card-base p-4"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Última visita</p><p className="font-semibold">{selected.lastVisit ? formatDate(selected.lastVisit) : '—'}</p></div>
              <div className="card-base p-4"><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Próxima cita</p><p className="font-semibold">{selected.nextAppointment ? formatDate(selected.nextAppointment) : '—'}</p></div>
            </div>
            <div className="card-base p-5 mb-5"><h3 className="font-semibold text-foreground mb-2 text-sm">Historia Médica</h3><p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.medicalHistory || 'Sin historial registrado.'}</p></div>
            <div className="card-base p-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2"><User className="w-4 h-4 text-primary" />Contacto de Emergencia</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Nombre</p><p className="font-medium">{selected.emergencyContact.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Relación</p><p className="font-medium">{selected.emergencyContact.relationship}</p></div>
                <div><p className="text-xs text-muted-foreground">Teléfono</p><p className="font-medium">{selected.emergencyContact.phone}</p></div>
              </div>
            </div>
          </div>
        ) : <div className="flex items-center justify-center h-full text-muted-foreground">Selecciona un paciente</div>}
      </div>

      {/* New Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-background rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-foreground flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Nuevo Paciente</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Nombre Completo *</label>
                  <input required type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Nacimiento *</label>
                  <input required type="date" value={newPatient.dateOfBirth} onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de Sangre</label>
                  <select value={newPatient.bloodType} onChange={e => setNewPatient({...newPatient, bloodType: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Email *</label>
                  <input required type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Teléfono</label>
                  <input required type="tel" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Alergias (separadas por coma)</label>
                  <input type="text" placeholder="Ej: Penicilina, Latex" value={newPatient.allergies} onChange={e => setNewPatient({...newPatient, allergies: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">Contacto de Emergencia</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Nombre</label>
                    <input required type="text" value={newPatient.emergencyContactName} onChange={e => setNewPatient({...newPatient, emergencyContactName: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Parentesco</label>
                    <input required type="text" value={newPatient.emergencyContactRelationship} onChange={e => setNewPatient({...newPatient, emergencyContactRelationship: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Teléfono</label>
                    <input required type="tel" value={newPatient.emergencyContactPhone} onChange={e => setNewPatient({...newPatient, emergencyContactPhone: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">Registrar Paciente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
