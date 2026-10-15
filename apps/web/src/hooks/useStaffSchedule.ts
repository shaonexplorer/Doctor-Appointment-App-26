'use client';

/**
 * TanStack Query hooks for staff schedule/dashboard (Staff Portal)
 * Provides caching, pagination, search, and filtering functionality
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  appointmentApi,
  scheduleApi,
  doctorApi,
  type DoctorAppointmentFilters,
  type DoctorAppointmentResponse,
  type PaginatedDoctorAppointmentsResponse,
  type ScheduleSlot,
  type DoctorSearchResult,
  type PaginatedResponse,
} from '@/lib/api';

// Query keys for consistent caching
export const staffScheduleKeys = {
  all: ['staff-schedule'] as const,
  todayAppointments: () => [...staffScheduleKeys.all, 'today'] as const,
  weeklyAppointments: (weekStart: string) =>
    [...staffScheduleKeys.all, 'weekly', weekStart] as const,
  doctorStats: () => [...staffScheduleKeys.all, 'doctor-stats'] as const,
  doctorsOnDuty: (date: string) => [...staffScheduleKeys.all, 'doctors-on-duty', date] as const,
  utilizationStats: () => [...staffScheduleKeys.all, 'utilization'] as const,
};

// Re-export types for consumers
export type {
  DoctorAppointmentResponse,
  PaginatedDoctorAppointmentsResponse,
  ScheduleSlot,
  DoctorSearchResult,
};

/**
 * Hook for fetching today's appointments for all doctors (staff view)
 * Uses the doctor appointments endpoint with dateRange: 'today'
 */
export function useStaffTodayAppointments() {
  return useQuery({
    queryKey: staffScheduleKeys.todayAppointments(),
    queryFn: () =>
      appointmentApi.getDoctorAppointments({
        dateRange: 'today',
        limit: 100, // Get more for today's view
        sortBy: 'slot.startTime',
        sortOrder: 'asc',
      }),
    select: (data) => data.data,
    staleTime: 30 * 1000, // 30 seconds - refresh frequently for today's view
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching weekly appointments for all doctors (staff view)
 * Uses the doctor appointments endpoint with dateRange: 'week'
 */
export function useStaffWeeklyAppointments(weekStart: string) {
  return useQuery({
    queryKey: staffScheduleKeys.weeklyAppointments(weekStart),
    queryFn: () =>
      appointmentApi.getDoctorAppointments({
        dateRange: 'week',
        limit: 200,
        sortBy: 'slot.startTime',
        sortOrder: 'asc',
      }),
    select: (data) => data.data,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching all doctors (for doctors on duty view)
 */
export function useStaffDoctors() {
  return useQuery({
    queryKey: staffScheduleKeys.doctorsOnDuty('all'),
    queryFn: () => doctorApi.searchDoctors({ limit: 50 }),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes - doctors don't change often
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching slot utilization stats (for stat cards)
 */
export function useStaffUtilizationStats() {
  return useQuery({
    queryKey: staffScheduleKeys.utilizationStats(),
    queryFn: () => appointmentApi.getDoctorUtilizationStats(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching weekly schedule slots for all doctors
 * This aggregates slots from all doctors for the weekly grid view
 */
export function useStaffWeeklySlots(weekStart: string) {
  return useQuery({
    queryKey: [...staffScheduleKeys.all, 'weekly-slots', weekStart],
    queryFn: async () => {
      // First get all doctors
      const doctorsResponse = await doctorApi.searchDoctors({ limit: 50 });
      const doctors = doctorsResponse.data;

      // Then fetch slots for each doctor for the week
      const weekStartDate = new Date(weekStart);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      weekEndDate.setHours(23, 59, 59, 999);

      const slotsPromises = doctors.map((doctor) =>
        scheduleApi.getDoctorSlots(doctor.userId, weekStartDate, weekEndDate)
      );

      const allSlotsArrays = await Promise.all(slotsPromises);
      return allSlotsArrays.flat();
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend DoctorAppointmentResponse to frontend ScheduleEvent format
 * Maps API response to the UI component's expected data structure
 */
export function transformAppointmentToScheduleEvent(
  appointment: DoctorAppointmentResponse
): ScheduleEvent {
  const startTime = new Date(appointment.slot.startTime);
  const endTime = new Date(appointment.slot.endTime);

  // Format time as "9:00 AM" (12-hour format)
  const formattedTime = startTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Map status from backend to frontend format
  const statusMap: Record<string, 'Confirmed' | 'Checked in' | 'Pending' | 'Cancelled'> = {
    SCHEDULED: 'Confirmed',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Confirmed', // Completed appointments show as confirmed in schedule
    CANCELLED: 'Cancelled',
    NO_SHOW: 'Cancelled',
  };

  // Get patient name
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;

  // Get doctor name
  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

  // Determine status class for badge styling
  const statusClassMap: Record<string, string> = {
    Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    'Checked in': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const status = statusMap[appointment.status] || 'Confirmed';

  return {
    id: appointment.id,
    time: formattedTime,
    patient: patientName,
    doctor: doctorName,
    status,
    statusClass: statusClassMap[status] || 'bg-blue-50 text-blue-700 border-blue-200',
    rawStatus: appointment.status,
    paymentStatus: appointment.paymentStatus,
    consultationType: appointment.consultationType,
    slotId: appointment.slotId,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    symptoms: appointment.symptoms,
    notes: appointment.notes,
    startTime: appointment.slot.startTime,
    endTime: appointment.slot.endTime,
  };
}

/**
 * Transform array of appointments to ScheduleEvent format
 */
export function transformAppointmentsToScheduleEvents(
  appointments: DoctorAppointmentResponse[]
): ScheduleEvent[] {
  return appointments.map(transformAppointmentToScheduleEvent);
}

/**
 * Transform backend DoctorSearchResult to frontend DoctorOnDuty format
 */
export function transformDoctorToOnDuty(
  doctor: DoctorSearchResult,
  stats?: {
    availableSlots: number;
    totalSlots: number;
  }
): DoctorOnDuty {
  const firstName = doctor.user.firstName;
  const lastName = doctor.user.lastName;
  const initial = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // Map specialty to color
  const specialtyColors: Record<string, string> = {
    Cardiology: 'bg-blue-500',
    Dermatology: 'bg-violet-500',
    Neurology: 'bg-emerald-500',
    'General Medicine': 'bg-amber-500',
    Orthopedics: 'bg-orange-500',
    Pediatrics: 'bg-pink-500',
    Psychiatry: 'bg-indigo-500',
    Oncology: 'bg-red-500',
    Radiology: 'bg-slate-500',
    'Emergency Medicine': 'bg-rose-500',
  };

  const availableSlots = stats?.availableSlots ?? 0;
  const totalSlots = stats?.totalSlots ?? 0;

  return {
    name: `Dr. ${firstName} ${lastName}`,
    specialty: doctor.specialty,
    color: specialtyColors[doctor.specialty] || 'bg-primary',
    slots: `${availableSlots} / ${totalSlots}`,
    initial,
  };
}

/**
 * Transform array of doctors to DoctorOnDuty format
 */
export function transformDoctorsToOnDuty(
  doctors: DoctorSearchResult[],
  slotsByDoctorId: Record<string, ScheduleSlot[]>
): DoctorOnDuty[] {
  return doctors.map((doctor) => {
    const doctorSlots = slotsByDoctorId[doctor.userId] || [];
    const availableSlots = doctorSlots.filter((s) => s.status === 'AVAILABLE').length;
    const totalSlots = doctorSlots.length;
    return transformDoctorToOnDuty(doctor, { availableSlots, totalSlots });
  });
}

/**
 * Build week days data for the weekly grid
 */
export interface WeekDayData {
  day: string;
  isToday: boolean;
  appointments: string;
  slots: Array<{
    time: string;
    patient: string;
    doctorColor: string;
  }>;
}

export function buildWeekDaysData(
  appointments: DoctorAppointmentResponse[],
  slots: ScheduleSlot[],
  weekStart: string
): WeekDayData[] {
  const weekStartDate = new Date(weekStart);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return Array.from({ length: 7 }, (_, i) => {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(weekStartDate.getDate() + i);

    const dayStr = currentDate.toISOString().split('T')[0];
    const isToday = currentDate.getTime() === today.getTime();

    // Filter appointments for this day
    const dayAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.slot.startTime).toISOString().split('T')[0];
      return aptDate === dayStr;
    });

    // Filter slots for this day
    const daySlots = slots.filter((slot) => {
      // console.log('Slot:', slot);
      const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
      return slotDate === dayStr && slot.status === 'BOOKED';
    });

    // Get unique doctors for color mapping
    const doctorColors = new Map<string, string>();
    const specialtyColors: Record<string, string> = {
      Cardiology: 'bg-blue-500',
      Dermatology: 'bg-violet-500',
      Neurology: 'bg-emerald-500',
      'General Medicine': 'bg-amber-500',
      Orthopedics: 'bg-orange-500',
      Pediatrics: 'bg-pink-500',
      Psychiatry: 'bg-indigo-500',
      Oncology: 'bg-red-500',
      Radiology: 'bg-slate-500',
      'Emergency Medicine': 'bg-rose-500',
    };

    dayAppointments.forEach((apt) => {
      const specialty = apt.doctorProfile?.specialty || 'General Medicine';
      if (!doctorColors.has(apt.doctorId)) {
        doctorColors.set(apt.doctorId, specialtyColors[specialty] || 'bg-primary');
      }
    });

    const slotsForUI = daySlots
      // .slice(0, 3) // Limit to 3 slots per day in the grid
      .map((slot) => {
        // Find the appointment for this slot to get patient name
        const appointment = dayAppointments.find((apt) => apt.slotId === slot.id);

        // console.log('Appointment:', appointment);
        const patientName = appointment
          ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
          : 'Booked';
        const doctorColor = doctorColors.get(slot.doctorId) || 'bg-primary';

        return {
          time: new Date(slot.startTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          patient: patientName,
          doctorColor,
        };
      });

    return {
      day: `${dayNames[i]} ${currentDate.getDate()}`,
      isToday,
      appointments: `${dayAppointments.length} appointment${dayAppointments.length !== 1 ? 's' : ''}`,
      slots: slotsForUI.filter((slot) => slot.patient !== 'Booked'), // Only show slots with patient names
    };
  });
}

/**
 * Compute stat cards data from appointments and utilization stats
 */
export interface StatCardData {
  label: string;
  value: string;
  detail: string;
}

export function computeStatCards(
  todayAppointments: DoctorAppointmentResponse[],
  utilizationStats: {
    booked: number;
    available: number;
    cancelled: number;
    noShow: number;
    total: number;
  },
  doctors: DoctorSearchResult[],
  weekSlots: ScheduleSlot[]
): StatCardData[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointmentsCount = todayAppointments.length;
  const availableSlots = utilizationStats.available;
  const doctorsOnDuty = doctors.length;

  // Count blocked time (cancelled slots today)
  const todayStr = today.toISOString().split('T')[0];
  const blockedToday = weekSlots.filter(
    (slot) =>
      slot.status === 'CANCELLED' &&
      new Date(slot.startTime).toISOString().split('T')[0] === todayStr
  ).length;

  return [
    {
      label: "Today's appointments",
      value: String(todayAppointmentsCount),
      detail: `Across ${doctorsOnDuty} doctors`,
    },
    { label: 'Available slots', value: String(availableSlots), detail: 'Ready to book' },
    { label: 'Doctors on duty', value: String(doctorsOnDuty), detail: 'All clinics' },
    { label: 'Blocked time', value: String(blockedToday), detail: 'Today' },
  ];
}

// Type definitions for the UI
export interface ScheduleEvent {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  status: 'Confirmed' | 'Checked in' | 'Pending' | 'Cancelled';
  statusClass: string;
  rawStatus: string;
  paymentStatus: string;
  consultationType: string;
  slotId: string;
  doctorId: string;
  patientId: string;
  symptoms: string | null;
  notes: string | null;
  startTime: string;
  endTime: string;
}

export interface DoctorOnDuty {
  name: string;
  specialty: string;
  color: string;
  slots: string;
  initial: string;
}
