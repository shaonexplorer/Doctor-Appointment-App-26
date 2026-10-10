import { StaffPortalShell } from '@/components/staff-portal/StaffPortalShell';
import { FileText } from 'lucide-react';

export default function StaffReportsPage() {
  return (
    <StaffPortalShell active="Reports">
      <Placeholder title="Reports" icon={FileText} />
    </StaffPortalShell>
  );
}

function Placeholder({ title, icon: Icon }: { title: string; icon: typeof FileText }) {
  return (
    <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-12 text-center">
      <Icon className="text-primary/60 mx-auto size-8" />
      <h2 className="mt-4 font-bold">{title} workspace</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Front-desk workflow tools for {title.toLowerCase()} are ready to connect here.
      </p>
    </div>
  );
}