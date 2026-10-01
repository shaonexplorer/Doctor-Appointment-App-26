'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { PrescriptionForm } from '@/components/doctor-prescription';

export default function DoctorPrescriptionsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <DoctorPortalShell active="Prescriptions">
        <PrescriptionForm />
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
