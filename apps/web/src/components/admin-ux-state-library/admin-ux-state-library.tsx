'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, LockKeyhole, RefreshCw, Trash2, WifiOff } from 'lucide-react';

const workflows = [
  'Booking',
  'Cancellation',
  'Schedule',
  'Prescription',
  'Authentication',
  'Tables',
] as const;
const states = [
  'Loading',
  'Skeleton',
  'Empty',
  'Error',
  'Permission denied',
  'Success',
  'Confirmation',
  'Destructive action',
  'Form validation',
  'Network failure',
] as const;

type Workflow = (typeof workflows)[number];
type State = (typeof states)[number];

const copy: Record<Workflow, Record<State, { title: string; body: string; action?: string }>> = {
  Booking: {
    Loading: {
      title: 'Securing your appointment',
      body: 'We are checking the slot and confirming availability.',
      action: 'Cancel request',
    },
    Skeleton: {
      title: 'Loading available appointments',
      body: 'Doctor details and time slots are on their way.',
    },
    Empty: {
      title: 'No appointments available',
      body: 'Try another date or choose a nearby clinic.',
      action: 'Change date',
    },
    Error: {
      title: 'This slot is unavailable',
      body: 'Someone else booked it moments ago. Choose another time.',
      action: 'View available slots',
    },
    'Permission denied': {
      title: 'Booking access required',
      body: 'Your account cannot book appointments yet. Contact your clinic administrator.',
      action: 'Contact support',
    },
    Success: {
      title: 'Appointment booked',
      body: 'Your confirmation and calendar invite are ready.',
      action: 'View appointment',
    },
    Confirmation: {
      title: 'Confirm appointment',
      body: 'Dr. Michael Anderson · Thu, Sep 24 · 10:30 AM · $85',
      action: 'Confirm booking',
    },
    'Destructive action': {
      title: 'Cancel this appointment?',
      body: 'Cancellation is allowed until Sep 23 at 10:30 AM. Refunds may take 3–5 business days.',
      action: 'Cancel appointment',
    },
    'Form validation': {
      title: 'Check your booking details',
      body: 'Select a date and time before continuing. Symptoms can be added later.',
      action: 'Review fields',
    },
    'Network failure': {
      title: 'We could not reach the booking service',
      body: 'Your slot was not changed. Check your connection and try again.',
      action: 'Retry',
    },
  },
  Cancellation: {
    Loading: {
      title: 'Checking cancellation policy',
      body: 'We are calculating eligibility and refund details.',
    },
    Skeleton: {
      title: 'Loading appointment details',
      body: 'Cancellation policy and payment information are loading.',
    },
    Empty: {
      title: 'No cancellable appointments',
      body: 'There are no upcoming appointments eligible for cancellation.',
    },
    Error: {
      title: 'Cancellation deadline passed',
      body: 'This appointment can no longer be cancelled online. Contact the clinic for help.',
      action: 'Contact clinic',
    },
    'Permission denied': {
      title: 'Cancellation unavailable',
      body: 'Only the patient or clinic staff can cancel this appointment.',
    },
    Success: {
      title: 'Appointment cancelled',
      body: 'The patient and doctor have been notified.',
      action: 'View appointments',
    },
    Confirmation: {
      title: 'Confirm cancellation',
      body: 'This will notify the care team and release the appointment slot.',
      action: 'Keep appointment',
    },
    'Destructive action': {
      title: 'Cancel and request refund?',
      body: 'Refund pending · $85 will be returned to the original payment method.',
      action: 'Confirm cancellation',
    },
    'Form validation': {
      title: 'Select a cancellation reason',
      body: 'A reason helps the clinic improve availability.',
      action: 'Choose reason',
    },
    'Network failure': {
      title: 'Cancellation not completed',
      body: 'We could not update the appointment. Nothing has changed.',
      action: 'Retry cancellation',
    },
  },
  Schedule: {
    Loading: { title: 'Updating schedule', body: 'We are validating your availability.' },
    Skeleton: { title: 'Loading weekly schedule', body: 'Availability and bookings are loading.' },
    Empty: {
      title: 'No availability generated',
      body: 'Create recurring slots to start accepting appointments.',
      action: 'Generate slots',
    },
    Error: {
      title: 'Schedule conflict detected',
      body: 'One or more slots overlap an existing appointment.',
      action: 'Review conflicts',
    },
    'Permission denied': {
      title: 'Schedule editing is restricted',
      body: 'You need schedule-management permission to edit availability.',
    },
    Success: {
      title: '12 slots generated',
      body: 'New availability is ready and conflict-free.',
      action: 'View schedule',
    },
    Confirmation: {
      title: 'Generate recurring slots?',
      body: 'Mon–Fri · 7:00 PM–9:00 PM · 20 minute appointments',
      action: 'Generate slots',
    },
    'Destructive action': {
      title: 'Delete selected slots?',
      body: 'Booked appointments will not be deleted. Available slots will be removed.',
      action: 'Delete slots',
    },
    'Form validation': {
      title: 'Complete schedule settings',
      body: 'End time must be after start time and at least one weekday is required.',
    },
    'Network failure': {
      title: 'Schedule could not be saved',
      body: 'Your previous schedule is still active.',
      action: 'Retry',
    },
  },
  Prescription: {
    Loading: {
      title: 'Issuing prescription',
      body: 'Securely signing and sending the prescription.',
    },
    Skeleton: {
      title: 'Loading prescription',
      body: 'Patient details and medication history are loading.',
    },
    Empty: { title: 'No prescription items', body: 'Add at least one medication before issuing.' },
    Error: {
      title: 'Prescription could not be issued',
      body: 'The pharmacy service returned an error. Your draft is safe.',
      action: 'Try again',
    },
    'Permission denied': {
      title: 'Prescription signing unavailable',
      body: 'Only licensed clinicians can issue prescriptions.',
    },
    Success: {
      title: 'Prescription issued',
      body: 'The patient has been notified and the signed copy is ready.',
      action: 'View prescription',
    },
    Confirmation: {
      title: 'Issue this prescription?',
      body: 'This will electronically sign and send the prescription to the patient.',
      action: 'Issue prescription',
    },
    'Destructive action': {
      title: 'Discard prescription draft?',
      body: 'This action cannot be undone.',
      action: 'Discard draft',
    },
    'Form validation': {
      title: 'Complete medication details',
      body: 'Add dosage, frequency, and duration for every medication.',
    },
    'Network failure': {
      title: 'PDF generation failed',
      body: 'The prescription was issued, but the PDF could not be generated.',
      action: 'Retry PDF',
    },
  },
  Authentication: {
    Loading: { title: 'Signing you in', body: 'Verifying your credentials securely.' },
    Skeleton: { title: 'Loading account', body: 'Preparing your secure workspace.' },
    Empty: { title: 'No account found', body: 'Create an account or check the email address.' },
    Error: {
      title: 'Invalid credentials',
      body: 'Email or password is incorrect. You have 4 attempts remaining.',
      action: 'Try again',
    },
    'Permission denied': {
      title: 'Account locked',
      body: 'Too many failed attempts. Try again in 15 minutes or reset your password.',
      action: 'Reset password',
    },
    Success: {
      title: 'Email verified',
      body: 'Your account is ready. Welcome to MediBook.',
      action: 'Continue',
    },
    Confirmation: {
      title: 'Reset your password?',
      body: 'We will email a secure password-reset link.',
      action: 'Send reset link',
    },
    'Destructive action': {
      title: 'Sign out all devices?',
      body: 'You will need to sign in again on every device.',
      action: 'Sign out devices',
    },
    'Form validation': {
      title: 'Check your sign-in details',
      body: 'Enter a valid email address and a password with at least 8 characters.',
    },
    'Network failure': {
      title: 'Sign-in service unavailable',
      body: 'Check your connection. Your account has not been changed.',
      action: 'Retry',
    },
  },
  Tables: {
    Loading: { title: 'Loading records', body: 'Fetching the latest results.' },
    Skeleton: { title: 'Preparing table', body: 'Columns, filters, and pagination are loading.' },
    Empty: {
      title: 'No records yet',
      body: 'New records will appear here when they are created.',
      action: 'Create record',
    },
    Error: {
      title: 'Could not load records',
      body: 'The server returned an error while loading this table.',
      action: 'Retry',
    },
    'Permission denied': {
      title: 'Access restricted',
      body: 'You do not have permission to view these records.',
    },
    Success: { title: 'Changes saved', body: 'The table is up to date.' },
    Confirmation: {
      title: 'Apply bulk action?',
      body: 'This will update the selected records.',
      action: 'Apply changes',
    },
    'Destructive action': {
      title: 'Delete selected records?',
      body: 'Deleted records cannot be recovered.',
      action: 'Delete records',
    },
    'Form validation': {
      title: 'Select at least one record',
      body: 'Choose records before applying a bulk action.',
    },
    'Network failure': {
      title: 'Connection lost',
      body: 'Your filters are preserved. Reconnect to continue.',
      action: 'Reconnect',
    },
  },
};

export function AdminUXStateLibrary() {
  const [workflow, setWorkflow] = useState<Workflow>('Booking');
  const [state, setState] = useState<State>('Success');
  const [notice, setNotice] = useState('');
  const item = copy[workflow][state];
  const tone =
    state === 'Success'
      ? 'border-[#c9ead8] bg-[#f1fbf5] text-[#217a4d]'
      : state === 'Error' || state === 'Network failure' || state === 'Destructive action'
        ? 'border-[#f0d2cc] bg-[#fff8f6] text-[#b86f63]'
        : state === 'Loading' || state === 'Skeleton'
          ? 'border-primary/20 bg-primary/5 text-primary'
          : 'border-[#ead9aa] bg-[#fffaf0] text-[#9d7830]';
  return (
    <section className="mt-8 space-y-5">
      <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-primary text-xs font-black tracking-wider uppercase">
              Design system audit
            </p>
            <h2 className="mt-1 text-xl font-black">UX State Library</h2>
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
              Production-ready states for every critical workflow, shared across all MediBook roles.
            </p>
          </div>
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-black">
            60 states covered
          </span>
        </div>
        <div className="mobile-scroll-x mt-6 flex gap-2 overflow-x-auto pb-1">
          {workflows.map((item) => (
            <button
              key={item}
              onClick={() => setWorkflow(item)}
              className={`mobile-touch-target shrink-0 rounded-xl px-4 py-2 text-xs font-black ${workflow === item ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="border-border bg-card rounded-2xl border p-4">
          <p className="text-muted-foreground px-2 text-xs font-black tracking-wider uppercase">
            States
          </p>
          <div className="mt-3 grid gap-1">
            {states.map((item) => (
              <button
                key={item}
                onClick={() => setState(item)}
                className={`mobile-touch-target flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-bold ${state === item ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
              >
                {item}
                <span className="text-[10px] opacity-50">10.{states.indexOf(item) + 1}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-border bg-card rounded-2xl border p-5 sm:p-7">
          <div className={`rounded-2xl border p-5 sm:p-7 ${tone}`} role="status">
            <div className="flex items-start gap-4">
              {state === 'Success' ? (
                <CheckCircle2 className="mt-0.5 size-6 shrink-0" />
              ) : state === 'Permission denied' ? (
                <LockKeyhole className="mt-0.5 size-6 shrink-0" />
              ) : state === 'Network failure' ? (
                <WifiOff className="mt-0.5 size-6 shrink-0" />
              ) : state === 'Loading' || state === 'Skeleton' ? (
                <RefreshCw className="mt-0.5 size-6 shrink-0 animate-spin" />
              ) : state === 'Destructive action' ? (
                <Trash2 className="mt-0.5 size-6 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 size-6 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black tracking-widest uppercase opacity-70">
                  {workflow} · {state}
                </p>
                <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 opacity-80">{item.body}</p>
                {item.action && (
                  <button
                    onClick={() => setNotice(`${item.action} action acknowledged.`)}
                    className="mt-5 rounded-xl bg-current/10 px-4 py-2.5 text-xs font-black hover:bg-current/20"
                  >
                    {item.action}
                  </button>
                )}
              </div>
            </div>
          </div>
          {notice && (
            <div
              role="status"
              className="border-primary/20 bg-primary/5 text-primary mt-4 rounded-xl border px-4 py-3 text-sm font-bold"
            >
              {notice}
            </div>
          )}
          <div className="text-muted-foreground mt-5 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="bg-secondary rounded-full px-3 py-1.5">Keyboard accessible</span>
            <span className="bg-secondary rounded-full px-3 py-1.5">Screen-reader labeled</span>
            <span className="bg-secondary rounded-full px-3 py-1.5">Touch optimized</span>
          </div>
        </div>
      </div>
    </section>
  );
}
