"use client";

import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { ProfileInfo } from "./ProfileInfo";

export interface ClinicInfoSectionProps {
  clinicName?: string;
  infoItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }>;
  className?: string;
}

export function ClinicInfoSection({ clinicName = "Heart & Vascular Center", infoItems, className }: ClinicInfoSectionProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Clinic information</h2>
          <p className="mt-1 text-xs text-muted-foreground">{clinicName}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
          <MapPin className="size-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {infoItems.map((item, index) => (
          <ProfileInfo key={index} {...item} />
        ))}
      </div>
    </section>
  );
}