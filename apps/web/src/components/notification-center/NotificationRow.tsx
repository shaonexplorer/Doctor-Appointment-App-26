"use client";

import { cn } from "@/lib/utils";
import { CalendarClock, Check, ChevronRight, CreditCard, FileText, ShieldCheck, Stethoscope, Trash2 } from "lucide-react";

export type NotificationCategory = "Appointment" | "Payment" | "Prescription" | "Schedule" | "System";

export interface Notification {
  id: number;
  category: NotificationCategory;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  related?: string;
}

export interface NotificationRowProps {
  item: Notification;
  onRead: () => void;
  onDelete: () => void;
  className?: string;
}

export function NotificationRow({ item, onRead, onDelete, className }: NotificationRowProps) {
  const Icon = item.category === "Appointment"
    ? CalendarClock
    : item.category === "Payment"
    ? CreditCard
    : item.category === "Prescription"
    ? FileText
    : item.category === "Schedule"
    ? Stethoscope
    : ShieldCheck;

  return (
    <article
      className={cn(
        "group flex gap-3 p-4 transition sm:gap-4 sm:p-5",
        item.unread ? "bg-[#f7faff]" : "bg-card",
        className
      )}
    >
      <div className={cn("mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl", item.unread ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold">{item.title}</h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{item.category}</span>
          {item.unread && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground">
          <span>{item.time}</span>
          {item.related && (
            <button onClick={onRead} className="inline-flex items-center gap-1 text-primary hover:underline">
              View related appointment <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-start gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
        <button
          onClick={onRead}
          aria-label={item.unread ? "Mark as read" : "Mark as unread"}
          title={item.unread ? "Mark as read" : "Mark as unread"}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary"
        >
          <Check className="size-4" aria-hidden="true" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete notification"
          title="Delete notification"
          className="rounded-lg p-2 text-muted-foreground hover:bg-[#fff0ef] hover:text-[#c9776d]"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}