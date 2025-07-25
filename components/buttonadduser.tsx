"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { createUser, getRoles, getBranches } from "@/lib/auth-service";

interface EditProfileDialogProps {
  onUserCreated?: () => void;
}

interface Role {
  id: number;
  name: string;
  description?: string;
}

interface Branch {
  id: number;
  name: string;
  shortName: string;
  location: string;
}

export default function EditProfileDialog({
  onUserCreated,
}: EditProfileDialogProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    branch: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  // Load branches and roles when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [branchesResponse, rolesResponse] = await Promise.all([
          getBranches(),
          getRoles(),
        ]);
        setBranches(branchesResponse || []);
        setRoles(rolesResponse || []);
      } catch (error) {
        console.error("Error loading branches and roles:", error);
      } finally {
        setLoadingData(false);
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
      branch: "",
      role: "",
    });
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber || undefined,
        branchId: Number(form.branch),
        roleId: Number(form.role),
        status: "ACTIVE" as "ACTIVE", // Always set to ACTIVE for new users
      };

      const response = await createUser(payload);
      setMessage("เพิ่มผู้ใช้สำเร็จ");

      // Reset form and close dialog
      setTimeout(() => {
        resetForm();
        setOpen(false);
        if (onUserCreated) {
          onUserCreated();
        }
      }, 1500);
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "เกิดข้อผิดพลาด");
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
                เลือกสาขา
              </Text>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือกสาขา</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id.toString()}>
                    {b.location}{" "}
                    {b.shortName !== null && b.shortName !== ""
                      ? `(${b.shortName})`
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
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">เลือกตำแหน่ง</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id.toString()}>
                    {r.name}
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
