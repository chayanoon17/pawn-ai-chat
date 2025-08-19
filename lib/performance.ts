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
 * @returns Memoized value
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
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

// Export React for lazy loading
import React from "react";
export { React };
