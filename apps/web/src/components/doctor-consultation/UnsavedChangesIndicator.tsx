'use client';

import { cn } from '@/lib/utils';

interface UnsavedChangesIndicatorProps {
  isSaved: boolean;
  className?: string;
}

export function UnsavedChangesIndicator({ isSaved, className }: UnsavedChangesIndicatorProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center gap-2 text-xs font-semibold',
        className
      )}
    >
      <span className={cn('size-2 rounded-full', isSaved ? 'bg-[#258c70]' : 'bg-[#d68b42]')} />
      {isSaved ? 'All changes saved' : 'Unsaved changes'}
    </div>
  );
}
