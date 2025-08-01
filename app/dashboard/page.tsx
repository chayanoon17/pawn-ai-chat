"use client";

import { ContractStatusSummary } from "@/components/widgets/dashboard/contract-status-summary";
import { ContractTransactionSummary } from "@/components/widgets/dashboard/contract-transaction-type-summary";
import { DailyOperationSummary } from "@/components/widgets/dashboard/daily-operation-summary";
import { GoldPriceCard } from "@/components/widgets/dashboard/gold-price";
import { WeeklyOperationSummary } from "@/components/widgets/dashboard/weekly-operation-summary";
import ContractTransactionDetails from "@/components/widgets/dashboard/contract-transaction-details";
import { MenuPermissionGuard } from "@/components/core/permission-guard";
import { useFilter } from "@/context/filter-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { filterData } = useFilter();

  // แสดง Skeleton เมื่อกำลังโหลดข้อมูล
  if (filterData.isLoading) {
    return (
      <div className="space-y-8">
        {/* Gold Price Skeleton */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </Card>

        {/* Daily Operation Skeleton */}
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Summary Skeleton */}
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Transaction Details Skeleton */}
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/8" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <MenuPermissionGuard
      requiredMenuPermission="Dashboard"
      fallback={
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
      }
    >
      <div className="space-y-8">
        {/* Gold Price Section */}
        <GoldPriceCard />

        <DailyOperationSummary
          branchId={filterData.branchId}
          date={filterData.date}
          isLoading={filterData.isLoading}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ContractStatusSummary
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
    </MenuPermissionGuard>
  );
}
