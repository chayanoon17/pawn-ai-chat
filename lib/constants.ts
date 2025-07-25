/**
 * Application Constants
 * รวม constants ที่ใช้ทั่วทั้งแอพ
 */

// 📄 Page Configuration
export const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard Overview",
  "pawn-tickets": "ข้อมูลตั๋วรับจำนำ",
  "asset-types": "ประเภททรัพย์และราคา",
  "user-management": "จัดการข้อมูลผู้ใช้",
  "log-management": "ประวัติการใช้งาน",
  settings: "Settings",
} as const;

// 🏢 Branch Data (ใช้ชั่วคราวจนกว่าจะ integrate กับ API)
export const BRANCHES = [
  { id: 1, name: "สะพานขาว", shortName: "", location: "สะพานขาว" },
  { id: 2, name: "หนองจอก", shortName: "", location: "หนองจอก" },
  { id: 3, name: "บางซื่อ", shortName: "", location: "บางซื่อ" },
  { id: 4, name: "บางแค", shortName: "", location: "บางแค" },
  { id: 5, name: "สาธุประดิษฐ์", shortName: "", location: "สาธุประดิษฐ์" },
  { id: 6, name: "บางขุนเทียน", shortName: "", location: "บางขุนเทียน" },
  { id: 7, name: "หลักสี่", shortName: "", location: "หลักสี่" },
  { id: 8, name: "ม.เกษตร", shortName: "", location: "ม.เกษตร" },
  { id: 9, name: "ธนบุรี-ปากท่อ", shortName: "", location: "ธนบุรี-ปากท่อ" },
  { id: 10, name: "ห้วยขวาง", shortName: "", location: "ห้วยขวาง" },
  { id: 11, name: "บางกะปิ", shortName: "", location: "บางกะปิ" },
  { id: 12, name: "สะพานพุทธ", shortName: "", location: "สะพานพุทธ" },
  { id: 13, name: "อุดมสุข", shortName: "", location: "อุดมสุข" },
  { id: 14, name: "ดอนเมือง", shortName: "", location: "ดอนเมือง" },
  { id: 15, name: "สุวินทวงศ์", shortName: "", location: "สุวินทวงศ์" },
  { id: 16, name: "ปากเกร็ด", shortName: "", location: "ปากเกร็ด" },
  { id: 17, name: "บางบอน", shortName: "", location: "บางบอน" },
  { id: 18, name: "หนองแขม", shortName: "", location: "หนองแขม" },
  { id: 19, name: "ทุ่งสองห้อง", shortName: "", location: "ทุ่งสองห้อง" },
  { id: 20, name: "รามอินทรา", shortName: "", location: "รามอินทรา" },
  { id: 21, name: "ระยอง", shortName: "", location: "ระยอง" },
  { id: 22, name: "พัฒนาการ", shortName: "", location: "พัฒนาการ" },
  { id: 23, name: "ลาดกระบัง", shortName: "", location: "ลาดกระบัง" },
  { id: 24, name: "สายไหม", shortName: "", location: "สายไหม" },
  { id: 25, name: "ทุ่งครุ", shortName: "", location: "ทุ่งครุ" },
  { id: 26, name: "สมุทรปราการ", shortName: "", location: "สมุทรปราการ" },
  { id: 27, name: "นนทบุรี", shortName: "", location: "นนทบุรี" },
  { id: 28, name: "ประตูน้ำ", shortName: "", location: "ประตูน้ำ" },
] as const;

// 👤 Role Data (ใช้ชั่วคราวจนกว่าจะ integrate กับ API)
export const ROLES = [
  { id: 1, name: "User", description: "ผู้ใช้ทั่วไป" },
  { id: 2, name: "Admin", description: "ผู้ดูแลระบบ" },
  { id: 3, name: "Manager", description: "ผู้จัดการ" },
] as const;

// 🎨 Status Badge Configuration
export const STATUS_BADGE_CONFIG = {
  ACTIVE: {
    variant: "default" as const,
    label: "ใช้งาน",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  INACTIVE: {
    variant: "secondary" as const,
    label: "ไม่ใช้งาน",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
  SUSPENDED: {
    variant: "destructive" as const,
    label: "ระงับ",
    className: "bg-red-100 text-red-800 border-red-200",
  },
} as const;

// 📊 Chart Colors
export const CHART_COLORS = {
  PRIMARY: "#3B82F6", // blue-500
  SECONDARY: "#10B981", // emerald-500
  SUCCESS: "#22C55E", // green-500
  WARNING: "#F59E0B", // amber-500
  DANGER: "#EF4444", // red-500
  INFO: "#6366F1", // indigo-500
  LIGHT: "#94A3B8", // slate-400
  DARK: "#1E293B", // slate-800
} as const;

// 🔧 API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// 📱 Responsive Breakpoints (matches Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;
