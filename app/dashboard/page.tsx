"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { ContractTransactionSummary } from "@/components/widgets/dashboard/contract-transaction-summary";
import { DailyOperationSummary } from "@/components/widgets/dashboard/daily-operation-summary";
import { GoldPriceCard } from "@/components/widgets/dashboard/gold-price";
import { WeeklyOperationSummary } from "@/components/widgets/dashboard/weekly-operation-summary";
import ContractTransactionDetails from "@/components/widgets/dashboard/contract-transaction-details";
import { WidgetFilterData } from "@/components/widget-filter";

export default function DashboardPage() {
  return (
    <BasePageLayout page="pawn-tickets">
      {(filterData: WidgetFilterData) => (
        <>
          <GoldPriceCard />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <DailyOperationSummary
              branchId={filterData.branchId}
              date={filterData.date}
              isLoading={filterData.isLoading}
            />
            <ContractTransactionSummary
              branchId={filterData.branchId}
              date={filterData.date}
              isLoading={filterData.isLoading}
            />
          </div>

          <WeeklyOperationSummary
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />

          <ContractTransactionDetails
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />
        </>
      )}
    </BasePageLayout>
  );
}
