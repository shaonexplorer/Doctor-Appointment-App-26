/**
 * Patients Module Types
 * Type definitions for patient-specific operations
 */

import { AppointmentStatus, ConsultationType } from '@prisma/client';
import type { Medication } from '@doctor-appointment-app/shared';

/**
 * Dashboard statistics for patient
 */
export interface PatientDashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  totalExpenses: number;
  prescriptionCompliance: number;
  nextAppointment: NextAppointment | null;
  appointmentsByStatus: Record<AppointmentStatus, number>;
  appointmentsBySpecialty: Array<{ specialty: string; count: number }>;
  monthlyExpenses: Array<{ month: string; amount: number }>;
}

/**
 * Next upcoming appointment summary
 */
export interface NextAppointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  clinic: string;
  startTime: Date;
  endTime: Date;
  consultationType: ConsultationType;
  status: AppointmentStatus;
}

/**
 * Medical timeline entry - combines appointments and prescriptions
 */
export interface MedicalTimelineEntry {
  id: string;
  type: 'appointment' | 'prescription';
  date: Date;
  title: string;
  description: string;
  doctorName: string;
  doctorSpecialty: string;
  clinic: string;
  // Appointment fields
  appointmentId?: string;
  appointmentStatus?: AppointmentStatus;
  consultationType?: ConsultationType;
  symptoms?: string | null;
  // Prescription fields
  prescriptionId?: string;
  diagnosis?: string;
  medications?: Medication[];
  tests?: string | null;
  notes?: string | null;
}

/**
 * Medical timeline response
 */
export interface MedicalTimelineResponse {
  data: MedicalTimelineEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Upcoming appointment with full details for timeline
 */
export interface UpcomingAppointmentDetail {
  id: string;
  status: AppointmentStatus;
  symptoms: string | null;
  notes: string | null;
  consultationType: ConsultationType;
  paymentStatus: string;
  createdAt: Date;
  slot: {
    id: string;
    startTime: Date;
    endTime: Date;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  doctorProfile: {
    specialty: string;
    clinic?: string;
    designation: string;
    fee: number;
  } | null;
}

/**
 * Completed appointment with prescription links
 */
export interface CompletedAppointmentDetail {
  id: string;
  status: AppointmentStatus;
  symptoms: string | null;
  notes: string | null;
  consultationType: ConsultationType;
  paymentStatus: string;
  createdAt: Date;
  completedAt: Date | null;
  slot: {
    id: string;
    startTime: Date;
    endTime: Date;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  doctorProfile: {
    specialty: string;
    clinic?: string;
    designation: string;
    fee: number;
  } | null;
  prescriptions: Array<{
    id: string;
    diagnosis: string;
    createdAt: Date;
  }>;
}

export { AppointmentStatus, ConsultationType };

// Re-export query types from validators
export type { TimelineQuery, DashboardStatsQuery } from '../validators';