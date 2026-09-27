"use client";

import { cn } from "@/lib/utils";
import { ProfileInfo } from "./ProfileInfo";

export interface AboutSectionProps {
  title?: string;
  description?: string;
  infoItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }>;
  className?: string;
}

export function AboutSection({ title = "About Dr. Anderson", description, infoItems, className }: AboutSectionProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <h2 className="text-lg font-black">{title}</h2>
      {description && <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {infoItems.map((item, index) => (
          <ProfileInfo key={index} {...item} />
        ))}
      </div>
    </section>
  );
}