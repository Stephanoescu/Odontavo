'use client';

import { useEffect, useState } from 'react';
import { Settings, Search, Edit3, Check, X, Tag, Clock, ChevronDown, PlusCircle } from 'lucide-react';
import { useSettingsStore } from '@settings/presentation/useSettingsStore';
import { TreatmentCategory } from '@settings/domain/Treatment';
import { cn } from '@shared/lib/utils';

const CATEGORIES: TreatmentCategory[] = [
  'Diagnóstico', 'Preventivo', 'Restauradora', 'Endodoncia',
  'Periodoncia', 'Cirugía', 'Estética', 'Ortodoncia', 'Prótesis', 'Otros',
];

const CATEGORY_COLORS: Record<TreatmentCategory, string> = {
  'Diagnóstico':  'bg-blue-50 text-blue-700 border-blue-100',
  'Preventivo':   'bg-teal-50 text-teal-700 border-teal-100',
  'Restauradora': 'bg-violet-50 text-violet-700 border-violet-100',
  'Endodoncia':   'bg-rose-50 text-rose-700 border-rose-100',
  'Periodoncia':  'bg-orange-50 text-orange-700 border-orange-100',
  'Cirugía':      'bg-red-50 text-red-700 border-red-100',
  'Estética':     'bg-pink-50 text-pink-700 border-pink-100',
  'Ortodoncia':   'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Prótesis':     'bg-slate-50 text-slate-700 border-slate-100',
  'Otros':        'bg-gray-50 text-gray-600 border-gray-100',
};

export default function SettingsPage() {
  const { treatments, isLoading, loadAll, updatePrice, createTreatment } = useSettingsStore();
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState<string>('all');
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editPrice, setEditPrice]     = useState<string>('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    category: 'Diagnóstico' as TreatmentCategory,
    price: '',
    duration: '30',
    description: ''
  });

  useEffect(() => { loadAll(); }, []);

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`;

  const filtered = treatments.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === 'all' || t.category === filterCat;
    return matchSearch && matchCat;
  });

  const startEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(String(currentPrice));
  };

  const saveEdit = async (id: string) => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      await updatePrice(id, newPrice);
    }
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTreatment({
      name: newTreatment.name,
      category: newTreatment.category,
      price: Number(newTreatment.price),
      duration: Number(newTreatment.duration),
      description: newTreatment.description
    });
    setShowModal(false);
    setNewTreatment({ name: '', category: 'Diagnóstico', price: '', duration: '30', description: '' });
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter((t) => t.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof treatments>);

  return (
    <div className="page-container max-w-5xl animate-fade-in relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Catálogo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catálogo de tratamientos y precios · {treatments.length} servicios configurados
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
          <PlusCircle className="w-4 h-4" /> Nuevo Tratamiento
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tratamientos', value: treatments.length, icon: Tag, color: 'text-primary', bg: 'bg-accent' },
          { label: 'Precio Promedio', value: fmt(Math.round(treatments.reduce((s,t)=>s+t.price,0)/Math.max(treatments.length,1))), icon: Settings, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Duración Prom.', value: `${Math.round(treatments.reduce((s,t)=>s+t.duration,0)/Math.max(treatments.length,1))} min`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Categorías', value: CATEGORIES.length, icon: ChevronDown, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-base p-4">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-2', s.bg)}>
                <Icon className={cn('w-4 h-4', s.color)} />
              </div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar tratamiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="h-9 border border-input rounded-lg px-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Catalog grouped by category */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="card-base overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide',
                CATEGORY_COLORS[category as TreatmentCategory]
              )}>
                {category}
              </span>
              <span className="text-xs text-muted-foreground">{items.length} tratamientos</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground">Tratamiento</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">Descripción</th>
                  <th className="text-center px-5 py-2.5 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Duración</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-muted-foreground">Precio (MXN)</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{t.name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell text-xs">
                      {t.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {t.duration} min
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {editingId === t.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-muted-foreground text-xs">$</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 h-7 border border-primary rounded-lg px-2 text-sm text-right focus:outline-none bg-background"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(t.id); if (e.key === 'Escape') setEditingId(null); }}
                          />
                          <button onClick={() => saveEdit(t.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded-md transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-foreground">{fmt(t.price)}</span>
                      )}
                    </td>
                    <td className="px-3">
                      {editingId !== t.id && (
                        <button
                          onClick={() => startEdit(t.id, t.price)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Editar precio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* New Treatment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h2 className="font-bold text-foreground flex items-center gap-2"><PlusCircle className="w-5 h-5 text-primary" /> Nuevo Tratamiento</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-muted-foreground hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Nombre del tratamiento *</label>
                <input required type="text" placeholder="Ej: Carilla de porcelana" value={newTreatment.name} onChange={e => setNewTreatment({...newTreatment, name: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Categoría *</label>
                <select required value={newTreatment.category} onChange={e => setNewTreatment({...newTreatment, category: e.target.value as TreatmentCategory})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Precio (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input required type="number" min="0" step="0.01" value={newTreatment.price} onChange={e => setNewTreatment({...newTreatment, price: e.target.value})} className="w-full h-9 pl-7 pr-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Duración (min) *</label>
                  <input required type="number" min="1" step="1" value={newTreatment.duration} onChange={e => setNewTreatment({...newTreatment, duration: e.target.value})} className="w-full h-9 px-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">Descripción (Opcional)</label>
                <textarea rows={2} placeholder="Ej: Por pieza" value={newTreatment.description} onChange={e => setNewTreatment({...newTreatment, description: e.target.value})} className="w-full p-3 rounded-lg border border-input text-sm bg-background focus:ring-2 focus:ring-primary/30 outline-none resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">Guardar Tratamiento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
