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

// Volume chart data point (from backend)
export interface VolumeDataPoint {
  date: string;
  count: number;
  label: string;
}

// Utilization data point (from backend)
export interface UtilizationDataPoint {
  name: string;
  value: number;
  color: string;
  total: number;
}

// Revenue data point (from backend)
export interface RevenueDataPoint {
  type: string;
  amount: number;
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
        (profile.stats as DoctorDashboardStats) || {
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
 * Hook for fetching doctor's upcoming appointments (Doctor Portal)
 * GET /api/appointments/doctor?status=SCHEDULED
 */
export function useDoctorAppointments(filters?: {
  status?: string | string[];
  patientSearch?: string;
  dateFrom?: string;
  dateTo?: string;
  dateRange?: 'today' | 'week' | 'month' | 'custom';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: doctorDashboardKeys.appointments(filters),
    queryFn: () => appointmentApi.getDoctorAppointments(filters || {}),
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
    queryFn: () => appointmentApi.getDoctorVolumeStats(days),
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
      const data = await appointmentApi.getDoctorUtilizationStats();
      return [
        { name: 'Booked', value: data.booked, color: '#1E40AF', total: data.total },
        { name: 'Available', value: data.available, color: '#059669', total: data.total },
        { name: 'Cancelled', value: data.cancelled, color: '#DC2626', total: data.total },
        { name: 'No Show', value: data.noShow, color: '#F59E0B', total: data.total },
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
    queryFn: () => appointmentApi.getDoctorRevenueStats(),
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
