"use client";

import { AssetTypesSummary } from "@/components/widgets/asset-type/asset-type-summary";
import { RankingByPeriodAssetType } from "@/components/widgets/asset-type/ranking-by-period-asset-type";
import { TopRankingAssetType } from "@/components/widgets/asset-type/top-ranking-asset-type";
import { MenuPermissionGuard } from "@/components/core/permission-guard";
import { useFilter } from "@/context/filter-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AssetTypePage() {
  const { filterData } = useFilter();

  // แสดง Skeleton เมื่อกำลังโหลดข้อมูล
  if (filterData.isLoading) {
    return (
      <div className="space-y-8">
        {/* Top Ranking Asset Type Skeleton */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Ranking by Period Card Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Summary Card Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
              {/* Chart Area */}
              <div className="space-y-2 mt-6">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-32 w-full rounded" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <MenuPermissionGuard
      requiredMenuPermission="Asset Types"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-gray-600">
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้าวิเคราะห์ประเภททรัพย์
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Analysis Cards */}
        <TopRankingAssetType
          branchId={filterData.branchId}
          date={filterData.date}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Ranking by Period Card */}
          <RankingByPeriodAssetType
            branchId={filterData.branchId}
            date={filterData.date}
          />

          {/* Summary Card */}
          <AssetTypesSummary
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />
        </div>
      </div>
    </MenuPermissionGuard>
  );
}
