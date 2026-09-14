'use client';

import { Menu, Stethoscope } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/Sheet';
import { PatientSidebar } from './PatientSidebar';

export function PatientMobileNav() {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-foreground text-[15px]">Odontavo</span>
      </div>

      <Sheet>
        <SheetTrigger className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[260px] flex flex-col bg-card border-r border-border">
          <PatientSidebar isMobile />
        </SheetContent>
      </Sheet>
    </div>
  );
}
