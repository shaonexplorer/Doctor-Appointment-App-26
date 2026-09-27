"use client";

import { cn } from "@/lib/utils";
import { Clock, Check } from "lucide-react";

export interface TimeSlotPickerProps {
  slots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    status: "AVAILABLE" | "BOOKED" | "CANCELLED" | "LOCKED";
    doctorId?: string;
  }>;
  selectedSlotId?: string;
  onSelect: (slotId: string) => void;
  disabled?: boolean;
  showDate?: boolean;
  date?: Date;
  className?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelect,
  disabled = false,
  showDate = true,
  date,
  className,
  columns = 4,
}: TimeSlotPickerProps) {
  const availableSlots = slots.filter((s) => s.status === "AVAILABLE");
  const bookedSlots = slots.filter((s) => s.status === "BOOKED");
  const cancelledSlots = slots.filter((s) => s.status === "CANCELLED");
  const lockedSlots = slots.filter((s) => s.status === "LOCKED");

  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const SlotButton = ({
    slot,
    variant = "default",
    role,
    "aria-selected": ariaSelected,
  }: {
    slot: { id: string; startTime: string; endTime: string };
    variant?: "default" | "booked" | "cancelled" | "locked";
    role?: string;
    "aria-selected"?: boolean;
  }) => {
    const isSelected = selectedSlotId === slot.id;
    const isDisabled = disabled || variant !== "default";

    const baseClasses = cn(
      "relative h-20 rounded-xl border transition-all text-left",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      isSelected
        ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
        : variant === "default"
        ? "border-border hover:border-primary/30 hover:bg-primary/[0.02]"
        : variant === "booked"
        ? "border-[#efd3ce] bg-[#fff8f6] cursor-not-allowed"
        : variant === "cancelled"
        ? "border-border bg-muted/50 cursor-not-allowed"
        : "border-primary/20 bg-primary/5 cursor-not-allowed"
    );

    return (
      <button
        type="button"
        onClick={() => !isDisabled && onSelect(slot.id)}
        disabled={isDisabled}
        className={baseClasses}
        role={role}
        aria-selected={ariaSelected}
        aria-pressed={isSelected}
        aria-disabled={isDisabled}
        aria-label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}${isSelected ? ", selected" : ""}`}
      >
        {variant === "booked" && (
          <span className="absolute -top-2 -right-2 rounded-full bg-[#b86f63] px-2 py-0.5 text-[10px] font-bold text-white">
            Booked
          </span>
        )}
        {variant === "cancelled" && (
          <span className="absolute -top-2 -right-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            Cancelled
          </span>
        )}
        {variant === "locked" && (
          <span className="absolute -top-2 -right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            Held
          </span>
        )}
        <div className="flex flex-col justify-center h-full px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Clock className={cn("size-3.5", isSelected ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
            <p className="text-lg font-bold">{formatTime(slot.startTime)}</p>
          </div>
          <p className="text-xs text-muted-foreground">{formatTime(slot.endTime)}</p>
        </div>
        {isSelected && <Check className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-primary" />}
      </button>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {showDate && date && (
        <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
          <div className="shrink-0 grid size-10 place-items-center rounded-lg bg-card text-primary">
            <Calendar className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Selected Date</p>
            <p className="font-semibold">{formatDate(date.toISOString())}</p>
          </div>
        </div>
      )}

      {availableSlots.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <span className="size-2 rounded-full bg-[#218765]" aria-hidden="true" />
              Available Slots
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {availableSlots.length}
              </span>
            </h3>
          </div>
          <div
            className={cn("grid gap-3", columnClasses[columns])}
            role="listbox"
            aria-label="Available time slots"
          >
            {availableSlots.map((slot) => (
              <SlotButton key={slot.id} slot={slot} variant="default" role="option" aria-selected={selectedSlotId === slot.id} />
            ))}
          </div>
        </section>
      )}

      {(bookedSlots.length > 0 || cancelledSlots.length > 0 || lockedSlots.length > 0) && (
        <section>
          <h3 className="mb-3 text-sm font-bold text-muted-foreground">Unavailable Slots</h3>
          <div className={cn("grid gap-3", columnClasses[columns])}>
            {bookedSlots.map((slot) => (
              <SlotButton key={slot.id} slot={slot} variant="booked" />
            ))}
            {cancelledSlots.map((slot) => (
              <SlotButton key={slot.id} slot={slot} variant="cancelled" />
            ))}
            {lockedSlots.map((slot) => (
              <SlotButton key={slot.id} slot={slot} variant="locked" />
            ))}
          </div>
        </section>
      )}

      {slots.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Clock className="mx-auto size-8 text-muted-foreground/50" />
          <h3 className="mt-4 font-bold">No slots available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This doctor doesn't have any scheduled slots for this date.
          </p>
        </div>
      )}
    </div>
  );
}

export function SlotGrid({
  slots,
  selectedSlotId,
  onSelect,
  disabled = false,
  columns = 6,
  className,
}: {
  slots: Array<{
    id: string;
    startTime: string;
    endTime: string;
    status: "AVAILABLE" | "BOOKED" | "CANCELLED" | "LOCKED";
  }>;
  selectedSlotId?: string;
  onSelect: (slotId: string) => void;
  disabled?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const availableSlots = slots.filter((s) => s.status === "AVAILABLE");
  const otherSlots = slots.filter((s) => s.status !== "AVAILABLE");

  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {availableSlots.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Available</h4>
          <div className={cn("grid gap-2", columnClasses[columns])} role="listbox" aria-label="Available time slots">
            {availableSlots.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                slot={slot}
                selected={selectedSlotId === slot.id}
                onSelect={onSelect}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {otherSlots.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Unavailable</h4>
          <div className={cn("grid gap-2", columnClasses[columns])}>
            {otherSlots.map((slot) => (
              <TimeSlotButton
                key={slot.id}
                slot={slot}
                selected={false}
                onSelect={() => {}}
                disabled={true}
                variant={slot.status === "BOOKED" ? "booked" : slot.status === "CANCELLED" ? "cancelled" : "locked"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeSlotButton({
  slot,
  selected,
  onSelect,
  disabled,
  variant = "default",
}: {
  slot: { id: string; startTime: string; endTime: string };
  selected: boolean;
  onSelect: (slotId: string) => void;
  disabled: boolean;
  variant?: "default" | "booked" | "cancelled" | "locked";
}) {
  const isSelected = selected;
  const isDisabled = disabled;

  const baseClasses = cn(
    "relative h-16 rounded-xl border transition-all text-left",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    isSelected
      ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
      : variant === "default"
      ? "border-border hover:border-primary/30 hover:bg-primary/[0.02]"
      : variant === "booked"
      ? "border-[#efd3ce] bg-[#fff8f6] cursor-not-allowed"
      : variant === "cancelled"
      ? "border-border bg-muted/50 cursor-not-allowed"
      : "border-primary/20 bg-primary/5 cursor-not-allowed"
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(slot.id)}
      disabled={isDisabled}
      className={baseClasses}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      aria-label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}${isSelected ? ", selected" : ""}`}
    >
      {variant === "booked" && (
        <span className="absolute -top-1 -right-1 rounded-full bg-[#b86f63] px-1.5 py-0.5 text-[9px] font-bold text-white">
          Booked
        </span>
      )}
      {variant === "cancelled" && (
        <span className="absolute -top-1 -right-1 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
          Cancelled
        </span>
      )}
      {variant === "locked" && (
        <span className="absolute -top-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
          Held
        </span>
      )}
      <div className="flex flex-col justify-center h-full px-3 py-2">
        <p className="text-sm font-bold">{formatTime(slot.startTime)}</p>
        <p className="text-[10px] text-muted-foreground">{formatTime(slot.endTime)}</p>
      </div>
      {isSelected && <Check className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-primary" />}
    </button>
  );
}

// Need to import Calendar
import { Calendar } from "lucide-react";