import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffReports } from '@/components/staff-reports/StaffReports';

export default function StaffReportsPage() {
  return (
    <StaffPortalShell active="Reports">
      <StaffReports />
    </StaffPortalShell>
  );
}