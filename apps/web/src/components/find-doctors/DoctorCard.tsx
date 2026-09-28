'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, Check, Clock3, MapPin, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface DoctorCardData {
  id: string;
  name: string;
  initials: string;
  designation: string;
  specialties: string[];
  symptoms: string[];
  experience: string;
  qualifications: string;
  fee: string;
  clinic: string;
  next: string;
  availability: string;
  color: string;
}

export interface DoctorCardProps {
  doctor: DoctorCardData;
  list?: boolean;
  className?: string;
}

export function DoctorCard({ doctor, list = false, className }: DoctorCardProps) {
  const router = useRouter();
  return (
    <article
      className={cn(
        'border-border bg-card hover:border-primary/30 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
        list ? 'sm:flex sm:items-center sm:gap-5' : '',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-black',
            doctor.color
          )}
        >
          {doctor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-black">{doctor.name}</h3>
              <p className="text-primary mt-1 text-xs font-semibold">{doctor.designation}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#c28a31]">
              <Star className="size-3.5 fill-current" aria-hidden="true" />
              4.9
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((item) => (
              <span
                key={item}
                className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-border mt-4 grid gap-3 border-y py-4 text-xs sm:grid-cols-2">
        <Info icon={Clock3} label="Experience" value={doctor.experience} />
        <Info icon={Check} label="Qualifications" value={doctor.qualifications} />
        <Info icon={MapPin} label="Clinic" value={doctor.clinic} />
        <Info icon={CalendarDays} label="Next available" value={doctor.next} />
      </div>
      <p className="text-muted-foreground mt-2 mb-4 text-xs">
        <span className="text-foreground font-bold">Treats:</span>{' '}
        {doctor.symptoms.join(' &middot; ')}
      </p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Consultation fee
          </p>
          <p className="mt-1 text-lg font-black">
            {doctor.fee}{' '}
            <span className="text-muted-foreground text-[10px] font-semibold">/ visit</span>
          </p>
          <p
            className={cn(
              'mt-1 text-[10px] font-bold',
              doctor.availability === 'Available today' ? 'text-[#278e70]' : 'text-primary'
            )}
          >
            {doctor.availability}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/doctors/${doctor.id}`)}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2.5 text-xs font-bold"
          >
            View profile
          </button>
          <button
            onClick={() => router.push(`/doctors/${doctor.id}/book`)}
            className="bg-primary text-primary-foreground rounded-xl px-3 py-2.5 text-xs font-bold hover:opacity-90"
          >
            Book appointment
          </button>
        </div>
      </div>
    </article>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
          {label}
        </p>
        <p className="mt-1 truncate font-bold">{value}</p>
      </div>
    </div>
  );
}
