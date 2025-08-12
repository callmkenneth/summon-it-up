import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  animate?: boolean;
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  className,
  suffix = '',
  prefix = '',
  animate = true
}: AnimatedCounterProps) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!animate) {
      setCount(end);
      return;
    }

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const current = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, start, duration, animate]);

  return (
    <span 
      className={cn(
        'counter-digit font-bungee',
        isAnimating && 'updating',
        className
      )}
    >
      {prefix}{count}{suffix}
    </span>
  );
}