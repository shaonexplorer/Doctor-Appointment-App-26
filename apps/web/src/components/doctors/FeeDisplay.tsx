"use client";

import { cn } from "@/lib/utils";

export interface FeeDisplayProps {
  amount: number;
  currency?: "USD" | "INR" | "EUR" | "GBP";
  consultationType?: "in_person" | "video" | "phone";
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  showPerVisit?: boolean;
  className?: string;
  isFree?: boolean;
  isInsuranceCovered?: boolean;
}

export function FeeDisplay({
  amount,
  currency = "USD",
  consultationType,
  size = "md",
  showLabel = true,
  label,
  showPerVisit = true,
  className,
  isFree = false,
  isInsuranceCovered = false,
}: FeeDisplayProps) {
  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formattedAmount = formatCurrency(amount, currency);

  const sizeClasses = {
    sm: { value: "text-lg", label: "text-[10px]", perVisit: "text-[10px]" },
    md: { value: "text-xl", label: "text-xs", perVisit: "text-xs" },
    lg: { value: "text-2xl", label: "text-sm", perVisit: "text-sm" },
    xl: { value: "text-3xl", label: "text-base", perVisit: "text-base" },
  };

  const consultationLabels = {
    in_person: "In-person",
    video: "Video visit",
    phone: "Phone call",
  };

  const consultationIcons = {
    in_person: "🏥",
    video: "💻",
    phone: "📞",
  };

  const sizes = sizeClasses[size];

  if (isFree) {
    return (
      <div className={cn("flex items-baseline gap-1", className)}>
        {showLabel && (
          <span className={cn(sizes.label, "font-bold uppercase tracking-wide text-muted-foreground")}>
            {label || "Consultation fee"}
          </span>
        )}
        <span className={cn(sizes.value, "font-black text-[#218765]")}>Free</span>
        {isInsuranceCovered && (
          <span className={cn(sizes.label, "font-bold text-[#218765]")}>Insurance covered</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {showLabel && (
        <span className={cn(sizes.label, "font-bold uppercase tracking-wide text-muted-foreground")}>
          {label || "Consultation fee"}
        </span>
      )}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className={cn(sizes.value, "font-black text-primary")}>{formattedAmount}</span>
        {showPerVisit && (
          <span className={cn(sizes.perVisit, "text-muted-foreground")}>per visit</span>
        )}
        {consultationType && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-secondary text-primary",
              sizes.perVisit
            )}
          >
            {consultationIcons[consultationType]}
            {consultationLabels[consultationType]}
          </span>
        )}
        {isInsuranceCovered && (
          <span className={cn(sizes.label, "font-bold text-[#218765]")}>
            Insurance accepted
          </span>
        )}
      </div>
    </div>
  );
}

export function FeeRangeDisplay({
  minAmount,
  maxAmount,
  currency = "USD",
  size = "md",
  className,
}: {
  minAmount: number;
  maxAmount: number;
  currency?: "USD" | "INR" | "EUR" | "GBP";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  if (minAmount === maxAmount) {
    return (
      <span className={cn("font-black text-primary", sizeClasses[size], className)}>
        {formatCurrency(minAmount, currency)}
      </span>
    );
  }

  return (
    <span className={cn("font-black text-primary", sizeClasses[size], className)}>
      {formatCurrency(minAmount, currency)} - {formatCurrency(maxAmount, currency)}
    </span>
  );
}