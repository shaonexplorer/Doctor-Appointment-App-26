'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bell, User, LogOut, LayoutDashboard, Stethoscope, Users, Settings, Shield, Calendar, ClipboardList, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@doctor-appointment-app/shared';
import { cn } from '@/lib/utils';

const navigationItems: Record<UserType, Array<{ label: string; href: string; icon: React.ReactNode }>> = {
  [UserType.PATIENT]: [
    { label: 'Dashboard', href: '/dashboard/patient', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Appointments', href: '/appointments', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Doctors', href: '/doctors', icon: <Stethoscope className="h-4 w-4" /> },
    { label: 'Prescriptions', href: '/prescriptions', icon: <ClipboardList className="h-4 w-4" /> },
  ],
  [UserType.DOCTOR]: [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Appointments', href: '/doctor/appointments', icon: <ClipboardList className="h-4 w-4" /> },
    { label: 'Patients', href: '/doctor/patients', icon: <Users className="h-4 w-4" /> },
    { label: 'Analytics', href: '/doctor/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  ],
  [UserType.STAFF]: [
    { label: 'Dashboard', href: '/dashboard/staff', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Appointments', href: '/staff/appointments', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Doctors', href: '/staff/doctors', icon: <Stethoscope className="h-4 w-4" /> },
    { label: 'Patients', href: '/staff/patients', icon: <Users className="h-4 w-4" /> },
  ],
  [UserType.ADMIN]: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
    { label: 'Doctors', href: '/admin/doctors', icon: <Stethoscope className="h-4 w-4" /> },
    { label: 'Appointments', href: '/admin/appointments', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: <Shield className="h-4 w-4" /> },
  ],
};

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const userNavItems = navigationItems[user.userType as UserType] || [];

  return (
    <>
      <style jsx>{`
        header {
          backdrop-filter: blur(8px);
        }
      `}</style>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 transition-all duration-200',
          scrolled ? 'shadow-sm' : ''
        )}
        onScroll={handleScroll}
      >
        <div className="container-page flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Stethoscope className="size-4" />
            </span>
            <span className="hidden font-bold text-xl text-foreground sm:block">
              Medi<span className="text-primary">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {userNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.email} alt={user.firstName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4">
            <nav className="flex flex-col gap-1">
              {userNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <Separator className="my-3" />
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}