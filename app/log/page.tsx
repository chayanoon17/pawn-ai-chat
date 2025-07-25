"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-side-bar";
import Header from "@/components/header";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import { WidgetFilterData } from "@/components/widget-filter";

type Tab = "login" | "export" | "view" | "chat";

interface LoginRow {
  name: string;
  email: string;
  datetime: string;
  action: string;
  ip: string;
  agent: string;
  session: string;
  location: string;
}

interface ExportRow {
  name: string;
  email: string;
  type: string;
  format: string;
  records: number;
  size: string;
  status: string;
  datetime: string;
}

interface ViewRow {
  name: string;
  email: string;
  menuId: string;
  menuName: string;
}

interface ChatRow {
  name: string;
  email: string;
  topic: string;
  datetime: string;
  messageId: string;
  action: string;
  // เพิ่ม array ของข้อความแชท mock
  transcript: { from: "user" | "ai"; text: string; time: string }[];
}

const overview = [
  { label: "Logs ทั้งหมด", value: 28947 },
  { label: "Logs ในเดือนนี้", value: 3842 },
  { label: "จำนวนผู้ใช้งาน", value: 247 },
];

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: "login", label: "ผู้ใช้/เข้าสู่ระบบ", count: 1847 },
  { key: "export", label: "ส่งออกไฟล์", count: 492 },
  { key: "view", label: "การเข้าถึงเมนู", count: 8623 },
  { key: "chat", label: "ประวัติแชท", count: 2156 },
];

const loginData: LoginRow[] = [
  {
    name: "ธวัชชัย ญาณศิริ",
    email: "thawatchai.y@pawnshop.go.th",
    datetime: "2025-07-24 14:32:15",
    action: "log_in",
    ip: "203.150.3.45",
    agent: "Chrome 127.0.0.0 บน Windows 11",
    session: "sess_tws_240724_1432",
    location: "กรุงเทพมหานคร, ประเทศไทย",
  },
  {
    name: "สุภาพร เจริญศักดิ์",
    email: "supaporn.j@pawnshop.go.th",
    datetime: "2025-07-24 14:28:42",
    action: "log_out",
    ip: "203.150.3.67",
    agent: "Edge 126.0.2592.68 บน Windows 10",
    session: "sess_spj_240724_1415",
    location: "เชียงใหม่, ประเทศไทย",
  },
  {
    name: "อนุชา พิทักษ์วงศ์",
    email: "anucha.p@pawnshop.go.th",
    datetime: "2025-07-24 14:25:18",
    action: "log_in",
    ip: "203.150.3.89",
    agent: "Firefox 128.0 บน macOS Sonoma",
    session: "sess_acp_240724_1425",
    location: "นครราชสีมา, ประเทศไทย",
  },
  {
    name: "วิภาวี สุขสวัสดิ์",
    email: "vipavee.s@pawnshop.go.th",
    datetime: "2025-07-24 14:20:07",
    action: "log_in",
    ip: "203.150.3.12",
    agent: "Chrome 127.0.0.0 บน Android 14",
    session: "sess_vps_240724_1420",
    location: "ขอนแก่น, ประเทศไทย",
  },
  {
    name: "ประดิษฐ์ ทองคำ",
    email: "pradit.t@pawnshop.go.th",
    datetime: "2025-07-24 14:15:33",
    action: "log_out",
    ip: "203.150.3.156",
    agent: "Safari 17.5 บน iOS 17.5.1",
    session: "sess_pdt_240724_1330",
    location: "ภูเก็ต, ประเทศไทย",
  },
  {
    name: "กัลยา มาลัยทอง",
    email: "kanaya.m@pawnshop.go.th",
    datetime: "2025-07-24 14:12:21",
    action: "log_in",
    ip: "203.150.3.78",
    agent: "Chrome 127.0.0.0 บน Windows 11",
    session: "sess_kym_240724_1412",
    location: "สงขลา, ประเทศไทย",
  },
  {
    name: "วิรัช ศรีสวัสดิ์",
    email: "virat.s@pawnshop.go.th",
    datetime: "2025-07-24 14:08:45",
    action: "log_in",
    ip: "203.150.3.234",
    agent: "Edge 126.0.2592.68 บน Windows 10",
    session: "sess_vrs_240724_1408",
    location: "อุดรธานี, ประเทศไทย",
  },
  {
    name: "นิตยา พงษ์พิพัฒน์",
    email: "nitaya.p@pawnshop.go.th",
    datetime: "2025-07-24 14:05:16",
    action: "log_out",
    ip: "203.150.3.91",
    agent: "Chrome 127.0.0.0 บน Windows 11",
    session: "sess_nyp_240724_1345",
    location: "นครศรีธรรมราช, ประเทศไทย",
  },
  {
    name: "สมชาย รัตนวิไล",
    email: "somchai.r@pawnshop.go.th",
    datetime: "2025-07-24 14:02:58",
    action: "log_in",
    ip: "203.150.3.145",
    agent: "Firefox 128.0 บน Ubuntu 22.04",
    session: "sess_scr_240724_1402",
    location: "ระยอง, ประเทศไทย",
  },
  {
    name: "พิมพ์ชนก แสงอรุณ",
    email: "pimchanok.s@pawnshop.go.th",
    datetime: "2025-07-24 13:58:12",
    action: "log_in",
    ip: "203.150.3.203",
    agent: "Chrome 127.0.0.0 บน Windows 10",
    session: "sess_pcs_240724_1358",
    location: "อุบลราชธานี, ประเทศไทย",
  },
];

const exportData: ExportRow[] = [
  {
    name: "ธวัชชัย ญาณศิริ",
    email: "thawatchai.y@pawnshop.go.th",
    type: "รายงานรับจำนำประจำเดือน",
    format: "CSV",
    records: 2847,
    size: "1.2 MB",
    status: "success",
    datetime: "2025-07-24 13:45:23",
  },
  {
    name: "สุภาพร เจริญศักดิ์",
    email: "supaporn.j@pawnshop.go.th",
    type: "รายงานขายทอดตลาด",
    format: "CSV",
    records: 1546,
    size: "892 KB",
    status: "success",
    datetime: "2025-07-24 12:30:15",
  },
  {
    name: "อนุชา พิทักษ์วงศ์",
    email: "anucha.p@pawnshop.go.th",
    type: "รายงานผู้ใช้งานระบบ",
    format: "CSV",
    records: 247,
    size: "156 KB",
    status: "success",
    datetime: "2025-07-24 11:22:41",
  },
  {
    name: "วิภาวี สุขสวัสดิ์",
    email: "vipavee.s@pawnshop.go.th",
    type: "รายงานสินค้าคงคลัง",
    format: "CSV",
    records: 5934,
    size: "2.8 MB",
    status: "processing",
    datetime: "2025-07-24 10:15:32",
  },
  {
    name: "ประดิษฐ์ ทองคำ",
    email: "pradit.t@pawnshop.go.th",
    type: "รายงานการเงินรายวัน",
    format: "CSV",
    records: 1203,
    size: "734 KB",
    status: "success",
    datetime: "2025-07-24 09:45:18",
  },
  {
    name: "กัลยา มาลัยทอง",
    email: "kanaya.m@pawnshop.go.th",
    type: "รายงานลูกค้าใหม่",
    format: "CSV",
    records: 438,
    size: "267 KB",
    status: "failed",
    datetime: "2025-07-24 09:12:07",
  },
  {
    name: "วิรัช ศรีสวัสดิ์",
    email: "virat.s@pawnshop.go.th",
    type: "รายงานดอกเบี้ยค้างชำระ",
    format: "CSV",
    records: 892,
    size: "445 KB",
    status: "success",
    datetime: "2025-07-24 08:55:49",
  },
  {
    name: "นิตยา พงษ์พิพัฒน์",
    email: "nitaya.p@pawnshop.go.th",
    type: "รายงานสาขาทั้งหมด",
    format: "CSV",
    records: 3765,
    size: "1.9 MB",
    status: "success",
    datetime: "2025-07-24 08:33:21",
  },
];

const viewData: ViewRow[] = [
  {
    name: "ธวัชชัย ญาณศิริ",
    email: "thawatchai.y@pawnshop.go.th",
    menuId: "menu_pawn_data",
    menuName: "ข้อมูลตัวรับจำนำ",
  },
  {
    name: "สุภาพร เจริญศักดิ์",
    email: "supaporn.j@pawnshop.go.th",
    menuId: "menu_asset_types",
    menuName: "ประเภททรัพย์และราคา",
  },
  {
    name: "อนุชา พิทักษ์วงศ์",
    email: "anucha.p@pawnshop.go.th",
    menuId: "menu_user",
    menuName: "จัดการข้อมูลผู้ใช้",
  },
  {
    name: "วิภาวี สุขสวัสดิ์",
    email: "vipavee.s@pawnshop.go.th",
    menuId: "menu_reports",
    menuName: "รายงานและสถิติ",
  },
  {
    name: "ประดิษฐ์ ทองคำ",
    email: "pradit.t@pawnshop.go.th",
    menuId: "menu_logs",
    menuName: "ประวัติการใช้งาน",
  },
  {
    name: "กัลยา มาลัยทอง",
    email: "kanaya.m@pawnshop.go.th",
    menuId: "menu_dashboard",
    menuName: "ข้อมูลตั๋วรับจำนำ",
  },
  {
    name: "วิรัช ศรีสวัสดิ์",
    email: "virat.s@pawnshop.go.th",
    menuId: "menu_asset_types",
    menuName: "ประเภททรัพย์และราคา",
  },
  {
    name: "นิตยา พงษ์พิพัฒน์",
    email: "nitaya.p@pawnshop.go.th",
    menuId: "menu_customers",
    menuName: "ข้อมูลลูกค้า",
  },
  {
    name: "สมชาย รัตนวิไล",
    email: "somchai.r@pawnshop.go.th",
    menuId: "menu_transactions",
    menuName: "ประวัติการทำธุรกรรม",
  },
  {
    name: "พิมพ์ชนก แสงอรุณ",
    email: "pimchanok.s@pawnshop.go.th",
    menuId: "menu_user",
    menuName: "จัดการข้อมูลผู้ใช้",
  },
];

const chatData: ChatRow[] = [
  {
    name: "ธวัชชัย ญาณศิริ",
    email: "thawatchai.y@pawnshop.go.th",
    topic: "สอบถามเกี่ยวกับการรับจำนำทองคำ",
    datetime: "2025-07-24 14:25:32",
    messageId: "chat_tws_240724_001",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "สวัสดีครับ ผมอยากสอบถามเกี่ยวกับการรับจำนำทองคำครับ",
        time: "14:25:32",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณธวัชชัย ยินดีให้ข้อมูลเรื่องการรับจำนำทองคำครับ ขณะนี้เรารับจำนำทองคำ 96.5% ในราคา 32,500 บาทต่อบาท และทอง 90% ในราคา 30,800 บาทต่อบาท มีอะไรเพิ่มเติมที่อยากทราบไหมครับ?",
        time: "14:25:45",
      },
      {
        from: "user",
        text: "อัตราดอกเบี้ยเป็นอย่างไรครับ",
        time: "14:26:02",
      },
      {
        from: "ai",
        text: "อัตราดอกเบี้ยสำหรับการรับจำนำทองคำอยู่ที่ 1.25% ต่อเดือน โดยสามารถไถ่คืนได้ภายใน 6 เดือน หากเกินกำหนดจะมีการประมูลขายทอดตลาดครับ",
        time: "14:26:15",
      },
      {
        from: "user",
        text: "ขอบคุณครับ ข้อมูลครบแล้ว",
        time: "14:26:28",
      },
    ],
  },
  {
    name: "สุภาพร เจริญศักดิ์",
    email: "supaporn.j@pawnshop.go.th",
    topic: "สอบถามการประมูลขายทอดตลาด",
    datetime: "2025-07-24 13:42:18",
    messageId: "chat_spj_240724_002",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "ดีค่ะ อยากทราบเกี่ยวกับการประมูลขายทอดตลาดค่ะ",
        time: "13:42:18",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณสุภาพร การประมูลขายทอดตลาดจะจัดขึ้นทุกวันพุธและเสาร์ เวลา 10:00 น. ที่สำนักงานใหญ่ครับ สามารถดูรายการสินค้าได้ล่วงหน้า 3 วัน",
        time: "13:42:30",
      },
      {
        from: "user",
        text: "มีค่าธรรมเนียมในการเข้าร่วมประมูลไหมคะ",
        time: "13:42:45",
      },
      {
        from: "ai",
        text: "ไม่มีค่าธรรมเนียมในการเข้าร่วมประมูลครับ แต่หากชนะการประมูลต้องชำระเงินเต็มจำนวนในวันเดียวกัน และมีค่าธรรมเนียมการโอน 1% ของราคาประมูล",
        time: "13:42:58",
      },
    ],
  },
  {
    name: "อนุชา พิทักษ์วงศ์",
    email: "anucha.p@pawnshop.go.th",
    topic: "สอบถามการรับจำนำเครื่องใช้ไฟฟ้า",
    datetime: "2025-07-24 12:15:47",
    messageId: "chat_acp_240724_003",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "ครับ อยากสอบถามว่าเรารับจำนำเครื่องใช้ไฟฟ้าอะไรบ้างครับ",
        time: "12:15:47",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณอนุชา เรารับจำนำเครื่องใช้ไฟฟ้าหลายประเภท เช่น โทรศัพท์มือถือ แท็บเล็ต โน๊ตบุ๊ค กล้องดิจิทัล เครื่องเสียง แต่ต้องเป็นของแท้และใช้งานได้ปกติครับ",
        time: "12:16:02",
      },
      {
        from: "user",
        text: "แล้วเกณฑ์การประเมินราคาเป็นอย่างไรครับ",
        time: "12:16:20",
      },
      {
        from: "ai",
        text: "เกณฑ์การประเมินจะดูจากสภาพของสินค้า อายุการใช้งาน ราคาตลาดปัจจุบัน และความต้องการในตลาด โดยทั่วไปจะได้ประมาณ 40-60% ของราคาตลาดครับ",
        time: "12:16:35",
      },
    ],
  },
  {
    name: "วิภาวี สุขสวัสดิ์",
    email: "vipavee.s@pawnshop.go.th",
    topic: "สอบถามการต่ออายุสัญญาจำนำ",
    datetime: "2025-07-24 11:33:21",
    messageId: "chat_vps_240724_004",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "สวัสดีค่ะ อยากสอบถามเรื่องการต่ออายุสัญญาจำนำค่ะ",
        time: "11:33:21",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณวิภาวี สำหรับการต่ออายุสัญญาจำนำ สามารถทำได้ก่อนครบกำหนด 7 วัน โดยชำระดอกเบี้ยที่ค้างอยู่ แล้วจะได้อายุใหม่อีก 6 เดือนครับ",
        time: "11:33:35",
      },
      {
        from: "user",
        text: "ถ้าไม่สามารถมาต่อด้วยตัวเองได้ ให้คนอื่นมาแทนได้ไหมคะ",
        time: "11:33:52",
      },
      {
        from: "ai",
        text: "ได้ครับ แต่ต้องมีหนังสือมอบอำนาจที่ถูกต้องตามกฎหมาย พร้อมสำเนาบัตรประชาชนของผู้มอบและผู้รับมอบอำนาจ และต้องนำต้นฉบับตั๋วจำนำมาด้วยครับ",
        time: "11:34:08",
      },
    ],
  },
  {
    name: "ประดิษฐ์ ทองคำ",
    email: "pradit.t@pawnshop.go.th",
    topic: "สอบถามการรับจำนำรถยนต์",
    datetime: "2025-07-24 10:28:15",
    messageId: "chat_pdt_240724_005",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "ครับ อยากทราบเรื่องการรับจำนำรถยนต์ครับ",
        time: "10:28:15",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณประดิษฐ์ เรารับจำนำรถยนต์ป้ายแดงที่มีอายุไม่เกิน 15 ปี โดยประเมินจากสภาพรถ อายุ และราคาตลาด วงเงินสูงสุด 2 ล้านบาทครับ",
        time: "10:28:30",
      },
      {
        from: "user",
        text: "เอกสารที่ต้องใช้มีอะไรบ้างครับ",
        time: "10:28:45",
      },
      {
        from: "ai",
        text: "เอกสารที่ต้องใช้ ได้แก่ เล่มทะเบียนรถ ใบอนุญาตขับขี่ บัตรประชาชน ทะเบียนบ้าน และหนังสือยินยอมจากคู่สมรส (ถ้ามี) รถต้องไม่มีภาระผูกพันครับ",
        time: "10:29:02",
      },
    ],
  },
  {
    name: "กัลยา มาลัยทอง",
    email: "kanaya.m@pawnshop.go.th",
    topic: "สอบถามการเปิดบัญชีลูกค้าใหม่",
    datetime: "2025-07-24 09:45:33",
    messageId: "chat_kym_240724_006",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "สวัสดีค่ะ อยากทราบขั้นตอนการเปิดบัญชีลูกค้าใหม่ค่ะ",
        time: "09:45:33",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณกัลยา การเปิดบัญชีลูกค้าใหม่ใช้เวลาประมาณ 15 นาที ต้องนำบัตรประชาชน ทะเบียนบ้าน และหนังสือรับรองเงินเดือน (ถ้ามี) มาให้เจ้าหน้าที่ตรวจสอบครับ",
        time: "09:45:48",
      },
      {
        from: "user",
        text: "มีค่าธรรมเนียมในการเปิดบัญชีไหมคะ",
        time: "09:46:05",
      },
      {
        from: "ai",
        text: "ไม่มีค่าธรรมเนียมในการเปิดบัญชีครับ เป็นบริการฟรี แต่หากทำธุรกรรมจำนำจะมีค่าธรรมเนียมการทำสัญญาตามอัตราที่กำหนดครับ",
        time: "09:46:18",
      },
    ],
  },
  {
    name: "วิรัช ศรีสวัสดิ์",
    email: "virat.s@pawnshop.go.th",
    topic: "สอบถามระบบการชำระดอกเบี้ย",
    datetime: "2025-07-24 08:52:47",
    messageId: "chat_vrs_240724_007",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "ครับ อยากทราบเกี่ยวกับระบบการชำระดอกเบี้ยครับ",
        time: "08:52:47",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณวิรัช สำหรับการชำระดอกเบี้ย สามารถชำระได้หลายช่องทาง เช่น ที่เคาน์เตอร์ ตู้ ATM โมบายแบงก์กิ้ง หรือแอปพลิเคชันของเราครับ",
        time: "08:53:02",
      },
      {
        from: "user",
        text: "ถ้าชำระล่าช้าจะมีค่าปรับไหมครับ",
        time: "08:53:18",
      },
      {
        from: "ai",
        text: "หากชำระล่าช้าจะมีค่าปรับ 2% ต่อเดือน นับจากวันที่ครบกำหนดชำระ แต่หากล่าช้าเกิน 30 วัน อาจส่งผลต่อการพิจารณาสินเชื่อครั้งต่อไปครับ",
        time: "08:53:35",
      },
    ],
  },
  {
    name: "นิตยา พงษ์พิพัฒน์",
    email: "nitaya.p@pawnshop.go.th",
    topic: "สอบถามการรับจำนำเครื่องประดับ",
    datetime: "2025-07-24 08:15:29",
    messageId: "chat_nyp_240724_008",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "สวัสดีค่ะ อยากสอบถามการรับจำนำเครื่องประดับค่ะ",
        time: "08:15:29",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณนิตยา เรารับจำนำเครื่องประดับทองคำ เพชร แพลทินัม และอัญมณีต่างๆ โดยจะประเมินจากน้ำหนัก ความบริสุทธิ์ และคุณภาพของเครื่องประดับครับ",
        time: "08:15:44",
      },
      {
        from: "user",
        text: "เครื่องประดับที่มีตัวหนังสือจำนำได้ไหมคะ",
        time: "08:16:02",
      },
      {
        from: "ai",
        text: "ได้ครับ แต่อาจส่งผลต่อราคาประเมิน เนื่องจากตัวหนังสือจะลดความสวยงามและมูลค่าในการขายต่อ แต่ยังคงประเมินจากน้ำหนักทองคำหรือเพชรตามปกติครับ",
        time: "08:16:18",
      },
    ],
  },
  {
    name: "สมชาย รัตนวิไล",
    email: "somchai.r@pawnshop.go.th",
    topic: "สอบถามการรับจำนำที่ดิน",
    datetime: "2025-07-24 07:43:16",
    messageId: "chat_scr_240724_009",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "ครับ อยากทราบเรื่องการรับจำนำที่ดินครับ",
        time: "07:43:16",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณสมชาย เรารับจำนำที่ดินที่มีโฉนดที่ดินหรือน.ส.3ก ในพื้นที่ที่เหมาะสม วงเงินขึ้นอยู่กับราคาประเมินของธนาคารแห่งประเทศไทยครับ",
        time: "07:43:32",
      },
      {
        from: "user",
        text: "ระยะเวลาการจำนำเป็นอย่างไรครับ",
        time: "07:43:48",
      },
      {
        from: "ai",
        text: "สำหรับการจำนำที่ดิน ระยะเวลาสูงสุด 3 ปี อัตราดอกเบี้ย 8% ต่อปี สามารถต่ออายุได้ แต่ต้องผ่านการประเมินราคาใหม่ทุกครั้งครับ",
        time: "07:44:05",
      },
    ],
  },
  {
    name: "พิมพ์ชนก แสงอรุณ",
    email: "pimchanok.s@pawnshop.go.th",
    topic: "สอบถามการรับจำนำมอเตอร์ไซค์",
    datetime: "2025-07-24 07:12:38",
    messageId: "chat_pcs_240724_010",
    action: "ดูรายละเอียดเพิ่มเติม",
    transcript: [
      {
        from: "user",
        text: "สวัสดีค่ะ อยากสอบถามการรับจำนำมอเตอร์ไซค์ค่ะ",
        time: "07:12:38",
      },
      {
        from: "ai",
        text: "สวัสดีครับคุณพิมพ์ชนก เรารับจำนำมอเตอร์ไซค์ป้ายแดงที่มีอายุไม่เกิน 10 ปี ประเมินจากสภาพและราคาตลาด วงเงินสูงสุด 150,000 บาทครับ",
        time: "07:12:53",
      },
      {
        from: "user",
        text: "ต้องมีเอกสารอะไรบ้างคะ",
        time: "07:13:08",
      },
      {
        from: "ai",
        text: "เอกสารที่ต้องใช้ ได้แก่ เล่มทะเบียนรถ ใบอนุญาตขับขี่ บัตรประชาชน ทะเบียนบ้าน และรถต้องไม่มีภาระผูกพัน พร้อมกุญแจสำรองครับ",
        time: "07:13:25",
      },
    ],
  },
];

export default function LogPage() {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [selectedChat, setSelectedChat] = useState<ChatRow | null>(null);

  // 🔐 Protected Route - ป้องกันการเข้าถึงโดยไม่ได้ login
  const { shouldRender, message } = useProtectedRoute();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentPage] = useState("log-management");

  // 🎯 Filter state สำหรับส่งต่อไป widgets
  const [filterData, setFilterData] = useState<WidgetFilterData>({
    branchId: "",
    date: new Date().toISOString().split("T")[0],
    isLoading: true,
  });

  function onChatToggle() {
    setIsChatOpen((prev) => !prev);
  }

  function onMenuToggle() {
    console.log("Menu toggled");
  }

  // 🔐 Guard - ถ้าไม่ควร render ให้แสดง loading/redirect message
  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  const renderTable = () => {
    switch (activeTab) {
      case "login":
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
        );
      case "view":
        return (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ชื่อ</th>
                <th className="px-4 py-2 text-left">อีเมล</th>
                <th className="px-4 py-2 text-left">ชื่อเมนู</th>
              </tr>
            </thead>
            <tbody>
              {viewData.map((r, i) => (
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
        );
      default:
        return null;
    }
  };

  const handleFilterChange = (data: WidgetFilterData) => {
    setFilterData(data);

    // Log การเปลี่ยนแปลง
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === "true") {
      console.log("🎯 Dashboard filter changed:", data);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar ฝั่งซ้าย fixed width */}
        <div className="w-64 border-r bg-white">
          <AppSidebar />
        </div>

        {/* ส่วนเนื้อหาหลัก ขวา flex-grow */}
        <div className="flex-1 flex flex-col">
          <Header
            selectedPage={currentPage}
            onChatToggle={onChatToggle}
            onMenuToggle={onMenuToggle}
            isChatOpen={isChatOpen}
            onFilterChange={handleFilterChange}
          />
          <main className="flex-1 p-8 bg-gray-50">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {overview.map((o) => (
                <div
                  key={o.label}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="text-sm text-gray-500">{o.label}</div>
                  <div className="mt-2 text-3xl font-bold">
                    {o.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-lg font-medium mb-4">ประเภทของ Log</h2>
              {tabs.map((t) => {
                const pct = Math.min(
                  (t.count / Math.max(...tabs.map((x) => x.count))) * 100,
                  100
                );
                return (
                  <div key={t.key} className="flex items-center mb-3">
                    <div className="w-32 text-sm text-gray-600">{t.label}</div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full mx-3 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm font-semibold">{t.count}</div>
                  </div>
                );
              })}
            </div>

            {/* Detail Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Tab Navs */}
              <div className="flex border-b mb-4">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-4 py-2 -mb-px font-medium ${
                      activeTab === t.key
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600 hover:text-gray-800"
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
                    {tabs.find((t) => t.key === activeTab)?.label}
                  </div>
                  <div className="text-sm text-blue-500">
                    วันที่{" "}
                    {new Date().toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ"
                    className="border px-3 py-2 rounded w-64"
                  />
                  <button className="border px-3 py-2 rounded">
                    เรียงตาม: ชื่อ
                  </button>
                </div>
              </div>

              {/* Render appropriate table */}
              {renderTable()}

              {/* Pagination placeholder */}
              <div className="mt-4 flex justify-end space-x-1 text-sm text-gray-600">
                <button className="px-2 py-1">ก่อนหน้า</button>
                {[...Array(10)].map((_, i) => (
                  <button
                    key={i}
                    className={`px-2 py-1 rounded ${
                      i === 0 ? "bg-blue-100" : ""
                    }`}
                  >
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
                    <div>
                      <strong>ชื่อผู้ใช้:</strong> {selectedChat.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedChat.email}
                    </div>
                    <div>
                      <strong>message_id:</strong> {selectedChat.messageId}
                    </div>
                    <div>
                      <strong>วันที่/เวลา:</strong> {selectedChat.datetime}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-gray-500 mb-2">บทสนทนา</p>
                    <div className="space-y-4">
                      {selectedChat.transcript.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            m.from === "ai" ? "justify-end" : ""
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg max-w-[70%] ${
                              m.from === "ai"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800"
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
