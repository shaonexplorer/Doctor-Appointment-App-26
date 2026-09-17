/**
 * Prisma Adapter for BetterAuth
 * Maps BetterAuth's expected database schema to our Prisma schema
 */

import type { PrismaClient } from '@prisma/client';
import type { Adapter } from 'better-auth/adapters';

export function betterAuthPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    id: 'prisma',
    // User methods
    async createUser(data) {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash || '',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          userType: data.userType || 'PATIENT',
          emailVerified: data.emailVerified || false,
        },
      });
      return mapUser(user);
    },

    async getUserById(id) {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? mapUser(user) : null;
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? mapUser(user) : null;
    },

    async updateUser(id, data) {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          userType: data.userType,
          emailVerified: data.emailVerified,
        },
      });
      return mapUser(user);
    },

    async deleteUser(id) {
      await prisma.user.delete({ where: { id } });
    },

    // Session methods
    async createSession(data) {
      const session = await prisma.session.create({
        data: {
          id: data.id,
          userId: data.userId,
          expiresAt: data.expiresAt,
          token: data.token,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
      return mapSession(session);
    },

    async getSessionByToken(token) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      return session ? { ...mapSession(session), user: mapUser(session.user) } : null;
    },

    async updateSession(id, data) {
      const session = await prisma.session.update({
        where: { id },
        data: {
          expiresAt: data.expiresAt,
          token: data.token,
        },
      });
      return mapSession(session);
    },

    async deleteSession(id) {
      await prisma.session.delete({ where: { id } });
    },

    async deleteSessionsByUserId(userId) {
      await prisma.session.deleteMany({ where: { userId } });
    },

    // Verification methods
    async createVerificationToken(data) {
      const token = await prisma.verificationToken.create({
        data: {
          identifier: data.identifier,
          token: data.token,
          expiresAt: data.expiresAt,
          type: data.type,
        },
      });
      return mapVerificationToken(token);
    },

    async getVerificationToken(identifier, token, type) {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { identifier, token, type },
      });
      return verificationToken ? mapVerificationToken(verificationToken) : null;
    },

    async deleteVerificationToken(identifier, token, type) {
      await prisma.verificationToken.deleteMany({
        where: { identifier, token, type },
      });
    },

    // Account methods (for OAuth)
    async createAccount(data) {
      const account = await prisma.account.create({
        data: {
          userId: data.userId,
          providerId: data.providerId,
          providerAccountId: data.providerAccountId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
          idToken: data.idToken,
        },
      });
      return mapAccount(account);
    },

    async getAccountByProvider(providerId, providerAccountId) {
      const account = await prisma.account.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId,
            providerAccountId,
          },
        },
      });
      return account ? mapAccount(account) : null;
    },

    async updateAccount(id, data) {
      const account = await prisma.account.update({
        where: { id },
        data: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          tokenType: data.tokenType,
          scope: data.scope,
          idToken: data.idToken,
        },
      });
      return mapAccount(account);
    },

    async deleteAccount(id) {
      await prisma.account.delete({ where: { id } });
    },
  };
}

// Mapping functions
function mapUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    userType: user.userType,
    emailVerified: user.emailVerified,
    image: user.image || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function mapSession(session: any) {
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    token: session.token,
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

function mapVerificationToken(token: any) {
  return {
    id: token.id,
    identifier: token.identifier,
    token: token.token,
    expiresAt: token.expiresAt,
    type: token.type,
  };
}

function mapAccount(account: any) {
  return {
    id: account.id,
    userId: account.userId,
    providerId: account.providerId,
    providerAccountId: account.providerAccountId,
    accessToken: account.accessToken,
    refreshToken: account.refreshToken,
    expiresAt: account.expiresAt,
    tokenType: account.tokenType,
    scope: account.scope,
    idToken: account.idToken,
  };
}
