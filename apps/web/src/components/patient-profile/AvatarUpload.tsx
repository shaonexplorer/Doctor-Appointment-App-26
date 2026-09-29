"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Camera, X } from "lucide-react";

export interface AvatarUploadProps {
  initials: string;
  photo?: string;
  editing: boolean;
  onChange?: (photo: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function AvatarUpload({ initials, photo, editing, onChange, onRemove, className }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  const displayPhoto = preview || photo;

  return (
    <div className={cn("relative grid size-20 shrink-0 place-items-center rounded-2xl bg-[#d9e8ff] text-xl font-black text-primary", className)}>
      {displayPhoto ? (
        <img src={displayPhoto} alt="" className="size-full rounded-2xl object-cover" />
      ) : (
        initials
      )}
      {editing && (
        <>
          <label className="absolute -bottom-2 -right-2 grid size-8 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground cursor-pointer">
            <Camera className="size-4" aria-hidden="true" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Change avatar"
            />
          </label>
          {displayPhoto && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border-2 border-card bg-destructive text-destructive-foreground"
              aria-label="Remove avatar"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          )}
        </>
      )}
    </div>
  );
}