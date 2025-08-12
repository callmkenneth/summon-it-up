import React, { useState, useEffect } from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface CountdownTimerProps {
  deadline: string;
  className?: string;
  size?: 'small' | 'large';
}

export function CountdownTimer({ deadline, className = "", size = "small" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return <span className={className}>Loading...</span>;
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className={className}>RSVP Closed</span>;
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;

  return (
    <div className={`bg-light-pink border-2 border-pink rounded-[30px] px-3 py-1 inline-block hover-lift ${isUrgent ? 'animate-pulse-glow border-accent' : ''}`}>
      <span className={`font-bungee text-purple ${size === 'large' ? 'text-4xl md:text-6xl lg:text-[99px]' : 'text-4xl'} ${className} ${isUrgent ? 'text-accent' : ''}`}>
        <AnimatedCounter end={timeLeft.days} duration={500} suffix=":" animate={false} />
        <AnimatedCounter end={timeLeft.hours} duration={500} suffix=":" animate={false} />
        <AnimatedCounter end={timeLeft.minutes} duration={500} suffix=":" animate={false} />
        <AnimatedCounter end={timeLeft.seconds} duration={500} animate={false} />
      </span>
    </div>
  );
}