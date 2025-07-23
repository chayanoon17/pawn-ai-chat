'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

// 🔸 JSON MOCK (แทน API)
const mockJson = {
  status: 'success',
  message: 'Branch daily summary retrieved successfully',
  data: {
    branchId: 1,
    beginningBalance: {
      count: 7283,
      amount: 149664400,
    },
    endingBalance: {
      count: 7283,
      amount: 149664400,
    },
    countChange: 0,
    amountChange: 0,
    timestamp: '2025-07-22T07:45:09.189Z',
  },
};

type BranchDailySummary = {
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
};

export const PerformanceReport = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const branchId = parseInt(searchParams.get('branch') ?? '1');
  const date = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

  const [summary, setSummary] = useState<BranchDailySummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // 🔸 ใช้ JSON ตรงๆ แทน API
      const data = mockJson.data;
      setSummary(data);
    } catch (err) {
      console.error('Error loading summary:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
    }
  }, [branchId, date]);

  const formatAmount = (value: number) =>
    value.toLocaleString('th-TH', { minimumFractionDigits: 2 });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPercentChange = (change: number, base: number): string => {
    if (base === 0) return '0.00%';
    return ((change / base) * 100).toFixed(2) + '%';
  };

  const beginningCount = summary?.beginningBalance.count ?? 0;
  const beginningAmount = summary?.beginningBalance.amount ?? 0;
  const endingCount = summary?.endingBalance.count ?? 0;
  const endingAmount = summary?.endingBalance.amount ?? 0;
  const countChange = summary?.countChange ?? 0;
  const amountChange = summary?.amountChange ?? 0;
  const timestamp = summary?.timestamp ?? null;

  return (
    <Card className="w-[800px] mx-auto mb-6">
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex justify-between items-center w-full">
          <div>
            <CardTitle className="text-[24px] font-semibold">รายงานผลการดำเนินงาน</CardTitle>
            <p className="text-sm text-[#36B8EE]">
              {timestamp ? `อัปเดตล่าสุดเมื่อ ${formatDate(timestamp)}` : 'ไม่มีข้อมูลวันนี้'}
            </p>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">ทรัพย์จำนำ (ยกมา)</h3>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold">{beginningCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">ราย</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold">{formatAmount(beginningAmount)}</div>
                <div className="text-sm text-gray-600">บาท</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">ทรัพย์จำนำ (ปัจจุบัน)</h3>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{endingCount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">ราย</div>
                  </div>
                  <div className={`flex items-center ${countChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {countChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span className="font-medium">{countChange}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{formatAmount(endingAmount)}</div>
                    <div className="text-sm text-gray-600">บาท</div>
                  </div>
                  <div className={`flex items-center ${amountChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {amountChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    <span className="font-medium">{amountChange}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-2">สรุปอัตราการทรัพย์จำนำ</h4>
          <div className="text-sm text-gray-600">
            <p>
              จำนวนราย{' '}
              <span className={countChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {countChange >= 0 ? 'เพิ่มขึ้น' : 'ลดลง'}
              </span>{' '}
              {Math.abs(countChange).toLocaleString()} ราย ({getPercentChange(countChange, beginningCount)})
            </p>
            <p>
              จำนวนเงิน{' '}
              <span className={amountChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {amountChange >= 0 ? 'เพิ่มขึ้น' : 'ลดลง'}
              </span>{' '}
              {formatAmount(Math.abs(amountChange))} บาท ({getPercentChange(amountChange, beginningAmount)})
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
