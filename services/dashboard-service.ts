import type { GoldPrice } from "@/types/dashboard";
import apiClient from "@/lib/api-client";

export interface StatusSummaryResponse {
  branchId: number;
  summaries: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  timestamp: string;
}

export interface TransactionSummaryItem {
  type: string;
  value: number;
  total: number;
}

export interface TransactionDetailItem {
  contractNumber: number;
  primaryContractNumber: number | null;
  previousContractNumber: number | null;
  ticketBookNumber: string;
  transactionDate: string;
  interestPaymentDate: string | null;
  overdueDays: number;
  remainingAmount: number;
  interestAmount: number;
  transactionType: string;
  branchId: number;
  branchName: string;
  branchShortName: string;
  branchLocation: string;
  assetName: string;
  assetType: string;
  assetDetail: string;
  pawnPrice: number;
  monthlyInterest: number;
  contractStatus: string;
  redeemedDate: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerOccupation: string;
}

export interface ContractTransactionDetailsResponse {
  branchId: number;
  summaries: TransactionSummaryItem[];
  transactions: TransactionDetailItem[];
  timestamp: string;
}

// ดึงข้อมูลราคาทองล่าสุด
export async function getLatestGoldPrice(): Promise<GoldPrice> {
  const response = await apiClient.get<GoldPrice>("/api/v1/gold-price/latest");
  return response.data;
}

// ดึงข้อมูลสรุปสถานะสัญญา
export async function getContractStatusSummary(params: {
  branchId?: string | null;
  date: string;
}): Promise<StatusSummaryResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);
  searchParams.append("summaryType", "contractStatus");

  const response = await apiClient.get<StatusSummaryResponse>(
    `/api/v1/contracts/transactions/summary?${searchParams.toString()}`
  );

  return response.data;
}

// ดึงข้อมูลสรุปประเภทธุรกรรม
export async function getContractTransactionTypeSummary(params: {
  branchId?: string | null;
  date: string;
}): Promise<StatusSummaryResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);
  searchParams.append("summaryType", "transactionType");

  const response = await apiClient.get<StatusSummaryResponse>(
    `/api/v1/contracts/transactions/summary?${searchParams.toString()}`
  );

  return response.data;
}

// ดึงข้อมูลรายละเอียดธุรกรรมสัญญาจำนำ
export async function getContractTransactionDetails(params: {
  branchId?: string | null;
  date: string;
  summaryType: string | null;
}): Promise<ContractTransactionDetailsResponse> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }

  searchParams.append("date", params.date);

  if (params.summaryType) {
    // summaryType มีสองแบบ คือ contractStatus และ transactionType
    searchParams.append("summaryType", params.summaryType);
  }

  const response = await apiClient.get<ContractTransactionDetailsResponse>(
    `/api/v1/contracts/transactions/details?${searchParams.toString()}`
  );

  return response.data;
}

// ส่งออกข้อมูลธุรกรรมสัญญาจำนำเป็น CSV
export async function exportContractTransactionsCSV(params: {
  branchId?: string | null;
  date: string;
  filename?: string;
}): Promise<void> {
  const searchParams = new URLSearchParams();

  if (params.branchId) {
    searchParams.append("branchId", params.branchId);
  }
  searchParams.append("date", params.date);

  const exportUrl = `/api/v1/contracts/transactions/export/csv?${searchParams.toString()}`;
  const filename =
    params.filename ||
    `contract-transactions-${params.branchId || "all"}-${params.date}.csv`;

  await apiClient.download(exportUrl, filename);
}
