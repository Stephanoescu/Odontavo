'use client';

import { useEffect, useState, useMemo } from 'react';
import { Clock, Calendar, CheckCircle2, Plus, X } from 'lucide-react';
import { formatDate, cn } from '@shared/lib/utils';
import { useSchedulingStore } from '@scheduling/presentation/useSchedulingStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { useAuthStore } from '@identity/presentation/useAuthStore';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function SchedulePage() {
  const { user } = useAuthStore();
  const { loadByDentist, upcoming, createAppointment, appointments } = useSchedulingStore();
  const { patients, loadAll: loadPatients } = usePatientStore();
  
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientId: '',
    date: '',
    time: '09:00',
    type: 'Consulta general',
    notes: ''
  });

  useEffect(() => {
    if (user?.id) loadByDentist(user.id);
    loadPatients();
  }, [user?.id]);

  const upcomingList = upcoming();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const patient = patients.find(p => p.id === newAppt.patientId);
    if (!patient) return;

    await createAppointment({
      patientId: patient.id,
      patientName: patient.name,
      dentistId: user.id,
      dentistName: user.name,
      date: newAppt.date,
      time: newAppt.time,
      type: newAppt.type,
      notes: newAppt.notes
    });
    
    setShowModal(false);
    setNewAppt({ patientId: '', date: '', time: '09:00', type: 'Consulta general', notes: '' });
  };

  // Genera las fechas de la semana actual (lun-sáb)
  const weekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=dom, 1=lun, ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  // Mapea una cita a su columna de día real (0=lun … 5=sáb) dentro de la semana actual
  const getApptForSlot = (dayIdx: number, hour: string) => {
    const slotDate = weekDates[dayIdx];
    const slotDateStr = slotDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    return appointments.find(a => {
      const apptDate = typeof a.date === 'string' ? a.date : a.date;
      return apptDate === slotDateStr && a.time === hour;
    });
  };

  return (
    <div className="page-container animate-fade-in relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Semana Actual</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          <Calendar className="w-4 h-4" />
          Nueva cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar view */}
        <div className="lg:col-span-2 card-base overflow-x-auto">
          <div className="grid grid-cols-7 border-b border-border text-xs min-w-[600px]">
            <div className="px-3 py-3 text-muted-foreground" />
            {DAYS.map((d, i) => {
              const isToday = weekDates[i]?.toDateString() === new Date().toDateString();
              return (
                <div key={d} className={cn("px-3 py-3 text-center font-semibold", isToday ? 'text-primary bg-accent' : 'text-muted-foreground')}>
                  <div>{d}</div>
                  <div className="text-[10px] font-normal opacity-70">{weekDates[i]?.getDate()}</div>
                </div>
              );
            })}
          </div>
          <div className="divide-y divide-border/60">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-7 min-h-[48px] min-w-[600px]">
                <div className="px-3 py-2 text-[11px] text-muted-foreground font-mono">{hour}</div>
                {DAYS.map((d, di) => {
                  const appt = getApptForSlot(di, hour);
                  return (
                    <div key={d} className={cn("border-l border-border/40 px-1 py-1", di === 0 && 'bg-accent/30')}>
                      {appt && (
                        <div className="bg-primary/10 border border-primary/20 rounded px-2 py-1 text-[10px] text-primary font-medium truncate" title={`${appt.patientName} - ${appt.type}`}>
                          {appt.patientName.split(' ')[0]} {appt.patientName.split(' ')[1]?.[0]}.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming list */}
        <div className="card-base overflow-hidden flex flex-col max-h-[calc(100vh-12rem)]">
          <div className="px-5 py-4 border-b border-border shrink-0">
            <h2 className="font-semibold text-foreground text-sm">Próximas citas</h2>
          </div>
          <div className="divide-y divide-border overflow-y-auto">
            {upcomingList.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground text-center">No hay citas pendientes</p>
            ) : (
              upcomingList.map((a) => (
                <div key={a.id} className="px-4 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{a.time}</span>
                    <span className="text-[11px] text-muted-foreground">· {formatDate(a.date, 'd MMM')}</span>
                    {a.status === 'confirmed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                    ) : (
                      <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">Pendiente</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground">{a.patientName}</p>
                  <p className="text-xs text-muted-foreground">{a.type}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Agendar Cita</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Paciente *</label>
                <select required value={newAppt.patientId} onChange={e => setNewAppt({...newAppt, patientId: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                  <option value="" disabled>Selecciona un paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Fecha *</label>
                  <input required type="date" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Hora *</label>
                  <select required value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Motivo / Tratamiento *</label>
                <input required type="text" placeholder="Ej: Control general" value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Notas (Opcional)</label>
                <textarea rows={2} value={newAppt.notes} onChange={e => setNewAppt({...newAppt, notes: e.target.value})} className="w-full p-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none resize-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">Agendar Cita</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
