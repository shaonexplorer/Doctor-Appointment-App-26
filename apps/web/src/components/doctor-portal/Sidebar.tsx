'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Pill,
  Stethoscope,
  Settings,
  Bell,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand } from '@/components/patient-portal/Brand';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/doctor/dashboard' },
  { label: 'Schedule', icon: Calendar, href: '/doctor/schedule' },
  { label: 'Patients', icon: Users, href: '/doctor/patients' },
  { label: 'Appointments', icon: FileText, href: '/doctor/appointments' },
  { label: 'Prescriptions', icon: Pill, href: '/doctor/prescriptions' },
  { label: 'Consultation', icon: Stethoscope, href: '/doctor/consultation' },
] as const;

const secondary = [
  { label: 'Profile', icon: UserRound, href: '/doctor/profile' },
  { label: 'Notifications', icon: Bell, href: '/doctor/notifications' },
  { label: 'Settings', icon: Settings, href: '/doctor/settings' },
] as const;

export interface DoctorSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  active: string;
  onNavigate: (label: string) => void;
  className?: string;
}

export function DoctorSidebar({
  collapsed,
  onToggleCollapse,
  active,
  onNavigate,
  className,
}: DoctorSidebarProps) {
  const pathname = usePathname();

  const navItem = (item: (typeof navigation)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label || pathname === item.href;
    return (
      <button
        key={item.label}
        onClick={() => onNavigate(item.label)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
          selected
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          collapsed ? 'justify-center px-0' : ''
        )}
        aria-current={selected ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  const secondaryNavItem = (item: (typeof secondary)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label || pathname === item.href;
    return (
      <button
        key={item.label}
        onClick={() => onNavigate(item.label)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
          selected
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          collapsed ? 'justify-center px-0' : ''
        )}
        aria-current={selected ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'border-border bg-card fixed inset-y-0 left-0 z-40 hidden border-r transition-all duration-200 lg:flex lg:flex-col',
        collapsed ? 'w-[76px]' : 'w-[248px]',
        className
      )}
    >
      <Brand collapsed={collapsed} />
      <div className="flex flex-1 flex-col px-3">
        {!collapsed && (
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
            Doctor portal
          </p>
        )}
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {navigation.map(navItem)}
        </nav>
        <div className="border-border my-5 border-t" />
        {!collapsed && (
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
            Account
          </p>
        )}
        <nav className="flex flex-col gap-1" aria-label="Account navigation">
          {secondary.map(secondaryNavItem)}
        </nav>
      </div>
      <div
        className={cn(
          'bg-secondary m-3 rounded-2xl p-3',
          collapsed ? 'flex justify-center p-2' : ''
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
            DS
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Dr. Michael Smith</p>
              <p className="text-muted-foreground truncate text-[11px]">Cardiology</p>
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={onToggleCollapse}
        variant="outline"
        className={cn(
          'border-border text-muted-foreground hover:bg-secondary mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold',
          collapsed ? '' : ''
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <>
            {' '}
            <PanelLeftClose className="size-4" /> Collapse{' '}
          </>
        )}
      </Button>
    </aside>
  );
}
