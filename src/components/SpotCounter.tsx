import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface SpotCounterProps {
  spotsClaimed: number;
  totalSpots: number | null; // null for unlimited
  className?: string;
  size?: 'small' | 'large';
}

export function SpotCounter({ spotsClaimed, totalSpots, className = "", size = "small" }: SpotCounterProps) {
  return (
    <div className="bg-light-pink border-2 border-pink rounded-[30px] px-3 py-1 inline-block hover-lift pulse-ring">
      <span className={`font-bungee text-purple ${size === 'large' ? 'text-[99px]' : 'text-4xl'} ${className}`}>
        {totalSpots === null ? (
          <span className="animate-pulse-glow">∞</span>
        ) : (
          <>
            <AnimatedCounter end={spotsClaimed} duration={1000} />
            <span>/</span>
            <AnimatedCounter end={totalSpots} duration={1000} />
          </>
        )}
      </span>
    </div>
  );
}