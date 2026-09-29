"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("mt-7 border-t border-border pt-5", className)}>
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}