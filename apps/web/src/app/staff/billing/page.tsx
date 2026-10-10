import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffBilling } from '@/components/staff-billing/StaffBillingNew';

export default function StaffBillingPage() {
  return (
    <StaffPortalShell active="Billing">
      <StaffBilling />
    </StaffPortalShell>
  );
}