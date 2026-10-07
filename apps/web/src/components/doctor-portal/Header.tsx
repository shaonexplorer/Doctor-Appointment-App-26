'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, CircleHelp, Bell, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GlobalSearch } from '@/components/global-search';
import { useDoctorProfile } from '@/hooks/useDoctorDashboard';
import { useAuth } from '@/context/AuthContext';

export interface HeaderProps {
  active: string;
  onNavigate: (label: string) => void;
  onMobileMenuOpen: () => void;
  collapsed?: boolean;
  className?: string;
}

export function DoctorHeader({ active, onNavigate, onMobileMenuOpen, className }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: profile } = useDoctorProfile();
  const { logout } = useAuth();

  const doctorInitials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : 'DS';

  return (
    <header
      className={cn(
        'border-border bg-background/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
          <span>Doctor portal</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="text-foreground font-semibold">{active}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch role="doctor" onNavigate={onNavigate} />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => onNavigate('Notifications')}
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          <span className="border-background bg-primary absolute top-1.5 right-1.5 size-2 rounded-full border-2" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:block" aria-label="Help">
          <CircleHelp className="size-[18px]" aria-hidden="true" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className="hover:bg-secondary flex items-center gap-2 rounded-xl p-1.5"
              aria-expanded={profileOpen}
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-primary bg-[#d9e8ff] text-xs font-bold">
                  {doctorInitials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown
                className="text-muted-foreground hidden size-4 sm:block"
                aria-hidden="true"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44" align="end">
            <DropdownMenuItem
              className="hover:bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold"
              onClick={() => {
                onNavigate('Profile');
                setProfileOpen(false);
              }}
            >
              My profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold"
              onClick={() => {
                onNavigate('Settings');
                setProfileOpen(false);
              }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-secondary text-destructive focus:text-destructive flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold"
              onClick={() => {
                void logout().then(() => {
                  window.location.href = '/login';
                });
                setProfileOpen(false);
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
