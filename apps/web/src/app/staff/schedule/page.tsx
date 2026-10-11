import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffSchedule } from '@/components/staff-portal/StaffSchedule';

export default function StaffSchedulePage() {
  return (
    <StaffPortalShell active="Schedule">
      <StaffSchedule />
    </StaffPortalShell>
  );
}