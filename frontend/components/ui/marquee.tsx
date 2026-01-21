"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  direction = "left",
  speed = "normal",
}: MarqueeProps) {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee-fast",
  };

  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-around gap-[var(--gap)]",
          speedClass[speed],
          direction === "right" && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center justify-around gap-[var(--gap)]",
          speedClass[speed],
          direction === "right" && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
