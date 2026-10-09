'use client';

import { LayoutDashboard, Users, Stethoscope, Activity, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMobileNavProps {
  active: string;
  onNavigate: (label: string) => void;
}

const mobileNav = [
  ['Dashboard', LayoutDashboard],
  ['Users', Users],
  ['Doctors', Stethoscope],
  ['Analytics', Activity],
  ['Appointments', CalendarDays],
] as const;

export function AdminMobileNav({ active, onNavigate }: AdminMobileNavProps) {
  return (
    <nav
      className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      role="navigation"
      aria-label="Admin mobile navigation"
    >
      {mobileNav.map(([label, Icon]) => (
        <button
          key={label}
          onClick={() => onNavigate(label)}
          className={cn(
            'mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold',
            active === label ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-current={active === label ? 'page' : undefined}
        >
          <Icon className="size-[18px]" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
