/**
 * User Service
 * Business logic for user operations
 */

import type { UserRepository } from '../../../repositories';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { UserType } from '@doctor-appointment-app/shared';
import { AppError } from '../../../shared/middleware/errorHandler';
import * as bcrypt from 'bcrypt';
import type {
  UpdateProfileInput,
  PaginationParams,
  UserProfile,
  UserListItem,
  UserStats,
  CreateUserInput,
} from '../types';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * Extract profile updates from UpdateProfileInput based on user type
   */
  private extractProfileUpdates(
    userType: UserType,
    data: UpdateProfileInput
  ): Record<string, unknown> {
    const profileUpdates: Record<string, unknown> = {};

    if (userType === UserType.DOCTOR) {
      if (data.specialty !== undefined) profileUpdates.specialty = data.specialty;
      if (data.designation !== undefined) profileUpdates.designation = data.designation;
      if (data.licenseNo !== undefined) profileUpdates.licenseNo = data.licenseNo;
      if (data.bio !== undefined) profileUpdates.bio = data.bio;
      if (data.fee !== undefined) profileUpdates.fee = new Prisma.Decimal(data.fee);
    } else if (userType === UserType.PATIENT) {
      if (data.dob !== undefined) profileUpdates.dob = data.dob ? new Date(data.dob) : null;
      if (data.gender !== undefined) profileUpdates.gender = data.gender;
      if (data.address !== undefined) profileUpdates.address = data.address;
      if (data.emergencyContact !== undefined)
        profileUpdates.emergencyContact = data.emergencyContact;
    }

    return profileUpdates;
  }

  /**
   * Get user profile with related profiles
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ..._userWithoutPassword } = user;
    void _passwordHash;
    return _userWithoutPassword as UserProfile;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    userType: UserType,
    data: UpdateProfileInput
  ): Promise<UserProfile> {
    // Build profile updates based on user type
    const profileUpdates = this.extractProfileUpdates(userType, data);

    // Extract user data (excluding profile-specific fields)
    const profileKeys = new Set([
      'specialty',
      'designation',
      'licenseNo',
      'bio',
      'fee',
      'dob',
      'gender',
      'address',
      'emergencyContact',
    ]);
    const userData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !profileKeys.has(key))
    );

    const updatedUser = await this.userRepository.updateWithProfiles(userId, {
      ...userData,
      doctorProfile:
        Object.keys(profileUpdates).length > 0 && userType === UserType.DOCTOR
          ? profileUpdates
          : undefined,
      patientProfile:
        Object.keys(profileUpdates).length > 0 && userType === UserType.PATIENT
          ? profileUpdates
          : undefined,
    });

    const { passwordHash: _passwordHash, ...userWithoutPassword } = updatedUser;
    void _passwordHash;
    return userWithoutPassword as UserProfile;
  }

  /**
   * Get user by ID (Admin/Staff)
   */
  async getUserById(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const { passwordHash: _passwordHash, ..._userWithoutPassword } = user;
    void _passwordHash;
    return _userWithoutPassword as UserProfile;
  }

  /**
   * List users with pagination (Admin/Staff)
   */
  async listUsers(
    params: PaginationParams
  ): Promise<{ data: UserListItem[]; meta: { total: number; totalPages: number } }> {
    const result = await this.userRepository.findMany(params);
    return {
      data: result.data.map(({ passwordHash: _passwordHash, ...user }) => user) as UserListItem[],
      meta: {
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      },
    };
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string, requestingUserId: string): Promise<{ message: string }> {
    if (userId === requestingUserId) {
      throw new AppError('FORBIDDEN', 'Cannot delete yourself', 403);
    }

    await this.userRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  /**
   * Get user statistics (Admin/Staff)
   */
  async getUserStats(): Promise<UserStats> {
    const [totalUsers, totalDoctors, totalPatients, totalAdmins, totalStaff] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { userType: UserType.DOCTOR } }),
      this.prisma.user.count({ where: { userType: UserType.PATIENT } }),
      this.prisma.user.count({ where: { userType: UserType.ADMIN } }),
      this.prisma.user.count({ where: { userType: UserType.STAFF } }),
    ]);

    return {
      total: totalUsers,
      byType: {
        [UserType.ADMIN]: totalAdmins,
        [UserType.STAFF]: totalStaff,
        [UserType.DOCTOR]: totalDoctors,
        [UserType.PATIENT]: totalPatients,
      },
    };
  }

  /**
   * Get current user's doctor profile with stats (Doctor only)
   */
  async getDoctorProfile(userId: string): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    if (user.userType !== UserType.DOCTOR) {
      throw new AppError('FORBIDDEN', 'User is not a doctor', 403);
    }

    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        schedules: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!doctorProfile) {
      throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
    }

    // Get stats
    const { AppointmentStatus, SlotStatus } = await import('@prisma/client');
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const [
      totalAppointments,
      todayAppointments,
      weeklyAppointments,
      totalSlotsThisWeek,
      bookedSlotsThisWeek,
      completedAppointments,
      totalPatients,
    ] = await Promise.all([
      this.prisma.appointment.count({ where: { doctorId: userId } }),
      this.prisma.appointment.count({
        where: {
          doctorId: userId,
          slot: { startTime: { gte: todayStart, lt: todayEnd } },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          doctorId: userId,
          slot: { startTime: { gte: weekStart } },
          status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] },
        },
      }),
      this.prisma.schedule.count({
        where: { doctorId: doctorProfile.id, startTime: { gte: weekStart } },
      }),
      this.prisma.schedule.count({
        where: {
          doctorId: doctorProfile.id,
          startTime: { gte: weekStart },
          status: SlotStatus.BOOKED,
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          doctorId: userId,
          status: AppointmentStatus.COMPLETED,
        },
        include: {
          doctor: { include: { doctorProfile: { select: { fee: true } } } },
        },
      }),
      // Count distinct patients using findMany with distinct
      this.prisma.appointment
        .findMany({
          where: { doctorId: userId },
          distinct: ['patientId'],
          select: { patientId: true },
        })
        .then((appointments) => appointments.length),
    ]);

    const slotUtilization =
      totalSlotsThisWeek > 0 ? Math.round((bookedSlotsThisWeek / totalSlotsThisWeek) * 100) : 0;

    const totalRevenue = completedAppointments.reduce((sum, appt) => {
      const fee = appt.doctor?.doctorProfile?.fee || 0;
      return sum + Number(fee);
    }, 0);

    // Return user info + doctor profile + stats
    const { passwordHash: _passwordHash, ..._userWithoutPassword } = user;
    void _passwordHash;

    return {
      // User basic info
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userType: user.userType,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Doctor profile fields
      specialty: doctorProfile.specialty,
      designation: doctorProfile.designation,
      licenseNo: doctorProfile.licenseNo,
      bio: doctorProfile.bio,
      fee:
        typeof doctorProfile.fee === 'object' && doctorProfile.fee !== null
          ? Number(doctorProfile.fee)
          : Number(doctorProfile.fee),
      isVerified: doctorProfile.isVerified,
      schedules: doctorProfile.schedules,
      // Stats
      stats: {
        totalAppointments,
        todayAppointments,
        weeklyAppointments,
        slotUtilization,
        totalRevenue,
        totalPatients,
      },
    };
  }

  /**
   * Update current user's doctor profile (Doctor only)
   * PATCH /api/users/me/doctor-profile
   */
  async updateDoctorProfile(
    userId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    if (user.userType !== UserType.DOCTOR) {
      throw new AppError('FORBIDDEN', 'User is not a doctor', 403);
    }

    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      throw new AppError('NOT_FOUND', 'Doctor profile not found', 404);
    }

    // Check license number uniqueness if being updated
    if (data.licenseNo && data.licenseNo !== doctorProfile.licenseNo) {
      const licenseExists = await this.prisma.doctorProfile.findUnique({
        where: { licenseNo: data.licenseNo as string },
      });
      if (licenseExists) {
        throw new AppError('CONFLICT', 'License number already registered', 409);
      }
    }

    // Prepare update data for doctor profile
    const profileUpdates: Record<string, unknown> = {};
    if (data.specialty !== undefined) profileUpdates.specialty = data.specialty;
    if (data.designation !== undefined) profileUpdates.designation = data.designation;
    if (data.licenseNo !== undefined) profileUpdates.licenseNo = data.licenseNo;
    if (data.bio !== undefined) profileUpdates.bio = data.bio;
    if (data.fee !== undefined) profileUpdates.fee = data.fee;

    if (Object.keys(profileUpdates).length > 0) {
      await this.prisma.doctorProfile.update({
        where: { userId },
        data: profileUpdates,
      });
    }

    // Return updated profile with stats
    return this.getDoctorProfile(userId);
  }

  /**
   * Create a new user (Admin only)
   * POST /api/users
   */
  async createUser(data: CreateUserInput): Promise<UserProfile> {
    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(data.email);
    if (emailExists) {
      throw new AppError('CONFLICT', 'Email already registered', 409);
    }

    // Check license number uniqueness for doctors
    if (data.userType === UserType.DOCTOR && data.licenseNo) {
      const licenseExists = await this.prisma.doctorProfile.findUnique({
        where: { licenseNo: data.licenseNo },
      });
      if (licenseExists) {
        throw new AppError('CONFLICT', 'License number already registered', 409);
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (data.password && data.password.length > 0) {
      passwordHash = await bcrypt.hash(data.password, 12);
    }

    // Prepare user data
    const userData = {
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone ?? null,
      userType: data.userType,
      emailVerified: false, // Admin-created users need to verify email
      passwordHash: passwordHash ?? '', // Will be empty if no password provided
    };

    // Create user with appropriate profile in a transaction
    const createdUser = await this.prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: userData,
      });

      // Create doctor profile if needed
      if (data.userType === UserType.DOCTOR) {
        await tx.doctorProfile.create({
          data: {
            userId: user.id,
            specialty: data.specialty!,
            designation: data.designation!,
            licenseNo: data.licenseNo!,
            bio: data.bio ?? null,
            fee: new Prisma.Decimal(data.fee!),
            isVerified: false,
          },
        });
      }

      // Create patient profile if needed
      if (data.userType === UserType.PATIENT) {
        await tx.patientProfile.create({
          data: {
            userId: user.id,
            dob: data.dob ? new Date(data.dob) : null,
            gender: data.gender ?? null,
            address: data.address ?? null,
            emergencyContact: data.emergencyContact ?? null,
          },
        });
      }

      // Return user with profiles
      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          doctorProfile: true,
          patientProfile: true,
        },
      });
    });

    if (!createdUser) {
      throw new AppError('INTERNAL_ERROR', 'Failed to create user', 500);
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } = createdUser;
    void _passwordHash;
    return userWithoutPassword as UserProfile;
  }
}

// Factory function for dependency injection
export function createUserService(
  userRepository: UserRepository,
  prisma: PrismaClient
): UserService {
  return new UserService(userRepository, prisma);
}
