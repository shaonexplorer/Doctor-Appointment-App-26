'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
            className
          )}
          checked={checked}
          aria-indeterminate={indeterminate}
          onChange={handleChange}
          {...props}
        />
        {checked && (
          <Check
            className={cn(
              'absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2',
              'text-primary-foreground'
            )}
          />
        )}
        {indeterminate && (
          <div
            className={cn(
              'absolute top-1/2 left-1/2 w-2.5 h-0.5 -translate-x-1/2 -translate-y-1/2',
              'bg-primary-foreground'
            )}
          />
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';