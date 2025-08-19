import { useWidgetRegistration, WidgetData } from "@/context/widget-context";

/**
 * 🎯 Hook สำหรับจัดการ Widget Context ที่ง่ายต่อการใช้งาน
 *
 * @param id - ID ของ Widget (ไม่ซ้ำกัน)
 * @param name - ชื่อ Widget ที่จะแสดงใน Chat
 * @param description - คำอธิบาย Widget
 * @param data - ข้อมูลของ Widget
 * @param options - ตัวเลือกเพิ่มเติม
 */
export const useWidgetContext = (
  id: string,
  name: string,
  description: string,
  data: any,
  options?: {
    /** 🔄 เปิด/ปิด Auto-Update เมื่อข้อมูลเปลี่ยน (default: true) */
    autoUpdate?: boolean;
    /** 🔄 แทนที่ Context เดิมเมื่อมีการอัพเดท (default: true) */
    replaceOnUpdate?: boolean;
    /** 📊 Dependencies เพิ่มเติมสำหรับตรวจสอบการเปลี่ยนแปลง */
    dependencies?: any[];
  }
) => {
  const {
    autoUpdate = true,
    replaceOnUpdate = true,
    dependencies = [],
  } = options || {};

  useWidgetRegistration(id, name, description, data, {
    autoUpdate,
    replaceOnUpdate,
    dependencies,
  });
};

export type { WidgetData };
