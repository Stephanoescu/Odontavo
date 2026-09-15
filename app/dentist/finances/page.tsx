'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp, TrendingDown, CreditCard, Clock, Search,
  ArrowUpRight, Filter, Download, PlusCircle, Wallet, X
} from 'lucide-react';
import { useFinancesStore, TransactionDto } from '@finances/presentation/useFinancesStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { formatDate, cn } from '@shared/lib/utils';
import { TransactionType, TransactionStatus } from '@finances/domain/Transaction';

const TYPE_CFG = {
  ingreso:     { label: 'Ingreso',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: TrendingUp },
  gasto:       { label: 'Gasto',        cls: 'bg-red-50 text-red-700 border-red-100',             icon: TrendingDown },
  presupuesto: { label: 'Presupuesto',  cls: 'bg-blue-50 text-blue-700 border-blue-100',          icon: Clock },
} as const;

const STATUS_CFG = {
  pagado:    { label: 'Pagado',    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  pendiente: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border border-amber-100' },
  cancelado: { label: 'Cancelado', cls: 'bg-red-50 text-red-700 border border-red-100' },
} as const;

export default function FinancesPage() {
  const { transactions, isLoading, loadAll, totalIncome, totalPending, createTransaction, updateTransactionStatus } = useFinancesStore();
  const { patients, loadAll: loadPatients } = usePatientStore();
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTx, setNewTx] = useState({
    patientId: '',
    concept: '',
    amount: '',
    type: 'ingreso' as TransactionType,
    status: 'pagado' as TransactionStatus,
    date: '',
    method: 'efectivo' as 'efectivo' | 'tarjeta' | 'transferencia' | 'otro',
    notes: ''
  });

  useEffect(() => { 
    loadAll();
    loadPatients();
  }, []);

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

  const filtered = transactions.filter((t) => {
    const matchSearch = !search ||
      t.concept.toLowerCase().includes(search.toLowerCase()) ||
      t.patientName.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType   === 'all' || t.type   === filterType;
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalBudgets = transactions
    .filter((t) => t.type === 'presupuesto')
    .reduce((s, t) => s + t.amount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === newTx.patientId);
    
    // Los gastos no tienen paciente asociado — se envía null para respetar la FK nullable
    const patientId   = newTx.type === 'gasto' ? null : (patient?.id || null);
    const patientName = newTx.type === 'gasto' ? 'Consultorio / Gasto Interno' : (patient?.name || '');

    if (newTx.type !== 'gasto' && !patientId) return;

    await createTransaction({
      patientId,
      patientName,
      concept: newTx.concept,
      amount: Number(newTx.amount),
      type: newTx.type,
      status: newTx.status,
      date: newTx.date || new Date().toISOString().split('T')[0],
      method: newTx.method,
      notes: newTx.notes
    });

    setShowModal(false);
    setNewTx({ patientId: '', concept: '', amount: '', type: 'ingreso', status: 'pagado', date: '', method: 'efectivo', notes: '' });
  };

  return (
    <div className="page-container max-w-6xl animate-fade-in relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finanzas</h1>
          <p className="text-sm text-muted-foreground mt-1">Control de pagos, ingresos y presupuestos de tu consultorio.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          <PlusCircle className="w-4 h-4" /> Nuevo Registro
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Ingresos Cobrados',  value: fmt(totalIncome()),   color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp,  delta: '+12% vs mes ant.' },
          { label: 'Saldo Pendiente',    value: fmt(totalPending()),  color: 'text-amber-600',   bg: 'bg-amber-50',   icon: Clock,       delta: `${transactions.filter(t=>t.status==='pendiente').length} transacciones` },
          { label: 'Presupuestos',       value: fmt(totalBudgets),    color: 'text-blue-600',    bg: 'bg-blue-50',    icon: Wallet,      delta: `${transactions.filter(t=>t.type==='presupuesto').length} activos` },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card-base p-5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', kpi.bg)}>
                <Icon className={cn('w-5 h-5', kpi.color)} />
              </div>
              <p className={cn('text-2xl font-bold', kpi.color)}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              <p className="text-[11px] text-muted-foreground mt-1 italic">{kpi.delta}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card-base p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por concepto o paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Todos los tipos</option>
            <option value="ingreso">Ingresos</option>
            <option value="presupuesto">Presupuestos</option>
            <option value="gasto">Gastos</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">Todos los estados</option>
            <option value="pagado">Pagados</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
        <button className="flex items-center gap-2 border border-border text-muted-foreground px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Exportar
        </button>
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fecha</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paciente</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Concepto</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tipo</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Monto</th>
              <th className="text-center px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((tx) => {
              const typeCfg   = TYPE_CFG[tx.type];
              const statusCfg = STATUS_CFG[tx.status];
              const TypeIcon  = typeCfg.icon;
              return (
                <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                    {formatDate(tx.date, 'd MMM yyyy')}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{tx.patientName}</p>
                    {tx.method && <p className="text-xs text-muted-foreground capitalize">{tx.method}</p>}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-muted-foreground max-w-[240px] truncate">
                    {tx.concept}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border', typeCfg.cls)}>
                      <TypeIcon className="w-3 h-3" />{typeCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={cn(
                      'font-bold',
                      tx.type === 'ingreso' ? 'text-emerald-600' : (tx.type === 'gasto' ? 'text-red-600' : 'text-foreground')
                    )}>
                      {tx.type === 'ingreso' ? '+' : (tx.type === 'gasto' ? '-' : '')}{fmt(tx.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-center">
                    <select
                      value={tx.status}
                      onChange={(e) => updateTransactionStatus(tx.id, e.target.value as TransactionStatus)}
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-full outline-none cursor-pointer appearance-none text-center',
                        statusCfg.cls,
                        'hover:brightness-95 transition-all'
                      )}
                    >
                      <option value="pagado" className="bg-background text-emerald-700 font-semibold">Pagado</option>
                      <option value="pendiente" className="bg-background text-amber-700 font-semibold">Pendiente</option>
                      <option value="cancelado" className="bg-background text-red-700 font-semibold">Cancelado</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No se encontraron transacciones con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-foreground flex items-center gap-2"><PlusCircle className="w-5 h-5 text-primary" /> Nuevo Registro</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo *</label>
                  <select required value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as TransactionType})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    <option value="ingreso">Ingreso (Cobro)</option>
                    <option value="gasto">Gasto (Egreso)</option>
                    <option value="presupuesto">Presupuesto</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Estado *</label>
                  <select required value={newTx.status} onChange={e => setNewTx({...newTx, status: e.target.value as TransactionStatus})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {newTx.type !== 'gasto' && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Paciente *</label>
                  <select required value={newTx.patientId} onChange={e => setNewTx({...newTx, patientId: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    <option value="" disabled>Selecciona un paciente</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Concepto *</label>
                <input required type="text" placeholder="Ej: Resina simple" value={newTx.concept} onChange={e => setNewTx({...newTx, concept: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Monto *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input required type="number" min="0" step="0.01" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="w-full h-9 pl-7 pr-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Método de pago</label>
                  <select value={newTx.method} onChange={e => setNewTx({...newTx, method: e.target.value as 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Notas (Opcional)</label>
                <textarea rows={2} value={newTx.notes} onChange={e => setNewTx({...newTx, notes: e.target.value})} className="w-full p-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
