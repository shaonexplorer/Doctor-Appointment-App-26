'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  Globe2,
  LockKeyhole,
  Save,
  Settings2,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: LockKeyhole },
  { id: 'workspace', label: 'Workspace', icon: Settings2 },
] as const;

export function StaffSettings() {
  const [section, setSection] = useState<(typeof sections)[number]['id']>('profile');
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [density, setDensity] = useState('comfortable');

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="border-border bg-card rounded-2xl border p-3 shadow-sm">
        <p className="text-muted-foreground px-3 py-2 text-[10px] font-black tracking-[0.16em] uppercase">
          Staff settings
        </p>
        <nav className="mt-1 grid gap-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`mobile-touch-target flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${
                section === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border border-b p-5 sm:p-6">
          <p className="text-primary text-xs font-black tracking-[0.16em] uppercase">
            Configuration
          </p>
          <h2 className="mt-1 text-xl font-black">
            {sections.find((item) => item.id === section)?.label} settings
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your front-desk preferences without changing clinic-wide policies.
          </p>
        </div>
        <div className="space-y-6 p-5 sm:p-6">
          {section === 'profile' && (
            <>
              <Field label="Full name" value="Jordan Davis" />
              <Field label="Role" value="Front Desk Coordinator" />
              <Field label="Work email" value="jordan.davis@medibook.com" />
              <Field label="Phone" value="+1 (555) 014-2088" />
            </>
          )}
          {section === 'notifications' && (
            <div className="space-y-3">
              <Toggle
                label="Appointment updates"
                description="Receive changes, cancellations, and reminders for today's queue."
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />
              <Toggle
                label="SMS notifications"
                description="Get urgent check-in and payment alerts by text message."
                checked={smsAlerts}
                onChange={setSmsAlerts}
              />
              <Toggle
                label="Daily operations summary"
                description="Receive a morning summary of appointments and pending payments."
                checked={true}
                onChange={() => undefined}
              />
            </div>
          )}
          {section === 'security' && (
            <div className="space-y-3">
              <Toggle
                label="Two-factor authentication"
                description="Require an extra verification step when signing in from a new device."
                checked={twoFactor}
                onChange={setTwoFactor}
              />
              <div className="border-border bg-secondary/40 rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-[#258c70]" />
                  <div>
                    <p className="text-sm font-bold">Account protected</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Last security review completed today at 08:42 AM.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start">
                Change password
              </Button>
            </div>
          )}
          {section === 'workspace' && (
            <>
              <div className="flex flex-col">
                <label className="text-muted-foreground text-xs font-bold" htmlFor="density">
                  Workspace density
                </label>
                <select
                  id="density"
                  value={density}
                  onChange={(event) => setDensity(event.target.value)}
                  className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none sm:max-w-xs"
                >
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </div>
              <div className="border-border bg-secondary/40 rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <Globe2 className="text-primary mt-0.5 size-5" />
                  <div>
                    <p className="text-sm font-bold">Clinic timezone</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Eastern Time (America/New_York)
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center">
            <Button onClick={save}>
              <Save className="size-4" />
              Save changes
            </Button>
            {saved && (
              <p
                role="status"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#258c70]"
              >
                <Check className="size-4" />
                Settings saved successfully
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col">
      <span className="text-muted-foreground text-xs font-bold">{label}</span>
      <input
        defaultValue={value}
        className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none sm:max-w-xl"
      />
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="border-border flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4">
      <span>
        <span className="block text-sm font-bold">{label}</span>
        <span className="text-muted-foreground mt-1 block text-xs">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-primary' : 'bg-secondary'
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </label>
  );
}
