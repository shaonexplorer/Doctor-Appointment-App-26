/**
 * User Repository
 * Data access layer for User operations
 */

import type { PrismaClient, User, UserType, DoctorProfile, PatientProfile } from '@prisma/client';
import type { PaginationParams, PaginatedResponse } from '@doctor-appointment-app/shared';

export interface UserWithProfiles extends User {
  doctorProfile: DoctorProfile | null;
  patientProfile: PatientProfile | null;
}

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find user by ID with profiles
   */
  async findById(id: string): Promise<UserWithProfiles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: true,
        patientProfile: true,
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Find user by ID (basic, no profiles)
   */
  async findByIdBasic(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    userType: UserType;
    emailVerified?: boolean;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Update user basic info
   */
  async updateBasic(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
    }
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Update user with profiles
   */
  async updateWithProfiles(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      doctorProfile?: Partial<DoctorProfile>;
      patientProfile?: Partial<PatientProfile>;
    }
  ): Promise<UserWithProfiles> {
    const { doctorProfile, patientProfile, ...userData } = data;

    return this.prisma.$transaction(async (tx) => {
      // Update user
      const user = await tx.user.update({
        where: { id },
        data: userData,
        include: {
          doctorProfile: true,
          patientProfile: true,
        },
      });

      // Update doctor profile if provided
      if (doctorProfile && user.doctorProfile) {
        await tx.doctorProfile.update({
          where: { userId: id },
          data: doctorProfile,
        });
      }

      // Update patient profile if provided
      if (patientProfile && user.patientProfile) {
        await tx.patientProfile.update({
          where: { userId: id },
          data: patientProfile,
        });
      }

      // Return updated user with profiles
      return tx.user.findUnique({
        where: { id },
        include: {
          doctorProfile: true,
          patientProfile: true,
        },
      }) as Promise<UserWithProfiles>;
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * List users with pagination (Admin/Staff)
   */
  async findMany(params: PaginationParams): Promise<PaginatedResponse<UserWithProfiles>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : { createdAt: 'desc' },
        include: {
          doctorProfile: true,
          patientProfile: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find users by type
   */
  async findByType(userType: UserType): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { userType },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    });
    return !!user;
  }
}
