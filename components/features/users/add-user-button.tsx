"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { createUser, getRoles, getBranches } from "@/lib/auth-service";
import type { Branch, Role, CreateUserPayload } from "@/types";
import {
  showCreateSuccess,
  showError,
  showNetworkError,
  showWarning,
} from "@/lib/sweetalert";

// 📝 Component Props Interface
interface AddUserDialogProps {
  onUserCreated?: () => void;
}

// 📝 Form State Interface
interface CreateUserFormData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  branchId: string;
  roleId: string;
}

/**
 * AddUserDialog Component
 *
 * แสดง Dialog สำหรับเพิ่มผู้ใช้ใหม่ในระบบ
 * รองรับการเลือกสาขาและตำแหน่งจาก API
 *
 * @param onUserCreated - Callback function ที่จะเรียกเมื่อสร้างผู้ใช้สำเร็จ
 */
export default function AddUserDialog({ onUserCreated }: AddUserDialogProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<CreateUserFormData>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    branchId: "",
    roleId: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Load branches and roles when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [branchesResponse, rolesResponse] = await Promise.all([
          getBranches(),
          getRoles(),
        ]);
        setBranches((branchesResponse as Branch[]) || []);
        setRoles((rolesResponse as Role[]) || []);
      } catch (error) {
        console.error("Error loading branches and roles:", error);
        showNetworkError("ไม่สามารถโหลดข้อมูลสาขาและตำแหน่งได้");
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      branchId: "",
      roleId: "",
    });
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.fullName || !form.email || !form.password || !form.roleId) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload: CreateUserPayload = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber || undefined,
        branchId: form.branchId ? Number(form.branchId) : undefined,
        roleId: Number(form.roleId),
        status: "ACTIVE", // Always set to ACTIVE for new users
      };

      await createUser(payload);

      // แสดง SweetAlert2 success
      showCreateSuccess(
        "สร้างผู้ใช้สำเร็จ!",
        `ผู้ใช้ "${form.fullName}" ถูกสร้างเรียบร้อยแล้ว`
      );

      // Reset form and close dialog
      resetForm();
      setOpen(false);
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาดในการสร้างผู้ใช้";
      showError("เกิดข้อผิดพลาด", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button onClick={() => setOpen(true)}>เพิ่มผู้ใช้งาน</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="500px" className="p-6 bg-white rounded shadow">
        <Dialog.Title>เพิ่มผู้ใช้งาน</Dialog.Title>

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
                Email
              </Text>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                เบอร์โทรศัพท์ (ไม่บังคับ)
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
                เลือกสาขา (ไม่บังคับ)
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
                    {branch.location}{" "}
                    {branch.shortName !== null && branch.shortName !== ""
                      ? `(${branch.shortName})`
                      : ""}
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
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
