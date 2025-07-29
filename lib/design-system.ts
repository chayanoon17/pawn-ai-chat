/**
 * Design System Constants
 * ระบบค่าคงที่สำหรับ design system ของแอพ
 */

// 🎨 Color Palette (ขยาย CHART_COLORS)
export const COLORS = {
  // Primary Colors
  PRIMARY: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },

  // Status Colors
  SUCCESS: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },

  WARNING: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },

  ERROR: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },

  // Neutral Colors
  GRAY: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;

// 📏 Spacing Scale (extends Tailwind)
export const SPACING = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

// 🔤 Typography Scale
export const TYPOGRAPHY = {
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// 🔄 Animation Duration
export const ANIMATION = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },
  easing: {
    ease: "ease",
    linear: "linear",
    "ease-in": "ease-in",
    "ease-out": "ease-out",
    "ease-in-out": "ease-in-out",
  },
} as const;

// 📱 Responsive Breakpoints
export const MEDIA_QUERIES = {
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
  xl: "@media (min-width: 1280px)",
  "2xl": "@media (min-width: 1536px)",
} as const;

// 🎯 Component Variants
export const COMPONENT_VARIANTS = {
  button: {
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    },
    variant: {
      primary: "bg-primary-500 text-white hover:bg-primary-600",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    },
  },
  card: {
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    shadow: {
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    },
  },
} as const;

// 🚀 Performance Constants
export const PERFORMANCE = {
  LAZY_LOAD_THRESHOLD: "10px",
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_CACHE_SIZE: 50,
} as const;
