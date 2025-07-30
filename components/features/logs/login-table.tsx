"use client"
import {
  getActivityLogs,
} from "@/lib/api";
import { useEffect, useState } from "react";

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: {
    id: number;
    name: string;
  };
  branch: any; // หรือกำหนดให้เป็น object/null ตามจริง
}

export interface LogMetadata {
  [x: string]: string;
  email: string;
  ipAddress: string;
  loginTime: string;
  userAgent: string;
  // เพิ่ม field อื่น ๆ ถ้า backend รองรับ เช่น location
}

export interface ActivityLog {
  id: number;
  activity: string;
  description: string;
  metadata: LogMetadata;
  ipAddress: string;
  userAgent: string;
  sessionId: string | null;
  success: boolean;
  errorMessage: string | null;
  createdAt: string;
  userId: number;
  user: UserInfo;
}

export interface ActivityLogResponse {
  status: string;
  message: string;
  data: {
    activityLogs: ActivityLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}


export function LoginTable() {
  const [page, setPage] = useState(1);
  const [getloguser, setGetloguser] = useState<ActivityLog[]>([]);


  const fetchGetloguser = async () => {
    try {
      const res = await getActivityLogs(page, 10);
      console.log("API Response:", res);
      const logs = res.activityLogs;
      setGetloguser(logs);
    } catch (err) {
      console.error("Request failed", err);
    }
  }

  useEffect(() => {
    fetchGetloguser();
  }, [page]);


  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-xs sm:text-sm">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700">ชื่อผู้ใช้</th>
            <th className="px-4 py-2 text-left text-gray-700 hidden sm:table-cell">อีเมล</th>
            <th className="px-4 py-2 text-left text-gray-700">วันที่และเวลา</th>
            <th className="px-4 py-2 text-left text-gray-700">การกระทำ</th>
            <th className="px-4 py-2 text-left text-gray-700 hidden md:table-cell">IP</th>
            <th className="px-4 py-2 text-left text-gray-700 hidden lg:table-cell">อุปกรณ์</th>
            <th className="px-4 py-2 text-left text-gray-700 hidden lg:table-cell">Session</th>
            <th className="px-4 py-2 text-left text-gray-700 hidden md:table-cell">ที่ตั้ง</th>
          </tr>
        </thead>
        <tbody>
          {getloguser.map((item) => (
            <tr key={item.id} className="border-b text-xs sm:text-sm">
              <td className="p-2">{item.user.fullName}</td>
              <td className="p-2 hidden sm:table-cell">{item.user.email}</td>
              <td className="p-2">{new Date(item.createdAt).toLocaleString("th-TH")}</td>
              <td className="p-2">{item.activity}</td>
              <td className="p-2 hidden md:table-cell">{item.ipAddress}</td>
              <td className="p-2 hidden lg:table-cell">{item.userAgent}</td>
              <td className="p-2 hidden lg:table-cell">{item.sessionId || "-"}</td>
              <td className="p-2 hidden md:table-cell">{item.metadata?.location || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
