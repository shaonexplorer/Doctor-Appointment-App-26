'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import { FindDoctors } from '@/components/find-doctors';

export default function DoctorSearchPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="Find Doctors">
        <FindDoctors />
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
