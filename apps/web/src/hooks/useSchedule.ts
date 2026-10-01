'use client';

/**
 * TanStack Query hooks for doctor schedule management
 * Provides caching, mutations, and real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  scheduleApi,
  type ScheduleSlot,
  type BulkSlotCreateInput,
  type BulkSlotUpdateInput,
} from '@/lib/api';

// Query keys for consistent caching
export const scheduleKeys = {
  all: ['schedules'] as const,
  weekly: (weekStart: string) => [...scheduleKeys.all, 'weekly', weekStart] as const,
  slots: (doctorId: string, startDate?: Date, endDate?: Date) =>
    [...scheduleKeys.all, 'slots', doctorId, startDate, endDate] as const,
};

/**
 * Hook for fetching weekly schedule for authenticated doctor
 * GET /api/schedules/doctor?weekStart=
 */
export function useWeeklySchedule(weekStart: string) {
  return useQuery({
    queryKey: scheduleKeys.weekly(weekStart),
    queryFn: () => scheduleApi.getWeeklySchedule(weekStart),
    enabled: !!weekStart,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching slots for a doctor (for booking)
 * GET /api/schedules/doctor/:doctorId?startDate=&endDate=
 */
export function useDoctorSlots(doctorId: string | undefined, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: scheduleKeys.slots(doctorId ?? '', startDate, endDate),
    queryFn: () => scheduleApi.getDoctorSlots(doctorId!, startDate, endDate),
    enabled: !!doctorId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for generating slots in bulk
 * POST /api/schedules/doctor/bulk
 */
export function useCreateBulkSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkSlotCreateInput) => scheduleApi.createBulkSlots(data),
    onSuccess: () => {
      // Invalidate weekly schedule to refetch
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create bulk slots:', error);
    },
  });
}

/**
 * Hook for updating slots in bulk
 * PATCH /api/schedules/doctor/bulk
 */
export function useBulkUpdateSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkSlotUpdateInput) => scheduleApi.bulkUpdateSlots(data),
    onSuccess: () => {
      // Invalidate weekly schedule to refetch
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
    onError: (error) => {
      console.error('Failed to bulk update slots:', error);
    },
  });
}

/**
 * Hook for deleting a single slot
 * DELETE /api/schedules/:id
 */
export function useDeleteSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => scheduleApi.deleteSlot(slotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete slot:', error);
    },
  });
}

// Helper types for the UI components
export interface ScheduleSlotWithDate extends ScheduleSlot {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  date: string; // YYYY-MM-DD
}

/**
 * Transform flat schedule array to grouped by day for ScheduleGrid
 */
export function transformScheduleForGrid(slots: ScheduleSlot[]): {
  slots: Array<{ time: string; patient: string; state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED' }>;
  days: string[];
} {
  if (slots.length === 0) {
    return { slots: [], days: [] };
  }

  // Group slots by date
  const slotsByDate = new Map<string, ScheduleSlot[]>();

  for (const slot of slots) {
    const date = new Date(slot.startTime);
    const dateKey = date.toISOString().split('T')[0];

    if (!slotsByDate.has(dateKey)) {
      slotsByDate.set(dateKey, []);
    }
    slotsByDate.get(dateKey)!.push(slot);
  }

  // Sort dates
  const sortedDates = Array.from(slotsByDate.keys()).sort();

  // Get unique time slots across all days
  const timeSlots = new Set<string>();
  for (const slot of slots) {
    const time = new Date(slot.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    timeSlots.add(time);
  }

  const sortedTimes = Array.from(timeSlots).sort((a, b) => {
    const timeA = new Date(`2000-01-01T${a}`);
    const timeB = new Date(`2000-01-01T${b}`);
    return timeA.getTime() - timeB.getTime();
  });

  // Build days array
  const days = sortedDates.map((dateKey) => {
    const date = new Date(dateKey);
    return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.toLocaleDateString('en-US', { day: 'numeric' })}`;
  });

  // Build slots array for grid
  const gridSlots = sortedTimes.map((time) => {
    // For each time slot, check status across days
    // For simplicity, we'll return the first day's status or 'AVAILABLE'
    const firstDayKey = sortedDates[0];
    const firstDaySlots = slotsByDate.get(firstDayKey) || [];
    const slotAtTime = firstDaySlots.find((s) => {
      const slotTime = new Date(s.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return slotTime === time;
    });

    let state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED' = 'AVAILABLE';
    let patient = '';

    if (slotAtTime) {
      state = slotAtTime.status as 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
      if (slotAtTime.status === 'BOOKED') {
        patient = 'Patient Name'; // Would come from appointment data
      }
    }

    return { time, patient, state };
  });

  return { slots: gridSlots, days };
}
