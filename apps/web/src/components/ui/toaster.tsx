'use client';

import { Toaster as BaseToaster } from '@/components/ui/toast';

export function Toaster({ children }: { children: React.ReactNode }) {
  return <BaseToaster>{children}</BaseToaster>;
}
