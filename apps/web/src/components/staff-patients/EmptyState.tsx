'use client';

import { UserRound } from 'lucide-react';
import type { EmptyStateProps } from './types';

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="p-14 text-center">
      <UserRound className="mx-auto size-8 text-primary/50" />
      <h3 className="mt-3 font-bold">No patients found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {message || 'Try adjusting your search or status filter.'}
      </p>
    </div>
  );
}