"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { WidgetFilterData } from "@/components/features/filters";

interface FilterContextType {
  filterData: WidgetFilterData;
  setFilterData: (data: WidgetFilterData) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: null, // เริ่มต้นด้วย null สำหรับ "ทุกสาขา"
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  return (
    <FilterContext.Provider value={{ filterData, setFilterData }}>
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
