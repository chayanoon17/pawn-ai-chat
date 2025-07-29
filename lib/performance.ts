/**
 * 🚀 Performance Optimization Utilities
 * Provides utilities for improving React app performance
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ⏱️ Debounce Hook
/**
 * Debounce hook that delays the execution of a function until after a specified delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 🎯 Throttle Hook
/**
 * Throttle hook that limits the rate at which a function can fire
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        return callback(...args);
      }
    },
    [callback, delay]
  ) as T;
}

// 🔄 Previous Value Hook
/**
 * Hook to get the previous value of a state or prop
 * @param value - Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

// 📊 Memoized Calculation Hook
/**
 * Enhanced useMemo with dependency tracking for debugging
 * @param factory - Factory function
 * @param deps - Dependencies array
 * @param debugName - Optional debug name
 * @returns Memoized value
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  const previous = usePrevious(deps);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    if (process.env.NODE_ENV === "development" && debugName) {
      console.log(`🔄 Recalculating ${debugName}`, {
        previous,
        current: deps,
        changed: previous ? deps.some((dep, i) => dep !== previous[i]) : true,
      });
    }
    return factory();
  }, deps);
}

// 🎭 Stable Callback Hook
/**
 * Creates a stable callback reference that doesn't change on every render
 * @param callback - Callback function
 * @param deps - Dependencies
 * @returns Stable callback
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps);
}

// 🏗️ Component Lazy Loading Utilities
/**
 * Creates a lazy-loaded component with error boundary support
 * @param importFunc - Dynamic import function
 * @param fallback - Loading fallback component
 * @returns Lazy component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);
  const FallbackComponent =
    fallback ||
    (() => React.createElement("div", { className: "loading-skeleton h-32" }));

  // Component wrapper
  // eslint-disable-next-line react/display-name
  const LazyWrapper = (props: React.ComponentProps<T>) =>
    React.createElement(
      React.Suspense,
      { fallback: React.createElement(FallbackComponent) },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(LazyComponent as any, props)
    );

  LazyWrapper.displayName = `LazyComponent`;

  return LazyWrapper;
}

// 📱 Intersection Observer Hook for Lazy Loading
/**
 * Hook for detecting when an element enters the viewport
 * @param options - Intersection Observer options
 * @returns [ref, isIntersecting]
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isIntersecting];
}

// 🎯 Lazy Loading Component
/**
 * Component that only renders children when visible in viewport
 */
interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export function LazyLoad({
  children,
  fallback,
  className,
  threshold = 0.1,
  rootMargin = "50px",
}: LazyLoadProps): React.ReactElement {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  const defaultFallback = React.createElement("div", {
    className: "loading-skeleton h-32",
  });

  return React.createElement(
    "div",
    { ref, className },
    isIntersecting ? children : fallback || defaultFallback
  );
}

// 🔄 Async State Hook with Caching
/**
 * Hook for managing async operations with caching
 * @param asyncFunction - Async function to call
 * @param deps - Dependencies for the async function
 * @param cacheKey - Optional cache key
 * @returns [data, loading, error, refetch]
 */
export function useAsyncWithCache<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList,
  cacheKey?: string
): [T | null, boolean, Error | null, () => void] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cache = useRef<Map<string, T>>(new Map());

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cacheKey && cache.current.has(cacheKey)) {
        setData(cache.current.get(cacheKey)!);
        setLoading(false);
        return;
      }

      const result = await asyncFunction();

      // Store in cache
      if (cacheKey) {
        cache.current.set(cacheKey, result);
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, cacheKey]);

  useEffect(() => {
    execute();
  }, [execute]);

  return [data, loading, error, execute];
}

// 🎮 Performance Monitoring
/**
 * Hook for measuring render performance
 * @param componentName - Name of the component for debugging
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 ${componentName} - Render #${
          renderCount.current
        } took ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
  });

  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🏁 ${componentName} unmounted after ${renderCount.current} renders`
        );
      }
    };
  }, [componentName]);
}

// Export React for lazy loading
import React from "react";
export { React };
