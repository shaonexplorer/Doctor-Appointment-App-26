/**
 * Doctors Module
 * Self-contained doctors module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { DoctorService, createDoctorService } from './services/doctorService';
export { DoctorController, createDoctorController } from './controllers/doctorController';
export { createDoctorRoutes } from './routes/doctorRoutes';

// Module factory for dependency injection
import type { DoctorRepository } from '../../repositories';
import { DoctorService } from './services/doctorService';
import { DoctorController } from './controllers/doctorController';
import { createDoctorRoutes } from './routes/doctorRoutes';

export interface DoctorsModule {
  service: DoctorService;
  controller: DoctorController;
  routes: ReturnType<typeof createDoctorRoutes>;
}

export function createDoctorsModule(doctorRepository: DoctorRepository): DoctorsModule {
  const service = new DoctorService(doctorRepository);
  const controller = new DoctorController(service);
  const routes = createDoctorRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
