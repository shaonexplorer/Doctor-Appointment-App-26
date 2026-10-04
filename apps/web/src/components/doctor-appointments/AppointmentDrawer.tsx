'use client';

import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Check,
  Loader2,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Video,
  X,
  CreditCard,
  FileText,
} from 'lucide-react';
import type { AppointmentDrawerProps, DoctorAppointment } from './types';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getConsultationLabel(type: DoctorAppointment['consultationType']) {
  switch (type) {
    case 'IN_PERSON':
      return 'In-person visit';
    case 'VIDEO':
      return 'Video visit';
    case 'PHONE':
      return 'Phone consultation';
    default:
      return 'Visit';
  }
}

function getDefaultTimeline(status: DoctorAppointment['status']) {
  return [
    { event: 'Appointment requested', completed: true, current: false },
    { event: 'Payment status verified', completed: true, current: false },
    {
      event: status === 'Completed' ? 'Visit completed' : 'Appointment confirmed',
      completed: status === 'Completed',
      current: status !== 'Completed',
    },
  ];
}

function getStatusColors(status: DoctorAppointment['status']) {
  switch (status) {
    case 'Confirmed':
      return 'bg-primary/10 text-primary';
    case 'Checked in':
      return 'bg-primary/10 text-primary';
    case 'Completed':
      return 'bg-primary/10 text-primary';
    case 'Cancelled':
      return 'bg-[#fff2ef] text-[#b86f63]';
    case 'No-show':
      return 'bg-[#fff2ef] text-[#b86f63]';
    default:
      return 'bg-secondary text-muted-foreground';
  }
}

function getPaymentColors(payment: DoctorAppointment['payment']) {
  switch (payment) {
    case 'Paid':
      return 'bg-[#e6f7ef] text-[#278e70]';
    case 'Refunded':
      return 'bg-[#e6f7ef] text-[#278e70]';
    case 'Pending':
      return 'bg-[#fff3e7] text-[#b97932]';
    default:
      return 'bg-secondary text-muted-foreground';
  }
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="bg-secondary rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Icon className="text-primary size-4" aria-hidden="true" />
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {label}
        </p>
      </div>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border mt-7 border-t pt-5">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

export function AppointmentDrawer({
  isOpen,
  onClose,
  appointment,
  onStartConsultation,
  onReschedule,
  onCancel,
  isLoading,
  isCancelling,
  className,
}: AppointmentDrawerProps) {
  if (!isOpen || !appointment) return null;

  const consultationTypeIcons = {
    IN_PERSON: MapPin,
    VIDEO: Video,
    PHONE: Stethoscope,
  };

  const timeline = getDefaultTimeline(appointment.status);

  return (
    <div
      className="bg-foreground/20 fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Appointment details"
    >
      <aside
        className={cn(
          'border-border bg-card h-full w-full max-w-xl overflow-y-auto border-l p-6 shadow-2xl sm:p-8',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Appointment detail
            </p>
            <h2 className="mt-1 text-2xl font-black">{appointment.patient}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {appointment.specialty} &middot; {appointment.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:bg-secondary rounded-xl p-2"
            aria-label="Close drawer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <InfoCard
            icon={CalendarDays}
            label="Date & time"
            value={`${formatDate(appointment.date)} - ${appointment.time}`}
          />
          <InfoCard icon={MapPin} label="Clinic" value={appointment.clinic} />
          <InfoCard
            icon={consultationTypeIcons[appointment.consultationType] || Stethoscope}
            label="Visit type"
            value={getConsultationLabel(appointment.consultationType)}
          />
          <InfoCard
            icon={CalendarDays}
            label="Appointment status"
            value={
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-bold',
                  getStatusColors(appointment.status)
                )}
              >
                {appointment.status}
              </span>
            }
          />
          <InfoCard
            icon={ShieldCheck}
            label="Payment status"
            value={
              <span
                className={cn(
                  'rounded-full px-2 py-1 text-[10px] font-bold',
                  getPaymentColors(appointment.payment)
                )}
              >
                {appointment.payment}
              </span>
            }
          />
        </div>

        {/* Symptoms Section */}
        <Section title="Patient symptoms">
          <p className="text-muted-foreground text-sm leading-6">
            {appointment.symptoms || 'Not specified'}
          </p>
        </Section>

        {/* Patient Information */}
        <Section title="Patient information">
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoCard icon={CalendarDays} label="DOB" value="May 14, 1988" />
            <InfoCard icon={MapPin} label="Blood group" value="O+" />
            <InfoCard icon={Stethoscope} label="History" value="Hypertension" />
          </div>
        </Section>

        {/* Timeline */}
        <Section title="Appointment timeline">
          <div className="border-primary/20 grid gap-3 border-l-2 pl-4 text-xs">
            {timeline.map((item) => (
              <div key={item.event} className="flex items-center gap-3 text-sm">
                <div
                  className={cn(
                    'grid size-5 place-items-center rounded-full',
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : item.completed
                        ? 'bg-secondary text-primary'
                        : 'bg-secondary text-primary'
                  )}
                >
                  <Check className="size-2.5" aria-hidden="true" />
                </div>
                <span
                  className={cn('font-bold', item.current ? 'text-primary' : 'text-foreground')}
                >
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Payment & Prescription */}
        <Section title="Payment & Prescription">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={CreditCard}
              label="Payment status"
              value={appointment.payment || 'Not specified'}
            />
            <InfoCard icon={FileText} label="Prescription" value="Not issued" />
          </div>
        </Section>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onStartConsultation || (() => {})}
            disabled={
              isLoading ||
              appointment.status === 'Completed' ||
              appointment.status === 'Cancelled' ||
              appointment.status === 'No-show'
            }
            className={cn(
              'bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold',
              isLoading && 'cursor-not-allowed opacity-50',
              (appointment.status === 'Completed' ||
                appointment.status === 'Cancelled' ||
                appointment.status === 'No-show') &&
                'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-3.5 animate-spin" aria-hidden="true" />
                Loading...
              </>
            ) : appointment.status === 'Completed' ? (
              'Already completed'
            ) : appointment.status === 'Cancelled' ? (
              'Cancelled'
            ) : appointment.status === 'No-show' ? (
              'No-show'
            ) : (
              'Start consultation'
            )}
          </button>
          {onReschedule && (
            <button
              type="button"
              onClick={onReschedule}
              className="border-border rounded-xl border px-4 py-2.5 text-xs font-bold"
            >
              Reschedule
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCancelling || appointment.status === 'Cancelled'}
              className={cn(
                'rounded-xl border border-[#f0ccc5] px-4 py-2.5 text-xs font-bold text-[#bd7165]',
                (isCancelling || appointment.status === 'Cancelled') &&
                  'cursor-not-allowed opacity-50'
              )}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" aria-hidden="true" />
                  Cancelling...
                </>
              ) : appointment.status === 'Cancelled' ? (
                'Already cancelled'
              ) : (
                'Cancel'
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="border-border rounded-xl border px-4 py-2.5 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}
