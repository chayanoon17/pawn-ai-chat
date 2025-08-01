"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { AssetTypesSummary } from "@/components/widgets/asset-type/asset-type-summary";
import { RankingByPeriodAssetType } from "@/components/widgets/asset-type/ranking-by-period-asset-type";
import { TopRankingAssetType } from "@/components/widgets/asset-type/top-ranking-asset-type";
import { WidgetFilterData } from "@/components/features/filters";
import { MenuPermissionGuard } from "@/components/core/permission-guard";

export default function AssetTypePage() {
  return (
    <MenuPermissionGuard
      requiredMenuPermission="Asset Types"
      fallback={
        <BasePageLayout page="asset-types" pageTitle="ประเภททรัพย์">
          {() => (
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
          )}
        </BasePageLayout>
      }
    >
      <BasePageLayout page="asset-types" pageTitle="ประเภททรัพย์">
        {(filterData: WidgetFilterData) => (
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
        )}
      </BasePageLayout>
    </MenuPermissionGuard>
  );
}
