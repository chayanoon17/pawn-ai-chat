
import React from "react";
import { Filter } from "../home/filter";
import { GoldPriceCard } from "../home/GoldPriceCard";
import { PerformanceReport } from "../home/PerformanceReport";
import { StatusPieChart } from "../home/StatusPieChart";
import { TrendCharts } from "../home/TrendCharts";
import ItemSummaryCards from "../home/ItemSummaryCards";
import { TypeAndPriceSummaryCards } from "../typeandprice/TypeAndPriceSummaryCards";
import { TypeAndPricePieChart } from "../typeandprice/TypeAndPricePieChart";
import { TypeAndPriceTrendCharts } from "../typeandprice/TypeAndPriceTrendCharts";

export const HomePage = () => {
  return (
    <div className="flex-1  overflow-y-auto">
      <div className="flex-1  overflow-y-auto">
        <Filter />
        <GoldPriceCard />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <PerformanceReport />
          <StatusPieChart />
        </div>
        
        <TrendCharts />
        <ItemSummaryCards />
      </div>
    </div>
  );
};
export const MainContent = () => {
  return (
    <div className="flex-1  overflow-y-auto">
      <div className="flex-1  overflow-y-auto">
        <TypeAndPriceSummaryCards />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <TypeAndPricePieChart />
          <TypeAndPriceTrendCharts />
        </div>
      </div>
    </div>
  );
};
