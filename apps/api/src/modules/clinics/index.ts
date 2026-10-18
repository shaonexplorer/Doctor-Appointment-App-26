/**
 * Clinics Module
 * Self-contained clinics module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { ClinicService, createClinicService } from './services/clinicService';
export { ClinicController, createClinicController } from './controllers/clinicController';
export { createClinicRoutes } from './routes/clinicRoutes';

// Module factory for dependency injection
import type { ClinicRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { ClinicService } from './services/clinicService';
import { ClinicController } from './controllers/clinicController';
import { createClinicRoutes } from './routes/clinicRoutes';

export interface ClinicsModule {
  service: ClinicService;
  controller: ClinicController;
  routes: ReturnType<typeof createClinicRoutes>;
}

export function createClinicsModule(
  clinicRepository: ClinicRepository,
  prisma: PrismaClient
): ClinicsModule {
  const service = new ClinicService(clinicRepository, prisma);
  const controller = new ClinicController(service);
  const routes = createClinicRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
