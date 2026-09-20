/**
 * Prescriptions Module Types
 * Type definitions for prescriptions module
 */

import type {
  PrescriptionCreateInput,
  PrescriptionUpdateInput,
} from '@doctor-appointment-app/shared';

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string | null;
  }>;
  tests: string | null;
  notes: string | null;
  pdfUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  appointment?: {
    id: string;
    startTime: Date;
    endTime: Date;
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

export type { PrescriptionCreateInput, PrescriptionUpdateInput };
