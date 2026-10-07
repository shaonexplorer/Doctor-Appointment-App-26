'use client';

import { useState, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import {
  BookingStepper,
  DoctorStep,
  DateTimeStep,
  SymptomsStep,
  ConfirmationStep,
  SuccessState,
} from '@/components/booking-flow';
import { ArrowLeft } from 'lucide-react';
import { useDoctor, useDoctorSchedule, transformDoctorProfileToCardData } from '@/hooks/useDoctors';
import { useAuth } from '@/context/AuthContext';
import { appointmentApi, type AppointmentCreateInput } from '@/lib/api';
import type { DateOption, TimeSlot } from '@/components/booking-flow';

const steps = ['Doctor', 'Date & Time', 'Symptoms', 'Confirmation', 'Success'];

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: doctorId } = use(params);
  const { user: currentUser } = useAuth();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Routine consultation']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'conflict' | 'failure'>('idle');
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentData, setAppointmentData] = useState<{
    id: string;
    slot: { startTime: string; endTime: string };
    doctor: { firstName: string; lastName: string };
    patient: { firstName: string; lastName: string; email: string };
  } | null>(null);

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

  // Transform doctor data for DoctorStep
  const doctor = useMemo(() => {
    if (!doctorData) return null;
    return transformDoctorProfileToCardData(doctorData);
  }, [doctorData]);

  // Transform schedule data for DateTimeStep - build slotsByDate map
  const slotsByDate = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return new Map<string, { morning: string[]; afternoon: string[]; evening: string[] }>();
    }

    const map = new Map<string, { morning: string[]; afternoon: string[]; evening: string[] }>();

    scheduleData
      .filter((slot) => slot.status === 'AVAILABLE')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .forEach((slot) => {
        const slotDate = new Date(slot.startTime);
        const dateKey = slotDate.toISOString().split('T')[0];
        const hour = slotDate.getHours();

        if (!map.has(dateKey)) {
          map.set(dateKey, { morning: [], afternoon: [], evening: [] });
        }

        const timeStr = slotDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
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
            : date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }),
        day: date.getDate(),
        value: dateKey,
      };
    }) as DateOption[];
  }, [slotsByDate]);

  // Build slots object for DateTimeStep based on selected date
  const slots = useMemo(() => {
    const slotsObj: Record<string, TimeSlot[]> = {};
    if (date && slotsByDate.has(date)) {
      const daySlots = slotsByDate.get(date)!;
      if (daySlots.morning.length > 0)
        slotsObj.Morning = daySlots.morning.map((time) => ({ time }));
      if (daySlots.afternoon.length > 0)
        slotsObj.Afternoon = daySlots.afternoon.map((time) => ({ time }));
      if (daySlots.evening.length > 0)
        slotsObj.Evening = daySlots.evening.map((time) => ({ time }));
    }
    return slotsObj;
  }, [slotsByDate, date]);

  // Auto-select first available date/time
  useEffect(() => {
    if (!date && dates.length > 0) {
      const firstDateValue = dates[0].value;
      setDate(firstDateValue);
      // Use slotsByDate to get first available slot for the first date
      if (slotsByDate.has(firstDateValue)) {
        const daySlots = slotsByDate.get(firstDateValue)!;
        if (daySlots.morning.length > 0) {
          setTime(daySlots.morning[0]);
        } else if (daySlots.afternoon.length > 0) {
          setTime(daySlots.afternoon[0]);
        } else if (daySlots.evening.length > 0) {
          setTime(daySlots.evening[0]);
        }
      }
    }
  }, [dates, slotsByDate, date]);

  // Handle date change - update slots for the new date
  const handleDateChange = (dateValue: string) => {
    setDate(dateValue);
    setTime('');

    // Find first available slot for this date using slotsByDate
    if (slotsByDate.has(dateValue)) {
      const daySlots = slotsByDate.get(dateValue)!;
      if (daySlots.morning.length > 0) {
        setTime(daySlots.morning[0]);
      } else if (daySlots.afternoon.length > 0) {
        setTime(daySlots.afternoon[0]);
      } else if (daySlots.evening.length > 0) {
        setTime(daySlots.evening[0]);
      }
    }
  };

  const toggleTag = (tag: string) =>
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    );
  const continueBooking = () => setStep((current) => Math.min(current + 1, 3));

  // Helper to find the slot ID matching the selected date and time
  // timeValue is in 12-hour format (e.g., "2:30 PM"), displayed in local time
  // slot.startTime from API is in UTC - we need to compare in the same timezone
  const findSlotId = (dateValue: string, timeValue: string): string | null => {
    if (!scheduleData) return null;

    // Parse the 12-hour time format (e.g., "2:30 PM") to hours/minutes in local time
    const [timePart, period] = timeValue.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    // Create a Date in the user's local timezone for the target date/time
    // This allows proper comparison with slot.startTime (UTC) by converting both to ISO strings
    const targetDate = new Date(dateValue);
    targetDate.setHours(hour24, minutes, 0, 0);
    const targetISO = targetDate.toISOString(); // This converts local time to UTC ISO string

    // Find the slot that matches - compare the UTC ISO strings (date + time)
    const matchingSlot = scheduleData.find((slot) => {
      if (slot.status !== 'AVAILABLE') return false;
      // slot.startTime is already an ISO string in UTC
      // Compare the full ISO timestamp (date + time) for exact match
      return slot.startTime === targetISO;
    });

    return matchingSlot?.id ?? null;
  };

  const confirm = async () => {
    setStatus('loading');

    try {
      const slotId = findSlotId(date, time);

      if (!slotId) {
        setStatus('failure');
        return;
      }

      const appointmentInput: AppointmentCreateInput = {
        slotId,
        symptoms: symptoms || selectedTags.join(', ') || 'Routine consultation',
        consultationType: 'IN_PERSON',
      };

      const response = await appointmentApi.bookAppointment(appointmentInput);
      setAppointmentData(response);
      setStatus('idle');
      setConfirmed(true);
      setStep(4);
    } catch (error) {
      console.error('Booking failed:', error);
      // Check if it's a slot conflict error
      if (error instanceof Error && error.message.includes('conflict')) {
        setStatus('conflict');
      } else {
        setStatus('failure');
      }
    }
  };

  const retry = () => {
    setStatus('idle');
    setStep(3);
  };

  if (confirmed && appointmentData)
    return (
      <SuccessState
        onDashboard={() => router.push('/patient/dashboard')}
        onBack={() => {
          setConfirmed(false);
          setAppointmentData(null);
          setStep(3);
        }}
        appointmentId={appointmentData.id}
        doctor={`Dr. ${appointmentData.doctor.firstName} ${appointmentData.doctor.lastName}`}
        date={new Date(appointmentData.slot.startTime).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}
        time={new Date(appointmentData.slot.startTime).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}
        clinic={doctor?.clinic || 'Clinic'}
      />
    );

  // Render loading skeleton
  const loadingSkeleton = (
    <PatientPortalShell active="Book Appointment">
      <div className="mx-auto max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="bg-muted h-28 rounded-2xl" />
          <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-8">
            <div className="space-y-6">
              <div className="bg-muted h-48 rounded-2xl" />
              <div className="bg-muted h-48 rounded-2xl" />
              <div className="bg-muted h-48 rounded-2xl" />
              <div className="bg-muted h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </PatientPortalShell>
  );

  // Render error state
  const errorState = (
    <PatientPortalShell active="Book Appointment">
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <div className="text-destructive mb-4 text-6xl">⚠️</div>
          <h2 className="text-2xl font-black">Doctor not found</h2>
          <p className="text-muted-foreground mt-2">
            {doctorError instanceof Error ? doctorError.message : 'Unable to load doctor profile'}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground mt-6 rounded-xl px-6 py-3 text-sm font-bold"
          >
            Back to doctors
          </button>
        </div>
      </div>
    </PatientPortalShell>
  );

  // Render main content
  const mainContent = (
    <PatientPortalShell active="Book Appointment">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary mb-6 flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft className="size-4" /> Back to doctor
        </button>
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-8">
          <BookingStepper steps={steps} currentStep={step} />
          {step === 0 && <DoctorStep doctor={doctor ?? undefined} onContinue={continueBooking} />}
          {step === 1 && (
            <DateTimeStep
              date={date}
              time={time}
              setDate={handleDateChange}
              setTime={setTime}
              onBack={() => setStep(0)}
              onContinue={continueBooking}
              dates={dates}
              timeSlots={slots}
            />
          )}
          {step === 2 && (
            <SymptomsStep
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              onBack={() => setStep(1)}
              onContinue={continueBooking}
            />
          )}
          {step === 3 && (
            <ConfirmationStep
              date={date}
              time={time}
              symptoms={symptoms}
              tags={selectedTags}
              status={status}
              onBack={() => setStep(2)}
              onConfirm={confirm}
              onRetry={retry}
              doctor={
                doctor
                  ? {
                      name: doctor.name,
                      designation: doctor.designation,
                      specialties: doctor.specialties,
                      clinic: doctor.clinic,
                      fee: doctor.fee,
                    }
                  : undefined
              }
              patient={
                currentUser
                  ? {
                      name: `${currentUser.firstName} ${currentUser.lastName}`,
                      email: currentUser.email,
                    }
                  : undefined
              }
            />
          )}
        </div>
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
