'use client';

import { createContext, useContext, useState } from 'react';
import { cn } from '@shared/lib/utils';

// ─── Context ────────────────────────────────────────────────────────────────
interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}
const TabsContext = createContext<TabsContextValue | null>(null);
const useTabsContext = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs subcomponents must be used within <Tabs>');
  return ctx;
};

// ─── Root ────────────────────────────────────────────────────────────────────
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

// ─── List ────────────────────────────────────────────────────────────────────
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}
export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-hide',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
export function TabsTrigger({ value, children, icon, className }: TabsTriggerProps) {
  const { active, setActive } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={cn(
        'relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none shrink-0',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {icon && (
        <span className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')}>
          {icon}
        </span>
      )}
      {children}
      {/* Active indicator */}
      <span
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200',
          isActive ? 'bg-primary opacity-100' : 'opacity-0'
        )}
      />
    </button>
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
export function TabsContent({ value, children, className }: TabsContentProps) {
  const { active } = useTabsContext();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}
