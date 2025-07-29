import React from "react";
import { LoginRow, ExportRow, ViewRow, ChatRow } from "@/types/log-types";
import ChatLogPage from "../chatlogpage";

export const LogTable = ({
  tab,
  data,
  onChatClick,
}: {
  tab: "login" | "export" | "view" | "chat";
  data: LoginRow[] | ExportRow[] | ViewRow[] | ChatRow[];
  onChatClick?: (chat: ChatRow) => void;
}) => {
  const renderTable = () => {
    switch (tab) {
      case "login":
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">วันที่และเวลา</th>
                <th className="px-4 py-2 text-left">การกระทำ</th>
                <th className="px-4 py-2 text-left">IP</th>
                <th className="px-4 py-2 text-left">เบราเซอร์</th>
                <th className="px-4 py-2 text-left">เซสชัน</th>
                <th className="px-4 py-2 text-left">ตำแหน่ง</th>
              </tr>
            </thead>
            <tbody>
              {(data as LoginRow[]).map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.datetime}</td>
                  <td className="px-4 py-2">{r.action}</td>
                  <td className="px-4 py-2">{r.ip}</td>
                  <td className="px-4 py-2">{r.agent}</td>
                  <td className="px-4 py-2">{r.session}</td>
                  <td className="px-4 py-2">{r.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "export":
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">ประเภทงาน</th>
                <th className="px-4 py-2 text-left">รูปแบบ</th>
                <th className="px-4 py-2 text-left">records</th>
                <th className="px-4 py-2 text-left">ขนาด</th>
                <th className="px-4 py-2 text-left">สถานะ</th>
                <th className="px-4 py-2 text-left">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {(data as ExportRow[]).map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.type}</td>
                  <td className="px-4 py-2">{r.format}</td>
                  <td className="px-4 py-2">{r.records.toLocaleString()}</td>
                  <td className="px-4 py-2">{r.size}</td>
                  <td className="px-4 py-2">{r.status}</td>
                  <td className="px-4 py-2">{r.datetime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "view":
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">เมนู</th>
              </tr>
            </thead>
            <tbody>
              {(data as ViewRow[]).map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.menuName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "chat":
        return (
         
      <ChatLogPage/>

        );

      default:
        return <p>ไม่พบข้อมูล</p>;
    }
  };

  return <div>{renderTable()}</div>;
};
