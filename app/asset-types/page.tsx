"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { AssetTypesSummary } from "@/components/widgets/asset-type/asset-type-summary";
import { RankingByPeriodAssetType } from "@/components/widgets/asset-type/ranking-by-period-asset-type";
import { TopRankingAssetType } from "@/components/widgets/asset-type/top-ranking-asset-type";
import { WidgetFilterData } from "@/components/features/filters";

export default function AssetTypePage() {
  return (
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
  );
}
