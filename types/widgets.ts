/**
 * Widget Types
 * รวม interfaces และ types สำหรับ widgets ทั้งหมด
 */

// ===== ASSET TYPE WIDGETS =====
export interface AssetRanking {
  rank: number;
  name: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface AssetTypeSummary {
  name: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface AssetTypeData {
  name: string;
  value: number;
  fill: string;
}

export interface TopRankingAssetTypeProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export interface AssetTypeSummaryProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export interface RankingByPeriodAssetTypeProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export interface DailyData {
  date: string;
  rankings: Ranking[];
}

export interface Ranking {
  name: string;
  amount: number;
}

export interface ChartDataItem {
  date: string;
  [key: string]: string | number;
}

export interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

// ===== DASHBOARD WIDGETS =====
export interface GoldPrice {
  buy: number;
  sell: number;
  lastUpdate: string;
  change: number;
  changePercent: number;
}

export interface BranchDailySummary {
  branchId: number;
  branchName: string;
  contractCount: number;
  totalAmount: number;
  averageAmount: number;
  goldWeight: number;
  interestAmount: number;
  date: string;
}

export interface DailyOperationProps {
  branchId?: number;
  date?: string;
}

export interface TransactionSummaryData {
  totalContracts: number;
  totalAmount: number;
  averageAmount: number;
  goldWeight: number;
  interestAmount: number;
}

export interface TransactionSummaryResponse {
  success: boolean;
  message: string;
  data: TransactionSummaryData;
}

export interface ContractTransactionSummaryProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export interface WeeklyOperationData {
  week: string;
  summary: OperationSummary[];
}

export interface OperationSummary {
  branchId: number;
  branchName: string;
  contractCount: number;
  totalAmount: number;
  averageAmount: number;
  goldWeight: number;
  interestAmount: number;
}

export interface WeeklyOperationResponse {
  success: boolean;
  message: string;
  data: WeeklyOperationData[];
}

export interface WeeklyOperationSummaryProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export interface TransactionSummaryItem {
  branchName: string;
  contractCount: number;
  totalAmount: number;
}

export interface TransactionDetailItem {
  contractId: string;
  customerName: string;
  amount: number;
  goldWeight: number;
  interestRate: number;
  interestAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  branchName: string;
}

export interface ContractTransactionDetailsResponse {
  success: boolean;
  message: string;
  data: {
    summary: TransactionSummaryItem[];
    details: TransactionDetailItem[];
  };
}

export interface ContractTransactionDetailsProps {
  branchId?: number;
  period?: import("./common").FilterPeriod;
}

export type TransactionType =
  | "NEW_CONTRACT"
  | "RENEW_CONTRACT"
  | "CLOSE_CONTRACT"
  | "PARTIAL_PAYMENT";

// ===== API RESPONSE TYPES =====
export interface WidgetApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> extends WidgetApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
