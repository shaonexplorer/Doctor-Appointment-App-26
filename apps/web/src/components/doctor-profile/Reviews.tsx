"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface Review {
  text: string;
  name: string;
  date: string;
}

export interface ReviewsProps {
  reviews: Review[];
  overallRating?: number;
  className?: string;
}

export function Reviews({ reviews, overallRating = 4.9, className }: ReviewsProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Patient reviews</h2>
          <p className="mt-1 text-xs text-muted-foreground">What patients say about their visits</p>
        </div>
        <span className="flex items-center gap-1 text-sm font-black text-[#c28a31]">
          <Star className="size-4 fill-current" aria-hidden="true" />
          {overallRating} overall
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.text} className="rounded-xl border border-border p-4">
            <div className="flex gap-1 text-[#c28a31]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="size-3 fill-current" aria-hidden="true" />
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">"{review.text}"</p>
            <p className="mt-3 text-xs font-black">
              {review.name} <span className="font-medium text-muted-foreground">&middot; {review.date}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}