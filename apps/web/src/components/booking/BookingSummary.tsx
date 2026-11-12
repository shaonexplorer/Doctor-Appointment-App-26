'use client';

import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, Stethoscope, User, CreditCard, Edit2 } from 'lucide-react';

export interface BookingSummaryProps {
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
    rating?: number;
  };
  slot: {
    date: Date;
    startTime: string;
    endTime: string;
  };
  fee: number;
  consultationType: 'IN_PERSON' | 'VIDEO' | 'PHONE';
  symptoms?: string;
  clinic: {
    name: string;
    address: string;
  };
  onEditSlot?: () => void;
  onEditSymptoms?: () => void;
  onEditConsultationType?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function BookingSummary({
  doctor,
  slot,
  fee,
  consultationType,
  symptoms,
  clinic,
  onEditSlot,
  onEditSymptoms,
  onEditConsultationType,
  children,
  className,
}: BookingSummaryProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const consultationTypeLabels = {
    IN_PERSON: 'In-person visit',
    VIDEO: 'Video consultation',
    PHONE: 'Phone consultation',
  };

  const consultationTypeIcons = {
    IN_PERSON: MapPin,
    VIDEO: Calendar, // Using Calendar as placeholder for video
    PHONE: Clock,
  };

  const ConsultationIcon = consultationTypeIcons[consultationType];

  const EditButton = ({
    onClick,
    label,
    ariaLabel,
  }: {
    onClick?: () => void;
    label: string;
    ariaLabel: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'text-primary flex items-center gap-1 text-xs font-medium hover:underline',
        !onClick && 'cursor-not-allowed opacity-50'
      )}
      aria-label={ariaLabel}
    >
      <Edit2 className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <div
      className={cn(
        'border-border bg-card hover:border-primary/30 rounded-2xl border p-5 shadow-sm transition',
        className
      )}
      role="region"
      aria-label="Booking summary"
    >
      <h3 className="font-bold">Booking Summary</h3>

      {/* Doctor Info */}
      <div className="border-border bg-background mt-4 flex items-start gap-3 rounded-xl border p-3">
        <div className="bg-primary/10 text-primary grid size-12 shrink-0 place-items-center rounded-xl">
          {doctor.avatar ? (
            <img src={doctor.avatar} alt="" className="size-full rounded-xl object-cover" />
          ) : (
            <User className="size-6" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-bold">{doctor.name}</p>
            {doctor.rating && (
              <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                {doctor.rating}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{doctor.specialty}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <Calendar className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Date
            </p>
            <p className="text-sm font-semibold">{formatDate(slot.date)}</p>
          </div>
        </div>

        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <Clock className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Time
            </p>
            <p className="text-sm font-semibold">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </p>
          </div>
        </div>

        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <MapPin className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Clinic
            </p>
            <p className="truncate text-sm font-semibold">{clinic.name}</p>
            <p className="text-muted-foreground truncate text-xs">{clinic.address}</p>
          </div>
        </div>

        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <ConsultationIcon className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Visit Type
            </p>
            <p className="text-sm font-semibold">{consultationTypeLabels[consultationType]}</p>
          </div>
        </div>

        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <Stethoscope className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Reason for Visit
            </p>
            <p className="truncate text-sm font-semibold">{symptoms || 'Not specified'}</p>
            {symptoms && onEditSymptoms && (
              <EditButton onClick={onEditSymptoms} label="Change" ariaLabel="Edit symptoms" />
            )}
          </div>
        </div>

        <div className="bg-secondary flex items-center gap-3 rounded-xl p-3">
          <CreditCard className="text-primary size-5" aria-hidden="true" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
              Consultation Fee
            </p>
            <p className="text-primary text-sm font-bold">${fee.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Edit Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {onEditSlot && (
          <EditButton onClick={onEditSlot} label="Change time slot" ariaLabel="Change time slot" />
        )}
        {onEditConsultationType && (
          <EditButton
            onClick={onEditConsultationType}
            label="Change visit type"
            ariaLabel="Change visit type"
          />
        )}
      </div>

      {/* Total */}
      <div className="border-border mt-4 rounded-xl border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-primary text-lg font-bold">${fee.toFixed(2)}</span>
        </div>
        <p className="text-muted-foreground mt-1 text-xs">
          Payment will be processed after the appointment
        </p>
      </div>

      {/* Children (e.g., reminders) */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
