'use client';

import { Menu, Stethoscope } from 'lucide-react';
import { Button } from '@ui/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/Sheet';
import { DentistSidebar } from './DentistSidebar';

export function DentistMobileNav() {
  return (
    <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 shrink-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px]">
          <DentistSidebar isMobile />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-1 items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-foreground text-sm tracking-tight">Odontavo</span>
      </div>
    </header>
  );
}
