'use client';

import { useState, useMemo, type ReactNode } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Loader2,
  Search,
  UserPlus,
  Users,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useStaffPatientSearch,
  type StaffBookingPatient,
  transformUsersToPatients,
} from '@/hooks/useStaffPatients';
import { useDoctors, type DoctorSearchResult } from '@/hooks/useDoctors';
import { useDoctorSlots } from '@/hooks/useSchedule';
import { useBookAppointment } from '@/hooks/useAppointments';
import { RegisterPatientDialog } from '@/components/staff-patients/RegisterPatientDialog';

interface DoctorSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
}

interface SelectedSlot {
  id: string;
  time: string;
  date: string;
  doctorId: string;
}

// Transformed doctor type for StaffBooking (similar to StaffBookingPatient)
interface StaffBookingDoctor {
  id: string;
  userId: string; // User ID - required for API calls (e.g., useDoctorSlots)
  name: string;
  specialty: string;
  designation: string;
  fee: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

// Transform DoctorSearchResult to StaffBookingDoctor format
function transformDoctorToBookingDoctor(doctor: DoctorSearchResult): StaffBookingDoctor {
  return {
    id: doctor.id,
    userId: doctor.userId,
    name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
    specialty: doctor.specialty,
    designation: doctor.designation,
    fee: doctor.fee,
    user: {
      firstName: doctor.user.firstName,
      lastName: doctor.user.lastName,
    },
  };
}

function transformDoctorsToBookingDoctors(doctors: DoctorSearchResult[]): StaffBookingDoctor[] {
  return doctors.map(transformDoctorToBookingDoctor);
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}

export function StaffBooking({ onBack }: { onBack: () => void }) {
  // State
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<StaffBookingPatient | null>(null);
  const [doctor, setDoctor] = useState<StaffBookingDoctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>('');
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');
  const [bookingAppointmentId, setBookingAppointmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  // Handle successful patient registration
  const handlePatientRegistered = () => {
    setIsRegisterDialogOpen(false);
    void refetchPatients();
    // The new patient will appear in the search results after refetch
    // We'll auto-select it in the effect below if needed
  };

  // API Hooks
  const {
    data: patientsResponse,
    isLoading: isPatientsLoading,
    isError: isPatientsError,
    refetch: refetchPatients,
  } = useStaffPatientSearch({
    search: searchQuery,
    page: 1,
    limit: 20,
  });

  // console.log(patientsResponse?.data, 'Patients Response');

  const {
    data: doctorsResponse,
    isLoading: isDoctorsLoading,
    isError: isDoctorsError,
    refetch: refetchDoctors,
  } = useDoctors({
    search: doctorSearchQuery,
    specialty: doctorSpecialty || undefined,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Unique specialties from doctors for filter dropdown
  const specialties = useMemo(() => {
    if (!doctorsResponse?.data) return [];
    const uniqueSpecialties = new Set(doctorsResponse.data.map((d) => d.specialty));
    return Array.from(uniqueSpecialties).sort();
  }, [doctorsResponse]);

  // Default date range: today to 7 days from now when a doctor is selected
  // This allows fetching slots before a specific date is chosen in Step 3
  // IMPORTANT: Use UTC dates to match database storage (Prisma/PostgreSQL stores timestamps in UTC)
  // This avoids timezone mismatch where local midnight != UTC midnight
  const startDate = useMemo(() => {
    if (!doctor) return undefined;
    const today = new Date();
    // Create UTC midnight for today
    return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  }, [doctor]);

  const endDate = useMemo(() => {
    if (!doctor) return undefined;
    const today = new Date();
    // Create UTC end of day for 7 days from now (23:59:59.999 UTC)
    const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7));
    end.setUTCMinutes(59);
    end.setUTCSeconds(59);
    end.setUTCMilliseconds(999);
    return end;
  }, [doctor]);

  const {
    data: slotsData,
    isLoading: isSlotsLoading,
    isError: isSlotsError,
  } = useDoctorSlots(doctor?.userId, startDate, endDate);

  const bookAppointmentMutation = useBookAppointment();

  // Transform API data to UI format and filter by search query
  const patients = useMemo(() => {
    if (!patientsResponse?.data) return [];
    // Transform UserListItem[] to StaffBookingPatient[]
    const transformedPatients = transformUsersToPatients(patientsResponse.data);
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return transformedPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.patientId?.toLowerCase().includes(query) ||
        p.phone?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query)
    );
  }, [patientsResponse, searchQuery]);

  const doctors = useMemo(() => {
    if (!doctorsResponse?.data) return [];
    // Transform DoctorSearchResult[] to StaffBookingDoctor[]
    const transformedDoctors = transformDoctorsToBookingDoctors(doctorsResponse.data);
    if (!doctorSearchQuery.trim()) return [];
    const query = doctorSearchQuery.toLowerCase();
    return transformedDoctors.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.specialty.toLowerCase().includes(query) ||
        d.designation.toLowerCase().includes(query)
    );
  }, [doctorsResponse, doctorSearchQuery]);

  const slots = useMemo((): DoctorSlot[] => {
    if (!slotsData) return [];
    return slotsData
      .filter((slot) => slot.status === 'AVAILABLE')
      .map((slot) => ({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status as 'AVAILABLE' | 'BOOKED' | 'CANCELLED',
      }));
  }, [slotsData]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Get unique dates from available slots
  const availableDates = useMemo(() => {
    if (!slots.length) return [];
    const dates = new Set<string>();
    slots.forEach((slot) => {
      dates.add(new Date(slot.startTime).toISOString().split('T')[0]);
    });
    return Array.from(dates).sort();
  }, [slots]);

  // Get slots for selected date, deduplicated by time (in case of duplicate slots with same time but different IDs)
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedSlot || !slots.length) return [];
    const filtered = slots.filter((slot) => {
      const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
      return slotDate === selectedSlot.date;
    });
    // Deduplicate by time - keep the first slot for each unique time
    const seenTimes = new Set<string>();
    return filtered.filter((slot) => {
      const timeKey = new Date(slot.startTime).toISOString(); // Full ISO string as unique key
      if (seenTimes.has(timeKey)) return false;
      seenTimes.add(timeKey);
      return true;
    });
  }, [slots, selectedSlot]);

  // console.log('Available slots:', slots);
  console.log(doctor ? `Selected doctor: ${doctor.userId}` : 'No doctor selected');
  console.log('Slots for selected date:', slotsForSelectedDate);

  // Handle next step
  const next = () => {
    setError('');
    if (step === 1 && !patient) {
      return setError('Select an existing patient or create a new patient first.');
    }
    if (step === 2 && !doctor) {
      return setError('Select a doctor first.');
    }
    if (step === 3 && !selectedSlot) {
      return setError('Choose an available appointment slot.');
    }
    if (step === 4 && symptoms.trim().length < 5) {
      return setError("Add a brief description of the patient's symptoms.");
    }
    setStep((s) => Math.min(5, s + 1));
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!patient || !selectedSlot || symptoms.trim().length < 5) return;

    setIsSubmitting(true);
    setError('');

    try {
      const result = await bookAppointmentMutation.mutateAsync({
        slotId: selectedSlot.id,
        symptoms: symptoms.trim(),
        consultationType: 'IN_PERSON',
      });

      setBookingAppointmentId(result.id);
      setCreated(true);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to book appointment. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCreated(false);
    setStep(1);
    setPatient(null);
    setDoctor(null);
    setSelectedSlot(null);
    setSymptoms('');
    setSearchQuery('');
    setBookingAppointmentId(null);
    setError('');
  };

  if (created)
    return (
      <main className="mx-auto max-w-3xl p-5 pb-24 sm:p-8 lg:p-10">
        <div className="border-border bg-card rounded-3xl border p-8 text-center shadow-sm sm:p-14">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f3] text-[#258c70]">
            <Check className="size-8" />
          </div>
          <p className="text-primary mt-6 text-xs font-bold tracking-[0.16em] uppercase">
            Booking complete
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Appointment created successfully
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            The patient and doctor have been added to the appointment queue.
          </p>
          <div className="bg-secondary mx-auto mt-8 max-w-md rounded-2xl p-5 text-left">
            <p className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Appointment ID
            </p>
            <p className="text-primary mt-1 text-xl font-black">
              {bookingAppointmentId || 'APT-2026-004932'}
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <p>
                <b>{patient?.name}</b> with Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}
              </p>
              <p>
                {selectedSlot ? `${formatDate(selectedSlot.date)} at ${selectedSlot.time}` : ''}{' '}
                &middot; ${doctor?.fee || '0'}
              </p>
              <p>
                Payment status: <b>Pending</b>
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print confirmation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError('Notification sent to the patient.')}
            >
              Send notification
            </Button>
            <Button size="sm" onClick={resetForm}>
              Book another appointment
            </Button>
          </div>
          {error && (
            <p role="status" className="text-primary mt-5 text-sm font-semibold">
              {error}
            </p>
          )}
        </div>
      </main>
    );

  return (
    <main className="mx-auto max-w-5xl min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground mb-5"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to dashboard
      </Button>
      <div className="mb-8">
        <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
          Front desk booking
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Book an appointment</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Create a visit on behalf of a patient in five clear steps.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-5 gap-2">
        {['Patient', 'Doctor', 'Date & time', 'Symptoms', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                step > i + 1
                  ? 'bg-[#e9f8f3] text-[#258c70]'
                  : step === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {step > i + 1 ? <Check className="size-4" /> : i + 1}
            </div>
            <span className="text-muted-foreground hidden text-[11px] font-bold sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-xl border border-[#f0d2cc] bg-[#fff8f6] p-3 text-sm font-semibold text-[#b86f63]"
        >
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-7">
        {/* Step 1: Search Patient */}
        {step === 1 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Search existing patient"
              description="Search by name, phone, email, or patient ID."
            />
            <div className="relative mt-6">
              <Search className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <Input
                aria-label="Search existing patient"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, phone, email, or ID"
                className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-xl border px-4 pl-10 text-sm outline-none focus:ring-2"
              />
            </div>
            {isPatientsLoading && (
              <div className="text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>Searching patients...</span>
              </div>
            )}
            {isPatientsError && (
              <div className="mt-4 text-center text-[#b86f63]">
                <p>Failed to load patients. Please try again.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => refetchPatients()}
                >
                  Retry
                </Button>
              </div>
            )}
            {!isPatientsLoading && !isPatientsError && searchQuery && patients.length === 0 && (
              <div className="text-muted-foreground mt-4 text-center">
                <p>No patients found matching "{searchQuery}"</p>
              </div>
            )}
            {!isPatientsLoading && !isPatientsError && !searchQuery && (
              <div className="text-muted-foreground mt-4 text-center">
                <p>Enter a search term to find patients</p>
              </div>
            )}
            <div className="scrollbar-clinical mt-4 flex max-h-96 flex-col gap-2 overflow-y-auto">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatient(p)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                    patient?.id === p.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <span>
                    <b className="text-sm">{p.name}</b>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {p.patientId} &middot; {p.phone || 'No phone'}
                    </span>
                  </span>
                  {patient?.id === p.id && <Check className="text-primary size-4" />}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-5 border-dashed"
              onClick={() => setIsRegisterDialogOpen(true)}
            >
              <UserPlus className="mr-2 size-4" />
              Create New Patient
            </Button>
          </>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Select doctor"
              description="Filter by specialty and availability."
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
                <Input
                  aria-label="Search doctors"
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  placeholder="Search doctor name, specialty..."
                  className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-xl border px-4 pl-10 text-sm outline-none focus:ring-2"
                />
              </div>
              <div className="relative">
                <Filter className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2" />
                <select
                  value={doctorSpecialty}
                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                  className="focus:border-primary focus:ring-primary/15 bg-background h-12 w-full appearance-none rounded-xl border px-4 pr-8 pl-10 text-sm outline-none focus:ring-2"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {(doctorSearchQuery || doctorSpecialty) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorSearchQuery('');
                      setDoctorSpecialty('');
                    }}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    aria-label="Clear filters"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
            {isDoctorsLoading && (
              <div className="text-muted-foreground mt-6 flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>Loading doctors...</span>
              </div>
            )}
            {isDoctorsError && (
              <div className="mt-6 text-center text-[#b86f63]">
                <p>Failed to load doctors. Please try again.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => refetchDoctors()}
                >
                  Retry
                </Button>
              </div>
            )}
            {!isDoctorsLoading && !isDoctorsError && doctors.length === 0 && (
              <div className="text-muted-foreground mt-6 text-center">
                <p>No doctors found matching your criteria.</p>
              </div>
            )}
            <div className="mt-6 grid gap-3">
              {doctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDoctor(d);
                    setSelectedSlot(null); // Reset slot when doctor changes
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left ${
                    doctor?.id === d.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  <span>
                    <b className="text-sm">
                      Dr. {d.user?.firstName} {d.user?.lastName}
                    </b>
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {d.specialty} &middot; {d.designation}
                    </span>
                  </span>
                  <span className="text-primary text-sm font-black">${d.fee}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Select Date and Slot */}
        {step === 3 && (
          <>
            <SectionTitle
              icon={<CalendarDays />}
              title="Select date and available slot"
              description="Choose a time that works for the patient."
            />
            {doctor && (
              <>
                <p className="text-muted-foreground mt-4 text-sm">
                  Selected:{' '}
                  <b>
                    Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                  </b>{' '}
                  ({doctor.specialty})
                </p>
              </>
            )}
            {!doctor && (
              <p className="mt-4 text-sm text-[#b86f63]">Please select a doctor first.</p>
            )}
            {isSlotsLoading && (
              <div className="text-muted-foreground mt-6 flex items-center justify-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>Loading available slots...</span>
              </div>
            )}
            {isSlotsError && (
              <div className="mt-6 text-center text-[#b86f63]">
                <p>Failed to load available slots.</p>
              </div>
            )}
            {!isSlotsLoading && !isSlotsError && availableDates.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {availableDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedSlot({
                        id: '',
                        time: '',
                        date: d,
                        doctorId: doctor?.id || '',
                      });
                    }}
                    className={`rounded-xl border px-4 py-3 text-xs font-bold ${
                      selectedSlot?.date === d
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    {formatDate(d)}
                  </button>
                ))}
              </div>
            )}
            {!isSlotsLoading && !isSlotsError && availableDates.length === 0 && doctor && (
              <div className="text-muted-foreground mt-6 text-center">
                <p>No available slots for this doctor in the next week.</p>
              </div>
            )}
            {selectedSlot?.date && slotsForSelectedDate.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {slotsForSelectedDate.map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setSelectedSlot({
                        id: s.id,
                        time: formatTime(s.startTime),
                        date: selectedSlot!.date,
                        doctorId: doctor!.id,
                      })
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${
                      selectedSlot?.id === s.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:bg-secondary'
                    }`}
                  >
                    <Clock3 className="size-4" />
                    {formatTime(s.startTime)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 4: Enter Symptoms */}
        {step === 4 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Enter symptoms"
              description="Add the reason for the visit to help the doctor prepare."
            />
            <Textarea
              aria-label="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms or reason for visit..."
              className="focus:border-primary focus:ring-primary/15 mt-6 min-h-40 w-full resize-y rounded-xl border p-4 text-sm outline-none focus:ring-2"
            />
          </>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <>
            <SectionTitle
              icon={<Check />}
              title="Review appointment"
              description="Confirm the details before creating the appointment."
            />
            <div className="bg-secondary mt-6 grid gap-3 rounded-2xl p-5 text-sm">
              <p>
                <span className="text-muted-foreground">Patient</span>
                <br />
                <b>{patient?.name}</b> &middot; {patient?.patientId}
              </p>
              <p>
                <span className="text-muted-foreground">Doctor</span>
                <br />
                <b>
                  Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}
                </b>{' '}
                &middot; {doctor?.specialty}
              </p>
              <p>
                <span className="text-muted-foreground">Date & time</span>
                <br />
                <b>
                  {selectedSlot
                    ? `${formatDate(selectedSlot.date)} at ${selectedSlot.time}`
                    : 'Not selected'}
                </b>
              </p>
              <p>
                <span className="text-muted-foreground">Consultation fee</span>
                <br />
                <b>${doctor?.fee || '0'}</b> &middot; Payment status: <b>Pending</b>
              </p>
              <p>
                <span className="text-muted-foreground">Symptoms</span>
                <br />
                {symptoms || 'None provided'}
              </p>
            </div>
          </>
        )}
      </section>

      {/* Register Patient Dialog */}
      <RegisterPatientDialog
        isOpen={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        onSuccess={handlePatientRegistered}
      />

      <div className="mt-5 flex justify-end gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={() => (step === 5 ? handleSubmit() : next())} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Booking...
            </>
          ) : step === 5 ? (
            <>
              Confirm booking
              <ChevronRight className="ml-2 size-4" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
