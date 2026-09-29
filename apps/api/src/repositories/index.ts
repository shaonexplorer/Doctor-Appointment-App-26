/**
 * Repository Layer Exports
 * Data access layer for all entities
 */

export { UserRepository } from './userRepository';
export { DoctorRepository } from './doctorRepository';
export { ScheduleRepository } from './scheduleRepository';
export { AppointmentRepository } from './appointmentRepository';
export { PrescriptionRepository } from './prescriptionRepository';

// Repository factory for dependency injection
import type { PrismaClient } from '@prisma/client';
import { UserRepository } from './userRepository';
import { DoctorRepository } from './doctorRepository';
import { ScheduleRepository } from './scheduleRepository';
import { AppointmentRepository } from './appointmentRepository';
import { PrescriptionRepository } from './prescriptionRepository';

export interface Repositories {
  user: UserRepository;
  doctor: DoctorRepository;
  schedule: ScheduleRepository;
  appointment: AppointmentRepository;
  prescription: PrescriptionRepository;
}

export function createRepositories(prisma: PrismaClient): Repositories {
  return {
    user: new UserRepository(prisma),
    doctor: new DoctorRepository(prisma),
    schedule: new ScheduleRepository(prisma),
    appointment: new AppointmentRepository(prisma),
    prescription: new PrescriptionRepository(prisma),
  };
}
