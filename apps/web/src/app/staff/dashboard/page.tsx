'use client';

import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffDashboard } from '@/components/staff-dashboard/StaffDashboard';

export default function StaffDashboardPage() {
  return (
    <StaffPortalShell active="Dashboard">
      <StaffDashboard />
    </StaffPortalShell>
  );
}