/**
 * Types สำหรับ Asset Type Widgets
 * รวม interfaces และ types ที่ใช้ในหน้า asset-type และ widgets ต่างๆ
 */

// ===== ASSET TYPE SUMMARY TYPES =====
export interface AssetTypeSummary {
  assetTypeId: number;
  assetTypeName: string;
  totalAmount: number;
  contractCount: number;
  percentage: number;
}

export interface AssetTypeSummaryResponse {
  success: boolean;
  data: AssetTypeSummary[];
  message?: string;
}

export interface AssetTypeSummaryProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

export interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
}

// ===== ASSET RANKING TYPES =====
export interface AssetRanking {
  assetTypeId: number;
  assetTypeName: string;
  totalAmount: number;
  contractCount: number;
  rank: number;
}

export interface AssetRankingResponse {
  success: boolean;
  data: AssetRanking[];
  message?: string;
}

export interface TopRankingAssetTypeProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

// ===== RANKING BY PERIOD TYPES =====
export interface RankingByPeriodProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

export interface DailyData {
  date: string;
  assetTypes: Ranking[];
}

export interface Ranking {
  assetTypeId: number;
  assetTypeName: string;
  totalAmount: number;
}

export interface RankingByPeriodResponse {
  success: boolean;
  data: DailyData[];
  message?: string;
}

export interface ChartDataItem {
  date: string;
  [key: string]: string | number; // สำหรับ asset type names เป็น keys
}
