"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { updateUser } from "@/lib/auth-service";
import type { User, UserStatus } from "@/types";
import { BRANCHES, ROLES } from "@/lib/constants";

// 📝 Component Props Interface
interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

// 📝 Form State Interface
interface EditUserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  branchId: string;
  roleId: string;
  status: UserStatus;
}

// 📝 Status Options
const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

/**
 * EditUserDialog Component
 *
 * แสดง Dialog สำหรับแก้ไขข้อมูลผู้ใช้
 * รองรับการแก้ไขข้อมูลทั่วไป, เปลี่ยนรหัสผ่าน, สาขา, ตำแหน่ง และสถานะ
 *
 * @param user - ข้อมูลผู้ใช้ที่ต้องการแก้ไข
 * @param open - สถานะการเปิด/ปิด dialog
 * @param onOpenChange - Function สำหรับเปลี่ยนสถานะ dialog
 * @param onUserUpdated - Callback function ที่จะเรียกเมื่ออัพเดทผู้ใช้สำเร็จ
 */
export default function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const [form, setForm] = useState<EditUserFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    branchId: "",
    roleId: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        password: "", // Don't populate password
        branchId: user.branch?.id?.toString() ?? "",
        roleId: user.role.id.toString(),
        status: user.status,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const payload: {
        fullName: string;
        phoneNumber?: string;
        branchId: number;
        roleId: number;
        status: "ACTIVE" | "INACTIVE";
        password?: string;
      } = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber || undefined,
        branchId: Number(form.branchId),
        roleId: Number(form.roleId),
        status: form.status as "ACTIVE" | "INACTIVE",
      };

      // Only include password if it's provided
      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateUser(user.id.toString(), payload);
      setMessage("อัปเดตข้อมูลผู้ใช้สำเร็จ");

      // Close dialog and refresh data
      setTimeout(() => {
        resetForm();
        onOpenChange(false);
        onUserUpdated();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setMessage(err?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="500px" className="p-6 bg-white rounded shadow">
        <Dialog.Title>แก้ไขข้อมูลผู้ใช้</Dialog.Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3" className="mt-4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ชื่อผู้ใช้งาน
              </Text>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email (ไม่สามารถแก้ไขได้)
              </Text>
              <input
                type="email"
                name="email"
                value={form.email}
                className="w-full p-2 border rounded bg-gray-100"
                disabled
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                รหัสผ่านใหม่ (ไม่บังคับ)
              </Text>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ใส่เฉพาะเมื่อต้องการเปลี่ยนรหัสผ่าน"
                minLength={6}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                เบอร์โทรศัพท์
              </Text>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="081-234-5678"
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                เลือกสาขา
              </Text>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือกสาขา</option>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id.toString()}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือก Role</option>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id.toString()}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือกสถานะ</option>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </Flex>

          {message && (
            <div
              className={`mt-3 p-2 rounded text-sm ${
                message.includes("สำเร็จ")
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                type="button"
                onClick={resetForm}
              >
                ยกเลิก
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
