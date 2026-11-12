'use client';

import { cn } from '@/lib/utils';

export interface BookingStepperProps {
  currentStep: number;
  totalSteps?: number;
  steps?: Array<{
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
  variant?: 'default' | 'compact';
}

export function BookingStepper({
  currentStep,
  totalSteps = 4,
  steps = [
    { label: 'Select Slot', description: 'Choose your preferred time' },
    { label: 'Symptoms', description: 'Tell us about your visit' },
    { label: 'Confirm', description: 'Review and confirm booking' },
    { label: 'Success', description: 'Appointment confirmed' },
  ],
  className,
  variant = 'default',
}: BookingStepperProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div
        className="relative mb-6"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Booking progress"
      >
        <div
          className="bg-border absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2"
          aria-hidden="true"
        />
        <div
          className="bg-primary absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          aria-hidden="true"
        />
        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={step.label} className="flex flex-col items-center" role="listitem">
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-primary border-primary text-primary-foreground ring-primary/20 ring-4'
                        : 'bg-background border-border text-muted-foreground'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{stepNumber}</span>
                  )}
                </div>
                {variant !== 'compact' && (
                  <div className="mt-2 max-w-[100px] text-center">
                    <p
                      className={cn(
                        'truncate text-xs font-semibold',
                        isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p
                        className={cn(
                          'mt-0.5 truncate text-[10px]',
                          isCurrent || isCompleted
                            ? 'text-muted-foreground'
                            : 'text-muted-foreground/60'
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Labels Only (Compact Variant) */}
      {variant === 'compact' && (
        <div
          className="flex justify-between text-xs font-medium"
          role="list"
          aria-label="Booking steps"
        >
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={step.label} className="flex flex-col items-center" role="listitem">
                <span
                  className={cn(
                    isCurrent || isCompleted ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
