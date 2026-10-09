'use client';

import { ClipboardList } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-12 text-center">
      <ClipboardList className="text-primary mx-auto size-8" />
      <h2 className="mt-4 font-bold">Reports workspace</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        System-wide tools for reports are ready to connect here.
      </p>
    </div>
  );
}
