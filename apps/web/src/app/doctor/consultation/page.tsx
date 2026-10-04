'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorConsultationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to appointments page since consultations are started from specific appointments
    router.push('/doctor/appointments');
  }, [router]);

  return null;
}
