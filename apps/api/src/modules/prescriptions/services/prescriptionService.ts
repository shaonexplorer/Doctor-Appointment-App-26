/**
 * Prescription Service
 * Business logic for prescription operations
 */

import type { PrescriptionRepository, AppointmentRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { AppointmentStatus, UserType } from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type { PrescriptionCreateInput, PrescriptionUpdateInput, Prescription } from '../types';

export class PrescriptionService {
  constructor(
    private prescriptionRepository: PrescriptionRepository,
    private appointmentRepository: AppointmentRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Create prescription
   */
  async createPrescription(doctorId: string, data: PrescriptionCreateInput): Promise<Prescription> {
    // Verify appointment exists and is completed
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

    // Check if appointment is completed
    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new AppError(
        'CONFLICT',
        'Can only create prescriptions for completed appointments',
        409
      );
    }

    // Check if prescription already exists
    const existing = await this.prescriptionRepository.findByAppointmentId(data.appointmentId);
    if (existing.length > 0) {
      throw new AppError('CONFLICT', 'Prescription already exists for this appointment', 409);
    }

    return this.prescriptionRepository.create({
      appointmentId: data.appointmentId,
      doctorId,
      patientId: appointment.patientId,
      diagnosis: data.diagnosis,
      medications: data.medications,
      tests: data.tests,
      notes: data.notes,
      pdfUrl: null,
    });
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

    return prescription;
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

    return this.prescriptionRepository.update(id, data);
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
    return this.prescriptionRepository.findMany(filters, params);
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

    return this.prescriptionRepository.findByAppointmentId(appointmentId);
  }

  /**
   * Get recent prescriptions for doctor
   */
  async getRecentByDoctor(doctorId: string, limit: number = 5): Promise<Prescription[]> {
    return this.prescriptionRepository.getRecentByDoctor(doctorId, limit);
  }

  /**
   * Get recent prescriptions for patient
   */
  async getRecentByPatient(patientId: string, limit: number = 5): Promise<Prescription[]> {
    return this.prescriptionRepository.getRecentByPatient(patientId, limit);
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
