'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Filter = () => {
  const router = useRouter();
  const [branch, setBranch] = useState("1");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSearch = () => {
    router.push(`/performance-report?branch=${branch}&date=${date}`);
  };

  return (
    <Card className="mb-4 px-4 py-2">
      <CardHeader className="pt-2 px-0">
        <div className="flex justify-end">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* สาขา */}
            <Select defaultValue={branch} onValueChange={setBranch}>
              <SelectTrigger className="w-[180px] h-[40px] text-sm">
                <SelectValue placeholder="เลือกสาขา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">สะพานขาว</SelectItem>
                <SelectItem value="18">ห้วยขวาง</SelectItem>
                <SelectItem value="44">ลพบุรี</SelectItem>
              </SelectContent>
            </Select>

            {/* วันที่ */}
            <div className="relative">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 w-[170px] h-[40px] text-sm"
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* ปุ่ม */}
            <Button
              variant="outline"
              className="text-sm h-[40px]"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 mr-1" />
              กรองข้อมูล
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-0" />
    </Card>
  );
};
