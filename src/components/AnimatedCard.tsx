import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  animationType?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'bounce';
  delay?: number;
}

export function AnimatedCard({
  title,
  description,
  icon,
  children,
  className,
  animationType = 'fade-up',
  delay = 0
}: AnimatedCardProps) {
  const { isVisible, elementRef } = useScrollAnimation();

  const animationClasses = {
    'fade-up': 'animate-fade-in-up',
    'fade-left': 'animate-fade-in-left', 
    'fade-right': 'animate-fade-in-right',
    'scale': 'animate-scale-in-bounce',
    'bounce': 'animate-bounce-subtle'
  };

  return (
    <Card
      ref={elementRef}
      className={cn(
        'transition-all duration-300 hover-lift glow',
        isVisible ? animationClasses[animationType] : 'opacity-0 translate-y-8',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="text-center">
        {icon && (
          <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl font-bungee text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}