"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

// 📊 Types สำหรับ Widget Data
export interface WidgetData {
  id: string;
  name: string;
  description: string;
  data: any;
  timestamp: string;
}

// 🔄 Types สำหรับ Context Replacement
export interface ContextReplacement {
  autoUpdate: boolean;
  replaceOnUpdate: boolean;
}

interface WidgetContextType {
  widgets: Map<string, WidgetData>;
  contextReplacement: Map<string, ContextReplacement>;
  registerWidget: (widget: WidgetData, options?: ContextReplacement) => void;
  unregisterWidget: (id: string) => void;
  updateWidget: (widget: WidgetData) => void;
  getWidget: (id: string) => WidgetData | undefined;
  getAllWidgets: () => WidgetData[];
  getWidgetsByRoute: (route: string) => WidgetData[];
  onWidgetUpdate: (callback: (widget: WidgetData) => void) => () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widgets, setWidgets] = useState<Map<string, WidgetData>>(new Map());
  const [contextReplacement, setContextReplacement] = useState<
    Map<string, ContextReplacement>
  >(new Map());
  const updateCallbacksRef = useRef<((widget: WidgetData) => void)[]>([]);

  // 🔄 Register Widget with Auto-Update Options
  const registerWidget = useCallback(
    (widget: WidgetData, options?: ContextReplacement) => {
      setWidgets((prev) => {
        const newWidgets = new Map(prev);
        newWidgets.set(widget.id, widget);
        return newWidgets;
      });

      if (options) {
        setContextReplacement((prev) => {
          const newOptions = new Map(prev);
          newOptions.set(widget.id, options);
          return newOptions;
        });
      }
    },
    []
  );

  // 🗑️ Unregister Widget
  const unregisterWidget = useCallback((id: string) => {
    setWidgets((prev) => {
      const newWidgets = new Map(prev);
      newWidgets.delete(id);
      return newWidgets;
    });
    setContextReplacement((prev) => {
      const newOptions = new Map(prev);
      newOptions.delete(id);
      return newOptions;
    });
  }, []);

  // 🔄 Update Widget และแจ้งเตือน Callbacks
  const updateWidget = useCallback((widget: WidgetData) => {
    setWidgets((prev) => {
      const existing = prev.get(widget.id);
      if (!existing) return prev;

      // ตรวจสอบว่าข้อมูลเปลี่ยนแปลงจริงหรือไม่
      const hasChanged =
        JSON.stringify(existing.data) !== JSON.stringify(widget.data);
      if (!hasChanged) return prev;

      const newWidgets = new Map(prev);
      const updatedWidget = { ...widget, timestamp: new Date().toISOString() };
      newWidgets.set(widget.id, updatedWidget);

      // แจ้งเตือน callbacks ที่ subscribe
      updateCallbacksRef.current.forEach((callback) => {
        try {
          callback(updatedWidget);
        } catch (error) {
          console.error("Error in widget update callback:", error);
        }
      });

      return newWidgets;
    });
  }, []);

  // 📡 Subscribe to Widget Updates
  const onWidgetUpdate = useCallback(
    (callback: (widget: WidgetData) => void) => {
      updateCallbacksRef.current.push(callback);

      // Return unsubscribe function
      return () => {
        updateCallbacksRef.current = updateCallbacksRef.current.filter(
          (cb) => cb !== callback
        );
      };
    },
    []
  );

  const getWidget = useCallback(
    (id: string): WidgetData | undefined => {
      return widgets.get(id);
    },
    [widgets]
  );

  const getAllWidgets = useCallback((): WidgetData[] => {
    return Array.from(widgets.values());
  }, [widgets]);

  const getWidgetsByRoute = (route: string): WidgetData[] => {
    return Array.from(widgets.values())
      .filter((widget) => {
        // กรองตาม route - แยกตาม widget id prefix และเรียงตามลำดับในหน้า
        if (route.includes("/dashboard")) {
          return [
            "gold-price",
            "daily-operation-summary",
            "contract-status-summary",
            "contract-transaction-type-summary",
            "weekly-operation-summary",
            "contract-transaction-details",
          ].includes(widget.id);
        } else if (route.includes("/asset-types")) {
          return [
            "top-ranking-asset-type",
            "ranking-by-period-asset-type",
            "asset-type-summary",
          ].includes(widget.id);
        }
        return true; // แสดงทั้งหมดสำหรับ route อื่นๆ
      })
      .sort((a, b) => {
        // เรียงลำดับ widgets ตามลำดับในหน้า
        if (route.includes("/dashboard")) {
          const dashboardOrder = [
            "gold-price",
            "daily-operation-summary",
            "contract-status-summary",
            "contract-transaction-type-summary",
            "weekly-operation-summary",
            "contract-transaction-details",
          ];
          return dashboardOrder.indexOf(a.id) - dashboardOrder.indexOf(b.id);
        } else if (route.includes("/asset-types")) {
          const assetTypesOrder = [
            "top-ranking-asset-type",
            "ranking-by-period-asset-type",
            "asset-type-summary",
          ];
          return assetTypesOrder.indexOf(a.id) - assetTypesOrder.indexOf(b.id);
        }
        return 0;
      });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        contextReplacement,
        registerWidget,
        unregisterWidget,
        updateWidget,
        getWidget,
        getAllWidgets,
        getWidgetsByRoute,
        onWidgetUpdate,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = () => {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidgetContext must be used within a WidgetProvider");
  }
  return context;
};

// 🎯 Custom Hook สำหรับ Widget Registration with Auto-Update
export const useWidgetRegistration = (
  id: string,
  name: string,
  description: string,
  data: any,
  options?: {
    autoUpdate?: boolean;
    replaceOnUpdate?: boolean;
    dependencies?: any[];
  }
) => {
  const { registerWidget, unregisterWidget, updateWidget } = useWidgetContext();
  const prevDataRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  const {
    autoUpdate = true,
    replaceOnUpdate = true,
    dependencies = [],
  } = options || {};

  React.useEffect(() => {
    // 🏁 Initial Registration
    if (!isInitializedRef.current && data) {
      registerWidget(
        {
          id,
          name,
          description,
          data,
          timestamp: new Date().toISOString(),
        },
        { autoUpdate, replaceOnUpdate }
      );

      prevDataRef.current = data;
      isInitializedRef.current = true;
      return;
    }

    // 🔄 Auto-Update: ตรวจสอบการเปลี่ยนแปลงข้อมูล
    if (autoUpdate && data && isInitializedRef.current) {
      const currentDataString = JSON.stringify(data);
      const prevDataString = JSON.stringify(prevDataRef.current);

      if (currentDataString !== prevDataString) {
        updateWidget({
          id,
          name,
          description,
          data,
          timestamp: new Date().toISOString(),
        });
        prevDataRef.current = data;
      }
    }
  }, [
    id,
    name,
    description,
    JSON.stringify(data),
    autoUpdate,
    replaceOnUpdate,
    ...dependencies,
  ]);

  React.useEffect(() => {
    return () => {
      unregisterWidget(id);
      isInitializedRef.current = false;
    };
  }, [id, unregisterWidget]);
};
