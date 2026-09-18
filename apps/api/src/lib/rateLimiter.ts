/**
 * Redis-backed Rate Limiter
 * Uses express-rate-limit with ioredis for distributed rate limiting
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { getRedisClient } from './redis';

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyPrefix?: string;
}

/**
 * Create a Redis-backed rate limiter
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const redisClient = getRedisClient();

  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: options.message || 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      // @ts-expect-error - RedisStore sendCommand signature compatibility
      sendCommand: (...args: string[]) => redisClient.call(...args),
      prefix: `rl:${options.keyPrefix || 'api'}:`,
    }),
    // Skip successful requests from counting (only count errors/limited)
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    // Custom key generator - use IP + user agent for better identification
    keyGenerator: (req) => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent') || 'unknown';
      return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 20)}`;
    },
    // Handler for when rate limit is exceeded
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        data: null,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: options.message || 'Too many requests, please try again later',
          details: null,
        },
        meta: null,
      });
    },
  });
}

/**
 * Pre-configured rate limiters for auth endpoints
 */
export const authRateLimiters = {
  // 5 requests per minute for login
  login: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many login attempts, please try again later',
    keyPrefix: 'auth:login',
  }),

  // 3 requests per hour for registration
  register: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many registration attempts, please try again later',
    keyPrefix: 'auth:register',
  }),

  // 10 requests per minute for password reset (forgot + reset)
  passwordReset: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: 'Too many password reset attempts, please try again later',
    keyPrefix: 'auth:password-reset',
  }),

  // 3 requests per hour for email verification
  emailVerification: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many verification requests, please try again later',
    keyPrefix: 'auth:email-verification',
  }),

  // General API rate limiter (100 req/min)
  api: createRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests, please try again later',
    keyPrefix: 'api',
  }),
};
