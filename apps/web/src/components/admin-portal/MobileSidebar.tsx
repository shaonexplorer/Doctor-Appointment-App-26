'use client';

import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
  onNavigate: (label: string) => void;
  children?: ReactNode;
}

const nav = [
  ['Dashboard', 'LayoutDashboard'],
  ['Users', 'Users'],
  ['Doctors', 'Stethoscope'],
  ['Patients', 'UserRound'],
  ['Staff', 'ShieldCheck'],
  ['Appointments', 'CalendarDays'],
  ['Clinics', 'Building2'],
  ['Departments', 'PanelLeft'],
  ['Analytics', 'Activity'],
  ['Payments', 'CreditCard'],
  ['Reports', 'FileText'],
  ['Settings', 'Settings'],
] as const;

const iconMap: Record<string, ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="size-[17px]" />,
  Users: <Users className="size-[17px]" />,
  Stethoscope: <Stethoscope className="size-[17px]" />,
  UserRound: <UserRound className="size-[17px]" />,
  ShieldCheck: <ShieldCheck className="size-[17px]" />,
  CalendarDays: <CalendarDays className="size-[17px]" />,
  Building2: <Building2 className="size-[17px]" />,
  PanelLeft: <PanelLeft className="size-[17px]" />,
  Activity: <Activity className="size-[17px]" />,
  CreditCard: <CreditCard className="size-[17px]" />,
  FileText: <FileText className="size-[17px]" />,
  Settings: <Settings className="size-[17px]" />,
};

export function AdminMobileSidebar({
  isOpen,
  onClose,
  active,
  onNavigate,
}: AdminMobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="bg-background/30 fixed inset-0 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[252px] max-w-full flex-col border-r lg:hidden">
        <div className="border-border flex items-center justify-between border-b px-5 py-6">
          <AdminBrand />
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-accent rounded-lg p-2"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3">
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.17em] uppercase">
            Admin console
          </p>
          <nav className="flex flex-col gap-1" role="navigation" aria-label="Admin navigation">
            {nav.map(([label, iconKey]) => (
              <button
                key={label}
                onClick={() => {
                  onNavigate(label);
                  onClose();
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors',
                  active === label
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                aria-current={active === label ? 'page' : undefined}
              >
                {iconMap[iconKey]}
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-accent m-3 mt-auto rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              AM
            </div>
            <div>
              <p className="text-xs font-bold">Alex Morgan</p>
              <p className="text-muted-foreground text-[11px]">System Administrator</p>
            </div>
            <MoreHorizontal className="text-muted-foreground ml-auto size-4" />
          </div>
        </div>
      </aside>
    </>
  );
}

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserRound,
  ShieldCheck,
  CalendarDays,
  Building2,
  PanelLeft,
  Activity,
  CreditCard,
  FileText,
  Settings,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function AdminBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      <span className="text-foreground text-lg font-black tracking-tight">
        Medi<span className="text-primary">Book</span>
      </span>
    </div>
  );
}
