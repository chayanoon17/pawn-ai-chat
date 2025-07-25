import { LoginRow } from "./types";

interface LoginTableProps {
  data: LoginRow[];
}

export function LoginTable({ data }: LoginTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">ชื่อ</th>
            <th className="px-4 py-2 text-left">อีเมล</th>
            <th className="px-4 py-2 text-left">วันที่และเวลา</th>
            <th className="px-4 py-2 text-left">การกระทำ</th>
            <th className="px-4 py-2 text-left">ที่อยู่ IP</th>
            <th className="px-4 py-2 text-left">เบราเซอร์/อุปกรณ์</th>
            <th className="px-4 py-2 text-left">รหัสเซสชัน</th>
            <th className="px-4 py-2 text-left">ตำแหน่งที่ตั้ง</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2">{row.email}</td>
              <td className="px-4 py-2">{row.datetime}</td>
              <td className="px-4 py-2">{row.action}</td>
              <td className="px-4 py-2">{row.ip}</td>
              <td className="px-4 py-2">{row.agent}</td>
              <td className="px-4 py-2">{row.session}</td>
              <td className="px-4 py-2">{row.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
