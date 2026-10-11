import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { StaffBilling } from '@/components/staff-billing/StaffBilling';

export default function StaffBillingPage() {
  return (
    <StaffPortalShell active="Billing">
      <StaffBilling />
    </StaffPortalShell>
  );
}