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
  stats?: {
    totalAppointments: number;
    todayAppointments: number;
    weeklyAppointments: number;
    slotUtilization: number;
    totalRevenue: number;
    totalPatients: number;
  };
}

// Schedule/Slot types
export interface ScheduleSlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    specialty: string;
    designation: string | null;
    fee: number | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface BulkSlotCreateInput {
  doctorId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  slotDuration: number; // minutes
  daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
}

export interface BulkSlotCreateResult {
  created: number;
  total: number;
}

export interface BulkSlotUpdateInput {
  slotIds: string[];
  status?: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  startTime?: string; // ISO datetime
  endTime?: string; // ISO datetime
}

export interface BulkSlotUpdateResult {
  updated: number;
  total: number;
}

export interface WeeklyScheduleParams {
  weekStart: string; // ISO date string
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

// Schedule API functions
export const scheduleApi = {
  /**
   * Get weekly schedule for authenticated doctor
   * GET /api/schedules/doctor?weekStart=
   */
  getWeeklySchedule: async (weekStart: string): Promise<ScheduleSlot[]> => {
    return apiRequest<ScheduleSlot[]>(
      `/api/schedules/doctor?weekStart=${encodeURIComponent(weekStart)}`
    );
  },

  /**
   * Get doctor slots for booking
   * GET /api/schedules/doctor/:doctorId?startDate=&endDate=
   */
  getDoctorSlots: async (
    doctorId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScheduleSlot[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    return apiRequest<ScheduleSlot[]>(`/api/schedules/doctor/${doctorId}?${params.toString()}`);
  },

  /**
   * Create bulk slots (Doctor only)
   * POST /api/schedules/doctor/bulk
   */
  createBulkSlots: async (data: BulkSlotCreateInput): Promise<BulkSlotCreateResult> => {
    return apiRequest<BulkSlotCreateResult>('/api/schedules/doctor/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Bulk update slots (Doctor only)
   * PATCH /api/schedules/doctor/bulk
   */
  bulkUpdateSlots: async (data: BulkSlotUpdateInput): Promise<BulkSlotUpdateResult> => {
    return apiRequest<BulkSlotUpdateResult>('/api/schedules/doctor/bulk', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a single slot (Doctor only)
   * DELETE /api/schedules/:id
   */
  deleteSlot: async (slotId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/schedules/${slotId}`, {
      method: 'DELETE',
    });
  },
};

// User Profile API types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Doctor profile fields (returned directly from /api/users/me/doctor-profile)
  specialty?: string;
  designation?: string;
  licenseNo?: string;
  bio?: string | null;
  fee?: number;
  isVerified?: boolean;
  stats?: {
    totalAppointments: number;
    todayAppointments: number;
    weeklyAppointments: number;
    slotUtilization: number;
    totalRevenue: number;
    totalPatients: number;
  };
  patientProfile?: {
    id: string;
    dob: string | null;
    gender: string | null;
    address: string | null;
    emergencyContact: string | null;
  } | null;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  // Patient fields
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  // Doctor fields
  specialty?: string;
  designation?: string;
  licenseNo?: string;
  bio?: string | null;
  fee?: number;
}

// User Profile API functions
export const userApi = {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/api/users/me');
  },

  /**
   * Update current user profile
   * PATCH /api/users/me
   */
  updateProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user's doctor profile with stats (Doctor only)
   * GET /api/users/me/doctor-profile
   */
  getDoctorProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/api/users/me/doctor-profile');
  },

  /**
   * Update current user's doctor profile (Doctor only)
   * PATCH /api/users/me/doctor-profile
   */
  updateDoctorProfile: async (data: UpdateProfileInput): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/api/users/me/doctor-profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Appointment API types
export interface AppointmentCreateInput {
  slotId: string;
  symptoms?: string | null;
  notes?: string | null;
  consultationType?: 'IN_PERSON' | 'VIDEO';
}

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

export interface AppointmentResponse {
  id: string;
  slotId: string;
  patientId: string;
  doctorId: string;
  status: string;
  symptoms: string | null;
  notes: string | null;
  paymentStatus: string;
  consultationType: string;
  createdAt: string;
  updatedAt: string;
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    doctorId: string;
  };
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctorProfile?: {
    specialty: string;
    clinic?: string;
    designation: string;
    fee: number;
  } | null;
  prescriptions?: Array<{
    id: string;
    diagnosis: string;
    createdAt: string;
  }>;
}

export interface PaginatedAppointmentsResponse {
  data: AppointmentResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Patient dashboard stats
export interface PatientDashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  totalExpenses: number;
  prescriptionCompliance: number;
  nextAppointment: {
    id: string;
    doctorName: string;
    doctorSpecialty: string;
    clinic: string;
    startTime: string;
    endTime: string;
    consultationType: string;
    status: string;
  } | null;
  appointmentsByStatus: Record<string, number>;
  appointmentsBySpecialty: Array<{ specialty: string; count: number }>;
  monthlyExpenses: Array<{ month: string; amount: number }>;
}

// Medical timeline
export interface MedicalTimelineEntry {
  id: string;
  type: 'appointment' | 'prescription';
  date: string;
  title: string;
  description: string;
  doctorName: string;
  doctorSpecialty: string;
  clinic: string;
  appointmentId?: string;
  appointmentStatus?: string;
  consultationType?: string;
  symptoms?: string | null;
  prescriptionId?: string;
  diagnosis?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  }>;
  tests?: string | null;
  notes?: string | null;
}

export interface MedicalTimelineResponse {
  data: MedicalTimelineEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Doctor Appointment Filters (for Doctor Portal)
export interface DoctorAppointmentFilters {
  status?: string | string[];
  patientSearch?: string;
  dateFrom?: string;
  dateTo?: string;
  dateRange?: 'today' | 'week' | 'month' | 'custom';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DoctorAppointmentResponse {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  status: string;
  symptoms: string | null;
  notes: string | null;
  paymentStatus: string;
  consultationType: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctor: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  doctorProfile?: {
    specialty: string;
    clinic?: string;
    designation: string;
    fee: number;
  } | null;
  prescriptions?: Array<{
    id: string;
    diagnosis: string;
    createdAt: string;
  }>;
}

export interface PaginatedDoctorAppointmentsResponse {
  data: DoctorAppointmentResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Appointment API functions
export const appointmentApi = {
  /**
   * Book a new appointment
   * POST /api/appointments
   */
  bookAppointment: async (input: AppointmentCreateInput): Promise<AppointmentResponse> => {
    return apiRequest<AppointmentResponse>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Get patient dashboard stats
   * GET /api/appointments/stats/dashboard
   */
  getDashboardStats: async (): Promise<PatientDashboardStats> => {
    return apiRequest<PatientDashboardStats>('/api/appointments/stats/dashboard');
  },

  /**
   * Get patient medical timeline
   * GET /api/appointments/timeline/medical
   */
  getMedicalTimeline: async (filters?: AppointmentFilters): Promise<MedicalTimelineResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    return apiRequest<MedicalTimelineResponse>(
      `/api/appointments/timeline/medical?${params.toString()}`
    );
  },

  /**
   * Get upcoming appointments with details
   * GET /api/appointments/timeline/upcoming
   */
  getUpcomingWithDetails: async (limit = 10): Promise<AppointmentResponse[]> => {
    return apiRequest<AppointmentResponse[]>(`/api/appointments/timeline/upcoming?limit=${limit}`);
  },

  /**
   * Get completed appointments with prescriptions
   * GET /api/appointments/timeline/completed
   */
  getCompletedWithPrescriptions: async (limit = 10): Promise<AppointmentResponse[]> => {
    return apiRequest<AppointmentResponse[]>(`/api/appointments/timeline/completed?limit=${limit}`);
  },

  /**
   * List appointments with filters (patient view)
   * GET /api/appointments
   */
  listAppointments: async (filters: AppointmentFilters): Promise<PaginatedAppointmentsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    return apiRequest<PaginatedAppointmentsResponse>(`/api/appointments?${params.toString()}`);
  },

  /**
   * Cancel appointment
   * DELETE /api/appointments/:id
   */
  cancelAppointment: async (id: string): Promise<AppointmentResponse> => {
    return apiRequest<AppointmentResponse>(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Reschedule appointment
   * PATCH /api/appointments/:id
   */
  rescheduleAppointment: async (
    id: string,
    data: { slotId: string }
  ): Promise<AppointmentResponse> => {
    return apiRequest<AppointmentResponse>(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // ==================== DOCTOR PORTAL ENDPOINTS ====================

  /**
   * Get doctor appointments with filters (Doctor Portal)
   * GET /api/appointments/doctor
   */
  getDoctorAppointments: async (
    filters: DoctorAppointmentFilters = {}
  ): Promise<PaginatedDoctorAppointmentsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    return apiRequest<PaginatedDoctorAppointmentsResponse>(
      `/api/appointments/doctor?${params.toString()}`
    );
  },

  /**
   * Get single doctor appointment detail (Doctor Portal)
   * GET /api/appointments/doctor/:id
   */
  getDoctorAppointmentDetail: async (id: string): Promise<DoctorAppointmentResponse> => {
    return apiRequest<DoctorAppointmentResponse>(`/api/appointments/doctor/${id}`);
  },

  /**
   * Cancel appointment as doctor (with refund option)
   * PATCH /api/appointments/doctor/:id/cancel
   */
  cancelAppointmentAsDoctor: async (
    id: string,
    data: { reason: string; triggerRefund: boolean }
  ): Promise<DoctorAppointmentResponse> => {
    return apiRequest<DoctorAppointmentResponse>(`/api/appointments/doctor/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Reschedule appointment as doctor
   * PATCH /api/appointments/doctor/:id/reschedule
   */
  rescheduleAppointmentAsDoctor: async (
    id: string,
    data: { newSlotId: string }
  ): Promise<DoctorAppointmentResponse> => {
    return apiRequest<DoctorAppointmentResponse>(`/api/appointments/doctor/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check in patient (doctor/staff)
   * PATCH /api/appointments/doctor/:id/check-in
   */
  checkInPatient: async (id: string, notes?: string): Promise<DoctorAppointmentResponse> => {
    return apiRequest<DoctorAppointmentResponse>(`/api/appointments/doctor/${id}/check-in`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  },

  /**
   * Complete appointment as doctor
   * PATCH /api/appointments/doctor/:id/complete
   */
  completeAppointmentAsDoctor: async (
    id: string,
    data: { notes?: string | null; diagnosis?: string | null }
  ): Promise<DoctorAppointmentResponse> => {
    return apiRequest<DoctorAppointmentResponse>(`/api/appointments/doctor/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Patient API types (Doctor Portal)
export interface DoctorPatientListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  emergencyContact: string | null;
  lastVisit: string | null;
  nextAppointment: string | null;
  totalAppointments: number;
  completedAppointments: number;
  conditions: string[];
  avatarUrl: string | null;
}

export interface DoctorPatientListResponse {
  data: DoctorPatientListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DoctorPatientFilters {
  search?: string;
  condition?: string;
  status?: 'all' | 'active' | 'inactive';
  sortBy?: 'lastVisit' | 'nextAppointment' | 'name' | 'totalAppointments';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DoctorPatientDetail extends DoctorPatientListItem {
  appointments: Array<{
    id: string;
    date: string;
    status: string;
    specialty: string;
    diagnosis: string | null;
    prescriptionCount: number;
  }>;
  prescriptions: Array<{
    id: string;
    date: string;
    diagnosis: string;
    medications: string | object;
  }>;
}

// Patient API functions
export const patientApi = {
  /**
   * Get doctor's patient list (Doctor Portal)
   * GET /api/patients/doctor
   */
  getDoctorPatientList: async (
    filters: DoctorPatientFilters
  ): Promise<DoctorPatientListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiRequest<DoctorPatientListResponse>(`/api/patients/doctor?${params.toString()}`);
  },

  /**
   * Get doctor's patient detail (for Patient Drawer)
   * GET /api/patients/doctor/:id
   */
  getDoctorPatientDetail: async (patientId: string): Promise<DoctorPatientDetail> => {
    return apiRequest<DoctorPatientDetail>(`/api/patients/doctor/${patientId}`);
  },
};

// Prescription API types
export interface MedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
}

export interface PrescriptionCreateInput {
  appointmentId: string;
  diagnosis: string;
  medications: MedicationInput[];
  tests?: string | null;
  notes?: string | null;
}

export interface PrescriptionUpdateInput {
  diagnosis?: string;
  medications?: MedicationInput[];
  tests?: string | null;
  notes?: string | null;
  pdfUrl?: string | null;
}

export interface PrescriptionResponse {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medications: MedicationInput[];
  tests: string | null;
  notes: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
  appointment?: {
    id: string;
    startTime: string;
    endTime: string;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
    };
    doctor: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface PaginatedPrescriptionsResponse {
  data: PrescriptionResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DoctorPrescriptionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Prescription API functions
export const prescriptionApi = {
  /**
   * Create a new prescription (Doctor only)
   * POST /api/prescriptions
   */
  createPrescription: async (input: PrescriptionCreateInput): Promise<PrescriptionResponse> => {
    return apiRequest<PrescriptionResponse>('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Get prescription by ID
   * GET /api/prescriptions/:id
   */
  getPrescription: async (id: string): Promise<PrescriptionResponse> => {
    return apiRequest<PrescriptionResponse>(`/api/prescriptions/${id}`);
  },

  /**
   * Update prescription (Doctor only)
   * PATCH /api/prescriptions/:id
   */
  updatePrescription: async (
    id: string,
    input: PrescriptionUpdateInput
  ): Promise<PrescriptionResponse> => {
    return apiRequest<PrescriptionResponse>(`/api/prescriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  /**
   * Delete prescription (Doctor only)
   * DELETE /api/prescriptions/:id
   */
  deletePrescription: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/api/prescriptions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * List prescriptions with filters
   * GET /api/prescriptions
   */
  listPrescriptions: async (
    filters: DoctorPrescriptionFilters = {}
  ): Promise<PaginatedPrescriptionsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return apiRequest<PaginatedPrescriptionsResponse>(`/api/prescriptions?${params.toString()}`);
  },

  /**
   * Get recent prescriptions for doctor
   * GET /api/prescriptions/recent/doctor
   */
  getRecentByDoctor: async (limit = 5): Promise<PrescriptionResponse[]> => {
    return apiRequest<PrescriptionResponse[]>(`/api/prescriptions/recent/doctor?limit=${limit}`);
  },

  /**
   * Get recent prescriptions for patient
   * GET /api/prescriptions/recent/patient
   */
  getRecentByPatient: async (limit = 5): Promise<PrescriptionResponse[]> => {
    return apiRequest<PrescriptionResponse[]>(`/api/prescriptions/recent/patient?limit=${limit}`);
  },

  /**
   * Get prescriptions by appointment
   * GET /api/prescriptions/appointment/:appointmentId
   */
  getPrescriptionsByAppointment: async (appointmentId: string): Promise<PrescriptionResponse[]> => {
    return apiRequest<PrescriptionResponse[]>(`/api/prescriptions/appointment/${appointmentId}`);
  },

  /**
   * Download prescription PDF
   * GET /api/prescriptions/:id/pdf
   */
  downloadPrescriptionPDF: async (id: string): Promise<Blob> => {
    const url = `${API_BASE_URL}/api/prescriptions/${id}/pdf`;
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to download PDF' }));
      throw new ApiError(
        error.error?.message || 'Failed to download PDF',
        error.error?.code || 'DOWNLOAD_ERROR',
        response.status
      );
    }
    return response.blob();
  },
};

export { ApiError };
