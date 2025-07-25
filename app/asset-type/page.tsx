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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              💎 ประเภททรัพย์และราคา
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              วิเคราะห์ข้อมูลประเภททรัพย์และแนวโน้มราคาในตลาด
            </p>
          </div>

          {/* Summary Card */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <AssetTypesSummary
                branchId={filterData.branchId}
                date={filterData.date}
                isLoading={filterData.isLoading}
              />
            </div>
          </div>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                📈 จัดอันดับตามช่วงเวลา
              </h2>
              <RankingByPeriodAssetType
                branchId={filterData.branchId}
                date={filterData.date}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                🏆 อันดับยอดนิยม
              </h2>
              <TopRankingAssetType
                branchId={filterData.branchId}
                date={filterData.date}
              />
            </div>
          </div>
        </div>
      )}
    </BasePageLayout>
  );
}
