"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalScrollRowProps {
  children: React.ReactNode;
  className?: string;
  scrollAmount?: number;
}

export default function HorizontalScrollRow({
  children,
  className,
  scrollAmount = 320,
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -scrollAmount : scrollAmount;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />

      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/70 bg-background/90 p-2 text-foreground shadow-sm backdrop-blur hover:bg-background"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => scrollByAmount("right")}
        className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/70 bg-background/90 p-2 text-foreground shadow-sm backdrop-blur hover:bg-background"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 overflow-x-auto scroll-smooth px-8 pb-2 hide-scrollbar",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
