import type { Metadata } from 'next';
import { PatientNav } from '@ui/components/patient/PatientNav';

export const metadata: Metadata = {
  title: 'Mi Portal | Odontavo',
  description: 'Tu portal personal de salud dental',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <PatientNav />
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
