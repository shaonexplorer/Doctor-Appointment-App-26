/**
 * Schedules Module
 * Self-contained schedules/slots module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { ScheduleService, createScheduleService } from './services/scheduleService';
export { ScheduleController, createScheduleController } from './controllers/scheduleController';
export { createScheduleRoutes } from './routes/scheduleRoutes';

// Module factory for dependency injection
import type { ScheduleRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { ScheduleService } from './services/scheduleService';
import { ScheduleController } from './controllers/scheduleController';
import { createScheduleRoutes } from './routes/scheduleRoutes';

export interface SchedulesModule {
  service: ScheduleService;
  controller: ScheduleController;
  routes: ReturnType<typeof createScheduleRoutes>;
}

export function createSchedulesModule(
  scheduleRepository: ScheduleRepository,
  prisma: PrismaClient
): SchedulesModule {
  const service = new ScheduleService(scheduleRepository, prisma);
  const controller = new ScheduleController(service);
  const routes = createScheduleRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
