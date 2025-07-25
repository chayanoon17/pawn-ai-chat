/**
 * Input Validation Schemas
 * ใช้ Zod สำหรับ type-safe validation ทั่วแอพ
 */

import { z, ZodType } from "zod";

// ===== COMMON VALIDATION SCHEMAS =====

/**
 * 📧 Email Schema
 */
export const emailSchema = z
  .string()
  .min(1, "กรุณากรอกอีเมล")
  .email("รูปแบบอีเมลไม่ถูกต้อง")
  .max(254, "อีเมลยาวเกินไป");

/**
 * 🔒 Password Schema
 */
export const passwordSchema = z
  .string()
  .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
  .max(100, "รหัสผ่านยาวเกินไป")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "รหัสผ่านต้องมีตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข"
  );

/**
 * 📱 Phone Number Schema (Thai format)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^(\+66|0)[6-9]\d{8}$/,
    "เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 0812345678)"
  )
  .or(z.literal(""));

/**
 * 🏢 Branch ID Schema
 */
export const branchIdSchema = z
  .union([
    z.string().min(1, "กรุณาเลือกสาขา"),
    z.number().min(1, "กรุณาเลือกสาขา"),
  ])
  .transform((val) => (typeof val === "string" ? parseInt(val) : val));

/**
 * 📅 Date Schema
 */
export const dateSchema = z
  .string()
  .min(1, "กรุณาเลือกวันที่")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)");

/**
 * 🔢 Positive Number Schema
 */
export const positiveNumberSchema = z
  .number()
  .positive("ตัวเลขต้องมากกว่า 0")
  .finite("ตัวเลขไม่ถูกต้อง");

/**
 * 💰 Currency Schema (Thai Baht)
 */
export const currencySchema = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num =
      typeof val === "string" ? parseFloat(val.replace(/,/g, "")) : val;
    return isNaN(num) ? 0 : num;
  })
  .refine((val) => val >= 0, "จำนวนเงินต้องมากกว่าหรือเท่ากับ 0");

// ===== AUTHENTICATION SCHEMAS =====

/**
 * 🔐 Login Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
  rememberMe: z.boolean().optional(),
});

/**
 * 👤 User Registration Schema
 */
export const userRegistrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(100, "ชื่อยาวเกินไป"),
    phoneNumber: phoneSchema.optional(),
    branchId: branchIdSchema,
    roleId: z.number().min(1, "กรุณาเลือกตำแหน่ง"),
    status: z.enum(["ACTIVE", "INACTIVE"], {
      message: "สถานะไม่ถูกต้อง",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

/**
 * ✏️ User Update Schema
 */
export const userUpdateSchema = userRegistrationSchema
  .omit({ password: true, confirmPassword: true })
  .extend({
    id: z.number().min(1),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmPassword"],
    }
  );

// ===== WIDGET FILTER SCHEMAS =====

/**
 * 🎛️ Widget Filter Schema
 */
export const widgetFilterSchema = z.object({
  branchId: branchIdSchema,
  date: dateSchema,
  dateRange: z
    .object({
      from: dateSchema,
      to: dateSchema,
    })
    .optional(),
});

/**
 * 📊 Pagination Schema
 */
export const paginationSchema = z.object({
  page: z.number().min(1, "หน้าต้องมากกว่า 0").default(1),
  limit: z
    .number()
    .min(1)
    .max(100, "จำนวนรายการต่อหน้าต้องไม่เกิน 100")
    .default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ===== API RESPONSE SCHEMAS =====

/**
 * 🌐 API Response Schema
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

/**
 * ❌ API Error Schema
 */
export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string(),
  details: z.any().optional(),
});

// ===== FORM VALIDATION HELPERS =====

/**
 * 🛠️ Validation Helper Functions
 */
export const ValidationHelpers = {
  /**
   * Parse and validate data with schema
   */
  safeParse: <T>(schema: z.ZodSchema<T>, data: unknown) => {
    const result = schema.safeParse(data);
    if (result.success) {
      return { data: result.data, error: null };
    }
    return {
      data: null,
      error: result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    };
  },

  /**
   * Get validation errors as object
   */
  getErrorObject: (error: z.ZodError) => {
    const errorObject: Record<string, string> = {};
    error.issues.forEach((err) => {
      const path = err.path.join(".");
      errorObject[path] = err.message;
    });
    return errorObject;
  },

  /**
   * Validate field value
   */
  validateField: <T>(schema: z.ZodSchema<T>, value: unknown) => {
    try {
      schema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง";
      }
      return "เกิดข้อผิดพลาดในการตรวจสอบ";
    }
  },
};

// ===== CUSTOM VALIDATION RULES =====

/**
 * 🎯 Custom Validation Rules
 */
export const CustomValidations = {
  /**
   * Thai ID Card validation (optional)
   */
  thaiIdCard: z
    .string()
    .regex(/^\d{13}$/, "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก")
    .refine((id) => {
      // Thai ID card checksum validation
      const digits = id.split("").map(Number);
      const sum = digits.slice(0, 12).reduce((acc, digit, index) => {
        return acc + digit * (13 - index);
      }, 0);
      const remainder = sum % 11;
      const checkDigit = remainder < 2 ? remainder : 11 - remainder;
      return checkDigit === digits[12];
    }, "เลขบัตรประชาชนไม่ถูกต้อง"),

  /**
   * File size validation
   */
  fileSize: (maxSizeInMB: number) =>
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= maxSizeInMB * 1024 * 1024,
        `ขนาดไฟล์ต้องไม่เกิน ${maxSizeInMB} MB`
      ),

  /**
   * File type validation
   */
  fileType: (allowedTypes: string[]) =>
    z
      .instanceof(File)
      .refine(
        (file) => allowedTypes.includes(file.type),
        `รองรับไฟล์ประเภท: ${allowedTypes.join(", ")}`
      ),
};

// ===== TYPE EXPORTS =====

export type LoginData = z.infer<typeof loginSchema>;
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type WidgetFilterData = z.infer<typeof widgetFilterSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;

// ===== VALIDATION HOOK =====

/**
 * 🎣 Hook สำหรับใช้ validation ใน components
 */
export function useValidation<T>(schema: z.ZodSchema<T>) {
  const validate = (data: unknown) => {
    return ValidationHelpers.safeParse(schema, data);
  };

  const validateField = (field: keyof T, value: unknown) => {
    // Extract field schema if possible
    try {
      if (
        "shape" in schema &&
        schema.shape &&
        typeof schema.shape === "object"
      ) {
        const fieldSchema = (schema.shape as Record<string, unknown>)[
          field as string
        ];
        if (
          fieldSchema &&
          typeof fieldSchema === "object" &&
          "parse" in fieldSchema
        ) {
          return ValidationHelpers.validateField(fieldSchema as ZodType, value);
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  return { validate, validateField };
}
