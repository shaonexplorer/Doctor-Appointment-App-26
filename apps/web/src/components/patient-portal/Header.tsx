"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Bell,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/global-search";

export interface HeaderProps {
  active: string;
  onNavigate: (label: string) => void;
  collapsed: boolean;
  onMobileMenuOpen: () => void;
  className?: string;
}

export function Header({
  active,
  onNavigate,
  collapsed,
  onMobileMenuOpen,
  className,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-8",
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
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span>Patient portal</span>
          <ChevronRight className="size-3" aria-hidden="true" />
          <span className="font-semibold text-foreground">{active}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch role="patient" onNavigate={onNavigate} />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => onNavigate("Notifications")}
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-background bg-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:block" aria-label="Help">
          <CircleHelp className="size-[18px]" aria-hidden="true" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-secondary" aria-expanded={profileOpen}>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-[#d9e8ff] text-xs font-bold text-primary">
                  SJ
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44" align="end">
            <DropdownMenuItem
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary"
              onClick={() => { onNavigate("Profile"); setProfileOpen(false); }}
            >
              My profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary"
              onClick={() => { onNavigate("Settings"); setProfileOpen(false); }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-secondary"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}