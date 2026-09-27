"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface BookingStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function BookingStepper({ steps, currentStep, className }: BookingStepperProps) {
  return (
    <div className={cn("overflow-x-auto pb-2", className)}>
      <div className="flex min-w-[620px] items-start justify-between">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "grid size-9 place-items-center rounded-full border-2 text-xs font-black",
                  index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {index < currentStep ? <Check className="size-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-bold",
                  index === currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mt-4 h-px flex-1",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}