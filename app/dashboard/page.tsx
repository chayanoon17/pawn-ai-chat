"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { ContractTransactionSummary } from "@/components/widgets/dashboard/contract-transaction-summary";
import { DailyOperationSummary } from "@/components/widgets/dashboard/daily-operation-summary";
import { GoldPriceCard } from "@/components/widgets/dashboard/gold-price";
import { WeeklyOperationSummary } from "@/components/widgets/dashboard/weekly-operation-summary";
import ContractTransactionDetails from "@/components/widgets/dashboard/contract-transaction-details";
import { WidgetFilterData } from "@/components/features/filters";
import { MenuPermissionGuard } from "@/components/core/permission-guard";

export default function DashboardPage() {
  return (
    <MenuPermissionGuard
      requiredMenuPermission="Dashboard"
      fallback={
        <BasePageLayout page="pawn-tickets" pageTitle="แดชบอร์ด">
          {() => (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  ไม่มีสิทธิ์เข้าถึง
                </h2>
                <p className="text-gray-600">
                  คุณไม่มีสิทธิ์ในการเข้าถึงหน้าแดชบอร์ด
                </p>
              </div>
            </div>
          )}
        </BasePageLayout>
      }
    >
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
    </MenuPermissionGuard>
  );
}
