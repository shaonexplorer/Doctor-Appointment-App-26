"use client";

import { cn } from "@/lib/utils";
import { Mail, Settings2 } from "lucide-react";

export type PreferenceItem = [string, string];

export const defaultPreferences: PreferenceItem[] = [
  ["Appointment updates", "Bookings, reschedules, cancellations, and reminders"],
  ["Payment updates", "Payment received, pending, and refund notifications"],
  ["Prescription updates", "New prescriptions and medication changes"],
  ["Schedule changes", "Doctor availability and clinic schedule updates"],
  ["System notifications", "Security, account, and platform announcements"],
] as const;

export interface PreferencesProps {
  channels: Record<string, boolean>;
  setChannels: (value: Record<string, boolean>) => void;
  saved: boolean;
  onSave: () => void;
  preferences?: PreferenceItem[];
  className?: string;
}

export function Preferences({ channels, setChannels, saved, onSave, preferences = defaultPreferences, className }: PreferencesProps) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-[1.4fr_1fr]", className)}>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold">Notification types</h2>
            <p className="mt-1 text-xs text-muted-foreground">Choose which updates you want to receive.</p>
          </div>
          <Settings2 className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="mt-5 divide-y divide-border">
          {preferences.map(([title, detail]) => (
            <label key={title} className="flex items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-sm font-bold">{title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
              </span>
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
            </label>
          ))}
        </div>
      </div>
      <div className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold">Delivery channels</h2>
            <p className="mt-1 text-xs text-muted-foreground">Control where alerts arrive.</p>
          </div>
          <Mail className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="mt-5 space-y-3">
          {(["email", "push", "sms"] as const).map((key) => {
            const labels = { email: "Email notifications", push: "Push notifications", sms: "SMS notifications" };
            return (
              <label key={key} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm font-semibold">
                <span>{labels[key]}</span>
                <input
                  type="checkbox"
                  checked={channels[key]}
                  onChange={(event) => setChannels({ ...channels, [key]: event.target.checked })}
                  className="size-4 accent-primary"
                />
              </label>
            );
          })}
        </div>
        <button onClick={onSave} className="mt-5 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90">
          {saved ? "Preferences saved" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}