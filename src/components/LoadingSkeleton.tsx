import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'form' | 'counter' | 'image';
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ 
  variant = 'card', 
  className,
  count = 1 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn("p-6 space-y-4", className)}>
            <Skeleton className="h-4 w-3/4 shimmer" />
            <Skeleton className="h-4 w-1/2 shimmer" />
            <Skeleton className="h-32 w-full shimmer" />
            <Skeleton className="h-10 w-24 shimmer" />
          </div>
        );
      
      case 'list':
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full shimmer" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 shimmer" />
                  <Skeleton className="h-3 w-24 shimmer" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div className={cn("space-y-4", className)}>
            <Skeleton className="h-4 w-20 shimmer" />
            <Skeleton className="h-10 w-full shimmer" />
            <Skeleton className="h-4 w-20 shimmer" />
            <Skeleton className="h-24 w-full shimmer" />
            <Skeleton className="h-10 w-32 shimmer" />
          </div>
        );
      
      case 'counter':
        return (
          <div className={cn("flex items-center justify-center", className)}>
            <Skeleton className="h-16 w-40 rounded-[30px] shimmer" />
          </div>
        );
      
      case 'image':
        return (
          <Skeleton className={cn("w-full h-48 shimmer", className)} />
        );
      
      default:
        return <Skeleton className={cn("h-4 w-full shimmer", className)} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}