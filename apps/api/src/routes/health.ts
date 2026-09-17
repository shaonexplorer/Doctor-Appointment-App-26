/**
 * Health Check Routes
 */

import { Router } from 'express';
import { prisma } from '../index';
import { buildSuccessResponse } from '@doctor-appointment-app/shared';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json(
      buildSuccessResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0',
      })
    );
  } catch {
    res.status(503).json(
      buildSuccessResponse({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        version: process.env.npm_package_version || '1.0.0',
      })
    );
  }
});

router.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json(buildSuccessResponse({ ready: true }));
  } catch {
    res.status(503).json(buildSuccessResponse({ ready: false }));
  }
});

export { router as healthRouter };
