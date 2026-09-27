"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  FileText,
  Pill,
} from "lucide-react";

const mobileNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/patient/dashboard" },
  { label: "Doctors", icon: Stethoscope, href: "/doctors/search" },
  { label: "Book", icon: CalendarDays, href: "/doctors/[id]/book" },
  { label: "Appointments", icon: CalendarDays, href: "/patient/appointments" },
  { label: "Records", icon: FileText, href: "/patient/records" },
];

export interface MobileNavProps {
  active: string;
  onNavigate: (label: string) => void;
  className?: string;
}

export function MobileNav({ active, onNavigate, className }: MobileNavProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t border-border bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden",
        className
      )}
      aria-label="Mobile navigation"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const selected = active === item.label;
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={cn(
              "mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold",
              selected ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-[18px]" aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}