/**
 * Patient Service
 * Business logic for patient-specific operations
 */

import type { PrismaClient } from '@prisma/client';
import { AppointmentStatus } from '@prisma/client';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  PatientDashboardStats,
  NextAppointment,
  MedicalTimelineEntry,
  MedicalTimelineResponse,
  UpcomingAppointmentDetail,
  CompletedAppointmentDetail,
  TimelineQuery,
  DoctorPatientListItem,
  DoctorPatientListResponse,
  DoctorPatientDetail,
} from '../types';
import type { AppointmentRepository, PrescriptionRepository } from '../../../repositories';

export class PatientService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private prescriptionRepository: PrescriptionRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Get dashboard statistics for a patient
   */
  async getDashboardStats(patientId: string): Promise<PatientDashboardStats> {
    // Get appointment stats
    const appointmentStats = await this.appointmentRepository.getPatientStats(patientId);

    // Get upcoming appointments with details for next appointment
    const upcomingAppointments = await this.appointmentRepository.getUpcomingWithDetails(
      patientId,
      1
    );
    const nextAppointment =
      upcomingAppointments.length > 0 ? this.formatNextAppointment(upcomingAppointments[0]) : null;

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
   * Get medical timeline combining appointments and prescriptions
   */
  async getMedicalTimeline(
    patientId: string,
    query: TimelineQuery
  ): Promise<MedicalTimelineResponse> {
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
        ? this.prescriptionRepository.findManyForTimeline(patientId, whereClause)
        : [],
    ]);

    // Transform to timeline entries
    const timelineEntries: MedicalTimelineEntry[] = [];

    // Add appointments
    for (const appt of appointments) {
      timelineEntries.push({
        id: `appt-${appt.id}`,
        type: 'appointment',
        date: appt.slot.startTime,
        title: `Appointment with Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
        description: appt.symptoms || 'No symptoms recorded',
        doctorName: `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
        doctorSpecialty: appt.doctorProfile?.specialty || 'Unknown',
        clinic: appt.doctorProfile?.clinic || 'Clinic',
        appointmentId: appt.id,
        appointmentStatus: appt.status,
        consultationType: appt.consultationType,
        symptoms: appt.symptoms,
      });
    }

    // Add prescriptions
    for (const rx of prescriptions) {
      timelineEntries.push({
        id: `rx-${rx.id}`,
        type: 'prescription',
        date: rx.createdAt,
        title: `Prescription from Dr. ${rx.appointment.doctor.firstName} ${rx.appointment.doctor.lastName}`,
        description: rx.diagnosis,
        doctorName: `Dr. ${rx.appointment.doctor.firstName} ${rx.appointment.doctor.lastName}`,
        doctorSpecialty: rx.appointment.doctorProfile?.specialty || 'Unknown',
        clinic: rx.appointment.doctorProfile?.clinic || 'Clinic',
        prescriptionId: rx.id,
        diagnosis: rx.diagnosis,
        medications: rx.medications as string | object,
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

  /**
   * Get upcoming appointments with full details
   */
  async getUpcomingWithDetails(
    patientId: string,
    limit: number = 10
  ): Promise<UpcomingAppointmentDetail[]> {
    return this.appointmentRepository.getUpcomingWithDetails(patientId, limit);
  }

  /**
   * Get completed appointments with prescription links
   */
  async getCompletedWithPrescriptions(
    patientId: string,
    limit: number = 10
  ): Promise<CompletedAppointmentDetail[]> {
    return this.appointmentRepository.getCompletedWithPrescriptions(patientId, limit);
  }

  // Private helper methods

  private formatNextAppointment(appt: UpcomingAppointmentDetail): NextAppointment {
    return {
      id: appt.id,
      doctorName: `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`,
      doctorSpecialty: appt.doctorProfile?.specialty || 'Unknown',
      clinic: appt.doctorProfile?.clinic || 'Clinic',
      startTime: appt.slot.startTime,
      endTime: appt.slot.endTime,
      consultationType: appt.consultationType,
      status: appt.status,
    };
  }

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

  // ==================== DOCTOR PORTAL ENDPOINTS ====================

  /**
   * Get doctor's patient list (Doctor Portal)
   */
  async getDoctorPatientList(
    doctorId: string,
    query: {
      page: number;
      limit: number;
      search?: string;
      condition?: string;
      status?: 'all' | 'active' | 'inactive';
      sortBy?: 'lastVisit' | 'nextAppointment' | 'name' | 'totalAppointments';
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<DoctorPatientListResponse> {
    const {
      page,
      limit,
      search,
      condition,
      status,
      sortBy = 'lastVisit',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Get all patients who have had appointments with this doctor
    const patientsWithAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        status: { in: [AppointmentStatus.COMPLETED, AppointmentStatus.SCHEDULED] },
      },
      select: {
        patientId: true,
      },
      distinct: ['patientId'],
    });

    const patientIds = patientsWithAppointments.map((a) => a.patientId);

    if (patientIds.length === 0) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    // Build where clause for patient search
    const patientWhere: Record<string, unknown> = {
      id: { in: patientIds },
    };

    if (search) {
      patientWhere.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get patients with their profiles
    const patients = await this.prisma.user.findMany({
      where: patientWhere,
      include: {
        patientProfile: true,
      },
      skip,
      take: limit,
      orderBy: { [sortBy === 'name' ? 'firstName' : sortBy]: sortOrder },
    });

    // For each patient, get appointment stats and conditions
    const patientListItems: DoctorPatientListItem[] = [];

    for (const patient of patients) {
      // Get appointments with this doctor
      const appointments = await this.prisma.appointment.findMany({
        where: {
          doctorId,
          patientId: patient.id,
        },
        include: {
          slot: { select: { startTime: true } },
          prescriptions: {
            select: {
              diagnosis: true,
              medications: true,
            },
          },
        },
        orderBy: { slot: { startTime: 'desc' } },
      });

      const completedAppointments = appointments.filter(
        (a) => a.status === AppointmentStatus.COMPLETED
      );
      const upcomingAppointments = appointments.filter(
        (a) => a.status === AppointmentStatus.SCHEDULED && a.slot.startTime > new Date()
      );

      // Extract conditions from prescriptions
      const conditions = new Set<string>();
      for (const appt of completedAppointments) {
        for (const rx of appt.prescriptions) {
          if (rx.diagnosis) {
            conditions.add(rx.diagnosis);
          }
        }
      }

      const lastVisit = completedAppointments[0]?.slot.startTime || null;
      const nextAppointment = upcomingAppointments[0]?.slot.startTime || null;

      patientListItems.push({
        id: patient.id,
        email: patient.email,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
        dob: patient.patientProfile?.dob || null,
        gender: patient.patientProfile?.gender || null,
        address: patient.patientProfile?.address || null,
        emergencyContact: patient.patientProfile?.emergencyContact || null,
        lastVisit,
        nextAppointment,
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        conditions: Array.from(conditions),
        avatarUrl: null, // Could be added later if avatar field exists
      });
    }

    // Apply status filter
    let filtered = patientListItems;
    if (status === 'active') {
      filtered = patientListItems.filter((p) => p.nextAppointment !== null);
    } else if (status === 'inactive') {
      filtered = patientListItems.filter((p) => p.nextAppointment === null);
    }

    // Apply condition filter
    if (condition) {
      filtered = filtered.filter((p) =>
        p.conditions.some((c) => c.toLowerCase().includes(condition.toLowerCase()))
      );
    }

    // Get total count for pagination (without pagination)
    const totalPatients = await this.prisma.user.count({
      where: patientWhere,
    });

    return {
      data: filtered,
      meta: {
        total: totalPatients,
        page,
        limit,
        totalPages: Math.ceil(totalPatients / limit),
      },
    };
  }

  /**
   * Get doctor's patient detail (for Patient Drawer)
   */
  async getDoctorPatientDetail(doctorId: string, patientId: string): Promise<DoctorPatientDetail> {
    // Verify patient has appointments with this doctor
    const hasAppointment = await this.prisma.appointment.findFirst({
      where: { doctorId, patientId },
    });

    if (!hasAppointment) {
      throw new AppError('NOT_FOUND', 'Patient not found or not associated with this doctor', 404);
    }

    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
      include: { patientProfile: true },
    });

    if (!patient) {
      throw new AppError('NOT_FOUND', 'Patient not found', 404);
    }

    // Get all appointments with this doctor
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId, patientId },
      include: {
        slot: { select: { startTime: true } },
        prescriptions: {
          select: {
            id: true,
            diagnosis: true,
            medications: true,
            createdAt: true,
          },
        },
        doctor: {
          include: {
            doctorProfile: { select: { specialty: true } },
          },
        },
      },
      orderBy: { slot: { startTime: 'desc' } },
    });

    const completedAppointments = appointments.filter(
      (a) => a.status === AppointmentStatus.COMPLETED
    );

    // Build appointment history
    const appointmentHistory = appointments.map((appt) => ({
      id: appt.id,
      date: appt.slot.startTime,
      status: appt.status,
      specialty: appt.doctor.doctorProfile?.specialty || 'Unknown',
      diagnosis: appt.prescriptions[0]?.diagnosis || null,
      prescriptionCount: appt.prescriptions.length,
    }));

    // Build prescription history
    const prescriptionHistory = completedAppointments.flatMap((appt) =>
      appt.prescriptions.map((rx) => ({
        id: rx.id,
        date: rx.createdAt,
        diagnosis: rx.diagnosis,
        medications: rx.medications as string | object,
      }))
    );

    return {
      id: patient.id,
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
      dob: patient.patientProfile?.dob || null,
      gender: patient.patientProfile?.gender || null,
      address: patient.patientProfile?.address || null,
      emergencyContact: patient.patientProfile?.emergencyContact || null,
      lastVisit: completedAppointments[0]?.slot.startTime || null,
      nextAppointment:
        appointments.find(
          (a) => a.status === AppointmentStatus.SCHEDULED && a.slot.startTime > new Date()
        )?.slot.startTime || null,
      totalAppointments: appointments.length,
      completedAppointments: completedAppointments.length,
      conditions: Array.from(
        new Set(
          completedAppointments.flatMap((a) =>
            a.prescriptions.map((rx) => rx.diagnosis).filter(Boolean)
          )
        )
      ),
      avatarUrl: null,
      appointments: appointmentHistory,
      prescriptions: prescriptionHistory,
    };
  }
}

// Factory function for dependency injection
export function createPatientService(
  appointmentRepository: AppointmentRepository,
  prescriptionRepository: PrescriptionRepository,
  prisma: PrismaClient
): PatientService {
  return new PatientService(appointmentRepository, prescriptionRepository, prisma);
}
