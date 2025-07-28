"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { updateUser, getRoles, getBranches } from "@/lib/auth-service";
import type { User, UserStatus } from "@/types";

// 📝 Component Props Interface
interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

// 📝 Form Data Interface
interface EditUserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  branchId: string;
  roleId: string;
  status: UserStatus;
}

/**
 * 🎯 EditUserDialog Component
 *
 * Component สำหรับแก้ไขข้อมูลผู้ใช้งาน
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
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

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

  // Load branches and roles when dialog opens
  useEffect(() => {
    if (open) {
      const loadData = async () => {
        try {
          const [branchesData, rolesData] = await Promise.all([
            getBranches(),
            getRoles(),
          ]);
          setBranches(branchesData as { id: number; name: string }[]);
          setRoles(rolesData as { id: number; name: string }[]);
        } catch (error) {
          console.error("Error loading branches and roles:", error);
        }
      };
      loadData();
    }
  }, [open]);

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
        branchId?: number;
        roleId: number;
        status: "ACTIVE" | "INACTIVE";
        password?: string;
      } = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber || undefined,
        roleId: Number(form.roleId),
        status: form.status as "ACTIVE" | "INACTIVE",
      };

      // Only include branchId if it's provided (since it's optional)
      if (form.branchId) {
        payload.branchId = Number(form.branchId);
      }

      // Only include password if it's provided
      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateUser(user.id.toString(), payload);
      setMessage("อัปเดตข้อมูลผู้ใช้สำเร็จ");

      // Close dialog and refresh data
      setTimeout(() => {
        onOpenChange(false);
        onUserUpdated();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error("Update user error:", error);
      setMessage("เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>แก้ไขข้อมูลผู้ใช้</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          แก้ไขข้อมูลผู้ใช้ในระบบ
        </Dialog.Description>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ชื่อ-นามสกุล
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
                อีเมล
              </Text>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled
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
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                รหัสผ่านใหม่ (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
              </Text>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="รหัสผ่านใหม่"
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                สาขา (ไม่บังคับ)
              </Text>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">เลือกสาขา (ไม่บังคับ)</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id.toString()}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ตำแหน่ง
              </Text>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือกตำแหน่ง</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id.toString()}>
                    {role.name}
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
                <option value="ACTIVE">ใช้งาน</option>
                <option value="INACTIVE">ไม่ใช้งาน</option>
              </select>
            </label>
          </Flex>

          {message && (
            <div
              className={`p-3 rounded text-center ${
                message.includes("สำเร็จ")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                ยกเลิก
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={loading}>
              {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
