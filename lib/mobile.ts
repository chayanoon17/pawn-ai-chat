/**
 * 📱 Mobile Responsive Utilities
 * Provides utilities for improving mobile user experience
 */

import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ACCESSIBILITY_CONSTANTS } from "./accessibility";

// 📱 Mobile-Responsive Hook
/**
 * Hook for handling different screen sizes and orientations
 */
export function useResponsiveLayout() {
  const isMobile = useIsMobile();
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    handleOrientationChange();
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    orientation,
    isTablet:
      !isMobile &&
      window.innerWidth < ACCESSIBILITY_CONSTANTS.BREAKPOINTS.DESKTOP,
    isDesktop: window.innerWidth >= ACCESSIBILITY_CONSTANTS.BREAKPOINTS.DESKTOP,
  };
}

// 👆 Touch-Friendly Component
/**
 * Component wrapper that makes elements more touch-friendly
 */
interface TouchFriendlyProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button" | "a" | "span";
}

export function TouchFriendly({
  children,
  className = "",
  as: Component = "div",
}: TouchFriendlyProps) {
  return React.createElement(
    Component,
    {
      className: `touch-target ${className}`,
      style: {
        minHeight: `${ACCESSIBILITY_CONSTANTS.MINIMUM_TOUCH_TARGET}px`,
        minWidth: `${ACCESSIBILITY_CONSTANTS.MINIMUM_TOUCH_TARGET}px`,
      },
    },
    children
  );
}

// 📊 Responsive Chart Container
/**
 * Container that adjusts chart size based on screen size
 */
interface ResponsiveChartProps {
  children: React.ReactNode;
  mobileHeight?: number;
  tabletHeight?: number;
  desktopHeight?: number;
  className?: string;
}

export function ResponsiveChart({
  children,
  mobileHeight = 300,
  tabletHeight = 400,
  desktopHeight = 500,
  className = "",
}: ResponsiveChartProps) {
  const { isMobile, isTablet } = useResponsiveLayout();

  const height = isMobile
    ? mobileHeight
    : isTablet
    ? tabletHeight
    : desktopHeight;

  return React.createElement(
    "div",
    {
      className: `${className}`,
      style: { height: `${height}px` },
    },
    children
  );
}

// 🔄 Responsive Grid
/**
 * Grid that adapts to different screen sizes
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  mobileColumns = 1,
  tabletColumns = 2,
  desktopColumns = 3,
  gap = 4,
  className = "",
}: ResponsiveGridProps) {
  const { isMobile, isTablet } = useResponsiveLayout();

  const columns = isMobile
    ? mobileColumns
    : isTablet
    ? tabletColumns
    : desktopColumns;

  return React.createElement(
    "div",
    {
      className: `grid gap-${gap} ${className}`,
      style: {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      },
    },
    children
  );
}

// 📱 Mobile-First Card Component
/**
 * Card component optimized for mobile devices
 */
interface MobileCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function MobileCard({
  children,
  title,
  subtitle,
  className = "",
  padding = "md",
}: MobileCardProps) {
  const { isMobile } = useResponsiveLayout();

  const paddingClass = {
    sm: isMobile ? "p-3" : "p-4",
    md: isMobile ? "p-4" : "p-6",
    lg: isMobile ? "p-6" : "p-8",
  }[padding];

  return React.createElement(
    "div",
    {
      className: `bg-white rounded-lg shadow-sm border ${paddingClass} ${className}`,
    },
    [
      title &&
        React.createElement("div", { key: "header", className: "mb-4" }, [
          React.createElement(
            "h3",
            {
              key: "title",
              className: `font-semibold ${isMobile ? "text-lg" : "text-xl"}`,
            },
            title
          ),
          subtitle &&
            React.createElement(
              "p",
              {
                key: "subtitle",
                className: `text-sm text-gray-600 ${
                  isMobile ? "mt-1" : "mt-2"
                }`,
              },
              subtitle
            ),
        ]),
      React.createElement("div", { key: "content" }, children),
    ].filter(Boolean)
  );
}

// 🌊 Swipe Gesture Hook
/**
 * Hook for handling swipe gestures on mobile
 */
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGesture(
  handlers: SwipeHandlers,
  threshold: number = 50
) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (absDeltaY > threshold && absDeltaY > absDeltaX) {
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    setTouchStart(null);
  };

  return { onTouchStart, onTouchEnd };
}

// 📐 Responsive Text
/**
 * Text component that scales based on screen size
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function ResponsiveText({
  children,
  size = "md",
  className = "",
  as: Component = "span",
}: ResponsiveTextProps) {
  const { isMobile } = useResponsiveLayout();

  const sizeMap = {
    xs: isMobile ? "text-xs" : "text-sm",
    sm: isMobile ? "text-sm" : "text-base",
    md: isMobile ? "text-base" : "text-lg",
    lg: isMobile ? "text-lg" : "text-xl",
    xl: isMobile ? "text-xl" : "text-2xl",
    "2xl": isMobile ? "text-2xl" : "text-3xl",
    "3xl": isMobile ? "text-3xl" : "text-4xl",
  };

  return React.createElement(
    Component,
    {
      className: `${sizeMap[size]} ${className}`,
    },
    children
  );
}

// 🎛️ Mobile-Optimized Input
/**
 * Input component optimized for mobile keyboards
 */
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function MobileInput({
  label,
  error,
  fullWidth = false,
  className = "",
  ...props
}: MobileInputProps) {
  const { isMobile } = useResponsiveLayout();

  const inputClasses = [
    "touch-target",
    "border rounded-md px-3 py-2",
    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "transition-colors duration-200",
    error ? "border-red-500" : "border-gray-300",
    fullWidth ? "w-full" : "",
    isMobile ? "text-base" : "text-sm", // Prevent zoom on iOS
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    "div",
    { className: fullWidth ? "w-full" : "" },
    [
      label &&
        React.createElement(
          "label",
          {
            key: "label",
            className: `block text-sm font-medium text-gray-700 ${
              isMobile ? "mb-2" : "mb-1"
            }`,
          },
          label
        ),
      React.createElement("input", {
        key: "input",
        ...props,
        className: inputClasses,
      }),
      error &&
        React.createElement(
          "p",
          {
            key: "error",
            className: "text-red-500 text-sm mt-1",
          },
          error
        ),
    ].filter(Boolean)
  );
}

// 📱 Mobile Navigation Hook
/**
 * Hook for handling mobile navigation patterns
 */
export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useResponsiveLayout();

  useEffect(() => {
    // Close menu when switching to desktop
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    isMobile,
  };
}
