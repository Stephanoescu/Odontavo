'use client';

import { useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, FileText, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { cn, formatDate } from '@shared/lib/utils';
import { useFinancesStore } from '@finances/presentation/useFinancesStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { useSchedulingStore } from '@scheduling/presentation/useSchedulingStore';
import { useAuthStore } from '@identity/presentation/useAuthStore';

export default function MetricsPage() {
  const { user } = useAuthStore();
  const { transactions, loadAll: loadFinances } = useFinancesStore();
  const { patients, loadAll: loadPatients } = usePatientStore();
  const { prescriptions, loadAll: loadPrescriptions } = usePrescriptionStore();
  const { appointments, loadByDentist } = useSchedulingStore();

  useEffect(() => {
    loadFinances();
    loadPatients();
    loadPrescriptions();
    if (user?.id) loadByDentist(user.id);
  }, [user?.id]);

  const now = new Date();
  const isCurrentMonth = (d: string) => {
    const date = new Date(d);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  };

  const monthlyIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'ingreso' && t.status === 'pagado' && isCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalPatients = useMemo(() => patients.length, [patients]);

  const monthlyPrescriptions = useMemo(() => {
    return prescriptions.filter(p => isCurrentMonth(p.createdAt)).length;
  }, [prescriptions]);

  const completedAppointments = useMemo(() => {
    return appointments.filter(a => a.status === 'completed' && isCurrentMonth(a.date)).length;
  }, [appointments]);

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

  const STATS = [
    { label: 'Ingresos Mensuales', value: fmt(monthlyIncome), delta: 'Este mes', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Pacientes', value: totalPatients.toString(), delta: 'Registrados', isUp: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Recetas (Mes)', value: monthlyPrescriptions.toString(), delta: 'Emitidas', isUp: true, icon: FileText, color: 'text-primary', bg: 'bg-accent' },
    { label: 'Citas Completadas', value: completedAppointments.toString(), delta: 'Este mes', isUp: true, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const recentActivity = useMemo(() => {
    const acts: any[] = [];
    transactions.slice(0, 3).forEach(t => acts.push({ id: `tx-${t.id}`, type: 'Ingreso', amount: fmt(t.amount), desc: t.concept, date: new Date(t.date) }));
    prescriptions.slice(0, 3).forEach(p => acts.push({ id: `rx-${p.id}`, type: 'Receta', amount: 'Emitida', desc: `${p.patientName} - ${p.diagnosis}`, date: new Date(p.createdAt) }));
    appointments.slice(0, 3).forEach(a => acts.push({ id: `ap-${a.id}`, type: 'Cita', amount: a.type, desc: `${a.patientName}`, date: new Date(a.date) }));
    
    return acts.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5).map(act => ({
      ...act,
      time: formatDate(act.date.toISOString(), 'd MMM, yyyy')
    }));
  }, [transactions, prescriptions, appointments]);

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Métricas y Rendimiento</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen detallado de la actividad de tu consultorio este mes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-base p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                  <Icon className={cn("w-5 h-5", s.color)} />
                </div>
                <div className={cn("flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full", 
                  s.isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                  {s.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.delta}
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6">
            <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Tendencia de Pacientes
            </h2>
            <div className="h-[240px] w-full bg-slate-50 rounded-xl border border-dashed border-border flex items-center justify-center text-muted-foreground italic text-sm">
              Gráfico de tendencia (Aún no hay suficientes datos históricos)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card-base p-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Top Tratamientos</h3>
              <div className="space-y-4">
                {[
                  { name: 'Profilaxis', count: 0, color: 'bg-primary' },
                  { name: 'Endodoncia', count: 0, color: 'bg-blue-500' },
                  { name: 'Resinas', count: 0, color: 'bg-teal-500' },
                ].map(t => (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{t.name}</span>
                      <span className="text-muted-foreground">{t.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", t.color)} style={{ width: `0%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-base p-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Origen de Pacientes</h3>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-24 h-24 rounded-full border-8 border-muted" />
                <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-wide">
                  <span className="text-muted-foreground">Sin datos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground text-sm">Actividad Reciente</h2>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.length === 0 ? (
              <p className="p-5 text-sm text-center text-muted-foreground">Aún no hay actividad registrada.</p>
            ) : recentActivity.map(act => (
              <div key={act.id} className="p-5 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest", 
                    act.type === 'Ingreso' ? 'text-emerald-600' : 
                    act.type === 'Receta' ? 'text-primary' : 'text-blue-600')}>
                    {act.type}
                  </span>
                  <span className="text-sm font-bold text-foreground">{act.amount}</span>
                </div>
                <p className="text-sm text-foreground mb-1">{act.desc}</p>
                <p className="text-xs text-muted-foreground italic">{act.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
