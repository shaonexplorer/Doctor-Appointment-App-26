/**
 * Prisma Adapter for BetterAuth
 * Maps BetterAuth's expected database schema to our Prisma schema
 */

import type { PrismaClient } from '@prisma/client';
import { UserType as PrismaUserType } from '@prisma/client';

export interface AdapterUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdapterSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdapterVerificationToken {
  id: string;
  identifier: string;
  token: string;
  expiresAt: Date;
  type: string;
}

export interface AdapterAccount {
  id: string;
  userId: string;
  providerId: string;
  providerAccountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  tokenType: string | null;
  scope: string | null;
  idToken: string | null;
}

export function betterAuthPrismaAdapter(prisma: PrismaClient) {
  // The BetterAuth v1 DBAdapter interface has different methods (create, findOne, etc.)
  // We return our custom adapter implementation that BetterAuth v1 expects
  return {
    id: 'prisma',
    // User methods
    async createUser(data: {
      email: string;
      passwordHash?: string;
      firstName: string;
      lastName: string;
      phone?: string | null;
      userType?: string;
      emailVerified?: boolean;
    }): Promise<AdapterUser> {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash || '',
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || null,
          userType: (data.userType as PrismaUserType) || PrismaUserType.PATIENT,
          emailVerified: data.emailVerified || false,
        },
      });
      return mapUser(user);
    },

    async getUserById(id: string) {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? mapUser(user) : null;
    },

    async getUserByEmail(email: string) {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? mapUser(user) : null;
    },

    async updateUser(id: string, data: Partial<AdapterUser>) {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          userType: data.userType as PrismaUserType | undefined,
          emailVerified: data.emailVerified,
        },
      });
      return mapUser(user);
    },

    async deleteUser(id: string) {
      await prisma.user.delete({ where: { id } });
    },

    // Session methods
    async createSession(data: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    }) {
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

    async getSessionByToken(token: string) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      return session ? { ...mapSession(session), user: mapUser(session.user) } : null;
    },

    async updateSession(id: string, data: Partial<AdapterSession>) {
      const session = await prisma.session.update({
        where: { id },
        data: {
          expiresAt: data.expiresAt,
          token: data.token,
        },
      });
      return mapSession(session);
    },

    async deleteSession(id: string) {
      await prisma.session.delete({ where: { id } });
    },

    async deleteSessionsByUserId(userId: string) {
      await prisma.session.deleteMany({ where: { userId } });
    },

    // Verification methods
    async createVerificationToken(data: {
      identifier: string;
      token: string;
      expiresAt: Date;
      type: string;
    }) {
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

    async getVerificationToken(identifier: string, token: string, type: string) {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { identifier, token, type },
      });
      return verificationToken ? mapVerificationToken(verificationToken) : null;
    },

    async deleteVerificationToken(identifier: string, token: string, type: string) {
      await prisma.verificationToken.deleteMany({
        where: { identifier, token, type },
      });
    },

    // Account methods (for OAuth)
    async createAccount(data: {
      userId: string;
      providerId: string;
      providerAccountId: string;
      accessToken?: string | null;
      refreshToken?: string | null;
      expiresAt?: Date | null;
      tokenType?: string | null;
      scope?: string | null;
      idToken?: string | null;
    }) {
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

    async getAccountByProvider(providerId: string, providerAccountId: string) {
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

    async updateAccount(id: string, data: Partial<AdapterAccount>) {
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

    async deleteAccount(id: string) {
      await prisma.account.delete({ where: { id } });
    },
  };
}

// Mapping functions
function mapUser(user: any): AdapterUser {
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

function mapSession(session: any): AdapterSession {
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

function mapVerificationToken(token: any): AdapterVerificationToken {
  return {
    id: token.id,
    identifier: token.identifier,
    token: token.token,
    expiresAt: token.expiresAt,
    type: token.type,
  };
}

function mapAccount(account: any): AdapterAccount {
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
