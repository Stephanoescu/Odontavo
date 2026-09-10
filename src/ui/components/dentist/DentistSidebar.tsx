'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, PlusCircle,
  Calendar, BarChart3, Stethoscope, LogOut, ChevronRight,
  DollarSign, Settings,
} from 'lucide-react';
import { useAuthStore } from '@identity/presentation/useAuthStore';
import { cn, getInitials } from '@shared/lib/utils';
import { SheetClose } from '@ui/components/ui/Sheet';

const navItems = [
  { label: 'Dashboard',    href: '/dentist',                    icon: LayoutDashboard, exact: true },
  { label: 'Pacientes',    href: '/dentist/patients',           icon: Users },
  { label: 'Recetas',      href: '/dentist/prescriptions',      icon: FileText },
  { label: 'Nueva Receta', href: '/dentist/prescriptions/new',  icon: PlusCircle },
  { label: 'Agenda',       href: '/dentist/schedule',           icon: Calendar },
  { label: 'Métricas',     href: '/dentist/metrics',            icon: BarChart3 },
  { label: 'Finanzas',     href: '/dentist/finances',           icon: DollarSign },
  { label: 'Catálogo',     href: '/dentist/settings',           icon: Settings },
];

interface DentistSidebarProps {
  isMobile?: boolean;
}

export function DentistSidebar({ isMobile }: DentistSidebarProps) {
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
          Dr.
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pb-2">
          Mi Consultorio
        </p>
        {navItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item);
          const LinkComp = isMobile ? SheetClose : 'div';
          
          return (
            <Link key={item.href} href={item.href} className="block group">
              <LinkComp className={cn(
                'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-primary' : '')} />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-primary/60" />}
              </LinkComp>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
            {user ? getInitials(user.name) : 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name ?? 'Odontólogo'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Cerrar sesión"
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        {user?.licenseNumber && (
          <p className="text-[10px] text-muted-foreground px-2 mt-1 truncate">Cédula: {user.licenseNumber}</p>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return <div className="h-full flex flex-col bg-card">{SidebarContent}</div>;
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] bg-card border-r border-border flex-col z-40">
      {SidebarContent}
    </aside>
  );
}
