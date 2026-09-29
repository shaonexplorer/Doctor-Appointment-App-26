/**
 * Users Module
 * Self-contained users module with controllers, services, routes, validators, and types
 */

export * from './types';
export * from './validators';
export { UserService, createUserService } from './services/userService';
export { UserController, createUserController } from './controllers/userController';
export { createUserRoutes } from './routes/userRoutes';

// Module factory for dependency injection
import type { UserRepository } from '../../repositories';
import type { PrismaClient } from '@prisma/client';
import { UserService } from './services/userService';
import { UserController } from './controllers/userController';
import { createUserRoutes } from './routes/userRoutes';

export interface UsersModule {
  service: UserService;
  controller: UserController;
  routes: ReturnType<typeof createUserRoutes>;
}

export function createUsersModule(
  userRepository: UserRepository,
  prisma: PrismaClient
): UsersModule {
  const service = new UserService(userRepository, prisma);
  const controller = new UserController(service);
  const routes = createUserRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
