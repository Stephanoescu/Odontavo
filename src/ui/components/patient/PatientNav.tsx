'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Activity, Calendar, User, Stethoscope, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { cn, getInitials } from '@shared/lib/utils';
import { Button } from '@ui/components/ui/Button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@ui/components/ui/Sheet';

const navItems = [
  { label: 'Mis Recetas',    href: '/patient',              icon: FileText,  exact: true },
  { label: 'Mi Tratamiento', href: '/patient/treatment',    icon: Activity },
  { label: 'Citas',          href: '/patient/appointments', icon: Calendar },
  { label: 'Mi Perfil',      href: '/patient/profile',      icon: User },
];

export function PatientNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    document.cookie = 'odontavo-role=; path=/; max-age=0';
    router.push('/login');
  };

  const isActive = (item: (typeof navItems)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <nav className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {/* Mobile Menu */}
        <div className="md:hidden mr-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="px-0 py-6 w-[280px]">
              <SheetHeader className="px-6 mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-3.5 h-3.5 text-white" />
                  </div>
                  Odontavo
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <Link key={item.href} href={item.href}>
                      <SheetClose className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all text-left",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                      )}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </SheetClose>
                    </Link>
                  );
                })}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left mt-4 border-t border-border pt-6">
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/patient" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-foreground text-[15px] hidden xs:block">Odontavo</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 items-center gap-1 justify-center max-w-lg">
        {navItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap',
                active ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}>
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2.5">
        <div className="text-right hidden sm:block mr-0.5">
          <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[120px]">{user?.name}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Paciente</p>
        </div>
        <div className="w-8 h-8 rounded-full border border-border bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
          {user ? getInitials(user.name) : 'P'}
        </div>
        <button onClick={handleLogout} title="Cerrar sesión"
          className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
