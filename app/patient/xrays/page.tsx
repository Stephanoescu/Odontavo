'use client';

import { Image as ImageIcon } from 'lucide-react';

export default function PatientXRaysPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Mis Radiografías</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Historial de imágenes y estudios radiológicos</p>
      </div>

      <div className="card-base p-12 text-center flex flex-col items-center border-dashed">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-foreground font-semibold mb-1">Sin estudios radiológicos</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Tu odontólogo aún no ha subido ninguna radiografía o estudio a tu expediente digital. 
          Cuando lo haga, aparecerán en esta sección.
        </p>
      </div>
    </div>
  );
}

