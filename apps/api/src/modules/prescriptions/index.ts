/**
 * Prescriptions Module
 * Self-contained prescriptions module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { PrescriptionService, createPrescriptionService } from './services/prescriptionService';
export {
  PrescriptionController,
  createPrescriptionController,
} from './controllers/prescriptionController';
export { createPrescriptionRoutes } from './routes/prescriptionRoutes';

// Module factory for dependency injection
import type { PrescriptionRepository, AppointmentRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { PrescriptionService } from './services/prescriptionService';
import { PrescriptionController } from './controllers/prescriptionController';
import { createPrescriptionRoutes } from './routes/prescriptionRoutes';

export interface PrescriptionsModule {
  service: PrescriptionService;
  controller: PrescriptionController;
  routes: ReturnType<typeof createPrescriptionRoutes>;
}

export function createPrescriptionsModule(
  prescriptionRepository: PrescriptionRepository,
  appointmentRepository: AppointmentRepository,
  prisma: PrismaClient
): PrescriptionsModule {
  const service = new PrescriptionService(prescriptionRepository, appointmentRepository, prisma);
  const controller = new PrescriptionController(service);
  const routes = createPrescriptionRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
