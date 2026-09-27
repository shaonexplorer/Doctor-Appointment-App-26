"use client";

import { cn } from "@/lib/utils";
import { AvatarUpload } from "./AvatarUpload";

export interface ProfileHeaderProps {
  name: string;
  initials: string;
  subtitle: string;
  photo?: string;
  editing: boolean;
  onPhotoChange?: (photo: string) => void;
  onPhotoRemove?: () => void;
  helperText?: string;
  className?: string;
}

export function ProfileHeader({
  name,
  initials,
  subtitle,
  photo,
  editing,
  onPhotoChange,
  onPhotoRemove,
  helperText,
  className,
}: ProfileHeaderProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <AvatarUpload
          initials={initials}
          photo={photo}
          editing={editing}
          onChange={onPhotoChange}
          onRemove={onPhotoRemove}
        />
        <div>
          <h3 className="font-black">{name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          <p className="mt-3 text-xs font-bold text-primary">
            {editing ? "Choose a clear photo for your care team" : helperText || "Your profile is visible to doctors you book with"}
          </p>
        </div>
      </div>
    </section>
  );
}