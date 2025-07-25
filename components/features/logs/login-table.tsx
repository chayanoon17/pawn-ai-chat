import { LoginRow } from "./types";

interface LoginTableProps {
  data: LoginRow[];
}

export function LoginTable({ data }: LoginTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              ชื่อผู้ใช้
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              อีเมล
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              วันที่และเวลา
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              การกระทำ
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              ที่อยู่ IP
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              เบราเซอร์/อุปกรณ์
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              รหัสเซสชัน
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
              ตำแหน่งที่ตั้ง
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.datetime}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    row.action === "เข้าสู่ระบบ"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {row.action}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-600">
                {row.ip}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.agent}</td>
              <td className="px-6 py-4 text-sm font-mono text-gray-500">
                {row.session}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.location}
              </td>
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
