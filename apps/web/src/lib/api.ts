/**
 * API Client for Doctor Appointment App
 * Handles HTTP requests to the backend API
 */

import { env } from './env';

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: Record<string, unknown> } | null;
  meta: { page: number; limit: number; total: number; totalPages: number } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.message || 'An error occurred',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status,
      data.error?.details
    );
  }

  return data.data as T;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth
  });

  return handleResponse<T>(response);
}

// Doctor API types
export interface DoctorSearchFilters {
  specialty?: string;
  search?: string;
  minFee?: number;
  maxFee?: number;
  availableFrom?: string;
  availableTo?: string;
  consultationType?: 'IN_PERSON' | 'VIDEO';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DoctorSearchResult {
  id: string;
  userId: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number;
  isVerified: boolean;
  searchVector: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: string;
    emailVerified: boolean;
  };
  schedules?: Array<{
    id: string;
    doctorId: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number;
  isVerified: boolean;
  searchVector: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: string;
    emailVerified: boolean;
  };
  schedules?: Array<{
    id: string;
    doctorId: string;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Doctor API functions
export const doctorApi = {
  /**
   * Search doctors with filters
   * GET /api/doctors
   */
  searchDoctors: async (
    filters: DoctorSearchFilters
  ): Promise<PaginatedResponse<DoctorSearchResult>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiRequest<PaginatedResponse<DoctorSearchResult>>(`/api/doctors?${params.toString()}`);
  },

  /**
   * Full-text search doctors
   * GET /api/doctors/search
   */
  fullTextSearchDoctors: async (
    filters: DoctorSearchFilters
  ): Promise<PaginatedResponse<DoctorSearchResult>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiRequest<PaginatedResponse<DoctorSearchResult>>(
      `/api/doctors/search?${params.toString()}`
    );
  },

  /**
   * Get doctor by ID
   * GET /api/doctors/:id
   */
  getDoctorById: async (id: string): Promise<DoctorProfile> => {
    return apiRequest<DoctorProfile>(`/api/doctors/${id}`);
  },

  /**
   * Get doctor schedule
   * GET /api/doctors/:id/schedule
   */
  getDoctorSchedule: async (
    id: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DoctorProfile['schedules']> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    return apiRequest<DoctorProfile['schedules']>(
      `/api/doctors/${id}/schedule?${params.toString()}`
    );
  },
};

export { ApiError };
