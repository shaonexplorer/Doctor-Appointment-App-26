'use client';

import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Users, FileText } from 'lucide-react';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Schedule', icon: Calendar },
  { label: 'Patients', icon: Users },
  { label: 'Appointments', icon: FileText },
  // { label: 'Prescriptions', icon: Pill },
  // { label: 'Consultation', icon: Stethoscope },
  // { label: 'Notifications', icon: Bell },
  // { label: 'Settings', icon: Settings },
] as const;

export interface DoctorMobileNavProps {
  active: string;
  onNavigate: (label: string) => void;
}

export function DoctorMobileNav({ active, onNavigate }: DoctorMobileNavProps) {
  return (
    <nav
      className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4">
        {navigation.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={cn(
              'relative flex flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition-colors',
              'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              active === item.label ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={active === item.label ? 'page' : undefined}
          >
            <item.icon className="size-5" aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
