"use client";

import { cn } from "@/lib/utils";
import { StepHeading } from "./StepHeading";
import { ActionRow } from "./ActionRow";

export interface SymptomsStepProps {
  symptoms: string;
  setSymptoms: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  onBack: () => void;
  onContinue: () => void;
  tags?: string[];
  maxLength?: number;
  className?: string;
}

const defaultTags = [
  "Chest pain",
  "Headache",
  "Fever",
  "Follow-up",
  "Routine consultation",
];

export function SymptomsStep({
  symptoms,
  setSymptoms,
  selectedTags,
  toggleTag,
  onBack,
  onContinue,
  tags = defaultTags,
  maxLength = 500,
  className,
}: SymptomsStepProps) {
  return (
    <div className={cn(className)}>
      <StepHeading
        eyebrow="Step 3 of 5"
        title="What brings you in?"
        description="Share a few details so your doctor can prepare for your visit."
      />
      <div className="mt-7">
        <label htmlFor="symptoms" className="text-sm font-black">
          Tell us about your symptoms <span className="font-medium text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
          placeholder="Describe what you have been experiencing..."
          className="mt-3 min-h-40 w-full resize-y rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          maxLength={maxLength}
        />
        <p className="mt-2 text-right text-xs text-muted-foreground">{symptoms.length}/{maxLength}</p>
        <p className="mt-5 text-sm font-black">Or choose common reasons</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs font-bold",
                selectedTags.includes(tag)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <ActionRow label="Review appointment" onClick={onContinue} onBack={onBack} />
    </div>
  );
}