/**
 * Request Logger Middleware
 */

import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // Skip logging for health checks
    if (url === '/api/health') return;

    const logLevel = statusCode >= 400 ? 'warn' : 'info';
    const message = `${method} ${url} ${statusCode} ${duration}ms - ${ip}`;

    if (logLevel === 'warn') {
      console.warn(message);
    } else {
      console.log(message);
    }
  });

  next();
}
