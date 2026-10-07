'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <div className="flex h-screen flex-col">{children}</div>
    </ProtectedRoute>
  );
}
