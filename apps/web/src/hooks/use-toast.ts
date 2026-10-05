'use client';

import { useToastManager, createToastManager } from '@/components/ui/toast';
import type { ToastManagerAddOptions } from '@base-ui/react/toast';

const toastManager = createToastManager();

function mapVariantToType(variant?: 'default' | 'destructive' | 'success'): string | undefined {
  switch (variant) {
    case 'destructive':
      return 'error';
    case 'success':
      return 'success';
    default:
      return 'default';
  }
}

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  action?: React.ReactNode;
} & Omit<ToastManagerAddOptions<object>, 'title' | 'description' | 'type' | 'action'>;

function toast(options: ToastOptions) {
  const { variant, ...rest } = options;
  const id = toastManager.add({
    ...rest,
    type: mapVariantToType(variant),
  });
  return {
    id,
    dismiss: () => toastManager.close(id),
    update: (opts: ToastManagerAddOptions<object>) => toastManager.update(id, opts),
  };
}

export function useToast() {
  const { toasts, add, close, update, promise } = useToastManager();

  const hookToast = (options: ToastOptions) => {
    const { variant, ...rest } = options;
    const id = add({
      ...rest,
      type: mapVariantToType(variant),
    });
    return {
      id,
      dismiss: () => close(id),
      update: (opts: ToastManagerAddOptions<object>) => update(id, opts),
    };
  };

  return {
    toasts,
    toast: hookToast,
    dismiss: close,
    update,
    promise,
  };
}

export { toast };
