import { ActiveContext } from "./active-context-section";

// 🎯 Generate Dynamic Prompts ตาม Active Contexts
export const generateDynamicPrompts = (
  activeContexts: ActiveContext[]
): string[] => {
  if (activeContexts.length === 0) return [];

  const prompts: string[] = [];
  const widgetIds = activeContexts.map((ctx) => ctx.widget.id);

  // Dashboard Context Prompts
  if (widgetIds.includes("weekly-operation-summary")) {
    prompts.push(
      "เงินสดรับเฉพาะวันจันทร์ของอาทิตย์นี้และอาทิตย์ที่แล้วต่างกันเยอะไหม?",
      "วันไหนที่มีเงินสดรับสูงที่สุดในอาทิตย์นี้?",
      "เปรียบเทียบผลงานอาทิตย์นี้กับอาทิตย์ที่แล้ว",
      "แนวโน้มเงินสดจ่ายเป็นอย่างไร?",
      "วิเคราะห์สาเหตุที่เงินสดรับลดลง"
    );
  }

  if (widgetIds.includes("gold-price")) {
    prompts.push(
      "ราคาทองแท่งกับทองรูปพรรณต่างกันเท่าไร?",
      "ส่วนต่างราคาซื้อ-ขายทองคำเป็นอย่างไร?",
      "ราคาทองอัปเดตล่าสุดเมื่อไหร?",
      "ควรซื้อทองแท่งหรือทองรูปพรรณดี?"
    );
  }

  if (widgetIds.includes("daily-operation-summary")) {
    prompts.push(
      "ยอดคงเหลือวันนี้เปลี่ยนแปลงอย่างไรจากตอนเปิดร้าน?",
      "จำนวนรายการเพิ่มขึ้นหรือลดลง?",
      "มูลค่าสต็อกรวมเป็นเท่าไร?",
      "แนวโน้มการเปลี่ยนแปลงยอดคงเหลือเป็นอย่างไร?"
    );
  }

  if (widgetIds.includes("contract-transaction-type-summary")) {
    prompts.push(
      "ประเภทธุรกรรมไหนที่มีมากที่สุดวันนี้?",
      "จำนวนรายการทั้งหมดเป็นเท่าไร?",
      "การไถ่ถอนมีกี่รายการ?",
      "ธุรกรรมใหม่เทียบกับการต่อดอกเบี้ยอย่างไร?"
    );
  }

  if (widgetIds.includes("contract-status-summary")) {
    prompts.push(
      "สถานะสัญญาไหนที่มีมากที่สุด?",
      "มีสัญญาครบกำหนดกี่ราย?",
      "สัญญาเกินกำหนดมีเท่าไร?",
      "สัญญาปกติเป็นเปอร์เซ็นต์เท่าไร?"
    );
  }

  if (widgetIds.includes("contract-transaction-details")) {
    prompts.push(
      "รายการที่มีมูลค่าสูงที่สุดเป็นอย่างไร?",
      "ลูกค้าคนไหนมีรายการมากที่สุด?",
      "ทรัพย์สินประเภทไหนได้รับความนิยม?",
      "รายการไหนบ้างมีราคารับจำนำไม่เกิน 5000 บาท?"
    );
  }

  // Asset Type Context Prompts
  if (widgetIds.includes("asset-type-summary")) {
    prompts.push(
      "ประเภททรัพย์สินไหนที่ได้รับความนิยมมากที่สุด?",
      "สัดส่วนของแต่ละประเภททรัพย์สินเป็นอย่างไร?",
      "มีประเภททรัพย์สินทั้งหมดกี่ประเภท?",
      "ประเภทไหนที่มีน้อยที่สุด?"
    );
  }

  if (widgetIds.includes("top-ranking-asset-type")) {
    prompts.push(
      "อันดับ 1 ประเภททรัพย์สินคืออะไร?",
      "ประเภทไหนที่มีมูลค่าสูงที่สุด?",
      "เปรียบเทียบอันดับ 1 กับอันดับ 2",
      "มูลค่าเฉลี่ยของแต่ละประเภทเป็นเท่าไร?"
    );
  }

  if (widgetIds.includes("ranking-by-period-asset-type")) {
    prompts.push(
      "แนวโน้มประเภททรัพย์สินเป็นอย่างไรในช่วงนี้?",
      "ประเภทไหนที่มีการเติบโตมากที่สุด?",
      "ช่วงเวลาไหนที่มีการรับจำนำมากที่สุด?",
      "วิเคราะห์แนวโน้มตามช่วงเวลา"
    );
  }

  // Mixed Context Prompts (เมื่อมีหลาย widget)
  if (widgetIds.length > 1) {
    // Smart combination prompts
    if (
      widgetIds.includes("weekly-operation-summary") &&
      widgetIds.includes("daily-operation-summary")
    ) {
      prompts.push(
        "เปรียบเทียบยอดรับจำนำรายสัปดาห์กับยอดคงเหลือรายวัน",
        "แนวโน้มการเติบโตจากข้อมูลรายวันและรายสัปดาห์"
      );
    }

    if (
      widgetIds.includes("gold-price") &&
      widgetIds.includes("weekly-operation-summary")
    ) {
      prompts.push(
        "ราคาทองมีผลต่อยอดรับจำนำอย่างไร?",
        "ช่วงที่ราคาทองสูงมีผลต่อธุรกิจไหม?"
      );
    }

    if (
      widgetIds.includes("asset-type-summary") &&
      widgetIds.includes("contract-transaction-type-summary")
    ) {
      prompts.push(
        "ประเภททรัพย์สินไหนที่มีการทำธุรกรรมมากที่สุด?",
        "วิเคราะห์ความสัมพันธ์ระหว่างประเภททรัพย์สินกับประเภทธุรกรรม"
      );
    }

    prompts.push(
      "สรุปภาพรวมข้อมูลทั้งหมดให้ฟัง",
      "วิเคราะห์ความสัมพันธ์ระหว่างข้อมูลต่างๆ",
      "จุดที่น่าสนใจจากข้อมูลทั้งหมดคืออะไร?",
      "ข้อเสนอแนะจากการวิเคราะห์ข้อมูลเหล่านี้"
    );
  }

  // Return unique prompts only (remove duplicates)
  return [...new Set(prompts)].slice(0, 10); // เพิ่มเป็น 10 คำถาม
};

// 🎨 Get prompt button color based on widget type - Enhanced
export const getPromptButtonStyle = (prompt: string) => {
  // Analysis prompts - สำหรับคำถามวิเคราะห์
  if (
    prompt.includes("วิเคราะห์") ||
    prompt.includes("เปรียบเทียบ") ||
    prompt.includes("แนวโน้ม")
  ) {
    return "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-800 hover:from-purple-100 hover:to-purple-200";
  }
  // Summary prompts - สำหรับคำถามสรุป
  if (
    prompt.includes("สรุป") ||
    prompt.includes("ภาพรวม") ||
    prompt.includes("ทั้งหมด")
  ) {
    return "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800 hover:from-green-100 hover:to-green-200";
  }
  // Specific data prompts - สำหรับคำถามข้อมูลเฉพาะ
  if (
    prompt.includes("เท่าไร") ||
    prompt.includes("กี่") ||
    prompt.includes("ไหน")
  ) {
    return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-800 hover:from-orange-100 hover:to-orange-200";
  }
  // Default style
  return "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800 hover:from-blue-100 hover:to-blue-200";
};

// 📊 Get Context Summary Info
export const getContextSummary = (activeContexts: ActiveContext[]) => {
  if (activeContexts.length === 0) return null;

  const contextTypes = activeContexts.map((ctx) => {
    if (ctx.widget.id.includes("asset-type")) return "ประเภททรัพย์สิน";
    if (ctx.widget.id.includes("transaction")) return "ธุรกรรม";
    if (ctx.widget.id.includes("operation")) return "ปฏิบัติการ";
    if (ctx.widget.id.includes("gold")) return "ราคาทอง";
    return "อื่นๆ";
  });

  const uniqueTypes = [...new Set(contextTypes)];
  return uniqueTypes.join(", ");
};
