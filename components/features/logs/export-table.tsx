"use client";

import { useEffect, useState } from "react";
import { getActivityLogexdport } from "@/lib/api";
import { ActivityLogExport } from "@/types/api"


export function ExportTable() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ActivityLogExport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchExportLogs = async () => {
    try {
      setLoading(true);
      const res = await getActivityLogexdport(page, 10);
      const logs = res.activityLogs ?? [];

      const exportLogs = logs.filter(
        (log: ActivityLogExport) => log.activity === "EXPORT_REPORT"
      );

      setData(logs); 
      console.log(exportLogs)
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExportLogs();
  }, [page]);

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">ชื่อ</th>
            <th className="px-4 py-2">อีเมล</th>
            <th className="px-4 py-2">ประเภทงาน</th>
            <th className="px-4 py-2">รูปแบบ</th>
            <th className="px-4 py-2">จำนวนระเบียน</th>
            <th className="px-4 py-2">ขนาดไฟล์</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2">วันที่</th>
            <th className="px-4 py-2">ดาวน์โหลด</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                ไม่พบประวัติการส่งออก
              </td>
            </tr>
          ) : (
            data.map((log) => {
              const {
                id,
                user,
                createdAt,
                metadata,
              } = log;

              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{user.fullName ?? "-"}</td>
                  <td className="px-4 py-2">{user?.email ?? "-"}</td>
                  <td className="px-4 py-2">xx</td>
                  <td className="px-4 py-2">{metadata?.format ?? "-"}</td>
                  <td className="px-4 py-2">{metadata?.totalRecords ?? "-"}</td>
                  <td className="px-4 py-2">
                    {metadata?.fileSize?.toFixed(2) ?? "-"} MB
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : status === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="px-4 py-2">
                    {status === "COMPLETED" && metadata?.filename ? (
                      <a
                        href={`/exports/${metadata.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        ดาวน์โหลด
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

    </div>
  );
}
