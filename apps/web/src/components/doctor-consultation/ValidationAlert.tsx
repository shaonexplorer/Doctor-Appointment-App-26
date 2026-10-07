'use client';

import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ValidationAlertProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function ValidationAlert({
  isVisible,
  message = 'Add a diagnosis and at least one medication before issuing the prescription.',
  className,
}: ValidationAlertProps) {
  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2 rounded-xl border border-[#efc9c2] bg-[#fff7f5] px-4 py-3 text-xs font-semibold text-[#b86f63]',
        className
      )}
    >
      <AlertCircle className="size-4" />
      {message}
    </div>
  );
}
