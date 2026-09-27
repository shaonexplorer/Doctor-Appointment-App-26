"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, Info, Loader2 } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
}

const variantConfig = {
  success: {
    icon: Check,
    iconBg: "bg-green-100 text-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
    titleColor: "text-green-800",
  },
  error: {
    icon: X,
    iconBg: "bg-red-100 text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    titleColor: "text-red-800",
  },
  warning: {
    icon: AlertCircle,
    iconBg: "bg-amber-100 text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
    titleColor: "text-amber-800",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100 text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    titleColor: "text-blue-800",
  },
  loading: {
    icon: Loader2,
    iconBg: "bg-primary/10 text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5",
    titleColor: "text-primary",
  },
};

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function ToastNotification({
  isOpen,
  onClose,
  variant,
  title,
  description,
  action,
  duration = 5000,
  position = "top-right",
  className,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsExiting(false);

      if (variant !== "loading" && duration > 0) {
        const timer = setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose();
          }, 200);
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 200);
    }
  }, [isOpen, variant, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-[70] flex max-w-sm w-full items-start gap-3 rounded-xl border shadow-lg animate-in slide-in-from-top-2 duration-200",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-2",
        positionClasses[position],
        config.border,
        config.bg,
        className
      )}
      data-state={isExiting ? "closed" : "open"}
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className={cn("shrink-0 grid size-9 place-items-center rounded-lg", config.iconBg)}>
        {variant === "loading" ? (
          <Icon className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <Icon className="size-5" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold", config.titleColor)}>{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 text-xs font-semibold underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose();
          }, 200);
        }}
        className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/* Toast Provider for managing multiple toasts */
import { createContext, useContext, useCallback, ReactNode } from "react";

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...options, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            isOpen={true}
            onClose={() => dismiss(toast.id)}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            action={toast.action}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}