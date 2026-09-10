import type { Metadata } from 'next';
import { DentistSidebar } from '@ui/components/dentist/DentistSidebar';
import { DentistMobileNav } from '@ui/components/dentist/DentistMobileNav';

export const metadata: Metadata = {
  title: 'Mi Consultorio | Odontavo',
  description: 'Gestión de tu consultorio odontológico personal',
};

export default function DentistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 lg:flex-row">
      {/* Desktop Sidebar */}
      <DentistSidebar />
      
      {/* Mobile Top Nav */}
      <DentistMobileNav />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
