'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { DoctorPortalShell } from '@/components/doctor-portal';
import { NotificationCenter } from '@/components/notification-center';

export default function DoctorNotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]}>
      <DoctorPortalShell active="Notifications">
        <NotificationCenter role="doctor" />
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
