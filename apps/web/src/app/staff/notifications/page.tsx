import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { NotificationCenter } from '@/components/notification-center';

export default function StaffNotificationsPage() {
  return (
    <StaffPortalShell active="Notifications">
      <NotificationCenter role="staff" />
    </StaffPortalShell>
  );
}