'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
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

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  active,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        'border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r transition-transform duration-200 lg:translate-x-0',
        collapsed ? 'lg:w-[76px]' : ''
      )}
      aria-label="Admin navigation"
    >
      <div className="border-border flex items-center justify-between border-b px-5 py-6">
        <AdminBrand collapsed={collapsed} />
        <button
          onClick={onToggleCollapse}
          className={cn(
            'text-muted-foreground hover:bg-accent rounded-lg p-2 transition-colors',
            collapsed ? 'lg:hidden' : 'hidden'
          )}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <Menu className="size-5" /> : <X className="size-5" />}
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
              onClick={() => onNavigate(label)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors',
                collapsed
                  ? 'justify-center px-2'
                  : active === label
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
              aria-current={active === label ? 'page' : undefined}
              title={collapsed ? label : undefined}
            >
              {iconMap[iconKey]}
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-accent m-3 mt-auto rounded-2xl p-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
            {adminInitials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold">Alex Morgan</p>
              <p className="text-muted-foreground truncate text-[11px]">System Administrator</p>
            </div>
          )}
          {!collapsed && <MoreHorizontal className="text-muted-foreground ml-auto size-4" />}
        </div>
      </div>
    </aside>
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

const adminInitials = 'AM';

function AdminBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      {!collapsed && (
        <span className="text-foreground text-lg font-black tracking-tight">
          Medi<span className="text-primary">Book</span>
        </span>
      )}
    </div>
  );
}
