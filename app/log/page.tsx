"use client"
import { AppSidebar } from "@/components/appsidebar";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

type Tab = 'login' | 'export' | 'view' | 'chat'

interface LoginRow {
  name: string
  email: string
  datetime: string
  action: string
  ip: string
  agent: string
  session: string
  location: string
}

interface ExportRow {
  name: string
  email: string
  type: string
  format: string
  records: number
  size: string
  status: string
  datetime: string
}

interface ViewRow {
  name: string
  email: string
  menuId: string
  menuName: string
  duration: string
}

interface ChatRow {
  name: string
  email: string
  topic: string
  datetime: string
  messageId: string
  action: string
  // เพิ่ม array ของข้อความแชท mock
  transcript: { from: 'user' | 'ai'; text: string; time: string }[]
}

const overview = [
  { label: 'Logs ทั้งหมด', value: 12345 },
  { label: 'Logs ในเดือนนี้', value: 2345 },
  { label: 'จำนวนผู้ใช้งาน', value: 123 },
]

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: 'login', label: 'User/Login', count: 123 },
  { key: 'export', label: 'Export', count: 1245 },
  { key: 'view', label: 'View menu', count: 6586 },
  { key: 'chat', label: 'Chat history', count: 4391 },
]

const loginData: LoginRow[] = Array.from({ length: 10 }).map((_, i) => ({
  name: `ผู้ใช้ ${i + 1}`,
  email: `user${i + 1}@pawn.co.th`,
  datetime: `2025-06-${10 + i} 09:0${i}`,
  action: i % 2 === 0 ? 'login_success' : 'login_failed',
  ip: `203.150.3.${i + 4}`,
  agent: ['Chrome 114.0 บน Windows 10', 'Firefox 101.0 บน macOS'][i % 2],
  session: `sess_ab${i + 100}`,
  location: ['Bangkok, Thailand', 'Chiang Mai, Thailand'][i % 2],
}))

const exportData: ExportRow[] = Array.from({ length: 8 }).map((_, i) => ({
  name: `ผู้ใช้ออกรายงาน ${i + 1}`,
  email: `export${i + 1}@pawn.co.th`,
  type: ['รายการรับจำนำทั้งหมด', 'รายการขายทั้งหมด'][i % 2],
  format: 'CSV',
  records: (i + 1) * 500,
  size: `${(i + 1) * 100} KB`,
  status: 'success',
  datetime: `2025-06-2${i} ${14 + i}:0${i}`,
}))

const viewData: ViewRow[] = [
  { name: 'ธวัชชัย ญาณศิริ', email: 'support@pawn.co.th', menuId: 'menu_reports', menuName: 'ข้อมูลรับจำนำ', duration: '00:02:15' },
  { name: 'ปราณี สุกิจกุล', email: 'info@pawn.co.th', menuId: 'menu_inventory', menuName: 'สต็อกสินค้า', duration: '00:03:45' },
  { name: 'นารีลักษณ์ ยิ่งกุล', email: 'service@pawn.co.th', menuId: 'menu_customers', menuName: 'ข้อมูลลูกค้า', duration: '00:05:30' },
  { name: 'เอนกธรา สมุทรสิริ', email: 'contact@pawn.co.th', menuId: 'menu_transactions', menuName: 'ประวัติการทำรายการ', duration: '00:01:50' },
  { name: 'ประวิทย์ ประกิตกุล', email: 'help@pawn.co.th', menuId: 'menu_settings', menuName: 'การตั้งค่า', duration: '00:07:20' },
  { name: 'สุภาษิต ศักดิ์รัตน์', email: 'admin@pawn.co.th', menuId: 'menu_dashboard', menuName: 'แดชบอร์ดหลัก', duration: '00:04:10' },
  { name: 'อังคณา ไพโรจน์', email: 'support@pawn.co.th', menuId: 'menu_summary', menuName: 'สรุปรายงาน', duration: '00:02:05' },
  { name: 'ชลธิชา วชิรบัณฑิต', email: 'info@pawn.co.th', menuId: 'menu_feedback', menuName: 'ความคิดเห็นลูกค้า', duration: '00:03:15' },
  { name: 'ประมวล กองคำ', email: 'service@pawn.co.th', menuId: 'menu_analytics', menuName: 'การวิเคราะห์ข้อมูล', duration: '00:06:00' },
  { name: 'พิมพ์ชนก แสงอรุณ', email: 'contact@pawn.co.th', menuId: 'menu_help', menuName: 'ศูนย์ช่วยเหลือ', duration: '00:08:25' },
]

const chatData: ChatRow[] = Array.from({ length: 10 }).map((_, i) => ({
  name: ['ธวัชชัย ญาณศิริ', 'จิราพร มะลี'][i % 2],
  email: ['support@pawn.co.th', 'jira@pawn.co.th'][i % 2],
  topic: ['รายการรับจำนำทั้งหมด', 'รายการขายฝาก'][i % 2],
  datetime: `2025-06-24 ${14 + i}:0${i}`,
  messageId: `pawnChat_0${i + 1}`,
  action: 'ดูรายละเอียดเพิ่มเติม',
  transcript: [
    { from: 'user', text: `สวัสดีครับคุณ${['ธวัชชัย', 'จิราพร'][i % 2]} ต้องการข้อมูลอะไรครับ?`, time: '02:25' },
    { from: 'ai', text: 'ช่วยสรุปรายงานผลการดำเนินงานให้หน่อยครับ', time: '11:25' },
    { from: 'ai', text: 'ได้เลยครับ รายงาน...', time: '02:25' },
    { from: 'user', text: 'ขอบคุณครับ', time: '11:25' },
  ]
}))

export default function Log() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("ข้อมูลตั๋วรับจำนำ");
  const [activeTab, setActiveTab] = useState<Tab>('login')
  const [selectedChat, setSelectedChat] = useState<ChatRow | null>(null)


  const renderTable = () => {
    switch (activeTab) {
      case 'login':
        return (
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
              {loginData.map((r, i) => (
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
        )
      case 'export':
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">ประเภทงาน</th>
                <th className="px-4 py-2 text-left">รูปแบบ</th>
                <th className="px-4 py-2 text-left">จำนวน records</th>
                <th className="px-4 py-2 text-left">ขนาดไฟล์</th>
                <th className="px-4 py-2 text-left">สถานะ</th>
                <th className="px-4 py-2 text-left">วันที่และเวลา</th>
              </tr>
            </thead>
            <tbody>
              {exportData.map((r, i) => (
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
        )
      case 'view':
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">รหัสเมนู</th>
                <th className="px-4 py-2 text-left">ชื่อเมนู</th>
                <th className="px-4 py-2 text-left">ระยะเวลาในหน้า</th>
              </tr>
            </thead>
            <tbody>
              {viewData.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.menuId}</td>
                  <td className="px-4 py-2">{r.menuName}</td>
                  <td className="px-4 py-2">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'chat':
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">หัวข้อ</th>
                <th className="px-4 py-2 text-left">วันที่และเวลา</th>
                <th className="px-4 py-2 text-left">message_id</th>
                <th className="px-4 py-2 text-left">action</th>
              </tr>
            </thead>
            <tbody>
              {chatData.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.topic}</td>
                  <td className="px-4 py-2">{r.datetime}</td>
                  <td className="px-4 py-2">{r.messageId}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedChat(r)}
                      className="text-blue-600 hover:underline"
                    >
                      ดูรายละเอียดเพิ่มเติม
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      default:
        return null
    }
  }



  function onChatToggle() {
    setIsChatOpen(prev => !prev);
  }

  function onMenuToggle() {
    console.log("Menu toggled");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar ฝั่งซ้าย fixed width */}
        <div className="w-64 border-r bg-white">
          <AppSidebar />
        </div>

        {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
        <div className="flex-1 flex flex-col ">
          <Header
            selectedPage={currentPage}
            onChatToggle={onChatToggle}
            onMenuToggle={onMenuToggle}
            isChatOpen={isChatOpen}
          />
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold mb-6">Log management</h1>

            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {overview.map(o => (
                <div key={o.label} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">{o.label}</div>
                  <div className="mt-2 text-3xl font-bold">{o.value.toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-lg font-medium mb-4">ประเภทของ Log</h2>
              {tabs.map(t => {
                const pct = Math.min((t.count / Math.max(...tabs.map(x => x.count))) * 100, 100)
                return (
                  <div key={t.key} className="flex items-center mb-3">
                    <div className="w-32 text-sm text-gray-600">{t.label}</div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full mx-3 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-12 text-sm font-semibold">{t.count}</div>
                  </div>
                )
              })}
            </div>

            {/* Detail Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Tab Navs */}
              <div className="flex border-b mb-4">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-4 py-2 -mb-px font-medium ${activeTab === t.key
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Date and Search bar placeholder */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-lg font-semibold capitalize">
                    {tabs.find(t => t.key === activeTab)?.label}
                  </div>
                  <div className="text-sm text-blue-500">วันที่ 20 มิถุนายน 2568</div>
                </div>
                <div className="flex space-x-3">
                  <input type="text" placeholder="ค้นหาชื่อ" className="border px-3 py-2 rounded w-64" />
                  <button className="border px-3 py-2 rounded">เรียงตาม: ชื่อ</button>
                </div>
              </div>

              {/* Render appropriate table */}
              {renderTable()}

              {/* Pagination placeholder */}
              <div className="mt-4 flex justify-end space-x-1 text-sm text-gray-600">
                <button className="px-2 py-1">ก่อนหน้า</button>
                {[...Array(10)].map((_, i) => (
                  <button key={i} className={`px-2 py-1 rounded ${i === 0 ? 'bg-blue-100' : ''}`}>
                    {i + 1}
                  </button>
                ))}
                <button className="px-2 py-1">ถัดไป</button>
              </div>
            </div>

            {/* Modal Overlay */}
            {selectedChat && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* background */}
                <div
                  className="absolute inset-0 bg-black opacity-50"
                  onClick={() => setSelectedChat(null)}
                />
                {/* modal content */}
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
                  <h3 className="text-xl font-semibold mb-4">
                    ประวัติการแชท: {selectedChat.topic}
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <div><strong>ชื่อผู้ใช้:</strong> {selectedChat.name}</div>
                    <div><strong>Email:</strong> {selectedChat.email}</div>
                    <div><strong>message_id:</strong> {selectedChat.messageId}</div>
                    <div><strong>วันที่/เวลา:</strong> {selectedChat.datetime}</div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-gray-500 mb-2">บทสนทนา</p>
                    <div className="space-y-4">
                      {selectedChat.transcript.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex ${m.from === 'ai' ? 'justify-end' : ''}`}
                        >
                          <div
                            className={`p-3 rounded-lg max-w-[70%] ${m.from === 'ai'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {m.text}
                            <div className="text-xs text-gray-400 mt-1 text-right">
                              {m.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      ปิด
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
