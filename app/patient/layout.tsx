import type { Metadata } from 'next';
import { PatientSidebar } from '@ui/components/patient/PatientSidebar';
import { PatientMobileNav } from '@ui/components/patient/PatientMobileNav';

export const metadata: Metadata = {
  title: 'Mi Portal | Odontavo',
  description: 'Tu portal personal de salud dental',
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 lg:flex-row">
      {/* Desktop Sidebar */}
      <PatientSidebar />
      
      {/* Mobile Top Nav */}
      <PatientMobileNav />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
