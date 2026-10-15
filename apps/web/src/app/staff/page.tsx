'use client';

import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffDashboard } from '@/components/staff-dashboard/StaffDashboard';

export default function StaffPage() {
  return (
    <StaffPortalShell active="Dashboard">
      <StaffDashboard />
    </StaffPortalShell>
  );
}