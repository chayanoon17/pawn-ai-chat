/**
 * Component Naming & Pattern Standards
 * กำหนดมาตรฐานการเขียน components ในโปรเจค
 */

// ===== NAMING CONVENTIONS =====

/**
 * 🏷️ Component Naming Rules:
 *
 * ✅ Page Components (app router):
 * - export default function Page()
 * - ไฟล์: page.tsx
 *
 * ✅ Layout Components:
 * - export default function Layout()
 * - ไฟล์: layout.tsx
 *
 * ✅ Regular Components:
 * - export function ComponentName()
 * - ไฟล์: component-name.tsx
 *
 * ✅ Widget Components:
 * - export function WidgetName()
 * - ไฟล์: widget-name.tsx
 *
 * ✅ Custom Hooks:
 * - export function useHookName()
 * - ไฟล์: use-hook-name.ts
 */

// ===== COMPONENT TEMPLATES =====

/**
 * 📄 Page Component Template
 */
export const PageTemplate = `
"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";

export default function Page() {
  const { shouldRender } = useProtectedRoute();

  if (!shouldRender) {
    return null;
  }

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
`;

/**
 * 🧩 Component Template
 */
export const ComponentTemplate = `
"use client";

import { cn } from "@/lib/utils";

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

export function ComponentName({ 
  className, 
  children,
  ...props 
}: ComponentNameProps) {
  return (
    <div 
      className={cn("base-styles", className)}
      {...props}
    >
      {children}
    </div>
  );
}
`;

/**
 * 📊 Widget Component Template
 */
export const WidgetTemplate = `
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWidgetData } from "@/hooks/use-api";
import { useWidgetRegistration } from "@/context/widget-context";
import { ErrorFallback } from "@/components/error-boundary";

interface WidgetNameProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

export function WidgetName({ 
  branchId, 
  date, 
  isLoading: parentLoading = false 
}: WidgetNameProps) {
  const { data, loading, error, refetch } = useWidgetData(
    "/api/v1/endpoint",
    branchId,
    date
  );

  // Register widget for context
  useWidgetRegistration({
    id: "widget-name",
    name: "Widget Name",
    description: "Widget description",
    data,
    timestamp: new Date().toISOString(),
  });

  const isLoading = loading || parentLoading;

  if (error) {
    return <ErrorFallback error={new Error(error)} resetError={refetch} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Title</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>Widget content</div>
        )}
      </CardContent>
    </Card>
  );
}
`;

/**
 * 🎣 Custom Hook Template
 */
export const HookTemplate = `
"use client";

import { useState, useEffect, useCallback } from "react";

export function useHookName() {
  const [state, setState] = useState();

  // Hook logic here

  return {
    // Return values
  };
}
`;

// ===== COMPONENT STANDARDS =====

/**
 * 📋 Component Standards Checklist:
 *
 * ✅ Props Interface:
 * - ใช้ interface แทน inline types
 * - ใส่ className?: string เสมอ
 * - ใส่ children?: React.ReactNode ถ้าต้องการ
 *
 * ✅ Error Handling:
 * - ใช้ ErrorFallback สำหรับ inline errors
 * - ห่อด้วย ErrorBoundary สำหรับ critical components
 *
 * ✅ Loading States:
 * - ใช้ consistent loading components
 * - รองรับ parent loading state
 *
 * ✅ Styling:
 * - ใช้ cn() utility จาก @/lib/utils
 * - ใช้ Tailwind classes
 * - รองรับ custom className
 *
 * ✅ Performance:
 * - ใช้ useCallback สำหรับ functions
 * - ใช้ useMemo สำหรับ expensive calculations
 * - ใช้ React.memo สำหรับ pure components
 */

// ===== FILE STRUCTURE STANDARDS =====

/**
 * 📁 File Organization:
 *
 * components/
 * ├── ui/                    # Base UI components (shadcn/ui)
 * ├── layouts/               # Layout components
 * ├── widgets/               # Business logic widgets
 * │   ├── dashboard/
 * │   └── asset-type/
 * ├── forms/                 # Form components
 * ├── error-boundary.tsx     # Error handling
 * └── component-name.tsx     # Regular components
 *
 * hooks/
 * ├── use-api.ts            # API related hooks
 * ├── use-auth.ts           # Auth related hooks
 * └── use-feature.ts        # Feature specific hooks
 *
 * types/
 * ├── api.ts                # API types
 * ├── auth.ts               # Auth types
 * └── components.ts         # Component types
 */

// ===== BARREL EXPORTS =====

/**
 * 📦 Barrel Export Pattern:
 *
 * components/index.ts:
 * export { ComponentA } from './component-a';
 * export { ComponentB } from './component-b';
 *
 * hooks/index.ts:
 * export { useHookA } from './use-hook-a';
 * export { useHookB } from './use-hook-b';
 *
 * การใช้งาน:
 * import { ComponentA, ComponentB } from '@/components';
 * import { useHookA, useHookB } from '@/hooks';
 */
