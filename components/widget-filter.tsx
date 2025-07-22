"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/api";

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
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // วันนี้ในรูปแบบ YYYY-MM-DD
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🌟 โหลดข้อมูลสาขาจาก API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get<Branch[]>("/api/v1/menu/branches");
        setBranches(response.data);

        // Set default เป็นสาขาแรก
        if (response.data.length > 0) {
          const firstBranchId = response.data[0].id.toString();
          setSelectedBranchId(firstBranchId);

          // ส่งข้อมูลเริ่มต้นไปยัง parent component
          onFilterChange?.({
            branchId: firstBranchId,
            date: selectedDate,
            isLoading: false,
          });
        }

        // Log ใน development mode
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.log("✨ Branches loaded:", response.data);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "ไม่สามารถโหลดข้อมูลสาขาได้";
        setError(errorMessage);

        // Log error ใน development mode
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
          console.error("❌ Failed to fetch branches:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // 🎯 Handle เมื่อเปลี่ยนสาขา
  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);

    // Log การเปลี่ยนแปลง
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🔄 Branch changed:", branchId);
    }

    // ส่งข้อมูลกลับไปยัง parent component
    onFilterChange?.({
      branchId,
      date: selectedDate,
      isLoading: false,
    });
  };

  // 🎯 Handle เมื่อเปลี่ยนวันที่
  const handleDateChange = (date: string) => {
    setSelectedDate(date);

    // Log การเปลี่ยนแปลง
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🔄 Date changed:", date);
    }

    // ส่งข้อมูลกลับไปยัง parent component
    onFilterChange?.({
      branchId: selectedBranchId,
      date,
      isLoading: false,
    });
  };

  // 🎨 Format วันที่เป็น dd/mm/yyyy
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // จะได้ dd/mm/yyyy
  };

  return (
    <div className="flex items-center gap-3">
      {/* เลือกสาขา */}
      <Select
        value={selectedBranchId}
        onValueChange={handleBranchChange}
        disabled={isLoading || branches.length === 0}
      >
        <SelectTrigger className="w-[140px] h-[36px] text-sm">
          <SelectValue placeholder="เลือกสาขา" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id.toString()}>
              {branch.location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* วันที่ */}
      <div className="relative">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="pl-8 w-[130px] h-[36px] text-sm"
        />
        <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
      </div>

      {/* แสดง Error สำหรับ development */}
      {error && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" && (
        <div className="text-red-500 text-xs">⚠️</div>
      )}
    </div>
  );
};
