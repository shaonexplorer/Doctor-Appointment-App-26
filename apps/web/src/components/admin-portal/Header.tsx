'use client';

import { Menu, Bell, CircleHelp } from 'lucide-react';

interface AdminHeaderProps {
  active: string;
  onNavigate: (label: string) => void;
  onMobileMenuOpen: () => void;
}

export function AdminHeader({
  active,
  onNavigate,
  onMobileMenuOpen,
}: AdminHeaderProps) {
  return (
    <header className="border-border bg-card/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="text-muted-foreground rounded-lg p-2 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <div className="text-muted-foreground hidden text-xs sm:block">
          Admin console <span className="mx-2">/</span>
          <span className="text-foreground font-semibold">{active}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch role="admin" onNavigate={onNavigate} />
        <button
          onClick={() => onNavigate('Notifications')}
          className="text-muted-foreground hover:bg-accent relative rounded-xl p-2.5"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="bg-destructive absolute top-1.5 right-1.5 size-2 rounded-full" />
        </button>
        <button
          className="text-muted-foreground hover:bg-accent hidden rounded-xl p-2.5 sm:block"
          aria-label="Help"
        >
          <CircleHelp className="size-[18px]" />
        </button>
        <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
          AM
        </div>
      </div>
    </header>
  );
}

import { GlobalSearch } from '@/components/global-search';
