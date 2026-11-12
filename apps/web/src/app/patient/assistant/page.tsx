'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserType } from '@doctor-appointment-app/shared';
import { PatientPortalShell } from '@/components/patient-portal';
import { AssistantWorkspace } from '@/components/ai-assistant';

export default function PatientAssistantPage() {
  return (
    <ProtectedRoute allowedRoles={[UserType.PATIENT]}>
      <PatientPortalShell active="AI Assistant">
        <AssistantWorkspace mode="workspace" />
      </PatientPortalShell>
    </ProtectedRoute>
  );
}
