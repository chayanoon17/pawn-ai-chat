/**
 * Custom Hooks สำหรับจัดการ API calls และ state ที่ซ้ำซ้อน
 * ลดโค้ดซ้ำซ้อนใน widgets และ components
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "@/lib/api-client";

/**
 * Generic API Query Hook
 * ใช้สำหรับ API calls ทั่วไป
 */
export function useApiQuery<T>(
  url: string | null,
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    refetchOnMount?: boolean;
    retryCount?: number;
    retryDelay?: number;
  } = {}
) {
  const {
    enabled = true,
    refetchOnMount = true,
    retryCount = 2,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(url, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setData(response.data as T);
        setLastFetch(new Date());
        retryCountRef.current = 0;
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "เกิดข้อผิดพลาดในการดึงข้อมูล";

        // Retry logic
        if (retryCountRef.current < retryCount && err.code !== "ERR_CANCELED") {
          retryCountRef.current++;
          setTimeout(() => {
            fetchData();
          }, retryDelay * retryCountRef.current);
          return;
        }

        setError(errorMessage);
        console.error(`API Error (${url}):`, err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [url, enabled, retryCount, retryDelay]);

  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, refetchOnMount, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLastFetch(null);
    retryCountRef.current = 0;
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
    lastFetch,
    isStale: lastFetch ? Date.now() - lastFetch.getTime() > 300000 : true, // 5 minutes
  };
}

/**
 * Widget Data Hook
 * เฉพาะสำหรับ widgets ที่ต้องการ branchId และ date
 */
export function useWidgetData<T>(
  endpoint: string,
  branchId: string | number,
  date: string,
  options: {
    enabled?: boolean;
    transform?: (data: any) => T;
  } = {}
) {
  const { enabled = true, transform } = options;

  const url =
    branchId && date ? `${endpoint}?branchId=${branchId}&date=${date}` : null;

  const result = useApiQuery<T>(url, [branchId, date], { enabled });

  // Transform data if transformer provided
  const transformedData =
    transform && result.data ? transform(result.data) : result.data;

  return {
    ...result,
    data: transformedData,
  };
}

/**
 * Form State Hook
 * จัดการ form state และ validation
 */
export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateField = useCallback(
    (field: keyof T) => {
      if (!validationRules?.[field]) return null;

      const error = validationRules[field]!(values[field]);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
      return error;
    },
    [values, validationRules]
  );

  const validateAll = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validationRules[field as keyof T]!(
        values[field as keyof T]
      );
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void>) => {
      setIsSubmitting(true);

      try {
        const isValid = validateAll();
        if (!isValid) return;

        await onSubmit(values);
        // Don't reset form automatically - let parent decide
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateField,
    validateAll,
    resetForm,
    handleSubmit,
    isValid: Object.keys(errors).length === 0,
    isDirty: JSON.stringify(values) !== JSON.stringify(initialValues),
  };
}

/**
 * Loading State Hook
 * จัดการ loading states หลายๆ อย่างพร้อมกัน
 */
export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback(
    (key?: string) => {
      if (key) return Boolean(loadingStates[key]);
      return Object.values(loadingStates).some(Boolean);
    },
    [loadingStates]
  );

  const resetLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    resetLoading,
    loadingStates,
  };
}

/**
 * Pagination Hook
 * จัดการ pagination state
 */
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const goToNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    goToNext,
    goToPrevious,
    resetPagination,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
  };
}

/**
 * Local Storage Hook
 * จัดการ localStorage แบบ type-safe
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return defaultValue;

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}
