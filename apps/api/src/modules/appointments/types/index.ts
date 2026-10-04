/**
 * Appointments Module Types
 * Type definitions for appointments module
 */

import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
} from '@doctor-appointment-app/shared';
import { AppointmentStatus, PaymentStatus, ConsultationType } from '@prisma/client';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  symptoms: string | null;
  notes: string | null;
  consultationType: ConsultationType;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  patient?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  doctor?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  slot?: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: string;
  };
}

export interface DoctorStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PatientStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface TimelineEntry {
  id: string;
  type: 'appointment' | 'prescription';
  date: Date;
  title: string;
  description: string;
  doctorName: string;
  doctorSpecialty: string;
  clinic: string;
  appointmentId?: string;
  appointmentStatus?: AppointmentStatus;
  consultationType?: ConsultationType;
  symptoms?: string | null;
  prescriptionId?: string;
  diagnosis?: string;
  medications?: string;
  tests?: string;
  notes?: string;
}

// Doctor-specific appointment filters
export interface DoctorAppointmentFilters extends Omit<AppointmentFilters, 'doctorId'> {
  doctorId?: string; // Optional for admin/staff to filter by specific doctor
}

// Complete appointment input
export interface DoctorCompleteAppointmentInput {
  notes?: string | null;
  diagnosis?: string | null;
}

// Doctor dashboard stats (for Doctor Portal)
export interface DoctorDashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  slotUtilization: number;
  totalRevenue: number;
  revenueByConsultationType: Array<{ type: ConsultationType; amount: number }>;
  dailyVolume: Array<{ date: string; count: number }>;
}

export type { AppointmentCreateInput, AppointmentUpdateInput, AppointmentFilters };
export { AppointmentStatus, PaymentStatus, ConsultationType };
