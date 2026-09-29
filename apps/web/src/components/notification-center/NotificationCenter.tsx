'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { NotificationRow, type Notification, type NotificationCategory } from './NotificationRow';
import { Preferences } from './Preferences';

export interface NotificationCenterProps {
  role?: 'patient' | 'doctor' | 'staff' | 'admin';
  initialNotifications?: Notification[];
  className?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    category: 'Appointment',
    title: 'Appointment booked',
    description: 'Sarah Johnson booked a cardiology follow-up for Sep 24 at 10:30 AM.',
    time: '8 min ago',
    unread: true,
    related: 'APT-2026-004821',
  },
  {
    id: 2,
    category: 'Appointment',
    title: 'Appointment reminder',
    description: 'Your appointment with Dr. Michael Chen starts tomorrow at 10:30 AM.',
    time: '1 hour ago',
    unread: true,
    related: 'APT-2026-004821',
  },
  {
    id: 3,
    category: 'Payment',
    title: 'Payment received',
    description: 'Payment of $120.00 was received for appointment APT-2026-004821.',
    time: '3 hours ago',
    unread: true,
  },
  {
    id: 4,
    category: 'Prescription',
    title: 'Prescription issued',
    description: 'Dr. Michael Anderson issued a new prescription for Sarah Johnson.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 5,
    category: 'Schedule',
    title: 'Doctor schedule changed',
    description: 'Dr. Emily Carter opened new appointment slots for Friday, Sep 25.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    category: 'Appointment',
    title: 'Appointment rescheduled',
    description: 'Robert Williams moved his appointment from Sep 22 to Sep 23 at 2:00 PM.',
    time: 'Sep 19',
    unread: false,
    related: 'APT-2026-004790',
  },
  {
    id: 7,
    category: 'Appointment',
    title: 'Appointment cancelled',
    description: 'Appointment APT-2026-004744 was cancelled and the patient was notified.',
    time: 'Sep 18',
    unread: false,
    related: 'APT-2026-004744',
  },
  {
    id: 8,
    category: 'System',
    title: 'System notification',
    description: 'MediBook security settings were updated successfully.',
    time: 'Sep 17',
    unread: false,
  },
];

export function NotificationCenter({
  role = 'patient',
  initialNotifications: customNotifications,
  className,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(customNotifications || initialNotifications);
  const [filter, setFilter] = useState<'All' | NotificationCategory>('All');
  const [tab, setTab] = useState<'Notifications' | 'Preferences'>('Notifications');
  const [channels, setChannels] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false,
  });
  const [saved, setSaved] = useState(false);

  const visible = useMemo(
    () =>
      filter === 'All' ? notifications : notifications.filter((item) => item.category === filter),
    [filter, notifications]
  );
  const unread = notifications.filter((item) => item.unread).length;

  const markRead = (id: number) =>
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  const markAll = () =>
    setNotifications((items) => items.map((item) => ({ ...item, unread: false })));
  const remove = (id: number) =>
    setNotifications((items) => items.filter((item) => item.id !== id));

  return (
    <section className={cn('mt-8 max-w-5xl space-y-5', className)}>
      <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-11 place-items-center rounded-xl bg-[#edf3ff]">
              <Bell className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-bold">Notification center</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Stay on top of activity across your {role} account.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#fff3e7] px-3 py-1.5 text-xs font-bold text-[#c98237]">
            {unread} unread
          </span>
          <button
            onClick={markAll}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2 text-xs font-bold"
          >
            Mark all as read
          </button>
        </div>
      </div>
      <div className="border-border bg-card flex gap-1 rounded-xl border p-1">
        <button
          onClick={() => setTab('Notifications')}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-bold',
            tab === 'Notifications'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          )}
        >
          Notifications
        </button>
        <button
          onClick={() => setTab('Preferences')}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-bold',
            tab === 'Preferences'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          )}
        >
          Notification preferences
        </button>
      </div>
      {tab === 'Notifications' ? (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['All', 'Appointment', 'Payment', 'Prescription', 'Schedule', 'System'] as const).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-bold whitespace-nowrap',
                    filter === item
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {item}
                </button>
              )
            )}
          </div>
          <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
            <div className="divide-border divide-y">
              {visible.length ? (
                visible.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onRead={() => markRead(item.id)}
                    onDelete={() => remove(item.id)}
                  />
                ))
              ) : (
                <div className="p-12 text-center">
                  <Bell className="text-muted-foreground/50 mx-auto size-8" aria-hidden="true" />
                  <p className="mt-3 font-bold">No notifications here</p>
                  <p className="text-muted-foreground mt-1 text-sm">You&apos;re all caught up.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <Preferences
          channels={channels}
          setChannels={setChannels}
          saved={saved}
          onSave={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2200);
          }}
        />
      )}
    </section>
  );
}
