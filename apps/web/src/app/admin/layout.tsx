'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';

import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <ProtectedRoute allowedRoles={[UserType.ADMIN]}>{children}</ProtectedRoute>;
}
