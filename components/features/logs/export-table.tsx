import { ExportRow } from "./types";

interface ExportTableProps {
  data: ExportRow[];
}

export function ExportTable({ data }: ExportTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ชื่อ</th>
            <th className="px-4 py-2 text-left">อีเมล</th>
            <th className="px-4 py-2 text-left">ประเภทงาน</th>
            <th className="px-4 py-2 text-left">รูปแบบ</th>
            <th className="px-4 py-2 text-left">จำนวนระเบียน</th>
            <th className="px-4 py-2 text-left">ขนาดไฟล์</th>
            <th className="px-4 py-2 text-left">สถานะ</th>
            <th className="px-4 py-2 text-left">วันที่และเวลา</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2">{row.email}</td>
              <td className="px-4 py-2">{row.type}</td>
              <td className="px-4 py-2">{row.format}</td>
              <td className="px-4 py-2">{row.records}</td>
              <td className="px-4 py-2">{row.size}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    row.status === "สำเร็จ"
                      ? "bg-green-100 text-green-800"
                      : row.status === "ล้มเหลว"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-2">{row.datetime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
