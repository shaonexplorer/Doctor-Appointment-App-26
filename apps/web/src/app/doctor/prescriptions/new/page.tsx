'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { CreatePrescriptionForm } from '@/components/doctor-prescriptions';
import { useSearchParams } from 'next/navigation';

export default function NewPrescriptionPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId') || undefined;

  return (
    <ProtectedRoute allowedRoles={[UserType.DOCTOR]} fallbackPath="/login">
      <DoctorPortalShell active="Prescriptions">
        <CreatePrescriptionForm initialAppointmentId={appointmentId} />
      </DoctorPortalShell>
    </ProtectedRoute>
  );
}
