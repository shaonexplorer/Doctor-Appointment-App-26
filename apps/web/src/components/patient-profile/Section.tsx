"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, icon, children, className }: SectionProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className={cn("flex items-center justify-between", icon && "gap-3")}>
        <div>
          <h3 className="font-black">{title}</h3>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {icon && <div className="size-5 text-primary">{icon}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}