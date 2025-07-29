/**
 * ♿ Accessibility Utilities and Components
 * Provides utilities for improving app accessibility
 */

import React, { useEffect, useRef } from "react";

// 🎯 Focus Management Hook
/**
 * Hook for managing focus after DOM updates
 * @param shouldFocus - Whether to focus the element
 * @returns Ref to attach to the element
 */
export function useFocusManagement<T extends HTMLElement>(
  shouldFocus: boolean = false
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
}

// ⌨️ Keyboard Navigation Hook
/**
 * Hook for handling keyboard navigation
 * @param onArrowUp - Handler for arrow up key
 * @param onArrowDown - Handler for arrow down key
 * @param onEnter - Handler for enter key
 * @param onEscape - Handler for escape key
 * @returns Event handler for onKeyDown
 */
export function useKeyboardNavigation(handlers: {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}) {
  return React.useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;

      switch (key) {
        case "ArrowUp":
          event.preventDefault();
          handlers.onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          handlers.onArrowDown?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlers.onArrowLeft?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          handlers.onArrowRight?.();
          break;
        case "Enter":
          event.preventDefault();
          handlers.onEnter?.();
          break;
        case "Escape":
          event.preventDefault();
          handlers.onEscape?.();
          break;
        case "Tab":
          handlers.onTab?.();
          break;
        case "Home":
          event.preventDefault();
          handlers.onHome?.();
          break;
        case "End":
          event.preventDefault();
          handlers.onEnd?.();
          break;
      }
    },
    [handlers]
  );
}

// 📢 Screen Reader Announcements
/**
 * Hook for making announcements to screen readers
 * @returns Function to announce messages
 */
export function useScreenReaderAnnouncement() {
  useEffect(() => {
    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.id = "screen-reader-announcements";

    if (!document.getElementById("screen-reader-announcements")) {
      document.body.appendChild(liveRegion);
    }

    return () => {
      const existingRegion = document.getElementById(
        "screen-reader-announcements"
      );
      if (existingRegion) {
        document.body.removeChild(existingRegion);
      }
    };
  }, []);

  const announce = React.useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      const liveRegion = document.getElementById("screen-reader-announcements");
      if (liveRegion) {
        liveRegion.setAttribute("aria-live", priority);
        liveRegion.textContent = message;

        // Clear after announcement
        setTimeout(() => {
          liveRegion.textContent = "";
        }, 1000);
      }
    },
    []
  );

  return announce;
}

// 🎯 Skip Link Component
/**
 * Skip to main content link for keyboard users
 */
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = "" }: SkipLinkProps) {
  return React.createElement(
    "a",
    {
      href,
      className: `sr-only-focusable ${className}`,
      onFocus: (e: React.FocusEvent) => {
        e.currentTarget.classList.remove("sr-only");
      },
      onBlur: (e: React.FocusEvent) => {
        e.currentTarget.classList.add("sr-only");
      },
    },
    children
  );
}

// 🏷️ Accessible Label Hook
/**
 * Hook for generating accessible labels and descriptions
 * @param baseId - Base ID for generating unique IDs
 * @returns Object with label and description IDs
 */
export function useAccessibleIds(baseId: string) {
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  return {
    labelId,
    descriptionId,
    errorId,
    getAriaProps: (hasError?: boolean, hasDescription?: boolean) => ({
      "aria-labelledby": labelId,
      "aria-describedby":
        [hasDescription ? descriptionId : null, hasError ? errorId : null]
          .filter(Boolean)
          .join(" ") || undefined,
    }),
  };
}

// 🎭 Visually Hidden Component
/**
 * Component for content that should be available to screen readers but not visible
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
}

export function VisuallyHidden({
  children,
  className = "",
}: VisuallyHiddenProps) {
  return React.createElement(
    "span",
    { className: `sr-only ${className}` },
    children
  );
}

// 🔊 Loading Announcement Component
/**
 * Component that announces loading states to screen readers
 */
interface LoadingAnnouncementProps {
  isLoading: boolean;
  loadingMessage?: string;
  completeMessage?: string;
}

export function LoadingAnnouncement({
  isLoading,
  loadingMessage = "Loading...",
  completeMessage = "Content loaded",
}: LoadingAnnouncementProps) {
  const announce = useScreenReaderAnnouncement();

  useEffect(() => {
    if (isLoading) {
      announce(loadingMessage);
    } else {
      announce(completeMessage);
    }
  }, [isLoading, loadingMessage, completeMessage, announce]);

  return null; // This component doesn't render anything visible
}

// 🎯 Focus Trap Hook
/**
 * Hook for trapping focus within an element (useful for modals)
 * @param isActive - Whether the focus trap is active
 * @returns Ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isActive]);

  return ref;
}

// 🎯 Accessible Button Component
/**
 * Enhanced button with accessibility features
 */
interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
}

export function AccessibleButton({
  children,
  isLoading = false,
  loadingText = "Loading...",
  className = "",
  disabled,
  ...props
}: AccessibleButtonProps) {
  const isDisabled = disabled || isLoading;

  return React.createElement(
    "button",
    {
      ...props,
      disabled: isDisabled,
      "aria-disabled": isDisabled,
      "aria-busy": isLoading,
      className: `touch-target focus-visible-ring ${className}`,
      type: props.type || "button",
    },
    isLoading ? loadingText : children
  );
}

// Export accessibility constants
export const ACCESSIBILITY_CONSTANTS = {
  MINIMUM_TOUCH_TARGET: 44, // 44px minimum touch target size
  FOCUS_RING_OFFSET: 2, // 2px focus ring offset
  ANIMATION_DURATION: {
    SHORT: 150,
    MEDIUM: 300,
    LONG: 500,
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
} as const;
