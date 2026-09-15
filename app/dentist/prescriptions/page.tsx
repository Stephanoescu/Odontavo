'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import { usePrescriptionStore } from '@prescription/presentation/usePrescriptionStore';
import { formatDate, cn } from '@shared/lib/utils';
import { PrescriptionStatusType } from '@prescription/domain/PrescriptionStatus';

const STATUS_CONFIG: Record<PrescriptionStatusType, { label: string; className: string }> = {
  sent:      { label: 'Enviada',    className: 'badge-status-sent' },
  viewed:    { label: 'Vista',      className: 'badge-status-viewed' },
  completed: { label: 'Completada', className: 'badge-status-completed' },
  draft:     { label: 'Borrador',   className: 'badge-status-draft' },
};

export default function PrescriptionsPage() {
  const { prescriptions, loadAll } = usePrescriptionStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PrescriptionStatusType | 'all'>('all');

  useEffect(() => { loadAll(); }, []);

  const filtered = prescriptions.filter((rx) => {
    const matchSearch = !search ||
      rx.patientName.toLowerCase().includes(search.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || rx.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Recetas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{prescriptions.length} recetas emitidas</p>
        </div>
        <Link href="/dentist/prescriptions/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          <PlusCircle className="w-4 h-4" />Nueva Receta
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="flex items-center gap-1.5">
          {(['all', 'sent', 'viewed', 'completed', 'draft'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filter === s ? 'bg-primary text-white' : 'bg-background border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
              {s === 'all' ? 'Todas' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-base overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Paciente', 'Diagnóstico', 'Medicamentos', 'Fecha', 'Estado'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0
              ? <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground italic">No se encontraron recetas.</td></tr>
              : filtered.map((rx) => {
                  const cfg = STATUS_CONFIG[rx.status];
                  return (
                    <tr key={rx.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {rx.patientName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{rx.patientName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px] truncate">{rx.diagnosis}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{rx.medications.length} med.</td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{formatDate(rx.createdAt, 'd MMM yyyy')}</td>
                      <td className="px-4 py-3.5"><span className={cfg.className}>{cfg.label}</span></td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
