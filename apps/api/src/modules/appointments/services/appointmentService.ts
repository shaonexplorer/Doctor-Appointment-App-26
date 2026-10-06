/**
 * Appointment Service
 * Business logic for appointment operations
 */

import type { AppointmentRepository, ScheduleRepository } from '../../../repositories';
import type { PrismaClient, Schedule } from '@prisma/client';
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
  DoctorDashboardStats,
  DoctorCompleteAppointmentInput,
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

    // Release the slot
    await this.scheduleRepository.releaseSlot(appointment.slotId);

    // Update appointment status
    const cancelledAppointment = await this.appointmentRepository.update(id, {
      status: AppointmentStatus.CANCELLED,
    });

    // Send cancellation notification
    await this.sendCancellationNotification(
      appointment.id,
      appointment.patientId,
      appointment.doctorId,
      appointment.slotId,
      appointment.consultationType
    );

    return cancelledAppointment;
  }

  /**
   * Get cancellation notification data
   */
  private async getCancellationNotificationData(
    appointmentId: string,
    slotId: string,
    doctorId: string
  ): Promise<{
    doctorName: string;
    specialty: string;
    clinic: string;
    startTime: Date;
    endTime: Date;
  } | null> {
    const slot = await this.scheduleRepository.findByIdWithDoctor(slotId);
    if (!slot || !slot.doctor) return null;

    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      select: { bio: true },
    });

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) return null;

    return {
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: slot.doctor.specialty || 'Unknown',
      clinic: doctorProfile?.bio || 'Clinic',
      startTime: slot.startTime,
      endTime: slot.endTime,
    };
  }

  // Send cancellation notification
  async sendCancellationNotification(
    appointmentId: string,
    patientId: string,
    doctorId: string,
    slotId: string,
    consultationType: ConsultationType
  ): Promise<void> {
    const notificationData = await this.getCancellationNotificationData(
      appointmentId,
      slotId,
      doctorId
    );
    if (notificationData) {
      await this.notificationService.sendBookingCancellation({
        appointmentId,
        patientId,
        doctorId,
        slotId,
        startTime: notificationData.startTime,
        endTime: notificationData.endTime,
        doctorName: notificationData.doctorName,
        specialty: notificationData.specialty,
        clinic: notificationData.clinic,
        consultationType,
      });
    }
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
  ): Promise<
    Array<{
      id: string;
      patientId: string;
      doctorId: string;
      slotId: string;
      status: AppointmentStatus;
      symptoms: string | null;
      notes: string | null;
      paymentStatus: PaymentStatus;
      consultationType: ConsultationType;
      createdAt: Date;
      updatedAt: Date;
      patient: { id: string; firstName: string; lastName: string };
      doctor: { id: string; firstName: string; lastName: string };
      slot: { id: string; startTime: Date; endTime: Date };
    }>
  > {
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
    nextAppointment: {
      id: string;
      status: AppointmentStatus;
      symptoms: string | null;
      notes: string | null;
      consultationType: ConsultationType;
      paymentStatus: PaymentStatus;
      createdAt: Date;
      slot: { id: string; startTime: Date; endTime: Date };
      doctor: { id: string; firstName: string; lastName: string; email: string };
      doctorProfile: {
        specialty: string;
        clinic?: string;
        designation: string;
        fee: number;
      } | null;
    } | null;
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
      (whereClause as Record<string, { gte?: Date; lte?: Date }>).createdAt = {};
      if (dateFrom)
        (whereClause as Record<string, { gte?: Date; lte?: Date }>).createdAt.gte = new Date(
          dateFrom
        );
      if (dateTo)
        (whereClause as Record<string, { gte?: Date; lte?: Date }>).createdAt.lte = new Date(
          dateTo
        );
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
        medications:
          typeof rx.medications === 'string' ? rx.medications : JSON.stringify(rx.medications),
        tests:
          typeof rx.tests === 'string' ? rx.tests : rx.tests ? JSON.stringify(rx.tests) : undefined,
        notes:
          typeof rx.notes === 'string' ? rx.notes : rx.notes ? JSON.stringify(rx.notes) : undefined,
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

  /**
   * Get doctor appointments with filters (Doctor Portal)
   */
  async getDoctorAppointments(
    doctorId: string,
    filters: {
      page: number;
      limit: number;
      status?: string | string[];
      search?: string;
      patientSearch?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<{ data: Appointment[]; meta: { total: number; totalPages: number } }> {
    const { page, limit, status, patientSearch, dateFrom, dateTo, sortBy, sortOrder } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { doctorId };

    if (status && status.length > 0) {
      where.status = { in: Array.isArray(status) ? status : [status] };
    }

    if (patientSearch) {
      where.patient = {
        OR: [
          { firstName: { contains: patientSearch, mode: 'insensitive' } },
          { lastName: { contains: patientSearch, mode: 'insensitive' } },
          { email: { contains: patientSearch, mode: 'insensitive' } },
        ],
      };
    }

    if (dateFrom || dateTo) {
      (where as Record<string, { gte?: Date; lte?: Date }>).createdAt = {};
      if (dateFrom)
        (where as Record<string, { gte?: Date; lte?: Date }>).createdAt.gte = new Date(dateFrom);
      if (dateTo)
        (where as Record<string, { gte?: Date; lte?: Date }>).createdAt.lte = new Date(dateTo);
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        skip,
        take: limit,
        where,
        include: {
          patient: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              userType: true,
            },
          },
          doctor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              userType: true,
            },
          },
          slot: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
            },
          },
          prescriptions: {
            select: {
              id: true,
              diagnosis: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single appointment detail for doctor
   */
  async getDoctorAppointmentDetail(appointmentId: string, doctorId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization - doctor must own this appointment or be admin/staff
    if (appointment.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to view this appointment', 403);
    }

    return appointment;
  }

  /**
   * Get doctor dashboard statistics
   * Note: doctorId here is the User ID, need to look up DoctorProfile ID for Schedule queries
   */
  async getDoctorDashboardStats(userId: string): Promise<DoctorDashboardStats> {
    // Look up DoctorProfile ID from User ID
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true, fee: true },
    });

    if (!doctorProfile) {
      return {
        todayAppointments: 0,
        weeklyAppointments: 0,
        slotUtilization: 0,
        totalRevenue: 0,
        revenueByConsultationType: [],
        dailyVolume: [],
      };
    }

    const doctorId = doctorProfile.id;
    const fee = doctorProfile.fee ? Number(doctorProfile.fee) : 0;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)

    // Get today's appointments (doctorId in Appointment is User ID)
    const todayAppointments = await this.prisma.appointment.count({
      where: {
        doctorId: userId,
        slot: {
          startTime: { gte: todayStart, lt: todayEnd },
        },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
      },
    });

    // Get this week's appointments
    const weeklyAppointments = await this.prisma.appointment.count({
      where: {
        doctorId: userId,
        slot: {
          startTime: { gte: weekStart },
        },
        status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
      },
    });

    // Get slot utilization (available vs booked slots this week) - Schedule uses DoctorProfile ID
    const [totalSlotsThisWeek, bookedSlotsThisWeek] = await Promise.all([
      this.prisma.schedule.count({
        where: {
          doctorId,
          startTime: { gte: weekStart },
        },
      }),
      this.prisma.schedule.count({
        where: {
          doctorId,
          startTime: { gte: weekStart },
          status: { in: [SlotStatus.BOOKED] },
        },
      }),
    ]);

    const slotUtilization =
      totalSlotsThisWeek > 0 ? Math.round((bookedSlotsThisWeek / totalSlotsThisWeek) * 100) : 0;

    // Get total revenue (completed appointments)
    const completedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: userId,
        status: AppointmentStatus.COMPLETED,
      },
      include: {
        doctor: {
          include: {
            doctorProfile: { select: { fee: true } },
          },
        },
      },
    });

    const totalRevenue = completedAppointments.reduce((sum, appt) => {
      const apptFee = appt.doctor?.doctorProfile?.fee || 0;
      return sum + Number(apptFee);
    }, 0);

    // Revenue by consultation type
    const revenueByType = await this.prisma.appointment.groupBy({
      by: ['consultationType'],
      where: {
        doctorId: userId,
        status: AppointmentStatus.COMPLETED,
      },
      _count: { id: true },
    });

    const revenueByConsultationType = revenueByType.map((r) => ({
      type: r.consultationType,
      amount: r._count.id * fee,
    }));

    // Daily volume for the last 7 days
    const dailyVolume = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date(todayStart);
        date.setDate(date.getDate() - (6 - i));
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await this.prisma.appointment.count({
          where: {
            doctorId: userId,
            slot: {
              startTime: { gte: date, lt: nextDate },
            },
            status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
          },
        });

        return {
          date: date.toISOString().split('T')[0],
          count,
        };
      })
    );

    return {
      todayAppointments,
      weeklyAppointments,
      slotUtilization,
      totalRevenue,
      revenueByConsultationType,
      dailyVolume,
    };
  }

  /**
   * Get patient volume analytics (daily/weekly)
   * GET /api/appointments/stats/doctor/volume
   */
  async getDoctorVolumeStats(
    doctorId: string,
    days: number = 7
  ): Promise<Array<{ date: string; count: number; label: string }>> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(todayStart);
    startDate.setDate(startDate.getDate() - (days - 1));

    const volumeData = await Promise.all(
      Array.from({ length: days }, async (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await this.prisma.appointment.count({
          where: {
            doctorId,
            slot: {
              startTime: { gte: date, lt: nextDate },
            },
            status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
          },
        });

        return {
          date: date.toISOString().split('T')[0],
          count,
          label: date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
        };
      })
    );

    return volumeData;
  }

  /**
   * Get slot utilization analytics
   * GET /api/appointments/stats/doctor/utilization
   * Note: doctorId here is the User ID, need to look up DoctorProfile ID
   */
  async getDoctorUtilizationStats(userId: string): Promise<{
    booked: number;
    available: number;
    cancelled: number;
    noShow: number;
    total: number;
  }> {
    // Look up DoctorProfile ID from User ID
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctorProfile) {
      return { booked: 0, available: 0, cancelled: 0, noShow: 0, total: 0 };
    }

    const doctorId = doctorProfile.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [booked, available, cancelled, noShow, total] = await Promise.all([
      this.prisma.schedule.count({
        where: { doctorId, startTime: { gte: weekStart }, status: SlotStatus.BOOKED },
      }),
      this.prisma.schedule.count({
        where: { doctorId, startTime: { gte: weekStart }, status: SlotStatus.AVAILABLE },
      }),
      this.prisma.schedule.count({
        where: { doctorId, startTime: { gte: weekStart }, status: SlotStatus.CANCELLED },
      }),
      this.prisma.appointment.count({
        where: {
          doctorId: userId,
          slot: { startTime: { gte: weekStart } },
          status: AppointmentStatus.NO_SHOW,
        },
      }),
      this.prisma.schedule.count({
        where: { doctorId, startTime: { gte: weekStart } },
      }),
    ]);

    return { booked, available, cancelled, noShow, total };
  }

  /**
   * Get revenue analytics by consultation type
   * GET /api/appointments/stats/doctor/revenue
   * Note: doctorId here is the User ID
   */
  async getDoctorRevenueStats(userId: string): Promise<Array<{ type: string; amount: number }>> {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      select: { fee: true },
    });
    const fee = doctorProfile?.fee ? Number(doctorProfile.fee) : 0;

    const revenueByType = await this.prisma.appointment.groupBy({
      by: ['consultationType'],
      where: {
        doctorId: userId,
        status: AppointmentStatus.COMPLETED,
      },
      _count: { id: true },
    });

    return revenueByType.map((r) => ({
      type: r.consultationType,
      amount: r._count.id * fee,
    }));
  }

  /**
   * Cancel appointment as doctor (with refund trigger)
   * POST /api/appointments/doctor/:id/cancel
   */
  async cancelAppointmentAsDoctor(
    appointmentId: string,
    doctorId: string,
    _data: { reason: string; triggerRefund: boolean }
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization - must be the doctor or admin/staff
    if (appointment.doctorId !== doctorId) {
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
    const cancelledAppointment = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    });

    // Send cancellation notification
    await this.sendCancellationNotification(
      appointment.id,
      appointment.patientId,
      appointment.doctorId,
      appointment.slotId,
      appointment.consultationType
    );

    // TODO: If triggerRefund is true, integrate with payment provider (Stripe) to process refund
    // This would be implemented when payment integration is added

    return cancelledAppointment;
  }

  /**
   * Reschedule appointment as doctor
   * POST /api/appointments/doctor/:id/reschedule
   */
  async rescheduleAppointmentAsDoctor(
    appointmentId: string,
    doctorId: string,
    newSlotId: string
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization - must be the doctor or admin/staff
    if (appointment.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to reschedule this appointment', 403);
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError('CONFLICT', 'Cannot reschedule a cancelled appointment', 409);
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('CONFLICT', 'Cannot reschedule a completed appointment', 409);
    }

    // Check if new slot exists and is available
    const newSlot = await this.scheduleRepository.findByIdWithAppointment(newSlotId);
    if (!newSlot) {
      throw new AppError('NOT_FOUND', 'New slot not found', 404);
    }

    if (newSlot.status !== SlotStatus.AVAILABLE) {
      throw new AppError('CONFLICT', 'New slot is not available', 409);
    }

    if (newSlot.appointment) {
      throw new AppError('CONFLICT', 'New slot is already booked', 409);
    }

    // Verify new slot belongs to the same doctor
    // appointment.doctorId is User ID, newSlot.doctorId is DoctorProfile ID
    // Need to look up DoctorProfile for the appointment's doctor
    const appointmentDoctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: appointment.doctorId },
      select: { id: true },
    });

    if (!appointmentDoctorProfile || newSlot.doctorId !== appointmentDoctorProfile.id) {
      throw new AppError('FORBIDDEN', 'New slot must belong to the same doctor', 403);
    }

    // Get old slot with doctor for notification
    const oldSlot = await this.scheduleRepository.findByIdWithDoctor(appointment.slotId);

    // Perform reschedule in transaction
    const rescheduledAppointment = await this.prisma.$transaction(async (tx) => {
      // Release old slot
      await tx.schedule.update({
        where: { id: appointment.slotId },
        data: { status: SlotStatus.AVAILABLE },
      });

      // Lock new slot
      await tx.schedule.update({
        where: { id: newSlotId },
        data: { status: SlotStatus.BOOKED },
      });

      // Update appointment with new slot
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          slotId: newSlotId,
          status: AppointmentStatus.SCHEDULED,
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

      return updatedAppointment;
    });

    // Send reschedule notification
    await this.sendRescheduleNotification(
      appointment.id,
      appointment.patientId,
      appointment.doctorId,
      oldSlot!,
      newSlot,
      appointment.consultationType
    );

    return rescheduledAppointment;
  }

  /**
   * Patient check-in by doctor/staff
   * PATCH /api/appointments/doctor/:id/check-in
   */
  async checkInPatient(
    appointmentId: string,
    doctorId: string,
    notes?: string | null
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization - must be the doctor or admin/staff
    // Note: In a real system, staff might also check in patients
    if (appointment.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to check in this patient', 403);
    }

    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new AppError(
        'CONFLICT',
        `Cannot check in appointment with status: ${appointment.status}`,
        409
      );
    }

    // Update appointment status and add check-in notes
    const updatedAppointment = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.SCHEDULED, // Status stays SCHEDULED, but we could add a check-in timestamp
      notes: notes ? `${appointment.notes || ''}\n[Check-in]: ${notes}`.trim() : appointment.notes,
    });

    // Send check-in notification to patient
    await this.sendCheckInNotification(appointment, doctorId);

    return updatedAppointment;
  }

  /**
   * Complete appointment as doctor
   * PATCH /api/appointments/doctor/:id/complete
   */
  async completeAppointmentAsDoctor(
    appointmentId: string,
    doctorId: string,
    data: DoctorCompleteAppointmentInput
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('NOT_FOUND', 'Appointment not found', 404);
    }

    // Check authorization - must be the doctor or admin/staff
    if (appointment.doctorId !== doctorId) {
      throw new AppError('FORBIDDEN', 'Not authorized to complete this appointment', 403);
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError('CONFLICT', 'Cannot complete a cancelled appointment', 409);
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('CONFLICT', 'Appointment is already completed', 409);
    }

    if (appointment.status === AppointmentStatus.NO_SHOW) {
      throw new AppError('CONFLICT', 'Cannot complete a no-show appointment', 409);
    }

    // Build notes with completion details
    const completionNotes = [];
    if (appointment.notes) completionNotes.push(appointment.notes);
    if (data.notes) completionNotes.push(`[Completion Notes]: ${data.notes}`);
    if (data.diagnosis) completionNotes.push(`[Diagnosis]: ${data.diagnosis}`);

    // Update appointment status to COMPLETED
    const completedAppointment = await this.appointmentRepository.update(appointmentId, {
      status: AppointmentStatus.COMPLETED,
      notes: completionNotes.join('\n'),
    });

    // Send completion notification to patient
    await this.sendCompletionNotification(appointment, doctorId, data);

    return completedAppointment;
  }

  /**
   * Send completion notification
   */
  private async sendCompletionNotification(
    appointment: Appointment,
    doctorId: string,
    data: DoctorCompleteAppointmentInput
  ): Promise<void> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) return;

    const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    // Fetch slot with doctor profile for notification
    const slot = await this.scheduleRepository.findByIdWithDoctor(appointment.slotId);
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: appointment.doctorId },
      select: { specialty: true, bio: true },
    });

    await this.notificationService.sendAppointmentCompletion({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      slotId: appointment.slotId,
      startTime: slot?.startTime || new Date(),
      endTime: slot?.endTime || new Date(),
      doctorName,
      specialty: doctorProfile?.specialty || slot?.doctor?.specialty || 'Unknown',
      clinic: doctorProfile?.bio || 'Clinic',
      consultationType: appointment.consultationType,
      diagnosis: data.diagnosis,
      notes: data.notes,
    });
  }

  /**
   * Send reschedule notification
   */
  private async sendRescheduleNotification(
    appointmentId: string,
    patientId: string,
    doctorId: string,
    oldSlot: Schedule & { doctor?: { specialty: string } | null },
    newSlot: Schedule,
    consultationType: ConsultationType
  ): Promise<void> {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
      select: { bio: true },
    });

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) return;

    const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    await this.notificationService.sendBookingReschedule({
      appointmentId,
      patientId,
      doctorId,
      slotId: newSlot.id, // Use new slot as the current slot
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      oldSlotId: oldSlot.id,
      newSlotId: newSlot.id,
      oldStartTime: oldSlot.startTime,
      oldEndTime: oldSlot.endTime,
      newStartTime: newSlot.startTime,
      newEndTime: newSlot.endTime,
      doctorName,
      specialty: oldSlot.doctor?.specialty || 'Unknown',
      clinic: doctorProfile?.bio || 'Clinic',
      consultationType,
    });
  }

  /**
   * Send check-in notification
   */
  private async sendCheckInNotification(appointment: Appointment, doctorId: string): Promise<void> {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { firstName: true, lastName: true },
    });

    if (!doctor) return;

    const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

    // Fetch slot with doctor profile for notification
    const slot = await this.scheduleRepository.findByIdWithDoctor(appointment.slotId);
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId: appointment.doctorId },
      select: { specialty: true, bio: true },
    });

    await this.notificationService.sendCheckInConfirmation({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      slotId: appointment.slotId,
      startTime: slot?.startTime || new Date(),
      endTime: slot?.endTime || new Date(),
      doctorName,
      specialty: doctorProfile?.specialty || slot?.doctor?.specialty || 'Unknown',
      clinic: doctorProfile?.bio || 'Clinic',
      consultationType: appointment.consultationType,
    });
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
