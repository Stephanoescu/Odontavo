'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { useFinancesStore } from '@finances/presentation/useFinancesStore';
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@shared/lib/utils';
import { TransactionDto } from '@finances/presentation/useFinancesStore';

export default function PatientFinancesPage() {
  const { user } = useAuthStore();
  const { selected, selectByAuthUserId } = usePatientStore();
  const { transactions, loadByPatient } = useFinancesStore();

  useEffect(() => {
    if (user?.id) selectByAuthUserId(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (selected?.id) loadByPatient(selected.id);
  }, [selected?.id]);

  const patientTransactions = transactions.filter(t => t.type === 'ingreso'); // The patient only sees what they were billed
  
  const pending = patientTransactions.filter(t => t.status === 'pendiente');
  const paid = patientTransactions.filter(t => t.status === 'pagado');

  const totalPendingAmount = pending.reduce((sum, t) => sum + t.amount, 0);
  const totalPaidAmount = paid.reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: TransactionDto['status']) => {
    if (status === 'pagado') return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Pagado</span>;
    if (status === 'pendiente') return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Pendiente</span>;
    return <span className="bg-destructive/10 text-destructive px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Cancelado</span>;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Mis Pagos y Estado de Cuenta</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control de tus presupuestos y pagos realizados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Deuda Pendiente */}
        <div className="card-base p-5 flex flex-col border-amber-200 bg-amber-50/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Saldo Pendiente</p>
              <p className="text-xs text-muted-foreground">Por pagar</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-700 mt-2">${totalPendingAmount.toFixed(2)}</p>
        </div>

        {/* Pagos Realizados */}
        <div className="card-base p-5 flex flex-col border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Total Pagado</p>
              <p className="text-xs text-muted-foreground">Historial completo</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 mt-2">${totalPaidAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="font-semibold text-foreground text-sm mb-4">Historial de Transacciones</h2>
        
        {patientTransactions.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No tienes transacciones registradas.
          </div>
        ) : (
          <div className="space-y-3">
            {patientTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.status === 'pagado' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    {tx.status === 'pagado' ? <ArrowDownRight className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{tx.concept}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(tx.date)} {tx.method && `· Pago: ${tx.method}`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-sm mb-1">${tx.amount.toFixed(2)}</p>
                  {getStatusBadge(tx.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

