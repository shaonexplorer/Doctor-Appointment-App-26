'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AppointmentReview, AppointmentSummary, GenUIBlock } from '@/types/agent.types';

interface GenUIRendererProps {
  blocks: GenUIBlock[];
  onSelectDoctor: (doctor: string) => void;
  onSelectSlot: (doctor: string, time: string) => void;
  onConfirmBooking: (block: Extract<GenUIBlock, { type: 'appointment_review' }>) => void;
  onConfirmCancellation: (appointment: AppointmentSummary) => void;
  onDismissAction: () => void;
}

export function GenUIRenderer({
  blocks,
  onSelectDoctor,
  onSelectSlot,
  onConfirmBooking,
  onConfirmCancellation,
  onDismissAction,
}: GenUIRendererProps) {
  return (
    <div className="mt-3 flex w-full flex-col gap-3">
      {blocks.map((block, index) => (
        <div key={`${block.type}-${index}`}>
          {block.type === 'doctor_results' && (
            <section className="border-border bg-card rounded-2xl border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Doctors to explore</h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Demo directory · verify details with the clinic
                  </p>
                </div>
                <Stethoscope className="text-primary size-5" />
              </div>
              <div className="flex flex-col gap-2">
                {block.data.map((doctor) => (
                  <article key={doctor.id} className="border-border rounded-xl border p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-full text-xs font-black">
                        {doctor.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold">{doctor.name}</h4>
                        <p className="text-muted-foreground text-xs">
                          {doctor.specialty} · {doctor.qualifications}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {doctor.experience} · {doctor.clinic}
                        </p>
                        <p className="text-primary mt-1 text-xs font-semibold">
                          {doctor.fee} · {doctor.rating}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Next demo availability: {doctor.availability}
                        </p>
                        <Button
                          className="mt-3"
                          size="sm"
                          onClick={() => onSelectDoctor(doctor.name)}
                        >
                          View profile <ArrowRight data-icon="inline-end" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
          {block.type === 'doctor_profile' && (
            <article className="border-border bg-card rounded-2xl border p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-full text-sm font-black">
                  {block.data.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{block.data.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {block.data.specialty} · {block.data.qualifications}
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {block.data.experience} at {block.data.clinic}. Rated {block.data.rating}.
                  </p>
                  <p className="mt-2 text-sm font-bold">Consultation {block.data.fee}</p>
                  <p className="text-primary mt-1 text-xs">Available {block.data.availability}</p>
                </div>
              </div>
            </article>
          )}
          {block.type === 'appointment_slots' && (
            <section className="border-border bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-primary size-4" />
                <h3 className="font-bold">Available demo times</h3>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {block.data.doctor} · {block.data.date}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {block.data.slots.map((slot) => (
                  <Button
                    key={slot}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSlot(block.data.doctor, slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
              <p className="text-muted-foreground mt-3 text-[11px]">
                Illustrative availability only. Selecting a time prepares a review; it does not
                book.
              </p>
            </section>
          )}
          {block.type === 'appointment_review' && (
            <ReviewCard
              review={block.data}
              onConfirm={() => onConfirmBooking(block)}
              onCancel={onDismissAction}
            />
          )}
          {block.type === 'appointment_success' && (
            <section role="status" className="border-border bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-primary size-5" />
                <h3 className="font-bold">Demo confirmation</h3>
              </div>
              <p className="mt-2 text-sm">
                {block.data.doctor} · {block.data.date} at {block.data.time}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {block.data.clinic} · Reference {block.data.reference}
              </p>
              <p className="bg-secondary mt-3 rounded-lg px-3 py-2 text-xs font-semibold">
                {block.data.status}. No live booking was made.
              </p>
            </section>
          )}
          {block.type === 'appointment_list' && (
            <section className="border-border bg-card rounded-2xl border p-4">
              <h3 className="font-bold">Your demo appointments</h3>
              <div className="mt-3 flex flex-col gap-2">
                {block.data.map((appointment) => (
                  <AppointmentRow key={appointment.reference} appointment={appointment} />
                ))}
              </div>
            </section>
          )}
          {block.type === 'appointment_details' && <AppointmentRow appointment={block.data} />}
          {block.type === 'cancel_appointment' && (
            <CancelCard
              appointment={block.data}
              onConfirm={onConfirmCancellation}
              onDismiss={onDismissAction}
            />
          )}
          {block.type === 'healthcare_faq' && (
            <section className="border-border bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-primary size-4" />
                <h3 className="font-bold">{block.data.title}</h3>
              </div>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {block.data.answer}
              </p>
            </section>
          )}
          {block.type === 'human_support' && (
            <section className="border-border bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-primary size-4" />
                <h3 className="font-bold">Patient support</h3>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{block.data.message}</p>
              <p className="mt-2 text-sm font-semibold">{block.data.contact}</p>
            </section>
          )}
          {block.type === 'medical_safety_notice' && (
            <section
              role="alert"
              className="border-destructive/30 bg-destructive/5 rounded-2xl border p-4"
            >
              <div className="text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4" />
                <h3 className="font-bold">Emergency guidance</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{block.data.message}</p>
            </section>
          )}
        </div>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onConfirm,
  onCancel,
}: {
  review: AppointmentReview;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <section className="border-primary/20 bg-primary/[0.03] rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-primary size-4" />
        <h3 className="font-bold">Review before confirming</h3>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <ReviewItem label="Doctor" value={review.doctor} />
        <ReviewItem label="Specialty" value={review.specialty} />
        <ReviewItem label="Clinic" value={review.clinic} />
        <ReviewItem label="Date & time" value={`${review.date} · ${review.time}`} />
        <ReviewItem label="Visit type" value={review.visitType} />
        <ReviewItem label="Fee" value={review.fee} />
      </dl>
      {confirmed ? (
        <p
          role="status"
          className="text-primary mt-4 flex items-center gap-2 text-xs font-semibold"
        >
          <Check className="size-4" />
          Demo confirmation shown below.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              setConfirmed(true);
              onConfirm();
            }}
          >
            Confirm demo booking
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
      <p className="text-muted-foreground mt-3 text-[11px]">
        Demo only: this action does not create a real appointment.
      </p>
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-semibold break-words">{value}</dd>
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: AppointmentSummary }) {
  return (
    <article className="border-border bg-card rounded-xl border p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold">{appointment.doctor}</h4>
          <p className="text-muted-foreground mt-1 text-xs">
            {appointment.specialty} · {appointment.clinic}
          </p>
        </div>
        <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-1 text-[10px] font-bold">
          {appointment.status}
        </span>
      </div>
      <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          {appointment.date}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-3.5" />
          {appointment.time}
        </span>
      </div>
      <p className="text-muted-foreground mt-2 text-[10px]">Ref {appointment.reference}</p>
    </article>
  );
}

function CancelCard({
  appointment,
  onConfirm,
  onDismiss,
}: {
  appointment: AppointmentSummary;
  onConfirm: (appointment: AppointmentSummary) => void;
  onDismiss: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <section className="border-border bg-card rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-primary size-4" />
        <h3 className="font-bold">Cancel appointment?</h3>
      </div>
      <div className="mt-3">
        <AppointmentRow appointment={appointment} />
      </div>
      <p className="text-muted-foreground mt-3 text-xs">
        Cancellation policies depend on the clinic. This demonstration does not change a real
        appointment.
      </p>
      {confirmed ? (
        <div
          role="status"
          className="text-primary mt-3 flex items-center gap-2 text-xs font-semibold"
        >
          <Check className="size-4" />
          Demo cancellation acknowledged. No real appointment was changed.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setConfirmed(true);
              onConfirm(appointment);
            }}
          >
            Confirm demo cancellation
          </Button>
          <Button size="sm" variant="outline" onClick={onDismiss}>
            Keep appointment
          </Button>
        </div>
      )}
    </section>
  );
}
