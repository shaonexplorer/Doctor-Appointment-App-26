'use client';

import { cn } from '@/lib/utils';
import {
  CalendarClock,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from 'lucide-react';

export type NotificationCategory =
  'Appointment' | 'Payment' | 'Prescription' | 'Schedule' | 'System';

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
  const Icon =
    item.category === 'Appointment'
      ? CalendarClock
      : item.category === 'Payment'
        ? CreditCard
        : item.category === 'Prescription'
          ? FileText
          : item.category === 'Schedule'
            ? Stethoscope
            : ShieldCheck;

  return (
    <article
      className={cn(
        'group flex gap-3 p-4 transition sm:gap-4 sm:p-5',
        item.unread ? 'bg-[#0a3fa9]' : 'bg-card',
        className
      )}
    >
      <div
        className={cn(
          'mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl',
          item.unread ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold">{item.title}</h3>
          <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold">
            {item.category}
          </span>
          {item.unread && <span className="bg-primary size-2 rounded-full" aria-label="Unread" />}
        </div>
        <p className="text-muted-foreground mt-1 text-sm leading-6">{item.description}</p>
        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <span>{item.time}</span>
          {item.related && (
            <button
              onClick={onRead}
              className="text-primary inline-flex items-center gap-1 hover:underline"
            >
              View related appointment <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-start gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
        <button
          onClick={onRead}
          aria-label={item.unread ? 'Mark as read' : 'Mark as unread'}
          title={item.unread ? 'Mark as read' : 'Mark as unread'}
          className="text-muted-foreground hover:bg-secondary hover:text-primary rounded-lg p-2"
        >
          <Check className="size-4" aria-hidden="true" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete notification"
          title="Delete notification"
          className="text-muted-foreground rounded-lg p-2 hover:bg-[#fff0ef] hover:text-[#c9776d]"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
