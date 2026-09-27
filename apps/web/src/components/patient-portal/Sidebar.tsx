"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  UserRound,
  Pill,
  FileText,
  Settings,
  Bell,
  UsersRound,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./Brand";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/patient/dashboard" },
  { label: "Find Doctors", icon: Stethoscope, href: "/doctors/search" },
  { label: "Doctor Profile", icon: UserRound, href: "/doctors/profile" },
  { label: "Book Appointment", icon: CalendarDays, href: "/doctors/[id]/book" },
  { label: "Appointments", icon: CalendarDays, href: "/patient/appointments" },
  { label: "Prescriptions", icon: Pill, href: "/patient/prescriptions" },
  { label: "Medical Records", icon: FileText, href: "/patient/records" },
];

const secondary = [
  { label: "Profile", icon: UserRound, href: "/patient/profile" },
  { label: "Settings", icon: Settings, href: "/patient/settings" },
  { label: "Notifications", icon: Bell, href: "/patient/notifications" },
];

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  active: string;
  onNavigate: (label: string) => void;
  className?: string;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  active,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  const navItem = (item: (typeof navigation)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label || pathname === item.href;
    return (
      <button
        key={item.label}
        onClick={() => onNavigate(item.label)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          selected
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          collapsed ? "justify-center px-0" : ""
        )}
        aria-current={selected ? "page" : undefined}
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
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          selected
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          collapsed ? "justify-center px-0" : ""
        )}
        aria-current={selected ? "page" : undefined}
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
        "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-all duration-200 lg:flex lg:flex-col",
        collapsed ? "w-[76px]" : "w-[248px]",
        className
      )}
    >
      <Brand collapsed={collapsed} />
      <div className="flex flex-1 flex-col px-3">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Patient portal
          </p>
        )}
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {navigation.map(navItem)}
        </nav>
        <div className="my-5 border-t border-border" />
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Account
          </p>
        )}
        <nav className="flex flex-col gap-1" aria-label="Account navigation">
          {secondary.map(secondaryNavItem)}
        </nav>
      </div>
      <div className={cn("m-3 rounded-2xl bg-secondary p-3", collapsed ? "flex justify-center p-2" : "")}>
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">
            SJ
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Sarah Johnson</p>
              <p className="truncate text-[11px] text-muted-foreground">Patient account</p>
            </div>
          )}
        </div>
      </div>
      <Button
        onClick={onToggleCollapse}
        variant="outline"
        className={cn("mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary", collapsed ? "" : "")}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <> <PanelLeftClose className="size-4" /> Collapse </>}
      </Button>
    </aside>
  );
}