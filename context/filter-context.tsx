"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { WidgetFilterData } from "@/components/features/filters";

interface FilterContextType {
  filterData: WidgetFilterData;
  setFilterData: (data: WidgetFilterData) => void;
  setFilterDataWithNotification: (data: WidgetFilterData) => void;
  onFilterChange: (callback: (data: WidgetFilterData) => void) => () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: null, // เริ่มต้นด้วย null สำหรับ "ทุกสาขา"
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  const filterCallbacksRef = useRef<((data: WidgetFilterData) => void)[]>([]);

  // 🔄 Set Filter Data with Auto-Update Notification
  const setFilterDataWithNotification = useCallback(
    (data: WidgetFilterData) => {
      setFilterData((prevData) => {
        // ตรวจสอบว่าข้อมูลเปลี่ยนแปลงจริงหรือไม่
        const hasChanged = JSON.stringify(prevData) !== JSON.stringify(data);

        if (hasChanged) {
          // แจ้งเตือน callbacks ที่ subscribe
          filterCallbacksRef.current.forEach((callback) => {
            try {
              callback(data);
            } catch (error) {
              console.error("Error in filter change callback:", error);
            }
          });
        }

        return data;
      });
    },
    []
  );

  // 📡 Subscribe to Filter Changes
  const onFilterChange = useCallback(
    (callback: (data: WidgetFilterData) => void) => {
      filterCallbacksRef.current.push(callback);

      // Return unsubscribe function
      return () => {
        filterCallbacksRef.current = filterCallbacksRef.current.filter(
          (cb) => cb !== callback
        );
      };
    },
    []
  );

  return (
    <FilterContext.Provider
      value={{
        filterData,
        setFilterData,
        setFilterDataWithNotification,
        onFilterChange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
