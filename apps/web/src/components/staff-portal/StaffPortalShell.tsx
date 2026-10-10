'use client';

import { useState, type ReactNode, useEffect } from 'react';
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { GlobalSearch } from '@/components/global-search';
import {
  Bell,
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Menu,
  Settings,
  Stethoscope,
  Users,
  X,
  Zap,
} from 'lucide-react';

const nav: readonly [string, LucideIcon][] = [
  ['Dashboard', LayoutDashboard],
  ['Appointments', CalendarDays],
  ['Patients', Users],
  ['Doctors', Stethoscope],
  ['Check-in', ClipboardCheck],
  ['Billing', CreditCard],
  ['Schedule', Zap],
  ['Reports', FileText],
  ['Settings', Settings],
];

const mobileNav: readonly [string, LucideIcon][] = [
  ['Dashboard', LayoutDashboard],
  ['Appointments', CalendarDays],
  ['Check-in', ClipboardCheck],
  ['Billing', CreditCard],
  ['Patients', Users],
];

const routeMap: Record<string, string> = {
  Dashboard: '/staff/dashboard',
  Appointments: '/staff/appointments',
  Patients: '/staff/patients',
  Doctors: '/staff/doctors',
  'Check-in': '/staff/checkin',
  Billing: '/staff/billing',
  Schedule: '/staff/schedule',
  Reports: '/staff/reports',
  Settings: '/staff/settings',
  'Book appointment': '/staff/booking',
  Notifications: '/staff/notifications',
};

export interface StaffPortalShellProps {
  children: ReactNode;
  active: string;
  className?: string;
}

export function StaffPortalShell({ children, active, className }: StaffPortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const dateStr = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
    setFormattedDate(dateStr);
  }, []);

  const handleNavigate = (label: string) => {
    const route = routeMap[label];
    if (route) {
      router.push(route);
    }
  };

  // Determine active from pathname if not provided
  const currentActive =
    active || Object.entries(routeMap).find(([, route]) => pathname === route)?.[0] || 'Dashboard';

  return (
    <div className={cn('bg-background text-foreground min-h-screen overflow-x-hidden', className)}>
      {mobileOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r shadow-xl transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-3">
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
            Staff portal
          </p>
          <nav className="flex flex-col gap-1">
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => handleNavigate(label)}
                aria-current={currentActive === label ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition',
                  currentActive === label
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {React.createElement(Icon, { className: 'size-[18px]' }) as React.ReactNode}
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-secondary m-3 mt-auto rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              JD
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Jordan Davis</p>
              <p className="text-muted-foreground truncate text-[11px]">Front Desk Coordinator</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0 lg:pl-[264px]">
        <header className="border-border bg-background/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted-foreground hover:bg-secondary rounded-lg p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
              <span>Staff portal</span>
              <span>/</span>
              <span className="text-foreground font-semibold">{currentActive}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="staff" onNavigate={handleNavigate} />
            <button
              onClick={() => handleNavigate('Notifications')}
              className="text-muted-foreground hover:bg-secondary relative rounded-xl p-2.5"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="border-background bg-primary absolute top-1.5 right-1.5 size-2 rounded-full border-2" />
            </button>
            <button
              className="text-muted-foreground hover:bg-secondary hidden rounded-xl p-2.5 sm:block"
              aria-label="Help"
            >
              <CircleHelp className="size-[18px]" />
            </button>
            <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              JD
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {currentActive === 'Dashboard' ? formattedDate || 'Welcome' : 'Staff portal'}
            </p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {currentActive === 'Dashboard' ? `Good morning, Jordan` : currentActive}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              {currentActive === 'Dashboard'
                ? "Keep today's front-desk flow moving smoothly."
                : `Manage ${currentActive.toLowerCase()} workflows from one place.`}
            </p>
          </div>
          {children}
        </main>
        <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {mobileNav.map(([label, Icon]) => (
            <button
              key={label as string}
              onClick={() => handleNavigate(label as string)}
              className={cn(
                'mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold',
                currentActive === label ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {React.createElement(Icon, { className: 'size-[18px]' }) as React.ReactNode}
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      <span className="text-lg font-black tracking-tight">
        Medi<span className="text-primary">Book</span>
      </span>
    </div>
  );
}