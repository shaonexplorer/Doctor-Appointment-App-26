'use client';

/**
 * TanStack Query hooks for doctor dashboard
 * Provides caching and real-time data for dashboard metrics
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { appointmentApi, userApi } from '@/lib/api';

// Query keys
export const doctorDashboardKeys = {
  all: ['doctorDashboard'] as const,
  stats: () => [...doctorDashboardKeys.all, 'stats'] as const,
  appointments: (filters?: AppointmentFilters) =>
    [...doctorDashboardKeys.all, 'appointments', filters] as const,
  patients: (filters?: AppointmentFilters) =>
    [...doctorDashboardKeys.all, 'patients', filters] as const,
  profile: () => [...doctorDashboardKeys.all, 'profile'] as const,
  volume: (days: number) => [...doctorDashboardKeys.all, 'volume', days] as const,
  utilization: () => [...doctorDashboardKeys.all, 'utilization'] as const,
  revenue: () => [...doctorDashboardKeys.all, 'revenue'] as const,
};

// Type for doctor dashboard stats
export interface DoctorDashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  weeklyAppointments: number;
  slotUtilization: number;
  totalRevenue: number;
  totalPatients: number;
}

// Volume chart data point
export interface VolumeDataPoint {
  day: string;
  patients: number;
}

// Utilization data point
export interface UtilizationDataPoint {
  name: string;
  value: number;
  color: string;
}

// Revenue data point
export interface RevenueDataPoint {
  day: string;
  follow: number;
  new: number;
  video: number;
}

/**
 * Hook for fetching doctor dashboard stats
 * GET /api/appointments/stats/doctor
 */
export function useDoctorDashboardStats() {
  return useQuery({
    queryKey: doctorDashboardKeys.stats(),
    queryFn: async () => {
      // For now, we'll use the user profile endpoint which includes stats
      // In the future, we can add a dedicated stats endpoint
      const profile = await userApi.getDoctorProfile();
      return (
        (profile.doctorProfile?.stats as DoctorDashboardStats) || {
          totalAppointments: 0,
          todayAppointments: 0,
          weeklyAppointments: 0,
          slotUtilization: 0,
          totalRevenue: 0,
          totalPatients: 0,
        }
      );
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching doctor profile with stats
 * GET /api/users/me/doctor-profile
 */
export function useDoctorProfile() {
  return useQuery({
    queryKey: doctorDashboardKeys.profile(),
    queryFn: () => userApi.getDoctorProfile(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching doctor's upcoming appointments
 * GET /api/appointments/doctor?status=SCHEDULED
 */
export function useDoctorAppointments(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: doctorDashboardKeys.appointments(filters),
    queryFn: () =>
      appointmentApi.listAppointments({
        status: filters?.status || 'SCHEDULED',
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
        page: 1,
        limit: 20,
        sortBy: 'slot.startTime',
        sortOrder: 'asc',
      }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching volume chart data
 * GET /api/appointments/stats/doctor/volume
 */
export function useVolumeData(days: number = 7) {
  return useQuery({
    queryKey: doctorDashboardKeys.volume(days),
    queryFn: async () => {
      // For now, we'll derive from appointments
      // In the future, we can add a dedicated volume endpoint
      const response = await appointmentApi.listAppointments({
        status: ['SCHEDULED', 'COMPLETED'],
        page: 1,
        limit: 1000,
        sortBy: 'slot.startTime',
        sortOrder: 'asc',
      });

      // Group by day
      const dayMap = new Map<string, number>();
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        dayMap.set(dayKey, 0);
      }

      response.data.forEach((appt) => {
        const date = new Date(appt.slot.startTime);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (dayMap.has(dayKey)) {
          dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
        }
      });

      return Array.from(dayMap.entries()).map(([day, patients]) => ({ day, patients }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching utilization data
 * GET /api/appointments/stats/doctor/utilization
 */
export function useUtilizationData() {
  return useQuery({
    queryKey: doctorDashboardKeys.utilization(),
    queryFn: async () => {
      // Get doctor profile stats
      const profile = await userApi.getDoctorProfile();
      const utilization = profile.doctorProfile?.stats?.slotUtilization || 0;

      return [
        { name: 'Booked', value: utilization, color: '#1E40AF' },
        { name: 'Available', value: 100 - utilization, color: '#059669' },
        { name: 'Cancelled', value: 0, color: '#DC2626' },
      ] as UtilizationDataPoint[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching revenue data
 * GET /api/appointments/stats/doctor/revenue
 */
export function useRevenueData() {
  return useQuery({
    queryKey: doctorDashboardKeys.revenue(),
    queryFn: async () => {
      // For now, we'll derive from completed appointments
      const response = await appointmentApi.listAppointments({
        status: 'COMPLETED',
        page: 1,
        limit: 1000,
        sortBy: 'slot.startTime',
        sortOrder: 'asc',
      });

      // Group by day and consultation type
      const dayMap = new Map<string, { follow: number; new: number; video: number }>();
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        dayMap.set(dayKey, { follow: 0, new: 0, video: 0 });
      }

      response.data.forEach((appt) => {
        const date = new Date(appt.slot.startTime);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (dayMap.has(dayKey)) {
          const fee = appt.doctorProfile?.fee || 100;
          const current = dayMap.get(dayKey)!;
          if (appt.consultationType === 'VIDEO') {
            current.video += fee;
          } else if (appt.consultationType === 'FOLLOW_UP') {
            current.follow += fee;
          } else {
            current.new += fee;
          }
        }
      });

      return Array.from(dayMap.entries()).map(([day, data]) => ({ day, ...data }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching recent patients
 */
export function useRecentPatients() {
  return useQuery({
    queryKey: doctorDashboardKeys.patients({}),
    queryFn: async () => {
      // For now, we'll derive from completed appointments
      const response = await appointmentApi.listAppointments({
        status: 'COMPLETED',
        page: 1,
        limit: 10,
        sortBy: 'slot.startTime',
        sortOrder: 'desc',
      });

      return response.data.map((appt) => ({
        patient: `${appt.patient.firstName} ${appt.patient.lastName}`,
        visit: new Date(appt.slot.startTime).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit',
        }),
        diagnosis: 'Diagnosis', // Would come from prescription
        appointment: appt.consultationType === 'VIDEO' ? 'Video visit' : 'Consultation',
        initials:
          `${appt.patient.firstName.charAt(0)}${appt.patient.lastName.charAt(0)}`.toUpperCase(),
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation for updating doctor profile
 */
export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userApi.updateDoctorProfile(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: doctorDashboardKeys.profile() });
      void queryClient.invalidateQueries({ queryKey: doctorDashboardKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to update doctor profile:', error);
    },
  });
}

// AppointmentFilters type
export interface AppointmentFilters {
  status?: string | string[];
  search?: string;
  specialty?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
