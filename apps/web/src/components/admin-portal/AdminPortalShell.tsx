'use client';

import { useState, type ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AdminSidebar } from './Sidebar';
import { AdminMobileSidebar } from './MobileSidebar';
import { AdminMobileNav } from './MobileNav';
import { AdminHeader } from './Header';
import { useAuth } from '@/context/AuthContext';

const routeMap: Record<string, string> = {
  Dashboard: '/admin/dashboard',
  Users: '/admin/users',
  Doctors: '/admin/doctors',
  Patients: '/admin/patients',
  Staff: '/admin/staff',
  Appointments: '/admin/appointments',
  Clinics: '/admin/clinics',
  Departments: '/admin/departments',
  Analytics: '/admin/analytics',
  Payments: '/admin/payments',
  Reports: '/admin/reports',
  Notifications: '/admin/notifications',
  Settings: '/admin/settings',
};

export interface AdminPortalShellProps {
  children: ReactNode;
  active: string;
  className?: string;
}

export function AdminPortalShell({ children, active, className }: AdminPortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const { user } = useAuth();

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

  const adminName = user?.firstName ? user.firstName : 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={cn('bg-background text-foreground min-h-screen overflow-x-hidden', className)}>
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        active={currentActive}
        onNavigate={handleNavigate}
      />

      {/* Mobile Sidebar */}
      <AdminMobileSidebar
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
        <AdminHeader
          active={currentActive}
          onNavigate={handleNavigate}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />
        <main className="mx-auto max-w-[1500px] min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {currentActive === 'Dashboard' ? formattedDate || 'Welcome' : 'Admin console'}
            </p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              {currentActive === 'Dashboard' ? `${greeting}, ${adminName}` : currentActive}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              {currentActive === 'Dashboard'
                ? "Here's what's happening across your healthcare network."
                : `System-wide ${currentActive.toLowerCase()} overview and operations.`}
            </p>
          </div>
          {children}
        </main>
        <AdminMobileNav active={currentActive} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
