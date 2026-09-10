'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, FileText, Calendar, TrendingUp, PlusCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { useSchedulingStore } from '@scheduling/presentation/useSchedulingStore';
import { useFinancesStore } from '@finances/presentation/useFinancesStore';
import { formatDate } from '@shared/lib/utils';
import { PrescriptionResponseDto } from '@prescription/application/dtos/PrescriptionDtos';
import { PrescriptionStatusType } from '@prescription/domain/PrescriptionStatus';

type StatusConfig = Record<PrescriptionStatusType, { label: string; className: string }>;
const STATUS_CONFIG: StatusConfig = {
  sent:      { label: 'Enviada',    className: 'badge-status-sent' },
  viewed:    { label: 'Vista',      className: 'badge-status-viewed' },
  completed: { label: 'Completada', className: 'badge-status-completed' },
  draft:     { label: 'Borrador',   className: 'badge-status-draft' },
};

export default function DentistDashboard() {
  const { user }         = useAuthStore();
  const { prescriptions, loadAll } = usePrescriptionStore();
  const { patients, loadAll: loadPatients } = usePatientStore();
  const { loadByDentist, upcoming } = useSchedulingStore();
  const { transactions, loadAll: loadFinances, totalIncome } = useFinancesStore();

  useEffect(() => {
    loadAll();
    loadPatients();
    loadFinances();
    if (user?.id) loadByDentist(user.id);
  }, [user?.id]);

  const recentRxs   = prescriptions.slice(0, 4);
  const upcomingList = upcoming().slice(0, 4);
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Ingresos del mes actual
  const now = new Date();
  const monthlyIncome = useMemo(() => {
    return transactions
      .filter(t => {
        if (t.type !== 'ingreso' || t.status !== 'pagado') return false;
        const d = new Date(t.date);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

  return (
    <div className="page-container max-w-7xl animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {user?.name?.split(' ')[1] || 'Doctor'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/dentist/prescriptions/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          <PlusCircle className="w-4 h-4" />Nueva Receta
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Pacientes',   value: patients.length,        icon: Users,      color: 'text-blue-600',    bg: 'bg-blue-50',    delta: 'Expedientes activos' },
          { label: 'Recetas Emitidas',  value: prescriptions.length,   icon: FileText,   color: 'text-primary',     bg: 'bg-accent',     delta: 'Historial completo' },
          { label: 'Citas Próximas',    value: upcomingList.length,    icon: Calendar,   color: 'text-violet-600',  bg: 'bg-violet-50',  delta: 'Esta semana' },
          { label: 'Ingresos del Mes',  value: fmt(monthlyIncome),     icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', delta: new Date().toLocaleDateString('es-MX', { month: 'long' }) },
        ].map((s) => { const Icon = s.icon; return (
          <div key={s.label} className="card-base p-5 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Icon className={s.color} style={{ width: 18, height: 18 }} />
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">{s.delta}</div>
          </div>
        ); })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent prescriptions */}
        <div className="lg:col-span-3 card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-[15px]">Recetas Recientes</h2>
            <Link href="/dentist/prescriptions" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todas <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentRxs.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">Aún no hay recetas emitidas.</p>
            ) : recentRxs.map((rx) => {
              const cfg = STATUS_CONFIG[rx.status];
              return (
                <div key={rx.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {rx.patientName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{rx.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{rx.diagnosis}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={cfg.className}>{cfg.label}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(rx.createdAt, 'd MMM')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="lg:col-span-2 card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-[15px]">Próximas Citas</h2>
            <Link href="/dentist/schedule" className="text-xs text-primary hover:underline flex items-center gap-1">
              Agenda <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingList.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">No hay citas próximas.</p>
            ) : upcomingList.map((a) => (
              <div key={a.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded bg-accent flex items-center justify-center">
                    <Clock className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary">{a.time}</span>
                  <span className="text-[11px] text-muted-foreground">· {formatDate(a.date, 'd MMM')}</span>
                  {a.status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                </div>
                <p className="text-sm font-medium text-foreground ml-7">{a.patientName}</p>
                <p className="text-xs text-muted-foreground ml-7 truncate">{a.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
