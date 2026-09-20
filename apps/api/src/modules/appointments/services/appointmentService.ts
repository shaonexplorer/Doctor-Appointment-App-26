/**
 * Appointment Service
 * Business logic for appointment operations
 */

import type { AppointmentRepository, ScheduleRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import {
  AppointmentStatus,
  PaymentStatus,
  ConsultationType,
  SlotStatus,
  UserType,
} from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
  Appointment,
  DoctorStats,
  PatientStats,
} from '../types';

export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private scheduleRepository: ScheduleRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Book an appointment
   */
  async bookAppointment(patientId: string, data: AppointmentCreateInput): Promise<Appointment> {
    // Check if slot exists and is available
    const slot = await this.scheduleRepository.findByIdWithAppointment(data.slotId);
    if (!slot) {
      throw new AppError('NOT_FOUND', 'Slot not found', 404);
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new AppError('CONFLICT', 'Slot is not available', 409);
    }

    if (slot.appointment) {
      throw new AppError('CONFLICT', 'Slot is already booked', 409);
    }

    // Get doctor ID from slot
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { id: slot.doctorId },
      select: { id: true, userId: true },
    });

    if (!doctorProfile) {
      throw new AppError('NOT_FOUND', 'Doctor not found', 404);
    }

    // Create appointment and lock slot in transaction
    return this.prisma.$transaction(async (tx) => {
      // Lock the slot
      await tx.schedule.update({
        where: { id: data.slotId },
        data: { status: SlotStatus.BOOKED },
      });

      // Create appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: doctorProfile.userId,
          slotId: data.slotId,
          symptoms: data.symptoms,
          notes: data.notes,
          consultationType: data.consultationType || ConsultationType.IN_PERSON,
          status: AppointmentStatus.SCHEDULED,
          paymentStatus: PaymentStatus.PENDING,
        },
        include: {
          patient: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true },
          },
          doctor: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true },
          },
          slot: {
            select: { id: true, startTime: true, endTime: true, status: true },
          },
        },
      });

      return appointment;
    });
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(id: string, userId: string, userType: UserType): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization
    const isPatient = appointment.patientId === userId;
    const isDoctor = appointment.doctorId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    if (!isPatient && !isDoctor && !isAdminOrStaff) {
      throw new AppError('FORBIDDEN', 'Not authorized to view this appointment', 403);
    }

    return appointment;
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    id: string,
    userId: string,
    userType: UserType,
    data: AppointmentUpdateInput
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization
    const isDoctor = appointment.doctorId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    // Patients can only update symptoms/notes for their own appointments
    const isPatient = appointment.patientId === userId;
    if (isPatient) {
      const allowedFields = ['symptoms', 'notes'];
      const hasDisallowedFields = Object.keys(data).some((key) => !allowedFields.includes(key));
      if (hasDisallowedFields) {
        throw new AppError('FORBIDDEN', 'Patients can only update symptoms and notes', 403);
      }
    } else if (!isDoctor && !isAdminOrStaff) {
      throw new AppError('FORBIDDEN', 'Not authorized to update this appointment', 403);
    }

    // If status is being changed to CANCELLED, release the slot
    if (
      data.status === AppointmentStatus.CANCELLED &&
      appointment.status !== AppointmentStatus.CANCELLED
    ) {
      await this.scheduleRepository.releaseSlot(appointment.slotId);
    }

    // If status is being changed from CANCELLED back to SCHEDULED, lock the slot
    if (
      data.status === AppointmentStatus.SCHEDULED &&
      appointment.status === AppointmentStatus.CANCELLED
    ) {
      const slot = await this.scheduleRepository.findById(appointment.slotId);
      if (!slot || slot.status !== SlotStatus.AVAILABLE) {
        throw new AppError('CONFLICT', 'Slot is no longer available', 409);
      }
      await this.scheduleRepository.lockSlot(appointment.slotId, appointment.patientId);
    }

    return this.appointmentRepository.update(id, data);
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(id: string, userId: string, userType: UserType): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    const isPatient = appointment.patientId === userId;
    const isDoctor = appointment.doctorId === userId;
    const isAdminOrStaff = userType === UserType.ADMIN || userType === UserType.STAFF;

    if (!isPatient && !isDoctor && !isAdminOrStaff) {
      throw new AppError('FORBIDDEN', 'Not authorized to cancel this appointment', 403);
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError('CONFLICT', 'Appointment is already cancelled', 409);
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('CONFLICT', 'Cannot cancel a completed appointment', 409);
    }

    // Release the slot
    await this.scheduleRepository.releaseSlot(appointment.slotId);

    // Update appointment status
    return this.appointmentRepository.update(id, { status: AppointmentStatus.CANCELLED });
  }

  /**
   * List appointments with filters
   */
  async listAppointments(
    filters: AppointmentFilters,
    userId: string,
    userType: UserType
  ): Promise<{ data: Appointment[]; meta: { total: number; totalPages: number } }> {
    return this.appointmentRepository.findMany(filters, userId, userType);
  }

  /**
   * Get upcoming appointments
   */
  async getUpcomingAppointments(
    userId: string,
    userType: UserType,
    limit: number = 5
  ): Promise<Appointment[]> {
    return this.appointmentRepository.getUpcoming(userId, userType, limit);
  }

  /**
   * Get appointment statistics for doctor
   */
  async getDoctorStats(doctorId: string): Promise<DoctorStats> {
    return this.appointmentRepository.getDoctorStats(doctorId);
  }

  /**
   * Get appointment statistics for patient
   */
  async getPatientStats(patientId: string): Promise<PatientStats> {
    return this.appointmentRepository.getPatientStats(patientId);
  }
}

// Factory function for dependency injection
export function createAppointmentService(
  appointmentRepository: AppointmentRepository,
  scheduleRepository: ScheduleRepository,
  prisma: PrismaClient
): AppointmentService {
  return new AppointmentService(appointmentRepository, scheduleRepository, prisma);
}
