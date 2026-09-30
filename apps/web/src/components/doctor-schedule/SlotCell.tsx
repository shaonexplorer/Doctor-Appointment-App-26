interface SlotCellProps {
  day: string;
  slot: {
    time: string;
    patient: string;
    state: 'AVAILABLE' | 'BOOKED' | 'CANCELLED';
  };
  selected: string[];
  onToggle: (time: string) => void;
  index: number;
}

export function SlotCell({ day, slot, selected, onToggle, index }: SlotCellProps) {
  const slotId = `${day}-${slot.time}`;
  const isSelected = selected.includes(slotId);

  return (
    <div
      key={slotId}
      className={`border-border min-h-[78px] border-l p-2 ${index === 0 ? 'bg-primary/[0.025]' : ''}`}
    >
      <button
        onClick={() => onToggle(slotId)}
        className={`group relative flex h-full w-full flex-col justify-between rounded-xl border p-2 text-left transition ${slot.state === 'BOOKED' ? 'border-primary/20 bg-primary/10' : slot.state === 'CANCELLED' ? 'border-[#f0ccc5] bg-[#fff7f5]' : isSelected ? 'border-primary bg-primary/10 ring-primary/20 ring-2' : 'hover:border-primary border-dashed border-[#a8d8c9] bg-[#f3fbf8]'}`}
      >
        <span
          className={`text-[9px] font-black tracking-wide ${slot.state === 'BOOKED' ? 'text-primary' : slot.state === 'CANCELLED' ? 'text-[#c2796d]' : 'text-[#338a70]'}`}
        >
          {slot.state}
        </span>
        <span className="truncate text-[10px] font-bold">{slot.patient}</span>
        {slot.state === 'BOOKED' && (
          <span className="text-muted-foreground text-[9px]">Consultation</span>
        )}
      </button>
    </div>
  );
}
