'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, Activity, Calendar, User, Stethoscope, LogOut } from 'lucide-react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { cn, getInitials } from '@shared/lib/utils';
import { SheetClose } from '@ui/components/ui/Sheet';

const navItems = [
  { label: 'Mis Recetas',    href: '/patient',              icon: FileText,  exact: true },
  { label: 'Mi Tratamiento', href: '/patient/treatment',    icon: Activity },
  { label: 'Citas',          href: '/patient/appointments', icon: Calendar },
  { label: 'Mi Perfil',      href: '/patient/profile',      icon: User },
];

interface PatientSidebarProps {
  isMobile?: boolean;
}

export function PatientSidebar({ isMobile }: PatientSidebarProps) {
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

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border shrink-0">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-foreground tracking-tight text-[15px]">Odontavo</span>
        <span className="ml-auto text-[10px] font-semibold py-0.5 px-1.5 rounded bg-primary/10 text-primary uppercase tracking-wide">
          Paciente
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pb-2">
          Mi Portal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          const LinkContent = (
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all group",
              active 
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <Icon className={cn("w-4 h-4", active ? "opacity-100" : "opacity-70 group-hover:opacity-100 transition-opacity")} />
              {item.label}
            </div>
          );

          return isMobile ? (
            <Link key={item.href} href={item.href} className="block">
              <SheetClose className="w-full text-left">{LinkContent}</SheetClose>
            </Link>
          ) : (
            <Link key={item.href} href={item.href} className="block">
              {LinkContent}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-9 h-9 rounded-full bg-emerald-600 border border-emerald-700 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            {user ? getInitials(user.name) : 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate">{user?.name || 'Cargando...'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        
        {isMobile ? (
          <SheetClose className="w-full">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center py-2.5 px-3 rounded-xl text-xs font-semibold text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors border border-destructive/10">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </SheetClose>
        ) : (
          <button onClick={handleLogout} className="w-full flex items-center gap-2 justify-center py-2.5 px-3 rounded-xl text-xs font-semibold text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors border border-destructive/10">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        )}
      </div>
    </>
  );

  if (isMobile) return SidebarContent;

  return (
    <aside className="hidden lg:flex flex-col w-[240px] bg-card border-r border-border h-screen fixed left-0 top-0 z-30">
      {SidebarContent}
    </aside>
  );
}
