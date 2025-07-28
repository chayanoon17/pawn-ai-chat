"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { ContractTransactionSummary } from "@/components/widgets/dashboard/contract-transaction-summary";
import { DailyOperationSummary } from "@/components/widgets/dashboard/daily-operation-summary";
import { GoldPriceCard } from "@/components/widgets/dashboard/gold-price";
import { WeeklyOperationSummary } from "@/components/widgets/dashboard/weekly-operation-summary";
import ContractTransactionDetails from "@/components/widgets/dashboard/contract-transaction-details";
import { WidgetFilterData } from "@/components/features/filters";

export default function DashboardPage() {
  return (
    <BasePageLayout page="pawn-tickets" pageTitle="แดชบอร์ด">
      {(filterData: WidgetFilterData) => (
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              📊 แดชบอร์ดภาพรวม
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              ติดตามข้อมูลธุรกิจและการดำเนินงานแบบเรียลไทม์
            </p>
          </div>

          {/* Gold Price Section */}
          <GoldPriceCard />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

          {/* Weekly Summary */}
          <WeeklyOperationSummary
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />

          {/* Transaction Details */}
          <ContractTransactionDetails
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />
        </div>
      )}
    </BasePageLayout>
  );
}
