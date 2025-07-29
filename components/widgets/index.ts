/**
 * Widgets Barrel Export
 * Export widget components ที่ใช้ในหน้า dashboard และ asset-type
 */

// 📊 Dashboard Widgets
export { default as ContractTransactionDetails } from "./dashboard/contract-transaction-details";
export { ContractTransactionSummary } from "./dashboard/contract-transaction-summary";
export { DailyOperationSummary } from "./dashboard/daily-operation-summary";
export { GoldPriceCard } from "./dashboard/gold-price";
export { WeeklyOperationSummary } from "./dashboard/weekly-operation-summary";

// 📈 Asset Type Widgets
export { AssetTypesSummary } from "./asset-type/asset-type-summary";
export { RankingByPeriodAssetType } from "./asset-type/ranking-by-period-asset-type";
export { TopRankingAssetType } from "./asset-type/top-ranking-asset-type";
