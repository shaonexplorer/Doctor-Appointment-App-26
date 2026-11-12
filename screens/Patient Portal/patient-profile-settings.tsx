'use client';

import { useState } from 'react';
import { Check, Camera, LockKeyhole, Save, ShieldCheck } from 'lucide-react';

const inputClass =
  'h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';

export function PatientProfileSettings({ mode = 'profile' }: { mode?: 'profile' | 'settings' }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('sarah.johnson@example.com');
  const [phone, setPhone] = useState('+1 (415) 555-0198');
  const [reminders, setReminders] = useState(true);
  const [prescriptions, setPrescriptions] = useState(true);
  const [cancellations, setCancellations] = useState(true);

  const save = () => {
    setSaving(true);
    setSaved(false);
    window.setTimeout(() => {
      setSaving(false);
      setEditing(false);
      setSaved(true);
    }, 650);
  };
  const field = (
    label: string,
    value: string,
    onChange?: (value: string) => void,
    type = 'text'
  ) => (
    <label className="text-foreground grid gap-2 text-xs font-bold">
      <span>{label}</span>
      <input
        disabled={!editing}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${inputClass} disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed`}
      />
    </label>
  );
  const toggle = (
    label: string,
    description: string,
    value: boolean,
    onChange: (value: boolean) => void
  ) => (
    <div className="border-border flex items-center justify-between gap-4 rounded-xl border p-4">
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => editing && onChange(!value)}
        aria-pressed={value}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? 'bg-primary' : 'bg-muted'}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow transition ${value ? 'left-6' : 'left-1'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-black">{mode === 'profile' ? 'My profile' : 'Settings'}</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            {mode === 'profile'
              ? 'Keep your personal and medical information up to date.'
              : 'Control your account, notifications, and privacy preferences.'}
          </p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <span className="flex items-center gap-1 rounded-xl bg-[#e9f8f3] px-3 py-2 text-xs font-bold text-[#218765]">
              <Check className="size-4" /> Saved
            </span>
          )}
          <button
            onClick={() => (editing ? save() : setEditing(true))}
            className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black hover:opacity-90"
            disabled={saving}
          >
            {saving ? (
              'Saving...'
            ) : editing ? (
              <>
                <Save className="size-4" /> Save changes
              </>
            ) : (
              'Edit profile'
            )}
          </button>
        </div>
      </div>
      {mode === 'profile' ? (
        <>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="text-primary relative grid size-20 shrink-0 place-items-center rounded-2xl bg-[#d9e8ff] text-xl font-black">
                SJ
                {editing && (
                  <button
                    aria-label="Change avatar"
                    className="border-card bg-primary text-primary-foreground absolute -right-2 -bottom-2 grid size-8 place-items-center rounded-full border-2"
                  >
                    <Camera className="size-4" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="font-black">Sarah Johnson</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  Patient account · Member since January 2024
                </p>
                <p className="text-primary mt-3 text-xs font-bold">
                  {editing
                    ? 'Choose a clear photo for your care team'
                    : 'Your profile is visible to doctors you book with'}
                </p>
              </div>
            </div>
          </section>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h3 className="font-black">Personal information</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field('Full name', 'Sarah Johnson')}
              {field('Email', email, setEmail, 'email')}
              {field('Phone', phone, setPhone, 'tel')}
              {field('Date of birth', 'June 14, 1992')}
              {field('Blood group', 'O+')}
              {field('Emergency contact', 'David Johnson · +1 (415) 555-0172')}
            </div>
            <label className="mt-4 grid gap-2 text-xs font-bold">
              Medical history summary
              <textarea
                disabled={!editing}
                defaultValue="Seasonal allergies. No major surgeries or hospitalizations."
                className="border-border bg-background focus:border-primary disabled:bg-secondary min-h-24 rounded-xl border p-3 text-sm outline-none"
              />
            </label>
          </section>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black">Medical information</h3>
                <p className="text-muted-foreground mt-1 text-xs">
                  This information helps your care team prepare for visits.
                </p>
              </div>
              <ShieldCheck className="text-primary size-5" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field('Blood group', 'O+')}
              {field('Allergies', 'Penicillin, pollen')}
              {field('Existing conditions', 'Seasonal allergies')}
              {field('Current medications', 'Cetirizine 10 mg as needed')}
              {field('Emergency contact', 'David Johnson · +1 (415) 555-0172')}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h3 className="font-black">Account</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field('Email', email, setEmail, 'email')}
              {field('Phone', phone, setPhone, 'tel')}
              <button className="border-border hover:bg-secondary flex h-11 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold">
                <LockKeyhole className="text-primary size-4" /> Change password
              </button>
            </div>
          </section>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h3 className="font-black">Notifications</h3>
            <div className="mt-5 grid gap-3">
              {toggle(
                'Appointment reminders',
                'Get notified before upcoming visits.',
                reminders,
                setReminders
              )}
              {toggle(
                'Prescription notifications',
                'Know when a prescription is ready to view.',
                prescriptions,
                setPrescriptions
              )}
              {toggle(
                'Cancellation notifications',
                'Stay informed about appointment changes.',
                cancellations,
                setCancellations
              )}
              {toggle('Email notifications', 'Receive important updates by email.', true, () => {})}
              {toggle(
                'SMS notifications',
                'Receive reminders and updates by text.',
                false,
                () => {}
              )}
            </div>
          </section>
          <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
            <h3 className="font-black">Privacy</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {field('Data visibility', 'Doctors you book with')}
              {field('Session management', '2 active sessions')}
            </div>
            <div className="bg-secondary text-muted-foreground mt-4 rounded-xl p-4 text-xs">
              MediBook uses encryption and role-based access to keep your health information
              protected.
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default PatientProfileSettings;
