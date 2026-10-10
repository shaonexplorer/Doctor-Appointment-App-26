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

  // console.log('Doctor Data:', doctorData);
  // console.log('Schedule Data:', scheduleData);

  // Transform doctor data for components
  const doctor = useMemo(() => {
    if (!doctorData) return null;
    return transformDoctorProfileToCardData(doctorData);
  }, [doctorData]);

  // Transform schedule data for ScheduleCalendar - build slotsByDate map
  const slotsByDate = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return new Map<string, { morning: string[]; afternoon: string[]; evening: string[] }>();
    }

    const map = new Map<string, { morning: string[]; afternoon: string[]; evening: string[] }>();

    scheduleData
      .filter((slot) => slot.status === 'AVAILABLE')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .forEach((slot) => {
        const date = new Date(slot.startTime);
        const dateKey = date.toISOString().split('T')[0];
        const hour = date.getHours();

        if (!map.has(dateKey)) {
          map.set(dateKey, { morning: [], afternoon: [], evening: [] });
        }

        const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const daySlots = map.get(dateKey)!;

        if (hour < 12) {
          daySlots.morning.push(timeStr);
        } else if (hour < 17) {
          daySlots.afternoon.push(timeStr);
        } else {
          daySlots.evening.push(timeStr);
        }
      });

    return map;
  }, [scheduleData]);

  // Get unique dates (next 7 days with available slots)
  const dates = useMemo(() => {
    const sortedDates = Array.from(slotsByDate.keys()).sort().slice(0, 7);
    const today = new Date();
    return sortedDates.map((dateKey) => {
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
  }, [slotsByDate]);

  // Build slots object for ScheduleCalendar based on selectedDate
  const slots = useMemo(() => {
    const slotsObj: Record<string, Array<{ time: string }>> = {};
    if (selectedDate && slotsByDate.has(selectedDate)) {
      const daySlots = slotsByDate.get(selectedDate)!;
      if (daySlots.morning.length > 0)
        slotsObj.Morning = [...new Set(daySlots.morning)].map((time) => ({ time }));
      if (daySlots.afternoon.length > 0)
        slotsObj.Afternoon = [...new Set(daySlots.afternoon)].map((time) => ({ time }));
      if (daySlots.evening.length > 0)
        slotsObj.Evening = [...new Set(daySlots.evening)].map((time) => ({ time }));
    }
    return slotsObj;
  }, [slotsByDate, selectedDate]);

  // console.log('Slots:', slots);

  // Auto-select first available date/time
  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      const firstDateValue = dates[0].value;
      setSelectedDate(firstDateValue);
      // Use slotsByDate to get first available slot for the first date
      if (slotsByDate.has(firstDateValue)) {
        const daySlots = slotsByDate.get(firstDateValue)!;
        if (daySlots.morning.length > 0) {
          setSelectedTime(daySlots.morning[0]);
        } else if (daySlots.afternoon.length > 0) {
          setSelectedTime(daySlots.afternoon[0]);
        } else if (daySlots.evening.length > 0) {
          setSelectedTime(daySlots.evening[0]);
        }
      }
    }
  }, [dates, slotsByDate, selectedDate]);

  // Handle date change - update slots for the new date
  const handleDateChange = (dateValue: string) => {
    setSelectedDate(dateValue);
    setSelectedTime('');

    // Find first available slot for this date using slotsByDate
    if (slotsByDate.has(dateValue)) {
      const daySlots = slotsByDate.get(dateValue)!;
      if (daySlots.morning.length > 0) {
        setSelectedTime(daySlots.morning[0]);
      } else if (daySlots.afternoon.length > 0) {
        setSelectedTime(daySlots.afternoon[0]);
      } else if (daySlots.evening.length > 0) {
        setSelectedTime(daySlots.evening[0]);
      }
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
      {
        text: 'Great experience, felt very comfortable during the visit.',
        name: 'Patient C.',
        date: '3 weeks ago',
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
            experience: doctor?.experience ?? '12 Years',
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
