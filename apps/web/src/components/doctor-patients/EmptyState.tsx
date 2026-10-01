'use client';

import { UserRound } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="p-14 text-center">
      <UserRound className="text-primary/50 mx-auto size-8" />
      <h3 className="mt-3 font-bold">No patients found</h3>
      <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
    </div>
  );
}
