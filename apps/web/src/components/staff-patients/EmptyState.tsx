'use client';

import { UserRound } from 'lucide-react';
import type { EmptyStateProps } from './types';

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="p-14 text-center">
      <UserRound className="text-primary/50 mx-auto size-8" />
      <h3 className="mt-3 font-bold">No patients found</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        {message || 'Try adjusting your search or status filter.'}
      </p>
    </div>
  );
}
