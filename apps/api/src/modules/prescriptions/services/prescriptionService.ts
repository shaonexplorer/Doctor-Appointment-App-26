/**
 * Prescription Service
 * Business logic for prescription operations
 */

import type { PrescriptionRepository, AppointmentRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { AppointmentStatus, UserType } from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  PrescriptionCreateInput,
  PrescriptionUpdateInput,
  Prescription,
  PrismaMedications,
} from '../types';
import { generatePrescriptionPDF, type PrescriptionPDFData } from './pdfService';

/**
 * Helper to cast Prisma JsonValue medications to PrismaMedications
 */
function castMedications(medications: unknown): PrismaMedications {
  if (medications === null || medications === undefined) return null;
  if (typeof medications === 'string') {
    try {
      return JSON.parse(medications) as PrismaMedications;
    } catch {
      return null;
    }
  }
  return medications as PrismaMedications;
}

export class PrescriptionService {
  constructor(
    private prescriptionRepository: PrescriptionRepository,
    private appointmentRepository: AppointmentRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Generate prescription PDF
   */
  async generatePrescriptionPDF(
    prescriptionId: string,
    userId: string,
    userType: UserType
  ): Promise<Buffer> {
    const prescription = await this.prescriptionRepository.findById(prescriptionId);
    if (!prescription) {
      throw new AppError('NOT_FOUND', 'Prescription not found', 404);
    }

    // Check authorization
    const isDoctor = prescription.doctorId === userId;
    const isPatient = prescription.patientId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    if (!isDoctor && !isPatient && !isAdminOrStaff) {
      throw new AppError('FORBIDDEN', 'Not authorized to access this prescription', 403);
    }

    // Fetch related data for PDF
    const appointment = await this.appointmentRepository.findById(prescription.appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Associated appointment not found', 404);
    }

    // Get doctor profile for title/clinic info
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: prescription.doctorId },
      include: { user: true },
    });

    // Get patient profile for DOB/blood group
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId: prescription.patientId },
      include: { user: true },
    });

    const pdfData: PrescriptionPDFData = {
      prescription,
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      patientDob: patientProfile?.dob || 'Unknown',
      patientBloodGroup: '—', // Blood group not currently stored
      doctorName: `Dr. ${doctorProfile?.user.firstName || ''} ${doctorProfile?.user.lastName || ''}`,
      doctorTitle: doctorProfile?.designation || 'Consultant',
      clinicName: 'MediBook Health Clinic', // Could be from doctor profile
      clinicAddress: '12 Park Avenue', // Could be from doctor profile
      clinicPhone: '+91 98765 43210', // Could be from doctor profile
      clinicEmail: 'care@medibook.health',
      prescriptionId,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    return generatePrescriptionPDF(pdfData);
  }

  /**
   * Create prescription
   */
  async createPrescription(doctorId: string, data: PrescriptionCreateInput): Promise<Prescription> {
    // Verify appointment exists and is in a valid status for prescriptions
    const appointment = await this.appointmentRepository.findById(data.appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check if doctor owns this appointment
    if (appointment.doctorId !== doctorId) {
      throw new AppError(
        'FORBIDDEN',
        'Not authorized to create prescription for this appointment',
        403
      );
    }

    // Allow prescriptions for appointments that are scheduled or completed
    // (but not cancelled or no-show)
    const allowedStatuses: AppointmentStatus[] = [
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.COMPLETED,
    ];
    if (!allowedStatuses.includes(appointment.status)) {
      throw new AppError(
        'CONFLICT',
        'Can only create prescriptions for scheduled or completed appointments',
        409
      );
    }

    // Check if prescription already exists
    const existing = await this.prescriptionRepository.findByAppointmentId(data.appointmentId);
    if (existing.length > 0) {
      throw new AppError('CONFLICT', 'Prescription already exists for this appointment', 409);
    }

    const created = await this.prescriptionRepository.create({
      appointmentId: data.appointmentId,
      doctorId,
      patientId: appointment.patientId,
      diagnosis: data.diagnosis,
      medications: data.medications,
      tests: data.tests,
      notes: data.notes,
      pdfUrl: null,
    });

    return {
      ...created,
      medications: castMedications(created.medications),
    };
  }

  /**
   * Get prescription by ID
   */
  async getPrescription(id: string, userId: string, userType: UserType): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findById(id);
    if (!prescription) {
      throw new AppError('NOT_FOUND', 'Prescription not found', 404);
    }

    // Check authorization
    const isDoctor = prescription.doctorId === userId;
    const isPatient = prescription.patientId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    if (!isDoctor && !isPatient && !isAdminOrStaff) {
      throw new AppError('FORBIDDEN', 'Not authorized to view this prescription', 403);
    }

    return {
      ...prescription,
      medications: castMedications(prescription.medications),
    };
  }

  /**
   * Update prescription
   */
  async updatePrescription(
    id: string,
    doctorId: string,
    data: PrescriptionUpdateInput
  ): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findById(id);
    if (!prescription) {
      throw new AppError('NOT_FOUND', 'Prescription not found', 404);
    }

    // Check if doctor owns this prescription
    if (prescription.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to update this prescription', 403);
    }

    const updated = await this.prescriptionRepository.update(id, data);

    return {
      ...updated,
      medications: castMedications(updated.medications),
    };
  }

  /**
   * Delete prescription
   */
  async deletePrescription(id: string, doctorId: string): Promise<{ message: string }> {
    const prescription = await this.prescriptionRepository.findById(id);
    if (!prescription) {
      throw new AppError('NOT_FOUND', 'Prescription not found', 404);
    }

    // Check if doctor owns this prescription
    if (prescription.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to delete this prescription', 403);
    }

    await this.prescriptionRepository.delete(id);
    return { message: 'Prescription deleted successfully' };
  }

  /**
   * List prescriptions with pagination
   */
  async listPrescriptions(
    filters: { doctorId?: string; patientId?: string; appointmentId?: string },
    params: { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<{ data: Prescription[]; meta: { total: number; totalPages: number } }> {
    const result = await this.prescriptionRepository.findMany(filters, params);

    return {
      ...result,
      data: result.data.map((p) => ({
        ...p,
        medications: castMedications(p.medications),
      })),
    };
  }

  /**
   * Get prescriptions by appointment
   */
  async getPrescriptionsByAppointment(
    appointmentId: string,
    userId: string,
    userType: UserType
  ): Promise<Prescription[]> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    const isDoctor = appointment.doctorId === userId;
    const isPatient = appointment.patientId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    if (!isDoctor && !isPatient && !isAdminOrStaff) {
      throw new AppError(
        'FORBIDDEN',
        'Not authorized to view prescriptions for this appointment',
        403
      );
    }

    const prescriptions = await this.prescriptionRepository.findByAppointmentId(appointmentId);

    return prescriptions.map((p) => ({
      ...p,
      medications: castMedications(p.medications),
    }));
  }

  /**
   * Get recent prescriptions for doctor
   */
  async getRecentByDoctor(doctorId: string, limit: number = 5): Promise<Prescription[]> {
    const prescriptions = await this.prescriptionRepository.getRecentByDoctor(doctorId, limit);

    return prescriptions.map((p) => ({
      ...p,
      medications: castMedications(p.medications),
    }));
  }

  /**
   * Get recent prescriptions for patient
   */
  async getRecentByPatient(patientId: string, limit: number = 5): Promise<Prescription[]> {
    const prescriptions = await this.prescriptionRepository.getRecentByPatient(patientId, limit);

    return prescriptions.map((p) => ({
      ...p,
      medications: castMedications(p.medications),
    }));
  }
}

// Factory function for dependency injection
export function createPrescriptionService(
  prescriptionRepository: PrescriptionRepository,
  appointmentRepository: AppointmentRepository,
  prisma: PrismaClient
): PrescriptionService {
  return new PrescriptionService(prescriptionRepository, appointmentRepository, prisma);
}
