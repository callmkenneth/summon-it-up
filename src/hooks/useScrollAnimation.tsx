import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true
}: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { isVisible, elementRef };
}

export function useStaggeredScrollAnimation(
  count: number,
  options?: UseScrollAnimationOptions
) {
  const { isVisible, elementRef } = useScrollAnimation(options);
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    if (isVisible) {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setVisibleItems(current);
        if (current >= count) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isVisible, count]);

  return { visibleItems, elementRef, isVisible };
}