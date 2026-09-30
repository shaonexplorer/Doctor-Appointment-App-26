'use client';

import { cn } from '@/lib/utils';
import {
  X,
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Pill,
  Stethoscope,
  Settings,
  Bell,
  UserRound,
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

export interface DoctorMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
  onNavigate: (label: string) => void;
  className?: string;
}

export function DoctorMobileSidebar({
  isOpen,
  onClose,
  active,
  onNavigate,
  className,
}: DoctorMobileSidebarProps) {
  const navItem = (item: (typeof navigation)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label;
    return (
      <button
        key={item.label}
        onClick={() => {
          onNavigate(item.label);
          onClose();
        }}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
          selected
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
        aria-current={selected ? 'page' : undefined}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    );
  };

  const secondaryNavItem = (item: (typeof secondary)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label;
    return (
      <button
        key={item.label}
        onClick={() => {
          onNavigate(item.label);
          onClose();
        }}
        className={cn(
          'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
          selected
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
        aria-current={selected ? 'page' : undefined}
      >
        <Icon className="size-[18px] shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r shadow-xl transition-transform lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="border-border flex items-center justify-between border-b p-4">
          <Brand collapsed={false} />
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Main navigation">
          {navigation.map(navItem)}
          <div className="border-border my-5 border-t" />
          {secondary.map(secondaryNavItem)}
        </nav>
      </aside>
    </>
  );
}
