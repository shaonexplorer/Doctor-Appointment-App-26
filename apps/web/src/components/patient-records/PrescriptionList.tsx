"use client";

import { cn } from "@/lib/utils";
import { Pill, FileText, Download, Upload, Printer, X } from "lucide-react";
import { Info } from "./Info";

export interface Prescription {
  id: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medications: number;
  tests: string;
  created: string;
}

export interface PrescriptionListProps {
  items: Prescription[];
  onPreview: (prescription: Prescription) => void;
  onDownload?: (prescription: Prescription) => void;
  onPrint?: (prescription: Prescription) => void;
  onUpload?: () => void;
  className?: string;
}

export function PrescriptionList({
  items,
  onPreview,
  onDownload,
  onPrint,
  onUpload,
  className,
}: PrescriptionListProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card shadow-sm", className)}>
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="font-black">My prescriptions</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {items.length} prescription record{items.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <button
          type="button"
          onClick={onUpload}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-bold hover:bg-secondary"
        >
          <Upload className="size-4" aria-hidden="true" />
          Upload document
        </button>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-5 sm:p-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e9f8f3] text-[#218765]">
                    <Pill className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold truncate">{item.id}</h4>
                      <span className="rounded-full bg-[#eaf1ff] px-2 py-1 text-[10px] font-bold text-primary">
                        Active record
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-primary">{item.doctor}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.date} &middot; {item.diagnosis}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 xl:w-[390px]">
                  <Info label="Medications" value={`${item.medications}`} />
                  <Info label="Tests" value={item.tests} />
                  <Info label="Created" value={item.created} />
                </div>
                <div className="flex gap-2 border-t border-border pt-3 xl:border-t-0 xl:pt-0">
                  <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-secondary"
                  >
                    <FileText className="size-4" aria-hidden="true" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownload?.(item)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    PDF
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <FileText className="mx-auto size-8 text-primary/50" aria-hidden="true" />
          <h3 className="mt-4 font-black">No records found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search or upload a new document.
          </p>
        </div>
      )}
    </section>
  );
}