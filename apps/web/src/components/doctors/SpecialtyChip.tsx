"use client";

import { cn } from "@/lib/utils";

export interface SpecialtyChipProps {
  label: string;
  variant?: "default" | "primary" | "secondary" | "tertiary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

// Specialty color mapping based on design.md Clinical Precision palette
const specialtyColors: Record<string, { bg: string; text: string; border: string }> = {
  Cardiology: { bg: "bg-[#dce8ff]", text: "text-primary", border: "border-primary/20" },
  Dermatology: { bg: "bg-[#e6f7ef]", text: "text-[#218765]", border: "border-[#bfe4d5]" },
  "Internal Medicine": { bg: "bg-[#fff3e7]", text: "text-[#b97932]", border: "border-[#f4d9b8]" },
  Pediatrics: { bg: "bg-[#f2ecff]", text: "text-[#8e68dc]", border: "border-[#e3dafb]" },
  Neurology: { bg: "bg-[#eef5ff]", text: "text-[#4f6ef7]", border: "border-[#dce8ff]" },
  Orthopedics: { bg: "bg-[#fff0eb]", text: "text-[#d97706]", border: "border-[#fcd6b8]" },
  Psychiatry: { bg: "bg-[#fdf2f8]", text: "text-[#db2777]", border: "border-[#fce7f3]" },
  Oncology: { bg: "bg-[#f8fafc]", text: "text-[#475569]", border: "border-[#e2e8f0]" },
  Gastroenterology: { bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", border: "border-[#dcfce7]" },
  Ophthalmology: { bg: "bg-[#eff6ff]", text: "text-[#2563eb]", border: "border-[#dbeafe]" },
  ENT: { bg: "bg-[#fefce8]", text: "text-[#ca8a04]", border: "border-[#fef08a]" },
  Urology: { bg: "bg-[#f5f0ff]", text: "text-[#7c3aed]", border: "border-[#ede9fe]" },
  default: { bg: "bg-secondary", text: "text-primary", border: "border-border" },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

const variantClasses = {
  default: "",
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-primary border-border",
  tertiary: "bg-[#fff3e7] text-[#b97932] border-[#f4d9b8]",
  destructive: "bg-[#fff2ef] text-[#b86f63] border-[#efd3ce]",
  outline: "bg-transparent border-border",
};

export function SpecialtyChip({
  label,
  variant = "default",
  size = "md",
  onClick,
  selected = false,
  className,
  icon,
}: SpecialtyChipProps) {
  const colors = specialtyColors[label] || specialtyColors.default;
  const isInteractive = typeof onClick === "function";

  const baseClasses = cn(
    "inline-flex items-center gap-1.5 rounded-full font-bold transition-all",
    "cursor-default select-none",
    sizeClasses[size],
    variantClasses[variant],
    selected && "ring-2 ring-primary ring-offset-2",
    isInteractive && "cursor-pointer hover:shadow-sm",
    className
  );

  const colorClasses = variant === "default" ? cn(colors.bg, colors.text, colors.border) : "";

  const Content = isInteractive ? "button" : "span";

  return (
    <Content
      type={isInteractive ? "button" : undefined}
      onClick={onClick}
      className={cn(baseClasses, colorClasses)}
      aria-pressed={selected}
      role={isInteractive ? "button" : undefined}
    >
      {icon}
      {label}
    </Content>
  );
}

export function SpecialtyChips({
  specialties,
  variant = "default",
  size = "md",
  onChange,
  selected = [],
  maxVisible = 4,
  className,
}: {
  specialties: string[];
  variant?: SpecialtyChipProps["variant"];
  size?: SpecialtyChipProps["size"];
  onChange?: (specialty: string) => void;
  selected?: string[];
  maxVisible?: number;
  className?: string;
}) {
  const visible = specialties.slice(0, maxVisible);
  const remaining = specialties.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((specialty) => (
        <SpecialtyChip
          key={specialty}
          label={specialty}
          variant={variant}
          size={size}
          selected={selected.includes(specialty)}
          onClick={() => onChange?.(specialty)}
        />
      ))}
      {remaining > 0 && (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-muted-foreground bg-secondary", sizeClasses[size])}>
          +{remaining} more
        </span>
      )}
    </div>
  );
}