/**
 * Doctor Repository
 * Data access layer for DoctorProfile operations
 */

import type { PrismaClient, DoctorProfile, Schedule } from '@prisma/client';
import { UserType, SlotStatus } from '@prisma/client';
import type { DoctorSearchFilters, PaginatedResponse } from '@doctor-appointment-app/shared';
import type { Prisma } from '@prisma/client';

export interface DoctorWithUser {
  id: string;
  userId: string;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: Decimal;
  isVerified: boolean;
  searchVector: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userType: UserType;
    emailVerified: boolean;
  };
  schedules?: Array<{
    id: string;
    doctorId: string;
    startTime: Date;
    endTime: Date;
    status: SlotStatus;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export class DoctorRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find doctor profile by ID with user info
   */
  async findById(id: string): Promise<DoctorWithUser | null> {
    const result = await this.prisma.doctorProfile.findUnique({
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
          select: {
            id: true,
            doctorId: true,
            startTime: true,
            endTime: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return result as DoctorWithUser | null;
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
    const result = await this.prisma.doctorProfile.findUnique({
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
          select: {
            id: true,
            doctorId: true,
            startTime: true,
            endTime: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    return result as DoctorWithUser | null;
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
   * Search doctors with filters using simple ILIKE text search
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

    // Build where clause with simple text search support
    const where: Prisma.DoctorProfileWhereInput = {
      user: {
        userType: UserType.DOCTOR,
      },
    };

    // Simple text search across multiple fields using ILIKE
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { specialty: { contains: searchTerm, mode: 'insensitive' } },
        { designation: { contains: searchTerm, mode: 'insensitive' } },
        { bio: { contains: searchTerm, mode: 'insensitive' } },
        { user: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    } else {
      // Only apply specialty filter if not using search
      if (specialty) {
        where.specialty = { contains: specialty, mode: 'insensitive' };
      }
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
      scheduleWhere.startTime = {
        ...(scheduleWhere.startTime as object),
        gte: new Date(availableFrom),
      } as Prisma.ScheduleWhereInput['startTime'];
    if (availableTo)
      scheduleWhere.startTime = {
        ...(scheduleWhere.startTime as object),
        lte: new Date(availableTo),
      } as Prisma.ScheduleWhereInput['startTime'];

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
            select: {
              id: true,
              doctorId: true,
              startTime: true,
              endTime: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
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
      select: {
        id: true,
        doctorId: true,
        startTime: true,
        endTime: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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
