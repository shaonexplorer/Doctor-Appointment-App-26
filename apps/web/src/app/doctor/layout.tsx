'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { DoctorPortalShell } from '@/components/doctor-portal';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <div className="flex h-screen flex-col">
        <DoctorPortalShell active="Dashboard">{children}</DoctorPortalShell>
      </div>
    </ProtectedRoute>
  );
}
