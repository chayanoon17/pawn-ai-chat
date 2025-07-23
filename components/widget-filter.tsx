"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Calendar } from "lucide-react";
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

  // 🔄 Load saved values from localStorage with session check
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      // ตรวจสอบว่าเป็น session ใหม่หรือไม่
      const isNewSession = !sessionStorage.getItem("widgetFilter_session");

      if (isNewSession) {
        // ถ้าเป็น session ใหม่ ให้ clear localStorage และ mark session
        localStorage.removeItem("widgetFilter_branchId");
        localStorage.removeItem("widgetFilter_date");
        sessionStorage.setItem("widgetFilter_session", "active");
        return "";
      } else {
        // ถ้าไม่ใช่ session ใหม่ ให้ใช้ค่าจาก localStorage
        return localStorage.getItem("widgetFilter_branchId") || "";
      }
    }
    return "";
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (typeof window !== "undefined") {
      const isNewSession = !sessionStorage.getItem("widgetFilter_session");

      if (isNewSession) {
        return new Date(); // วันนี้
      } else {
        const savedDate = localStorage.getItem("widgetFilter_date");
        if (savedDate) {
          return new Date(savedDate);
        }
      }
    }
    return new Date();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // หาวันที่วันนี้เป็น string "yyyy-MM-dd" เพื่อใช้ max attribute
  const todayStr = format(new Date(), "yyyy-MM-dd");

  // 🎯 Helper function สำหรับแปลง date format
  const formatDateForDisplay = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
  };

  const formatDateForValue = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const parseDateFromValue = (value: string): Date => {
    return new Date(value);
  };

  // โหลดข้อมูลสาขา
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get<Branch[]>("/api/v1/menu/branches");
        setBranches(response.data);

        // เฉพาะกรณีที่ยังไม่มีการเลือกสาขา (ครั้งแรกที่โหลด)
        if (response.data.length > 0 && !selectedBranchId) {
          const firstBranchId = response.data[0].id.toString();
          setSelectedBranchId(firstBranchId);

          // 💾 Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("widgetFilter_branchId", firstBranchId);
          }

          onFilterChange?.({
            branchId: firstBranchId,
            date: selectedDate?.toISOString().split("T")[0] || todayStr,
            isLoading: false,
          });
        } else if (selectedBranchId && selectedDate) {
          // ถ้ามีค่า saved อยู่แล้ว ให้ trigger onFilterChange
          onFilterChange?.({
            branchId: selectedBranchId,
            date: selectedDate.toISOString().split("T")[0],
            isLoading: false,
          });
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "ไม่สามารถโหลดข้อมูลสาขาได้";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);

    // 💾 Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("widgetFilter_branchId", branchId);
    }

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
    setIsDatePickerOpen(false);

    // 💾 Save to localStorage
    if (typeof window !== "undefined" && date) {
      localStorage.setItem("widgetFilter_date", date.toISOString());
    }

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

      {/* 📅 Custom Date Picker (แสดง dd/mm/yyyy แต่ใช้ yyyy-mm-dd) */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[140px] justify-between h-[36px] text-sm"
          >
            {selectedDate ? formatDateForDisplay(selectedDate) : "เลือกวันที่"}
            <Calendar className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium text-gray-700 px-2">
              เลือกวันที่
            </div>
            <Input
              type="date"
              max={todayStr}
              value={selectedDate ? formatDateForValue(selectedDate) : todayStr}
              onChange={handleDateInputChange}
              className="h-[36px] text-sm"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Debug Error */}
      {error && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" && (
        <div className="text-red-500 text-xs">⚠️ {error}</div>
      )}
    </div>
  );
};
