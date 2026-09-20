/**
 * Appointments Module
 * Self-contained appointments module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { AppointmentService, createAppointmentService } from './services/appointmentService';
export {
  AppointmentController,
  createAppointmentController,
} from './controllers/appointmentController';
export { createAppointmentRoutes } from './routes/appointmentRoutes';

// Module factory for dependency injection
import type { AppointmentRepository, ScheduleRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { AppointmentService } from './services/appointmentService';
import { AppointmentController } from './controllers/appointmentController';
import { createAppointmentRoutes } from './routes/appointmentRoutes';

export interface AppointmentsModule {
  service: AppointmentService;
  controller: AppointmentController;
  routes: ReturnType<typeof createAppointmentRoutes>;
}

export function createAppointmentsModule(
  appointmentRepository: AppointmentRepository,
  scheduleRepository: ScheduleRepository,
  prisma: PrismaClient
): AppointmentsModule {
  const service = new AppointmentService(appointmentRepository, scheduleRepository, prisma);
  const controller = new AppointmentController(service);
  const routes = createAppointmentRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
