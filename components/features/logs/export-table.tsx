"use client";

import { useEffect, useState } from "react";
import { getActivityLogexdport } from "@/lib/api";
import { ActivityLogExport } from "@/types/api";

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

      setData(exportLogs);
      console.log(exportLogs);
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
            <th className="px-4 py-2">ชื่อไฟล์</th>
            <th className="px-4 py-2">รูปแบบ</th>
            <th className="px-4 py-2">จำนวนระเบียน</th>
            <th className="px-4 py-2">ขนาดไฟล์</th>
            <th className="px-4 py-2">สถานะ</th>
            <th className="px-4 py-2">วันที่</th>
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
                description,
                createdAt,
                success,
                metadata,
                status,
              } = log;

              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{user?.fullName ?? "-"}</td>
                  <td className="px-4 py-2">{user?.email ?? "-"}</td>
                  <td className="px-4 py-2">{description ?? "-"}</td>
                  <td className="px-4 py-2">{metadata?.filename ?? "-"}</td>
                  <td className="px-4 py-2">{metadata?.recordsCount ?? "-"}</td>

                  <td className="px-4 py-2">
                    {metadata?.fileSize
                      ? metadata.fileSize.megabytes >= 1
                        ? `${metadata.fileSize.megabytes.toFixed(2)} MB`
                        : `${metadata.fileSize.kilobytes.toFixed(2)} KB`
                      : "-"}
                  </td>

                  {/* ✅ ฟิลด์ success */}
                  <td className="px-4 py-2">
                    {success ? (
                      <span className="text-green-600 font-medium">สำเร็จ</span>
                    ) : (
                      <span className="text-red-600 font-medium">ล้มเหลว</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(createdAt).toLocaleString("th-TH")}
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
