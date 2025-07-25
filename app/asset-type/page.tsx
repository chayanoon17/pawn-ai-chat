"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { AssetTypesSummary } from "@/components/widgets/asset-type/asset-type-summary";
import { RankingByPeriodAssetType } from "@/components/widgets/asset-type/ranking-by-period-asset-type";
import { TopRankingAssetType } from "@/components/widgets/asset-type/top-ranking-asset-type";
import { WidgetFilterData } from "@/components/widget-filter";

export default function AssetTypePage() {
  return (
    <BasePageLayout page="asset-types">
      {(filterData: WidgetFilterData) => (
        <>
          <AssetTypesSummary
            branchId={filterData.branchId}
            date={filterData.date}
            isLoading={filterData.isLoading}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <RankingByPeriodAssetType
              branchId={filterData.branchId}
              date={filterData.date}
            />
            <TopRankingAssetType
              branchId={filterData.branchId}
              date={filterData.date}
            />
          </div>
        </>
      )}
    </BasePageLayout>
  );
}
