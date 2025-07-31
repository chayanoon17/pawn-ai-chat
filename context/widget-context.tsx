"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 📊 Types สำหรับ Widget Data
export interface WidgetData {
  id: string;
  name: string;
  description: string;
  data: any;
  timestamp: string;
}

interface WidgetContextType {
  widgets: Map<string, WidgetData>;
  registerWidget: (widget: WidgetData) => void;
  unregisterWidget: (id: string) => void;
  getWidget: (id: string) => WidgetData | undefined;
  getAllWidgets: () => WidgetData[];
  getWidgetsByRoute: (route: string) => WidgetData[];
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widgets, setWidgets] = useState<Map<string, WidgetData>>(new Map());

  const registerWidget = (widget: WidgetData) => {
    setWidgets((prev) => {
      const newWidgets = new Map(prev);
      newWidgets.set(widget.id, widget);
      return newWidgets;
    });
  };

  const unregisterWidget = (id: string) => {
    setWidgets((prev) => {
      const newWidgets = new Map(prev);
      newWidgets.delete(id);
      return newWidgets;
    });
  };

  const getWidget = (id: string): WidgetData | undefined => {
    return widgets.get(id);
  };

  const getAllWidgets = (): WidgetData[] => {
    return Array.from(widgets.values());
  };

  const getWidgetsByRoute = (route: string): WidgetData[] => {
    return Array.from(widgets.values()).filter((widget) => {
      // กรองตาม route - แยกตาম widget id prefix
      if (route.includes("/dashboard")) {
        return [
          "weekly-operation-summary",
          "daily-operation-summary",
          "gold-price",
          "contract-transaction-type-summary",
          "contract-status-summary",
          "contract-transaction-details",
        ].includes(widget.id);
      } else if (route.includes("/asset-types")) {
        return [
          "asset-type-summary",
          "top-ranking-asset-type",
          "ranking-by-period-asset-type",
        ].includes(widget.id);
      }
      return true; // แสดงทั้งหมดสำหรับ route อื่นๆ
    });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        registerWidget,
        unregisterWidget,
        getWidget,
        getAllWidgets,
        getWidgetsByRoute,
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

// 🎯 Custom Hook สำหรับ Widget Registration
export const useWidgetRegistration = (
  id: string,
  name: string,
  description: string,
  data: any,
  dependencies: any[] = []
) => {
  const { registerWidget, unregisterWidget } = useWidgetContext();

  React.useEffect(() => {
    if (data) {
      registerWidget({
        id,
        name,
        description,
        data,
        timestamp: new Date().toISOString(),
      });
    }

    return () => {
      unregisterWidget(id);
    };
  }, [id, name, description, JSON.stringify(data), ...dependencies]);
};
