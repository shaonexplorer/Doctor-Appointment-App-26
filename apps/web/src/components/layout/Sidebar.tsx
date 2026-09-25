'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, LayoutDashboard, Calendar, ClipboardList, Users, Settings, Shield, BarChart3, LogOut, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@doctor-appointment-app/shared';
import { cn } from '@/lib/utils';

const navigationItems: Record<UserType, Array<{ label: string; href: string; icon: React.ReactNode }>> = {
  [UserType.PATIENT]: [
    { label: 'Dashboard', href: '/dashboard/patient', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Appointments', href: '/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Doctors', href: '/doctors', icon: <Stethoscope className="h-5 w-5" /> },
    { label: 'Prescriptions', href: '/prescriptions', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ],
  [UserType.DOCTOR]: [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Appointments', href: '/doctor/appointments', icon: <ClipboardList className="h-5 w-5" /> },
    { label: 'Patients', href: '/doctor/patients', icon: <Users className="h-5 w-5" /> },
    { label: 'Analytics', href: '/doctor/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ],
  [UserType.STAFF]: [
    { label: 'Dashboard', href: '/dashboard/staff', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Appointments', href: '/staff/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Doctors', href: '/staff/doctors', icon: <Stethoscope className="h-5 w-5" /> },
    { label: 'Patients', href: '/staff/patients', icon: <Users className="h-5 w-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  ],
  [UserType.ADMIN]: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Users', href: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { label: 'Doctors', href: '/admin/doctors', icon: <Stethoscope className="h-5 w-5" /> },
    { label: 'Appointments', href: '/admin/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: <Shield className="h-5 w-5" /> },
  ],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated || !user) {
    return null;
  }

  const userNavItems = navigationItems[user.userType as UserType] || [];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 border-r border-border bg-background flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:justify-center lg:px-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Stethoscope className="size-4" />
            </span>
            <span className="font-bold text-xl text-foreground">
              Medi<span className="text-primary">Book</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 lg:px-2 lg:py-6">
          {userNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 lg:p-6">
          <Separator className="mb-4" />
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.email} alt={user.firstName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.userType.toLowerCase()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-4 w-full justify-start gap-3"
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}