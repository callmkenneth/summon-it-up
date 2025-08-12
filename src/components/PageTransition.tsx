import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StaggeredRevealProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

export function StaggeredReveal({ 
  children, 
  className,
  delay = 100 
}: StaggeredRevealProps) {
  return (
    <div className={cn('stagger-children', className)}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * delay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}