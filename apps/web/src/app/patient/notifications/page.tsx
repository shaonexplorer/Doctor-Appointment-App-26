"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@doctor-appointment-app/shared";
import { PatientPortalShell } from "@/components/patient-portal";
import { NotificationCenter } from "@/components/notification-center";

export default function PatientNotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Notifications">
        <NotificationCenter role="patient" />
      </PatientPortalShell>
    </ProtectedRoute>
  );
}