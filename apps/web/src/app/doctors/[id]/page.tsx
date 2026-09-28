'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import {
  DoctorHeader,
  AboutSection,
  ClinicInfoSection,
  ScheduleCalendar,
  Reviews,
} from '@/components/doctor-profile';
import { useDoctor, useDoctorSchedule, transformDoctorProfileToCardData } from '@/hooks/useDoctors';
import {
  Award,
  Check,
  Clock3,
  Languages,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Video,
  ChevronLeft,
} from 'lucide-react';

export default function DoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  const [notice, setNotice] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch doctor profile
  const {
    data: doctorData,
    isLoading: isDoctorLoading,
    isError: isDoctorError,
    error: doctorError,
  } = useDoctor(doctorId);

  // Fetch doctor schedule for the next 30 days
  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }, []);
  const { data: scheduleData, isLoading: isScheduleLoading } = useDoctorSchedule(
    doctorId,
    startDate,
    endDate
  );

  // Transform doctor data for components
  const doctor = useMemo(() => {
    if (!doctorData) return null;
    return transformDoctorProfileToCardData(doctorData);
  }, [doctorData]);

  // Transform schedule data for ScheduleCalendar
  const { dates, slots } = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return { dates: [], slots: {} };
    }

    // Group slots by date
    const slotsByDate = new Map<
      string,
      { morning: string[]; afternoon: string[]; evening: string[] }
    >();

    scheduleData
      .filter((slot) => slot.status === 'AVAILABLE')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .forEach((slot) => {
        const date = new Date(slot.startTime);
        const dateKey = date.toISOString().split('T')[0];
        const hour = date.getHours();

        if (!slotsByDate.has(dateKey)) {
          slotsByDate.set(dateKey, { morning: [], afternoon: [], evening: [] });
        }

        const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const daySlots = slotsByDate.get(dateKey)!;

        if (hour < 12) {
          daySlots.morning.push(timeStr);
        } else if (hour < 17) {
          daySlots.afternoon.push(timeStr);
        } else {
          daySlots.evening.push(timeStr);
        }
      });

    // Get unique dates (next 7 days with available slots)
    const sortedDates = Array.from(slotsByDate.keys()).sort().slice(0, 7);

    const today = new Date();
    const dateOptions = sortedDates.map((dateKey) => {
      const date = new Date(dateKey);
      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow =
        date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
      return {
        label: isToday
          ? 'Today'
          : isTomorrow
            ? 'Tomorrow'
            : date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        value: dateKey,
      };
    });

    // Build slots object for ScheduleCalendar
    const slotsObj: Record<string, Array<{ time: string }>> = {};
    const firstDate = sortedDates[0];
    if (firstDate && slotsByDate.has(firstDate)) {
      const daySlots = slotsByDate.get(firstDate)!;
      if (daySlots.morning.length > 0)
        slotsObj.Morning = daySlots.morning.map((time) => ({ time }));
      if (daySlots.afternoon.length > 0)
        slotsObj.Afternoon = daySlots.afternoon.map((time) => ({ time }));
      if (daySlots.evening.length > 0)
        slotsObj.Evening = daySlots.evening.map((time) => ({ time }));
    }

    return { dates: dateOptions, slots: slotsObj };
  }, [scheduleData]);

  // Auto-select first available date/time
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0].value);
      if (slots.Morning && slots.Morning.length > 0) {
        setSelectedTime(slots.Morning[0].time);
      } else if (slots.Afternoon && slots.Afternoon.length > 0) {
        setSelectedTime(slots.Afternoon[0].time);
      } else if (slots.Evening && slots.Evening.length > 0) {
        setSelectedTime(slots.Evening[0].time);
      }
    }
  }, [dates, slots, selectedDate]);

  // Handle date change - update slots for the new date
  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    setSelectedTime('');

    // Find slots for this date
    if (!scheduleData) return;

    const dateSlots = scheduleData
      .filter((slot) => slot.status === 'AVAILABLE' && slot.startTime.startsWith(dateValue))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    if (dateSlots.length > 0) {
      const firstSlot = dateSlots[0];
      setSelectedTime(
        new Date(firstSlot.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    }
  };

  // Handle book action
  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setNotice(`Appointment request started for ${selectedDate}, ${selectedTime}.`);
      // Navigate to booking flow
      router.push(`/doctors/${doctorId}/book`);
    } else {
      setNotice('Select an available time first.');
    }
  };

  // Handle back navigation
  const handleBack = () => router.back();

  // Transform data for AboutSection
  const aboutInfoItems = useMemo(
    () => [
      { icon: Award, label: 'Qualifications', value: doctor?.qualifications ?? '' },
      { icon: Stethoscope, label: 'Specialties', value: doctor?.specialties.join(' · ') ?? '' },
      { icon: Check, label: 'Common symptoms', value: doctor?.symptoms.join(' · ') ?? '' },
      { icon: Languages, label: 'Languages', value: 'English' }, // Could be extended from doctor profile
    ],
    [doctor]
  );

  // Transform data for ClinicInfoSection
  const clinicInfoItems = useMemo(
    () => [
      { icon: MapPin, label: 'Clinic', value: doctor?.clinic ?? '' },
      { icon: Clock3, label: 'Consultation duration', value: '30 minutes per visit' },
      {
        icon: ShieldCheck,
        label: 'Cancellation policy',
        value: 'Free cancellation up to 24 hours before',
      },
      { icon: Video, label: 'Visit options', value: 'In-clinic or secure video visit' },
    ],
    [doctor]
  );

  // Transform reviews (placeholder - would come from API)
  const reviews = useMemo(
    () => [
      {
        text: 'Excellent care and very thorough explanation of my condition.',
        name: 'Patient A.',
        date: '1 week ago',
      },
      {
        text: 'Professional and compassionate. Highly recommended.',
        name: 'Patient B.',
        date: '2 weeks ago',
      },
    ],
    []
  );

  // Render loading skeleton
  const loadingSkeleton = (
    <PatientPortalShell active="Doctor Profile">
      <div className="flex flex-col gap-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-muted h-28 rounded-2xl" />
          <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
            <div className="space-y-6">
              <div className="bg-muted h-48 rounded-2xl" />
              <div className="bg-muted h-48 rounded-2xl" />
            </div>
            <div className="bg-muted h-96 rounded-2xl" />
          </div>
          <div className="bg-muted h-48 rounded-2xl" />
        </div>
      </div>
    </PatientPortalShell>
  );

  // Render error state
  const errorState = (
    <PatientPortalShell active="Doctor Profile">
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="text-destructive mb-4 text-6xl">⚠️</div>
        <h2 className="text-2xl font-black">Doctor not found</h2>
        <p className="text-muted-foreground mt-2">
          {doctorError instanceof Error ? doctorError.message : 'Unable to load doctor profile'}
        </p>
        <button
          onClick={handleBack}
          className="bg-primary text-primary-foreground mt-6 rounded-xl px-6 py-3 text-sm font-bold"
        >
          Back to doctors
        </button>
      </div>
    </PatientPortalShell>
  );

  // Render main content
  const mainContent = (
    <PatientPortalShell active="Doctor Profile">
      <div className="flex flex-col gap-6">
        {notice && (
          <div
            role="status"
            className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold"
          >
            <span>{notice}</span>
            <button onClick={() => setNotice('')} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
        <button
          onClick={handleBack}
          className="text-muted-foreground hover:text-primary flex w-fit items-center gap-2 text-sm font-bold"
        >
          <ChevronLeft className="size-4" /> Back to doctors
        </button>
        <DoctorHeader
          doctor={{
            name: doctor?.name ?? '',
            initials: doctor?.initials ?? '',
            designation: doctor?.designation ?? '',
            specialties: doctor?.specialties ?? [],
            experience: doctor?.experience ?? '',
            qualifications: doctor?.qualifications ?? '',
            clinic: doctor?.clinic ?? '',
            fee: doctor?.fee ?? '',
            rating: 4.9, // Would come from reviews API
            reviews: 128, // Would come from reviews API
            avatarColor: doctor?.color ?? '',
          }}
          onBack={handleBack}
          onBook={handleBook}
          selectedTime={selectedTime}
          onNotice={setNotice}
        />
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col gap-6">
            <AboutSection
              title={`About ${doctor?.name?.replace('Dr. ', '') ?? ''}`}
              description={
                doctor
                  ? `${doctor.name} is a board-certified ${doctor.specialties[0]?.toLowerCase() ?? ''} specialist focused on thoughtful, evidence-based care. ${doctor.experience} of clinical experience.`
                  : ''
              }
              infoItems={aboutInfoItems}
            />
            <ClinicInfoSection clinicName={doctor?.clinic ?? ''} infoItems={clinicInfoItems} />
          </div>
          <ScheduleCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            dates={dates}
            slots={slots}
            onBook={handleBook}
            onViewMoreDates={() => setNotice('More appointment dates will be available soon.')}
            onNotice={setNotice}
          />
        </div>
        <Reviews reviews={reviews} overallRating={4.9} />
      </div>
    </PatientPortalShell>
  );

  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      {isDoctorLoading || isScheduleLoading
        ? loadingSkeleton
        : isDoctorError || !doctor
          ? errorState
          : mainContent}
    </ProtectedRoute>
  );
}
