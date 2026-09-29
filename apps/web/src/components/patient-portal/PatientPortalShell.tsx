'use client';

import { useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { MobileNav } from './MobileNav';

const routeMap: Record<string, string> = {
  Dashboard: '/patient/dashboard',
  'Find Doctors': '/doctors/search',
  'Doctor Profile': '/doctors/profile',
  'Book Appointment': '/doctors/[id]/book',
  Appointments: '/patient/appointments',
  Prescriptions: '/patient/prescriptions',
  'Medical Records': '/patient/records',
  Profile: '/patient/profile',
  Settings: '/patient/settings',
  Notifications: '/patient/notifications',
};

export interface PatientPortalShellProps {
  children: ReactNode;
  active: string;
  className?: string;
}

export function PatientPortalShell({ children, active, className }: PatientPortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleNavigate = (label: string) => {
    const route = routeMap[label];
    if (route) {
      router.push(route);
    }
  };

  // Determine active from pathname if not provided
  const currentActive =
    active || Object.entries(routeMap).find(([, route]) => pathname === route)?.[0] || 'Dashboard';

  return (
    <div className={cn('bg-background text-foreground min-h-screen overflow-x-hidden', className)}>
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        active={currentActive}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
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
        <Header
          active={currentActive}
          onNavigate={handleNavigate}
          collapsed={collapsed}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />
        <main className="mx-auto max-w-[1440px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {currentActive === 'Dashboard' ? 'Monday, September 21, 2026' : 'Patient portal'}
            </p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {currentActive === 'Dashboard' ? 'Good morning, Sarah' : currentActive}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              {currentActive === 'Dashboard'
                ? "Here's what's happening with your health today."
                : `Manage your ${currentActive.toLowerCase()} in one secure place.`}
            </p>
          </div>
          {children}
        </main>
        <MobileNav active={currentActive} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
