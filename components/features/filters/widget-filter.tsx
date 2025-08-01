"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Calendar, Lock } from "lucide-react";
import apiClient from "@/lib/api";
import { format } from "date-fns";
import { useDebounce, useStableCallback } from "@/lib/performance";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/auth-context";
import type { Branch } from "@/types/auth";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // 🔒 ตรวจสอบว่า user มี branch restriction หรือไม่
  const isBranchRestricted = Boolean(user?.branchId && user.branchId > 0);
  const userBranchId = user?.branchId?.toString() || "";

  // 🔄 Load saved values from localStorage with session check and branch restriction
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    // 🔒 ถ้า user มี branch restriction ให้ใช้ branch ID ของ user เลย
    if (isBranchRestricted) {
      return userBranchId;
    }

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

  // 🎯 Helper function สำหรับแปลง date เป็น YYYY-MM-DD format ตาม timezone ท้องถิ่น
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // Debug log
    console.log("🔍 formatDateForAPI:", {
      input: date,
      output: formattedDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return formattedDate;
  };

  // 🎯 Helper function สำหรับแปลง date format
  const formatDateForDisplay = (date: Date): string => {
    return format(date, "dd/MM/yyyy");
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
          // 🔒 ถ้า user มี branch restriction ใช้ branch ของ user
          const defaultBranchId = isBranchRestricted
            ? userBranchId
            : response.data[0].id.toString();

          setSelectedBranchId(defaultBranchId);

          // 💾 Save to localStorage (เฉพาะ user ที่ไม่มี restriction)
          if (typeof window !== "undefined" && !isBranchRestricted) {
            localStorage.setItem("widgetFilter_branchId", defaultBranchId);
          }

          onFilterChange?.({
            branchId: defaultBranchId,
            date: selectedDate
              ? formatDateForAPI(selectedDate)
              : formatDateForAPI(new Date()),
            isLoading: false,
          });
        } else if (selectedBranchId && selectedDate) {
          // ถ้ามีค่า saved อยู่แล้ว ให้ trigger onFilterChange
          onFilterChange?.({
            branchId: selectedBranchId,
            date: formatDateForAPI(selectedDate),
            isLoading: false,
          });
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถโหลดข้อมูลสาขาได้";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBranchChange = (branchId: string) => {
    // 🔒 ป้องกันไม่ให้ user ที่มี branch restriction เปลี่ยนสาขา
    if (isBranchRestricted) {
      return;
    }

    setSelectedBranchId(branchId);

    // 💾 Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("widgetFilter_branchId", branchId);
    }
  };

  // 🎯 Debounced filter change to improve performance
  const debouncedBranchId = useDebounce(selectedBranchId, 300);
  const debouncedDate = useDebounce(selectedDate, 300);

  // 🔄 Stable callback for filter changes
  const handleFilterChange = useStableCallback(
    (...args: unknown[]) => {
      const data = args[0] as WidgetFilterData;
      onFilterChange?.(data);
    },
    [onFilterChange]
  );

  // รับ event จาก Calendar component
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);

    // 💾 Save to localStorage
    if (typeof window !== "undefined" && date) {
      localStorage.setItem("widgetFilter_date", date.toISOString());
    }
  };

  // 📡 Effect for debounced filter changes
  useEffect(() => {
    if (debouncedBranchId && debouncedDate) {
      handleFilterChange({
        branchId: debouncedBranchId,
        date: formatDateForAPI(debouncedDate),
        isLoading: false,
      });
    }
  }, [debouncedBranchId, debouncedDate, handleFilterChange]);

  return (
    <div
      className={`flex items-center ${
        isMobile ? "gap-1 flex-col sm:flex-row sm:gap-2" : "gap-3"
      }`}
    >
      {/* 🔎 Branch Select with Search */}
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`${
                isMobile
                  ? "w-full sm:w-[140px] text-xs sm:text-sm h-[32px] sm:h-[36px]"
                  : "w-[180px] text-sm h-[36px]"
              } justify-between ${
                isBranchRestricted ? "cursor-not-allowed opacity-75" : ""
              }`}
              disabled={
                isLoading || branches.length === 0 || isBranchRestricted
              }
            >
              <span className="truncate flex items-center gap-2">
                {isBranchRestricted && (
                  <Lock
                    className={`${
                      isMobile ? "h-3 w-3" : "h-4 w-4"
                    } text-gray-500`}
                  />
                )}
                {(() => {
                  const selectedBranch = branches.find(
                    (b) => b.id.toString() === selectedBranchId
                  );
                  if (selectedBranch) {
                    // แสดงแค่ชื่อสั้นใน mobile
                    return isMobile
                      ? selectedBranch.shortName
                      : `${selectedBranch.location} (${selectedBranch.shortName})`;
                  }
                  return isMobile ? "สาขา" : "เลือกสาขา";
                })()}
              </span>
              {!isBranchRestricted && (
                <ChevronDown
                  className={`ml-1 ${
                    isMobile ? "h-3 w-3" : "h-4 w-4"
                  } opacity-50`}
                />
              )}
            </Button>
          </PopoverTrigger>
          {!isBranchRestricted && (
            <PopoverContent
              className={`p-0 ${
                isMobile ? "w-[160px]" : "w-[200px]"
              } max-h-[300px] overflow-y-auto`}
            >
              <Command>
                <CommandInput placeholder="ค้นหาสาขา..." className="h-9" />
                <CommandEmpty>ไม่พบสาขา</CommandEmpty>
                <CommandGroup>
                  {branches.map((branch) => (
                    <CommandItem
                      key={branch.id}
                      value={branch.location}
                      onSelect={() => handleBranchChange(branch.id.toString())}
                      className={isMobile ? "text-xs" : ""}
                    >
                      {isMobile
                        ? `${branch.shortName} - ${branch.location}`
                        : `${branch.location} (${branch.shortName})`}
                      {branch.id.toString() === selectedBranchId && (
                        <Check
                          className={`ml-auto ${
                            isMobile ? "h-3 w-3" : "h-4 w-4"
                          }`}
                        />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>

      {/* 📅 Custom Date Picker (แสดง dd/mm/yyyy แต่ใช้ yyyy-mm-dd) */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${
              isMobile
                ? "w-full sm:w-[110px] text-xs sm:text-sm h-[32px] sm:h-[36px]"
                : "w-[140px] text-sm h-[36px]"
            } justify-between`}
          >
            {selectedDate
              ? isMobile
                ? format(selectedDate, "dd/MM") // แสดงแค่วัน/เดือนใน mobile
                : formatDateForDisplay(selectedDate)
              : isMobile
              ? "วันที่"
              : "เลือกวันที่"}
            <Calendar
              className={`ml-1 ${isMobile ? "h-3 w-3" : "h-4 w-4"} opacity-50`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date()} // ไม่ให้เลือกวันข้างหน้า
            initialFocus
            className={isMobile ? "text-xs" : ""}
          />
        </PopoverContent>
      </Popover>

      {/* Debug Error */}
      {error && process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" && (
        <div className="text-red-500 text-xs">⚠️ {error}</div>
      )}
    </div>
  );
};
