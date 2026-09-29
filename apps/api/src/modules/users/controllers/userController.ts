/**
 * User Controller
 * Handles user HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { UserService } from '../services/userService';
import { requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get current user profile
   * GET /api/users/me
   */
  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await this.userService.getProfile(req.user!.id);
      res.json(buildSuccessResponse(profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update current user profile
   * PATCH /api/users/me
   */
  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const profile = await this.userService.updateProfile(
        req.user!.id,
        req.user!.userType,
        validatedData
      );
      res.json(buildSuccessResponse(profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID (Admin/Staff only)
   * GET /api/users/:id
   */
  getUserById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(buildSuccessResponse(user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * List users (Admin/Staff only)
   * GET /api/users
   */
  listUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedQuery = req.validatedQuery;

      const result = await this.userService.listUsers(validatedQuery);
      res.json(
        buildSuccessResponse(buildPaginatedResponse(result.data, validatedQuery, result.meta.total))
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user (Admin only)
   * DELETE /api/users/:id
   */
  deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.deleteUser(req.params.id, req.user!.id);
      res.json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get middleware for role-based access
   */
  getRequireRoleMiddleware = () => requireRole(UserType.ADMIN, UserType.STAFF);
  getRequireAdminMiddleware = () => requireRole(UserType.ADMIN);
}

// Factory function for dependency injection
export function createUserController(userService: UserService): UserController {
  return new UserController(userService);
}
