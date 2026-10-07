'use client';

import { useState, type ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DoctorSidebar } from './Sidebar';

import { DoctorMobileSidebar } from './MobileSidebar';
import { DoctorMobileNav } from './MobileNav';
import { DoctorHeader } from './Header';
import { useAuth } from '@/context/AuthContext';
import { useDoctorProfile } from '@/hooks/useDoctorDashboard';

const routeMap: Record<string, string> = {
  Dashboard: '/doctor/dashboard',
  Schedule: '/doctor/schedule',
  Patients: '/doctor/patients',
  Appointments: '/doctor/appointments',
  Prescriptions: '/doctor/prescriptions',
  Consultation: '/doctor/consultation',
  Profile: '/doctor/profile',
  Notifications: '/doctor/notifications',
  Settings: '/doctor/settings',
};

export interface DoctorPortalShellProps {
  children: ReactNode;
  active: string;
  className?: string;
}

export function DoctorPortalShell({ children, active, className }: DoctorPortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const { user } = useAuth();
  const { data: profile } = useDoctorProfile();

  useEffect(() => {
    const dateStr = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());
    setFormattedDate(dateStr);
  }, []);

  const handleNavigate = (label: string) => {
    const route = routeMap[label];
    if (route) {
      router.push(route);
    }
  };

  // Determine active from pathname if not provided
  const currentActive =
    active || Object.entries(routeMap).find(([, route]) => pathname === route)?.[0] || 'Dashboard';

  const doctorName = profile?.lastName
    ? `Dr. ${profile.lastName}`
    : user?.lastName
      ? `Dr. ${user.lastName}`
      : user?.firstName
        ? `Dr. ${user.firstName}`
        : 'Dr. Smith';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={cn('bg-background text-foreground min-h-screen overflow-x-hidden', className)}>
      {/* Desktop Sidebar */}
      <DoctorSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        active={currentActive}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sidebar */}
      <DoctorMobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        active={currentActive}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div
        className={cn(
          'min-w-0 transition-[padding] duration-200',
          collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]'
        )}
      >
        <DoctorHeader
          active={currentActive}
          onNavigate={handleNavigate}
          collapsed={collapsed}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />
        <main className="mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {currentActive === 'Dashboard' ? formattedDate || 'Welcome' : 'Doctor portal'}
            </p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {currentActive === 'Dashboard' ? `${greeting}, ${doctorName}` : currentActive}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              {currentActive === 'Dashboard'
                ? "Here's your clinic overview for today."
                : `Manage your ${currentActive.toLowerCase()} in one secure place.`}
            </p>
          </div>
          {children}
        </main>
        <DoctorMobileNav active={currentActive} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
