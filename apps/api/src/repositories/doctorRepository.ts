/**
 * Doctor Repository
 * Data access layer for DoctorProfile operations
 */

import type { PrismaClient, DoctorProfile, Schedule } from '@prisma/client';
import { UserType, SlotStatus } from '@prisma/client';
import type { DoctorSearchFilters, PaginatedResponse } from '@doctor-appointment-app/shared';
import type { Prisma } from '@prisma/client';

export interface DoctorWithUser extends DoctorProfile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: UserType;
    emailVerified: boolean;
  };
  schedules?: Schedule[];
}

export class DoctorRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find doctor profile by ID with user info
   */
  async findById(id: string): Promise<DoctorWithUser | null> {
    return this.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            userType: true,
            emailVerified: true,
          },
        },
        schedules: {
          where: { status: SlotStatus.AVAILABLE },
          orderBy: { startTime: 'asc' },
        },
      },
    });
  }

  /**
   * Find doctor profile by user ID
   */
  async findByUserId(userId: string): Promise<DoctorProfile | null> {
    return this.prisma.doctorProfile.findUnique({
      where: { userId },
    });
  }

  /**
   * Find doctor profile by user ID with user info
   */
  async findByUserIdWithUser(userId: string): Promise<DoctorWithUser | null> {
    return this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            userType: true,
            emailVerified: true,
          },
        },
        schedules: {
          where: { status: SlotStatus.AVAILABLE, startTime: { gte: new Date() } },
          orderBy: { startTime: 'asc' },
        },
      },
    });
  }

  /**
   * Create doctor profile
   */
  async create(data: {
    userId: string;
    specialty: string;
    designation: string;
    licenseNo: string;
    bio?: string | null;
    fee: number;
  }): Promise<DoctorProfile> {
    return this.prisma.doctorProfile.create({
      data,
    });
  }

  /**
   * Update doctor profile
   */
  async update(userId: string, data: Partial<DoctorProfile>): Promise<DoctorProfile> {
    return this.prisma.doctorProfile.update({
      where: { userId },
      data,
    });
  }

  /**
   * Search doctors with filters
   */
  async search(filters: DoctorSearchFilters): Promise<PaginatedResponse<DoctorWithUser>> {
    const {
      page,
      limit,
      specialty,
      minFee,
      maxFee,
      availableFrom,
      availableTo,
      sortBy,
      sortOrder,
      search,
    } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.DoctorProfileWhereInput = {
      user: {
        userType: UserType.DOCTOR,
      },
    };

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { specialty: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (minFee !== undefined || maxFee !== undefined) {
      where.fee = {};
      if (minFee !== undefined) where.fee.gte = minFee;
      if (maxFee !== undefined) where.fee.lte = maxFee;
    }

    const scheduleWhere: Prisma.ScheduleWhereInput = {
      status: SlotStatus.AVAILABLE,
    };
    if (availableFrom)
      scheduleWhere.startTime = { ...scheduleWhere.startTime, gte: new Date(availableFrom) };
    if (availableTo)
      scheduleWhere.startTime = { ...scheduleWhere.startTime, lte: new Date(availableTo) };

    const [doctors, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({
        skip,
        take: limit,
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              userType: true,
              emailVerified: true,
            },
          },
          schedules: {
            where: scheduleWhere,
            orderBy: { startTime: 'asc' },
            take: 5,
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { id: 'desc' },
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return {
      data: doctors,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get doctor schedule (available slots)
   */
  async getSchedule(doctorId: string, startDate?: Date, endDate?: Date): Promise<Schedule[]> {
    const where: Prisma.ScheduleWhereInput = {
      doctorId,
      status: SlotStatus.AVAILABLE,
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = startDate;
      if (endDate) where.startTime.lte = endDate;
    }

    return this.prisma.schedule.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  /**
   * Check if license number exists
   */
  async licenseExists(licenseNo: string): Promise<boolean> {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { licenseNo },
      select: { id: true },
    });
    return !!doctor;
  }
}
