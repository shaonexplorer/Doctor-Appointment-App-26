'use client';

/**
 * TanStack Query hooks for doctor data fetching
 * Provides caching, pagination, and search functionality
 */

import { useQuery, useInfiniteQuery, useQueryClient, keepPreviousData, useMutation } from '@tanstack/react-query';
import {
  doctorApi,
  type CreateDoctorInput,
  type DoctorSearchFilters,
  type DoctorSearchResult,
  type DoctorProfile,
} from '@/lib/api';

// Query keys for consistent caching
export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (filters: DoctorSearchFilters) => [...doctorKeys.lists(), filters] as const,
  infiniteList: (filters: Omit<DoctorSearchFilters, 'page'>) =>
    [...doctorKeys.lists(), 'infinite', filters] as const,
  detail: (id: string) => [...doctorKeys.all, 'detail', id] as const,
  schedule: (id: string, startDate?: Date, endDate?: Date) =>
    [...doctorKeys.all, 'schedule', id, startDate, endDate] as const,
};

// Re-export types for consumers
export type {
  CreateDoctorInput,
  DoctorSearchFilters,
  DoctorSearchResult,
  DoctorProfile,
};

/**
 * Hook for fetching doctors with pagination (page-based)
 * Uses keepPreviousData for smooth pagination transitions
 */
export function useDoctors(filters: DoctorSearchFilters) {
  const { page = 1, limit = 20, ...restFilters } = filters;

  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorApi.searchDoctors({ ...restFilters, page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for infinite scrolling doctor search
 * Automatically handles pagination and loads more on scroll
 */
export function useInfiniteDoctors(filters: Omit<DoctorSearchFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: doctorKeys.infiniteList(filters),
    queryFn: ({ pageParam = 1 }) =>
      doctorApi.searchDoctors({ ...filters, page: pageParam, limit: filters.limit ?? 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a single doctor profile
 */
export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: doctorKeys.detail(id ?? ''),
    queryFn: () => doctorApi.getDoctorById(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching doctor schedule
 */
export function useDoctorSchedule(id: string | undefined, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: doctorKeys.schedule(id ?? '', startDate, endDate),
    queryFn: () => doctorApi.getDoctorSchedule(id!, startDate, endDate),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Transform backend DoctorSearchResult to frontend DoctorCardData format
 * Maps API response to the UI component's expected data structure
 */
export function transformDoctorToCardData(doctor: DoctorSearchResult): DoctorCardData {
  // Calculate experience from createdAt if available, or use a default
  const experienceYears = calculateExperience(doctor.createdAt);

  // Get next available slot from schedules
  const nextAvailable = getNextAvailableSlot(doctor.schedules);

  // Determine availability text
  const availability = determineAvailability(doctor.schedules);

  // Generate color based on specialty
  const color = getSpecialtyColor(doctor.specialty);

  // Generate initials from user name
  const initials = getInitials(doctor.user.firstName, doctor.user.lastName);

  return {
    id: doctor.id,
    name: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
    initials,
    designation: doctor.designation,
    specialties: [doctor.specialty], // API returns single specialty, could be expanded
    symptoms: extractSymptoms(doctor.specialty), // Map specialty to common symptoms
    experience: `${experienceYears} years`,
    qualifications: doctor.licenseNo, // Using license number as qualifications placeholder
    fee: `$${doctor.fee}`,
    clinic: doctor.bio || 'Clinic not specified', // Using bio as clinic placeholder
    next: nextAvailable,
    availability,
    color,
    rating: 4.9, // Default rating - would come from reviews API
    reviews: 0, // Default reviews count - would come from reviews API
  };
}

/**
 * Transform array of doctors to card data
 */
export function transformDoctorsToCardData(doctors: DoctorSearchResult[]): DoctorCardData[] {
  return doctors.map(transformDoctorToCardData);
}

/**
 * Transform backend DoctorProfile to frontend DoctorCardData format
 * Used for detailed doctor profile pages
 */
export function transformDoctorProfileToCardData(doctor: DoctorProfile): DoctorCardData {
  // Calculate experience from createdAt if available, or use a default
  const experienceYears = calculateExperience(doctor.createdAt);

  // Get next available slot from schedules
  const nextAvailable = getNextAvailableSlot(doctor.schedules);

  // Determine availability text
  const availability = determineAvailability(doctor.schedules);

  // Generate color based on specialty
  const color = getSpecialtyColor(doctor.specialty);

  // Generate initials from user name (handle optional user)
  const initials = doctor.user ? getInitials(doctor.user.firstName, doctor.user.lastName) : 'DR';

  return {
    id: doctor.id,
    name: doctor.user ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` : 'Dr. Unknown',
    initials,
    designation: doctor.designation,
    specialties: [doctor.specialty],
    symptoms: extractSymptoms(doctor.specialty),
    experience: `${experienceYears} years`,
    qualifications: doctor.licenseNo,
    fee: `$${doctor.fee}`,
    clinic: doctor.bio || 'Clinic not specified',
    next: nextAvailable,
    availability,
    color,
    rating: 4.9, // Default rating - would come from reviews API
    reviews: 0, // Default reviews count - would come from reviews API
  };
}

// Type for the transformed card data (matches DoctorCardData from DoctorCard.tsx)
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
  rating: number;
  reviews: number;
}

// Helper functions
function calculateExperience(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  return Math.max(1, years); // At least 1 year
}

function getNextAvailableSlot(schedules?: DoctorSearchResult['schedules']): string {
  if (!schedules || schedules.length === 0) {
    return 'No appointments available';
  }

  const now = new Date();
  const availableSlots = schedules
    .filter((s) => s.status === 'AVAILABLE' && new Date(s.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (availableSlots.length === 0) {
    return 'No appointments available';
  }

  const nextSlot = availableSlots[0];
  const date = new Date(nextSlot.startTime);
  // Use UTC dates for comparison to match backend storage
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (date.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
    return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function determineAvailability(schedules?: DoctorSearchResult['schedules']): string {
  if (!schedules || schedules.length === 0) {
    return 'Next week';
  }

  const now = new Date();
  // Use UTC dates to match backend storage (Prisma/PostgreSQL stores timestamps in UTC)
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const hasAvailableToday = schedules.some(
    (s) =>
      s.status === 'AVAILABLE' &&
      new Date(s.startTime) >= today &&
      new Date(s.startTime) < new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );

  const hasAvailableThisWeek = schedules.some(
    (s) =>
      s.status === 'AVAILABLE' &&
      new Date(s.startTime) >= today &&
      new Date(s.startTime) <= endOfWeek
  );

  if (hasAvailableToday) return 'Available today';
  if (hasAvailableThisWeek) return 'Available this week';
  return 'Next week';
}

function getSpecialtyColor(specialty: string): string {
  const colors: Record<string, string> = {
    Cardiology: 'bg-[#dce8ff] text-primary',
    Dermatology: 'bg-[#fce4f0] text-[#bd5d8c]',
    'Internal Medicine': 'bg-[#e6f7ef] text-[#278e70]',
    Pediatrics: 'bg-[#fff1d9] text-[#b97932]',
    Neurology: 'bg-[#eee8ff] text-[#8062c7]',
    Orthopedics: 'bg-[#e2f3f6] text-[#398a99]',
    Psychiatry: 'bg-[#fdf4f4] text-[#e07c7c]',
    Oncology: 'bg-[#f0e6ff] text-[#8b5cf6]',
    Ophthalmology: 'bg-[#dcfce7] text-[#22c55e]',
    ENT: 'bg-[#fef3c7] text-[#f59e0b]',
    Urology: 'bg-[#e0e7ff] text-[#6366f1]',
    Gastroenterology: 'bg-[#fce7f3] text-[#ec4899]',
  };
  return colors[specialty] || 'bg-[#f1f5f9] text-[#64748b]';
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function extractSymptoms(specialty: string): string[] {
  const specialtySymptoms: Record<string, string[]> = {
    Cardiology: ['Chest pain', 'High blood pressure', 'Heart palpitations'],
    Dermatology: ['Acne', 'Skin rash', 'Eczema', 'Psoriasis'],
    'Internal Medicine': ['Fatigue', 'Diabetes care', 'Hypertension', 'General checkup'],
    Pediatrics: ['Fever', 'Child nutrition', 'Vaccinations', 'Growth monitoring'],
    Neurology: ['Headaches', 'Sleep issues', 'Dizziness', 'Memory problems'],
    Orthopedics: ['Joint pain', 'Sports injuries', 'Back pain', 'Arthritis'],
    Psychiatry: ['Anxiety', 'Depression', 'Sleep disorders', 'Stress management'],
    Oncology: ['Cancer screening', 'Chemotherapy support', 'Pain management'],
    Ophthalmology: ['Vision problems', 'Eye infections', 'Glaucoma screening'],
    ENT: ['Ear infections', 'Sinus issues', 'Hearing loss', 'Throat problems'],
    Urology: ['Urinary issues', 'Kidney stones', 'Prostate health'],
    Gastroenterology: ['Digestive issues', 'Acid reflux', 'IBS', 'Liver health'],
  };
  return specialtySymptoms[specialty] || ['General consultation'];
}

/**
 * Transform backend DoctorSearchResult to frontend AdminDoctor format
 * Maps API response to the UI component's expected data structure
 */
export function transformDoctorToAdminFormat(doctor: DoctorSearchResult): AdminDoctorData {
  // Format created date
  const createdDate = new Date(doctor.createdAt);
  const formattedCreated = isNaN(createdDate.getTime())
    ? 'Unknown'
    : createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  // Format last activity - use updatedAt as fallback for "last activity"
  const updatedDate = new Date(doctor.updatedAt);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  let formattedActivity: string;
  if (isNaN(updatedDate.getTime())) {
    formattedActivity = 'Last activity unknown';
  } else if (updatedDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
    formattedActivity = `Today, ${updatedDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (updatedDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
    formattedActivity = 'Yesterday';
  } else {
    formattedActivity = updatedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Get full name with Dr. prefix
  const name = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;

  // Get initials
  const initials = `${doctor.user.firstName.charAt(0)}${doctor.user.lastName.charAt(0)}`.toUpperCase();

  // Format fee
  const fee = `$${doctor.fee}`;

  // Format clinic - use bio or default
  const clinic = doctor.bio || 'Clinic not specified';

  // Calculate experience from createdAt
  const experienceYears = calculateExperience(doctor.createdAt);
  const experience = `${experienceYears} years`;

  // Get next available slot from schedules
  const nextAvailable = getNextAvailableSlot(doctor.schedules);

  // Determine availability text
  const availability = determineAvailability(doctor.schedules);

  // Generate color based on specialty
  const color = getSpecialtyColor(doctor.specialty);

  // Default rating and reviews (would come from reviews API)
  const rating = 4.9;
  const reviews = 0;

  return {
    id: doctor.id,
    name,
    initials,
    specialty: doctor.specialty,
    designation: doctor.designation,
    clinic,
    fee,
    // The doctor search endpoint does not return appointment counts,
    // utilization, or account status — default them until a stats API exists.
    appointments: 0,
    utilization: 0,
    status: 'ACTIVE',
    next: nextAvailable,
    availability,
    color,
    experience,
    qualifications: doctor.licenseNo,
    rating,
    reviews,
    // Raw data for drawer
    raw: doctor,
  };
}

/**
 * Transform array of doctors to admin format
 */
export function transformDoctorsToAdminFormat(doctors: DoctorSearchResult[]): AdminDoctorData[] {
  return doctors.map(transformDoctorToAdminFormat);
}

// Type for the transformed admin doctor data (matches the AdminDoctorData interface)
export interface AdminDoctorData {
  id: string;
  name: string;
  initials: string;
  specialty: string;
  designation: string;
  clinic: string;
  fee: string;
  appointments: number;
  utilization: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  next: string;
  availability: string;
  color: string;
  experience: string;
  qualifications: string;
  rating: number;
  reviews: number;
  raw: DoctorSearchResult;
}

/**
 * Mutation hook for creating a new doctor (Admin only)
 * Invalidates the doctors list on success to refresh the data
 */
export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDoctorInput) => {
      return doctorApi.createDoctor(data);
    },
    onSuccess: () => {
      // Invalidate all doctor lists to refresh the data
      void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
  });
}
