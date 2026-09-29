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
import { NotificationService } from '../../../lib/notificationService';
import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
  Appointment,
  DoctorStats,
  PatientStats,
  TimelineEntry,
} from '../types';

export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private scheduleRepository: ScheduleRepository,
    private prisma: PrismaClient,
    private notificationService: NotificationService = new NotificationService()
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

    // Get patient info for notifications
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true },
    });

    if (!patient) {
      throw new AppError('NOT_FOUND', 'Patient not found', 404);
    }

    // Get doctor info for notifications
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorProfile.userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true },
    });

    if (!doctor) {
      throw new AppError('NOT_FOUND', 'Doctor user not found', 404);
    }

    // Get doctor profile for specialty and clinic (bio is used as clinic)
    const doctorProfileFull = await this.prisma.doctorProfile.findUnique({
      where: { id: slot.doctorId },
      select: { specialty: true, bio: true, designation: true, fee: true },
    });

    // Create appointment and lock slot in transaction
    const appointment = await this.prisma.$transaction(async (tx) => {
      // Lock the slot
      await tx.schedule.update({
        where: { id: data.slotId },
        data: { status: SlotStatus.BOOKED },
      });

      // Create appointment
      const newAppointment = await tx.appointment.create({
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

      return newAppointment;
    });

    // Send booking confirmation notification
    const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
    await this.notificationService.sendBookingConfirmation({
      appointmentId: appointment.id,
      patientId: patient.id,
      doctorId: doctor.id,
      slotId: data.slotId,
      startTime: appointment.slot!.startTime,
      endTime: appointment.slot!.endTime,
      doctorName,
      specialty: doctorProfileFull?.specialty || 'Unknown',
      clinic: doctorProfileFull?.bio || 'Clinic',
      consultationType: appointment.consultationType,
    });

    // Queue reminders (in production, these would be scheduled via BullMQ)
    await this.notificationService.queueAppointmentNotifications({
      appointmentId: appointment.id,
      patientId: patient.id,
      doctorId: doctor.id,
      slotId: data.slotId,
      startTime: appointment.slot!.startTime,
      endTime: appointment.slot!.endTime,
      doctorName,
      specialty: doctorProfileFull?.specialty || 'Unknown',
      clinic: doctorProfileFull?.bio || 'Clinic',
      consultationType: appointment.consultationType,
    });

    return appointment;
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
   * Cancel appointment with 2-hour threshold check
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

    // Check 2-hour threshold for patients
    if (isPatient && !isAdminOrStaff) {
      const slot = await this.scheduleRepository.findById(appointment.slotId);
      if (slot) {
        const appointmentTime = new Date(slot.startTime).getTime();
        const now = Date.now();
        const twoHoursInMs = 2 * 60 * 60 * 1000;

        if (appointmentTime - now < twoHoursInMs) {
          throw new AppError(
            'FORBIDDEN',
            'Cancellations within 2 hours of the appointment are not allowed. Please contact the clinic directly.',
            403
          );
        }
      }
    }

    // Get slot info for notification
    const slot = await this.scheduleRepository.findByIdWithDoctor(appointment.slotId);
    const doctor = appointment.doctor
      ? {
          id: appointment.doctor.id,
          firstName: appointment.doctor.firstName,
          lastName: appointment.doctor.lastName,
        }
      : null;

    // Release the slot
    await this.scheduleRepository.releaseSlot(appointment.slotId);

    // Update appointment status
    const cancelledAppointment = await this.appointmentRepository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });

    // Send cancellation notification
    if (doctor && slot) {
      const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
      await this.notificationService.sendBookingCancellation({
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: doctor.id,
        slotId: appointment.slotId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        doctorName,
        specialty: slot.doctor?.specialty || 'Unknown',
        clinic: slot.doctor?.clinic || 'Clinic',
        consultationType: appointment.consultationType,
      });
    }

    return cancelledAppointment;
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

  /**
   * Get dashboard statistics for patient
   */
  async getDashboardStats(patientId: string): Promise<{
    upcomingAppointments: number;
    totalAppointments: number;
    totalExpenses: number;
    prescriptionCompliance: number;
    nextAppointment: Appointment | null;
    appointmentsByStatus: Record<AppointmentStatus, number>;
    appointmentsBySpecialty: Array<{ specialty: string; count: number }>;
    monthlyExpenses: Array<{ month: string; amount: number }>;
  }> {
    // Get appointment stats
    const appointmentStats = await this.appointmentRepository.getPatientStats(patientId);

    // Get upcoming appointments with details for next appointment
    const upcomingAppointments = await this.appointmentRepository.getUpcomingWithDetails(
      patientId,
      1
    );
    const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

    // Get monthly expenses (last 6 months)
    const monthlyExpenses = await this.getMonthlyExpenses(patientId);

    // Get appointments by specialty
    const appointmentsBySpecialty = await this.getAppointmentsBySpecialty(patientId);

    // Calculate prescription compliance
    const prescriptionCompliance = await this.calculatePrescriptionCompliance(patientId);

    return {
      upcomingAppointments: appointmentStats.scheduled,
      totalAppointments: appointmentStats.total,
      totalExpenses: monthlyExpenses.reduce((sum, m) => sum + m.amount, 0),
      prescriptionCompliance,
      nextAppointment,
      appointmentsByStatus: {
        [AppointmentStatus.SCHEDULED]: appointmentStats.scheduled,
        [AppointmentStatus.COMPLETED]: appointmentStats.completed,
        [AppointmentStatus.CANCELLED]: appointmentStats.cancelled,
        [AppointmentStatus.NO_SHOW]: appointmentStats.noShow,
      },
      appointmentsBySpecialty,
      monthlyExpenses,
    };
  }

  /**
   * Get upcoming appointments with full details
   */
  async getUpcomingWithDetails(patientId: string, limit: number = 10) {
    return this.appointmentRepository.getUpcomingWithDetails(patientId, limit);
  }

  /**
   * Get completed appointments with prescription links
   */
  async getCompletedWithPrescriptions(patientId: string, limit: number = 10) {
    return this.appointmentRepository.getCompletedWithPrescriptions(patientId, limit);
  }

  /**
   * Get medical timeline combining appointments and prescriptions
   */
  async getMedicalTimeline(
    patientId: string,
    query: { page: number; limit: number; type?: string; dateFrom?: string; dateTo?: string }
  ): Promise<{
    data: TimelineEntry[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { page, limit, type, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = { patientId };

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom);
      if (dateTo) whereClause.createdAt.lte = new Date(dateTo);
    }

    const [appointments, prescriptions] = await Promise.all([
      // Get appointments
      type !== 'prescriptions'
        ? this.appointmentRepository.findManyForTimeline(patientId, whereClause)
        : [],
      // Get prescriptions
      type !== 'appointments'
        ? this.prisma.prescription.findMany({
            where: { patientId, ...whereClause },
            include: {
              appointment: {
                include: {
                  slot: { select: { startTime: true, endTime: true } },
                  patient: { select: { id: true, firstName: true, lastName: true } },
                  doctor: {
                    select: { id: true, firstName: true, lastName: true },
                    include: {
                      doctorProfile: { select: { specialty: true, designation: true, fee: true } },
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          })
        : [],
    ]);

    // Transform to timeline entries
    const timelineEntries: TimelineEntry[] = [];

    // Add appointments
    for (const appt of appointments) {
      const doctorProfile = appt.doctorProfile;
      timelineEntries.push({
        id: `appt-${appt.id}`,
        type: 'appointment',
        date: appt.slot.startTime,
        title: `Appointment with Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
        description: appt.symptoms || 'No symptoms recorded',
        doctorName: `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
        doctorSpecialty: doctorProfile?.specialty || 'Unknown',
        clinic: 'Clinic',
        appointmentId: appt.id,
        appointmentStatus: appt.status,
        consultationType: appt.consultationType,
        symptoms: appt.symptoms,
      });
    }

    // Add prescriptions
    for (const rx of prescriptions) {
      const doctorProfile = rx.appointment.doctor?.doctorProfile;
      timelineEntries.push({
        id: `rx-${rx.id}`,
        type: 'prescription',
        date: rx.createdAt,
        title: `Prescription from Dr. ${rx.appointment.doctor.firstName} ${rx.appointment.doctor.lastName}`,
        description: rx.diagnosis,
        doctorName: `Dr. ${rx.appointment.doctor.firstName} ${rx.appointment.doctor.lastName}`,
        doctorSpecialty: doctorProfile?.specialty || 'Unknown',
        clinic: 'Clinic',
        prescriptionId: rx.id,
        diagnosis: rx.diagnosis,
        medications: rx.medications,
        tests: rx.tests,
        notes: rx.notes,
      });
    }

    // Sort by date descending (most recent first)
    timelineEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Apply pagination
    const total = timelineEntries.length;
    const paginatedEntries = timelineEntries.slice(skip, skip + limit);

    return {
      data: paginatedEntries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Private helper methods

  private async getMonthlyExpenses(
    patientId: string
  ): Promise<Array<{ month: string; amount: number }>> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const completedAppointments = await this.prisma.appointment.findMany({
      where: {
        patientId,
        status: AppointmentStatus.COMPLETED,
        createdAt: { gte: sixMonthsAgo },
      },
      include: {
        slot: true,
        doctor: {
          include: {
            doctorProfile: true,
          },
        },
      },
    });

    // Group by month
    const monthlyMap = new Map<string, number>();

    for (const appt of completedAppointments) {
      const monthKey = `${appt.createdAt.getFullYear()}-${String(appt.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const fee = appt.doctor?.doctorProfile?.fee || 0;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(fee));
    }

    // Format as array
    const result: Array<{ month: string; amount: number }> = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      result.push({ month: monthName, amount: monthlyMap.get(key) || 0 });
    }

    return result;
  }

  private async getAppointmentsBySpecialty(
    patientId: string
  ): Promise<Array<{ specialty: string; count: number }>> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: {
            doctorProfile: { select: { specialty: true } },
          },
        },
      },
    });

    const specialtyMap = new Map<string, number>();

    for (const appt of appointments) {
      const specialty = appt.doctor?.doctorProfile?.specialty || 'Unknown';
      specialtyMap.set(specialty, (specialtyMap.get(specialty) || 0) + 1);
    }

    return Array.from(specialtyMap.entries()).map(([specialty, count]) => ({ specialty, count }));
  }

  private async calculatePrescriptionCompliance(patientId: string): Promise<number> {
    // Get completed appointments
    const completedAppointments = await this.prisma.appointment.findMany({
      where: {
        patientId,
        status: AppointmentStatus.COMPLETED,
      },
      select: { id: true },
    });

    if (completedAppointments.length === 0) return 100;

    const appointmentIds = completedAppointments.map((a) => a.id);

    // Get prescriptions for these appointments
    const prescriptions = await this.prisma.prescription.count({
      where: { appointmentId: { in: appointmentIds } },
    });

    return Math.round((prescriptions / completedAppointments.length) * 100);
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
