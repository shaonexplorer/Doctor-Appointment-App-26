"use client";

import { cn } from "@/lib/utils";
import { X, LayoutDashboard, Stethoscope, CalendarDays, UserRound, Pill, FileText, Settings, Bell, UsersRound } from "lucide-react";
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

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  active: string;
  onNavigate: (label: string) => void;
  className?: string;
}

export function MobileSidebar({
  isOpen,
  onClose,
  active,
  onNavigate,
  className,
}: MobileSidebarProps) {
  const navItem = (item: (typeof navigation)[number]) => {
    const Icon = item.icon;
    const selected = active === item.label;
    return (
      <button
        key={item.label}
        onClick={() => { onNavigate(item.label); onClose(); }}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        aria-current={selected ? "page" : undefined}
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
        onClick={() => { onNavigate(item.label); onClose(); }}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
          selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        aria-current={selected ? "page" : undefined}
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
        className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-border bg-card shadow-xl transition-transform lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <Brand collapsed={false} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Main navigation">
          {navigation.map(navItem)}
          <div className="my-5 border-t border-border" />
          {secondary.map(secondaryNavItem)}
        </nav>
      </aside>
    </>
  );
}