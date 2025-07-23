"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import apiClient from "@/lib/api";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Branch = {
  id: number;
  location: string;
  name: string;
};

export type WidgetFilterData = {
  branchId: string;
  date: string;
  isLoading: boolean;
};

interface WidgetFilterProps {
  onFilterChange?: (data: WidgetFilterData) => void;
}

export const WidgetFilter = ({ onFilterChange }: WidgetFilterProps) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // หาวันที่วันนี้เป็น string "yyyy-MM-dd" เพื่อใช้ max attribute
  const todayStr = format(new Date(), "yyyy-MM-dd");

  // โหลดข้อมูลสาขา
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get<Branch[]>("/api/v1/menu/branches");
        setBranches(response.data);

        if (response.data.length > 0) {
          const firstBranchId = response.data[0].id.toString();
          setSelectedBranchId(firstBranchId);
          onFilterChange?.({
            branchId: firstBranchId,
            date: todayStr,
            isLoading: false,
          });
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "ไม่สามารถโหลดข้อมูลสาขาได้";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    onFilterChange?.({
      branchId,
      date: selectedDate?.toISOString().split("T")[0] || todayStr,
      isLoading: false,
    });
  };

  // รับ event จาก input[type=date]
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // "yyyy-MM-dd"
    const date = value ? new Date(value) : undefined;
    setSelectedDate(date);
    onFilterChange?.({
      branchId: selectedBranchId,
      date: value,
      isLoading: false,
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* 🔎 Branch Select with Search */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[160px] justify-between h-[36px] text-sm"
            disabled={isLoading || branches.length === 0}
          >
            {branches.find((b) => b.id.toString() === selectedBranchId)
              ?.location ?? "เลือกสาขา"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[200px] max-h-[300px] overflow-y-auto">
          <Command>
            <CommandInput placeholder="ค้นหาสาขา..." className="h-9" />
            <CommandEmpty>ไม่พบสาขา</CommandEmpty>
            <CommandGroup>
              {branches.map((branch) => (
                <CommandItem
                  key={branch.id}
                  value={branch.location}
                  onSelect={() => handleBranchChange(branch.id.toString())}
                >
                  {branch.location}
                  {branch.id.toString() === selectedBranchId && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* 📅 Date Picker (native input[type=date] แบบใหม่ พร้อมจำกัดไม่ให้เลือกอนาคต) */}
      <div>
        <Input
          type="date"
          max={todayStr}
          value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : todayStr}
          onChange={handleDateInputChange}
          className="w-[160px] h-[36px] text-sm pl-3"
        />
      </div>

      {/* Debug Error */}
      {error && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" && (
        <div className="text-red-500 text-xs">⚠️ {error}</div>
      )}
    </div>
  );
};
