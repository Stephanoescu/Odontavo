'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { usePatientStore } from '@patient/presentation/usePatientStore';
import { formatDate } from '@shared/lib/utils';
import { Phone, Mail, MapPin, AlertCircle, User, Droplets } from 'lucide-react';

export default function PatientProfilePage() {
  const { user } = useAuthStore();
  const { selected, selectByAuthUserId, isLoading } = usePatientStore();

  useEffect(() => { if (user?.id) selectByAuthUserId(user.id); }, [user?.id]);

  if (isLoading) return <div className="text-center py-16 text-muted-foreground"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (!selected) return (
    <div className="card-base p-12 text-center">
      <p className="text-muted-foreground">No se encontró tu expediente. Contacta a tu dentista para que vincule tu cuenta.</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-5">
      <h1 className="text-xl font-bold text-foreground">Mi Perfil</h1>
      <div className="card-base p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white text-2xl font-bold flex items-center justify-center">{selected.avatar}</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
            <p className="text-muted-foreground text-sm">Fecha de nacimiento: {formatDate(selected.dateOfBirth)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href={`tel:${selected.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-accent transition-colors group">
            <Phone className="w-4 h-4 text-primary" />
            <div><p className="text-[10px] text-muted-foreground font-semibold uppercase">Teléfono</p><p className="text-sm font-medium group-hover:text-primary">{selected.phone}</p></div>
          </a>
          <a href={`mailto:${selected.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-accent transition-colors group">
            <Mail className="w-4 h-4 text-primary" />
            <div><p className="text-[10px] text-muted-foreground font-semibold uppercase">Correo</p><p className="text-sm font-medium truncate group-hover:text-primary">{selected.email}</p></div>
          </a>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
            <Droplets className="w-4 h-4 text-red-500" />
            <div><p className="text-[10px] text-muted-foreground font-semibold uppercase">Tipo sangre</p><p className="text-sm font-bold text-red-600">{selected.bloodType}</p></div>
          </div>
        </div>
      </div>
      {selected.allergies.length > 0 && (
        <div className="card-base p-5">
          <div className="flex items-center gap-2 mb-3"><AlertCircle className="w-4 h-4 text-red-500" /><h3 className="font-semibold text-foreground text-sm">Alergias</h3></div>
          <div className="flex flex-wrap gap-2">
            {selected.allergies.map(a => <span key={a} className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-sm text-red-700 font-medium">{a}</span>)}
          </div>
        </div>
      )}
      <div className="card-base p-5"><h3 className="font-semibold text-foreground text-sm mb-2">Historia Clínica</h3><p className="text-sm text-muted-foreground">{selected.medicalHistory}</p></div>
      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-primary" /><h3 className="font-semibold text-foreground text-sm">Dirección</h3></div>
        <p className="text-sm text-muted-foreground">{selected.address}</p>
      </div>
      <div className="card-base p-5">
        <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-primary" /><h3 className="font-semibold text-foreground text-sm">Contacto de Emergencia</h3></div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Nombre</p><p className="font-medium">{selected.emergencyContact.name}</p></div>
          <div><p className="text-xs text-muted-foreground">Relación</p><p className="font-medium">{selected.emergencyContact.relationship}</p></div>
          <div><p className="text-xs text-muted-foreground">Teléfono</p><p className="font-medium">{selected.emergencyContact.phone}</p></div>
        </div>
      </div>
    </div>
  );
}
