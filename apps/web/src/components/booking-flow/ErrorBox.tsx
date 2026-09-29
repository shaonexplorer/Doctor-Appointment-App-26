"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface ErrorBoxProps {
  title: string;
  text: string;
  onClick: () => void;
  className?: string;
}

export function ErrorBox({ title, text, onClick, className }: ErrorBoxProps) {
  return (
    <div
      role="alert"
      className={cn(
        "mt-5 flex items-start gap-3 rounded-xl border border-[#f0d2cc] bg-[#fff8f6] p-4 text-[#b86f63]",
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-xs">{text}</p>
      </div>
      <button onClick={onClick} className="text-xs font-black underline">
        Try again
      </button>
    </div>
  );
}