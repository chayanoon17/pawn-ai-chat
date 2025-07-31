"use client";

import { useEffect, useState } from "react";
import { getActivityLogs, } from "@/lib/api";
import { ActivityLog } from "@/types/api";

export default function ViewTable() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getActivityLogs(1, 20); // ดึง 20 รายการแรก
        const filtered = data.activityLogs.filter(
          (log: { activity: string; }) => log.activity === "MENU_ACCESS"
        );
        setLogs(filtered);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ชื่อผู้ใช้</th>
            <th className="border px-2 py-1">อีเมล</th>
            <th className="border px-2 py-1">เมนู</th>
            <th className="border px-2 py-1">Path</th>
            <th className="border px-2 py-1">เวลา</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                ไม่มีข้อมูลการเข้าใช้งานเมนู
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="border px-2 py-1">{log.user.fullName}</td>
                <td className="border px-2 py-1">{log.user.email}</td>
                <td className="border px-2 py-1">{log.metadata.menuName}</td>
                <td className="border px-2 py-1">{log.metadata.menuPath}</td>
                <td className="border px-2 py-1">
                  {new Date(log.createdAt).toLocaleString("th-TH", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
