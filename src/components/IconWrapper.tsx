import React from 'react';
import { cn } from '@/lib/utils';

interface IconWrapperProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IconWrapper({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className 
}: IconWrapperProps) {
  const baseClasses = "rounded-full flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground", 
    white: "bg-white text-primary shadow-sm"
  };
  
  const sizeClasses = {
    sm: "w-8 h-8 [&_svg]:w-4 [&_svg]:h-4",
    md: "w-10 h-10 [&_svg]:w-5 [&_svg]:h-5",
    lg: "w-12 h-12 [&_svg]:w-6 [&_svg]:h-6"
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}