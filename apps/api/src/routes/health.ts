/**
 * Health Check Route
 * Simple health endpoint for monitoring
 */

import { Router } from 'express';
import { asyncHandler } from '../shared/utils';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  })
);

export { router };
