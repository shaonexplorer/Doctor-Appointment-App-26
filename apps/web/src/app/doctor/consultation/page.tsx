'use client';

import { DoctorPortalShell } from '@/components/doctor-portal/DoctorPortalShell';
import { ConsultationEmptyState } from '@/components/doctor-consultation/EmptyState';

export default function DoctorConsultationPage() {
  return (
    <DoctorPortalShell active="Consultation">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Consultation</h1>
          <p className="text-muted-foreground mt-1">
            Start a clinical consultation from a scheduled appointment
          </p>
        </div>
        <ConsultationEmptyState />
      </div>
    </DoctorPortalShell>
  );
}
