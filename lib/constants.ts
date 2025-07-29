/**
 * Application Constants
 * รวม constants ที่ใช้ทั่วทั้งแอพ
 */

import { getBaseUrl, getApiUrl } from "./api";

// 🎨 Chart Colors - ใช้สีเดียวกันทุกที่
export const CHART_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Light Yellow
  "#BB8FCE", // Light Purple
  "#85C1E9", // Light Blue
] as const;

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
  { id: 4, name: "ลาดพร้าว", shortName: "", location: "ลาดพร้าว" },
  { id: 5, name: "วงศ์สว่าง", shortName: "", location: "วงศ์สว่าง" },
  { id: 6, name: "ช่องนนทรี", shortName: "", location: "ช่องนนทรี" },
  { id: 7, name: "ราชเทวี", shortName: "", location: "ราชเทวี" },
  { id: 8, name: "พระราม 2", shortName: "", location: "พระราม 2" },
  { id: 9, name: "บางแค", shortName: "", location: "บางแค" },
  { id: 10, name: "ธนบุรี-ปากท่อ", shortName: "", location: "ธนบุรี-ปากท่อ" },
  { id: 11, name: "ห้วยขวาง", shortName: "", location: "ห้วยขวาง" },
  { id: 12, name: "บางกะปิ", shortName: "", location: "บางกะปิ" },
  { id: 13, name: "สะพานพุทธ", shortName: "", location: "สะพานพุทธ" },
  { id: 14, name: "อุดมสุข", shortName: "", location: "อุดมสุข" },
  { id: 15, name: "ดอนเมือง", shortName: "", location: "ดอนเมือง" },
  { id: 16, name: "สุวินทวงศ์", shortName: "", location: "สุวินทวงศ์" },
  { id: 17, name: "ปากเกร็ด", shortName: "", location: "ปากเกร็ด" },
  { id: 18, name: "บางบอน", shortName: "", location: "บางบอน" },
  { id: 19, name: "หนองแขม", shortName: "", location: "หนองแขม" },
  { id: 20, name: "ทุ่งสองห้อง", shortName: "", location: "ทุ่งสองห้อง" },
  { id: 21, name: "ศรีนครินทร์", shortName: "", location: "ศรีนครินทร์" },
] as const;

// 👥 User Roles Configuration
export const ROLES = [
  { id: 1, name: "Super Admin", shortName: "SA", description: "สิทธิ์เต็ม" },
  { id: 2, name: "Admin", shortName: "AD", description: "ผู้ดูแลระบบ" },
  { id: 3, name: "Manager", shortName: "MG", description: "ผู้จัดการ" },
  { id: 4, name: "Staff", shortName: "ST", description: "พนักงาน" },
  { id: 5, name: "Viewer", shortName: "VW", description: "ดูข้อมูลอย่างเดียว" },
] as const;

// 👤 User Status Configuration
export const USER_STATUS = {
  ACTIVE: {
    value: "active" as const,
    label: "ใช้งาน",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  INACTIVE: {
    value: "inactive" as const,
    label: "ระงับ",
    className: "bg-red-100 text-red-800 border-red-200",
  },
} as const;

// ⏱️ Animation Durations
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  chart: 800,
} as const;

// 🎨 Common CSS Classes
export const COMMON_CLASSES = {
  card: "p-4 rounded-lg shadow bg-white",
  flexCenter: "flex items-center justify-center",
  textError: "text-red-600",
  textSuccess: "text-green-600",
  textMuted: "text-gray-600",
} as const;

// 🔧 API Configuration
export const API_CONFIG = {
  get BASE_URL() {
    return getApiUrl();
  },
  get ROOT_URL() {
    return getBaseUrl();
  },
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

// 📊 Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  DEFAULT_MARGIN: { top: 20, right: 30, left: 20, bottom: 5 },
  ANIMATION_DURATION: 800,
} as const;
