/**
 * Types สำหรับ Dashboard Widgets
 * รวม interfaces และ types ที่ใช้ในหน้า dashboard และ widgets ต่างๆ
 */

// ===== GOLD PRICE TYPES =====
export interface GoldPrice {
  id: number;
  goldBarBuy: number;
  goldBarSell: number;
  goldJewelryBuy: number;
  goldJewelrySell: number;
  createdAt: string;
  updatedAt: string;
}

// ===== DAILY OPERATION TYPES =====
export interface BranchDailySummary {
  branchId: number;
  beginningBalance: {
    count: number;
    amount: number;
  };
  endingBalance: {
    count: number;
    amount: number;
  };
  countChange: number;
  amountChange: number;
  timestamp: string;
}

export interface DailyOperationProps {
  branchId: string;
  date: string;
  isLoading?: boolean;
}

// ===== TRANSACTION SUMMARY TYPES =====
export interface TransactionSummaryData {
  totalContracts: number;
  totalAmount: number;
  averageAmount: number;
  totalInterest: number;
  profitMargin: number;
}

export interface TransactionSummaryResponse {
  success: boolean;
  data: TransactionSummaryData;
  message?: string;
}

export interface ContractTransactionSummaryProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

// ===== WEEKLY OPERATION TYPES =====
export interface WeeklyOperationData {
  date: string;
  total: number;
}

export interface OperationSummary {
  newContracts: WeeklyOperationData[];
  renewalContracts: WeeklyOperationData[];
  redemptions: WeeklyOperationData[];
  totalAmount: number;
  contractCount: number;
  averageAmount: number;
}

export interface WeeklyOperationResponse {
  success: boolean;
  data: OperationSummary;
  message?: string;
}

export interface WeeklyOperationSummaryProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

// ===== TRANSACTION DETAILS TYPES =====
export interface TransactionSummaryItem {
  type: string;
  value: number;
  total: number;
}

export interface TransactionDetailItem {
  contractNumber: number;
  transactionDate: string;
  interestPaymentDate: string | null;
  overdueDays: number;
  remainingAmount: number;
  interestAmount: number;
  transactionType: string;
  branchId: number;
}

export interface ContractTransactionDetailsResponse {
  summary: TransactionSummaryItem[];
  details: TransactionDetailItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContractTransactionDetailsProps {
  branchId: number | null;
  date: string | null;
  isLoading: boolean;
}

export type TransactionType =
  | "new-contract"
  | "renewal"
  | "redemption"
  | "interest-payment"
  | "extension"
  | "expired";
