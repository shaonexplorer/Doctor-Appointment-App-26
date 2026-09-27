/**
 * Doctor Repository
 * Data access layer for DoctorProfile operations
 */

import type { PrismaClient, DoctorProfile, Schedule } from '@prisma/client';
import { UserType, SlotStatus } from '@prisma/client';
import type { DoctorSearchFilters, PaginatedResponse } from '@doctor-appointment-app/shared';
import type { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Decimal } from '@prisma/client/runtime/library';

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
   * Search doctors with filters using PostgreSQL full-text search
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

    // Use full-text search when search query is provided
    if (search && search.trim()) {
      return this.searchWithFullText(filters, skip, limit);
    }

    // Fallback to regular search for filter-only queries
    const where: Prisma.DoctorProfileWhereInput = {
      user: {
        userType: UserType.DOCTOR,
      },
    };

    if (specialty) {
      where.specialty = { contains: specialty, mode: 'insensitive' };
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
      scheduleWhere.startTime = { ...(scheduleWhere.startTime as object), gte: new Date(availableFrom) } as Prisma.ScheduleWhereInput['startTime'];
    if (availableTo)
      scheduleWhere.startTime = { ...(scheduleWhere.startTime as object), lte: new Date(availableTo) } as Prisma.ScheduleWhereInput['startTime'];

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
   * Search doctors using PostgreSQL full-text search (tsvector/tsquery)
   */
  private async searchWithFullText(
    filters: DoctorSearchFilters,
    skip: number,
    limit: number
  ): Promise<PaginatedResponse<DoctorWithUser>> {
    const {
      specialty,
      minFee,
      maxFee,
      availableFrom,
      availableTo,
      sortBy,
      sortOrder,
      search,
    } = filters;

    // Build the tsquery from search terms
    const searchTerms = search!.trim().split(/\s+/).map(term => `${term}:*`).join(' & ');
    const tsQuery = `'${searchTerms}'`;

    // Build WHERE conditions for additional filters
    const conditions: string[] = [
      `u."userType" = 'DOCTOR'`,
    ];

    if (specialty) {
      conditions.push(`dp.specialty ILIKE '%${specialty.replace(/'/g, "''")}%'`);
    }
    if (minFee !== undefined) {
      conditions.push(`dp.fee >= ${minFee}`);
    }
    if (maxFee !== undefined) {
      conditions.push(`dp.fee <= ${maxFee}`);
    }

    // Build schedule subquery for availability filtering
    let scheduleJoin = '';
    if (availableFrom || availableTo) {
      let scheduleWhere = 's.status = \'AVAILABLE\'';
      if (availableFrom) {
        scheduleWhere += ` AND s."startTime" >= '${new Date(availableFrom).toISOString()}'`;
      }
      if (availableTo) {
        scheduleWhere += ` AND s."startTime" <= '${new Date(availableTo).toISOString()}'`;
      }
      scheduleJoin = `
        LEFT JOIN LATERAL (
          SELECT s.id, s."startTime", s."endTime", s.status
          FROM "Schedule" s
          WHERE s."doctorId" = dp.id AND ${scheduleWhere}
          ORDER BY s."startTime" ASC
          LIMIT 5
        ) s ON true
      `;
    } else {
      scheduleJoin = `
        LEFT JOIN LATERAL (
          SELECT s.id, s."startTime", s."endTime", s.status
          FROM "Schedule" s
          WHERE s."doctorId" = dp.id AND s.status = 'AVAILABLE'
          ORDER BY s."startTime" ASC
          LIMIT 5
        ) s ON true
      `;
    }

    const whereClause = conditions.join(' AND ');

    // Determine order by clause
    let orderByClause = 'ts_rank_cd(dp.search_vector, to_tsquery(${tsQuery})) DESC, dp.id DESC';
    if (sortBy) {
      const direction = sortOrder || 'asc';
      // Map Prisma field names to SQL column names
      const fieldMap: Record<string, string> = {
        'specialty': 'dp.specialty',
        'fee': 'dp.fee',
        'createdAt': 'dp."createdAt"',
        'updatedAt': 'dp."updatedAt"',
      };
      const sqlField = fieldMap[sortBy] || `dp."${sortBy}"`;
      orderByClause = `${sqlField} ${direction.toUpperCase()}`;
    }

    // Execute full-text search query
    const query = `
      SELECT
        dp.id,
        dp."userId",
        dp.specialty,
        dp.designation,
        dp."licenseNo",
        dp.bio,
        dp.fee,
        dp."isVerified",
        u.id as "user_id",
        u.email,
        u."firstName",
        u."lastName",
        u.phone,
        u."userType",
        u."emailVerified",
        ts_rank_cd(dp.search_vector, to_tsquery(${tsQuery})) as rank
      FROM "doctor_profile" dp
      JOIN "user" u ON dp."userId" = u.id
      ${scheduleJoin}
      WHERE ${whereClause}
        AND dp.search_vector @@ to_tsquery(${tsQuery})
      ORDER BY ${orderByClause}
      LIMIT ${limit} OFFSET ${skip}
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM "doctor_profile" dp
      JOIN "user" u ON dp."userId" = u.id
      WHERE ${whereClause}
        AND dp.search_vector @@ to_tsquery(${tsQuery})
    `;

    try {
      const [doctors, totalResult] = await Promise.all([
        this.prisma.$queryRawUnsafe<DoctorWithUser[]>(query),
        this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery),
      ]);

      const total = Number(totalResult[0]?.count || 0);

      // Fetch schedules for each doctor if not already included
      const doctorsWithSchedules = await Promise.all(
        doctors.map(async (doctor) => {
          const schedules = await this.prisma.schedule.findMany({
            where: {
              doctorId: doctor.id,
              status: SlotStatus.AVAILABLE,
              ...(availableFrom && { startTime: { gte: new Date(availableFrom) } }),
              ...(availableTo && { startTime: { lte: new Date(availableTo) } }),
            },
            orderBy: { startTime: 'asc' },
            take: 5,
          });
          return { ...doctor, schedules };
        })
      );

      return {
        data: doctorsWithSchedules,
        meta: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      // Fallback to regular search if full-text search fails
      if (error instanceof PrismaClientKnownRequestError) {
        console.warn('Full-text search failed, falling back to regular search:', error.message);
        return this.search(filters);
      }
      throw error;
    }
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

  /**
   * Full-text search doctors (for dedicated search endpoint)
   * Uses materialized view for better performance
   */
  async fullTextSearch(filters: DoctorSearchFilters): Promise<PaginatedResponse<DoctorWithUser>> {
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

    if (!search || !search.trim()) {
      return this.search(filters);
    }

    // Build the tsquery from search terms
    const searchTerms = search.trim().split(/\s+/).map(term => `${term}:*`).join(' & ');
    const tsQuery = `'${searchTerms}'`;

    // Build WHERE conditions for additional filters
    const conditions: string[] = [];

    if (specialty) {
      conditions.push(`specialty ILIKE '%${specialty.replace(/'/g, "''")}%'`);
    }
    if (minFee !== undefined) {
      conditions.push(`fee >= ${minFee}`);
    }
    if (maxFee !== undefined) {
      conditions.push(`fee <= ${maxFee}`);
    }

    // Build schedule subquery for availability filtering
    let scheduleJoin = `
      LEFT JOIN LATERAL (
        SELECT s.id, s."startTime", s."endTime", s.status
        FROM "Schedule" s
        WHERE s."doctorId" = dsv.id AND s.status = 'AVAILABLE'
        ORDER BY s."startTime" ASC
        LIMIT 5
      ) s ON true
    `;

    if (availableFrom || availableTo) {
      let scheduleWhere = 's.status = \'AVAILABLE\'';
      if (availableFrom) {
        scheduleWhere += ` AND s."startTime" >= '${new Date(availableFrom).toISOString()}'`;
      }
      if (availableTo) {
        scheduleWhere += ` AND s."startTime" <= '${new Date(availableTo).toISOString()}'`;
      }
      scheduleJoin = `
        LEFT JOIN LATERAL (
          SELECT s.id, s."startTime", s."endTime", s.status
          FROM "Schedule" s
          WHERE s."doctorId" = dsv.id AND ${scheduleWhere}
          ORDER BY s."startTime" ASC
          LIMIT 5
        ) s ON true
      `;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Determine order by clause
    let orderByClause = `ts_rank_cd(search_vector, to_tsquery(${tsQuery})) DESC, id DESC`;
    if (sortBy) {
      const direction = sortOrder || 'asc';
      const fieldMap: Record<string, string> = {
        'specialty': 'specialty',
        'fee': 'fee',
        'createdAt': '"createdAt"',
        'updatedAt': '"updatedAt"',
      };
      const sqlField = fieldMap[sortBy] || `"${sortBy}"`;
      orderByClause = `${sqlField} ${direction.toUpperCase()}`;
    }

    // Execute full-text search query using materialized view
    const query = `
      SELECT
        dsv.id,
        dsv."userId" as "user_id",
        dsv.specialty,
        dsv.designation,
        dsv."licenseNo",
        dsv.bio,
        dsv.fee,
        dsv."isVerified",
        dsv.email,
        dsv."firstName",
        dsv."lastName",
        dsv.phone,
        dsv."emailVerified",
        ts_rank_cd(dsv.search_vector, to_tsquery(${tsQuery})) as rank
      FROM "doctor_search_view" dsv
      ${scheduleJoin}
      ${whereClause}
        AND dsv.search_vector @@ to_tsquery(${tsQuery})
      ORDER BY ${orderByClause}
      LIMIT ${limit} OFFSET ${skip}
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM "doctor_search_view" dsv
      ${whereClause}
        AND dsv.search_vector @@ to_tsquery(${tsQuery})
    `;

    try {
      const [doctors, totalResult] = await Promise.all([
        this.prisma.$queryRawUnsafe<DoctorWithUser[]>(query),
        this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery),
      ]);

      const total = Number(totalResult[0]?.count || 0);

      // Transform the flat result to include user object
      const transformedDoctors = doctors.map(doc => ({
        ...doc,
        user: {
          id: (doc as any).user_id || (doc as any).userId,
          email: doc.email,
          firstName: doc.firstName,
          lastName: doc.lastName,
          phone: doc.phone,
          userType: 'DOCTOR' as UserType,
          emailVerified: doc.emailVerified,
        },
        schedules: (doc as any).schedules || [],
      }));

      return {
        data: transformedDoctors,
        meta: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      // Fallback to regular search if full-text search fails
      if (error instanceof PrismaClientKnownRequestError) {
        console.warn('Materialized view search failed, falling back to regular search:', error.message);
        return this.search(filters);
      }
      throw error;
    }
  }
}
