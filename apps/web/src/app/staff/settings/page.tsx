import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffSettings } from '@/components/staff-portal/StaffSettings';

export default function StaffSettingsPage() {
  return (
    <StaffPortalShell active="Settings">
      <StaffSettings />
    </StaffPortalShell>
  );
}
