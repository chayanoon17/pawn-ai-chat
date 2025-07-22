"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { fromTheme } from "tailwind-merge";
import { registerUser } from "@/lib/auth-service";

const BRANCHES = [
  { id: 1, name: "สะพานขาว" },
  { id: 2, name: "หนองจอก" },
  { id: 3, name: "บางซื่อ" },
  { id: 4, name: "บางแค" },
  { id: 5, name: "สาธุประดิษฐ์" },
  { id: 6, name: "บางขุนเทียน" },
  { id: 7, name: "หลักสี่" },
  { id: 8, name: "ม.เกษตร" },
  { id: 9, name: "ธนบุรี-ปากท่อ" },
  { id: 10, name: "ห้วยขวาง" },
  { id: 11, name: "บางกะปิ" },
  { id: 12, name: "สะพานพุทธ" },
  { id: 13, name: "อุดมสุข" },
  { id: 14, name: "ดอนเมือง" },
  { id: 15, name: "สุวินทวงศ์" },
  { id: 16, name: "ปากเกร็ด" },
  { id: 17, name: "บางบอน" },
  { id: 18, name: "หนองแขม" },
  { id: 19, name: "ทุ่งสองห้อง" },
  { id: 20, name: "รามอินทรา" },
  { id: 21, name: "ระยอง" },
  { id: 22, name: "พัฒนาการ" },
  { id: 23, name: "ลาดกระบัง" },
  { id: 24, name: "สายไหม" },
  { id: 25, name: "ทุ่งครุ" },
  { id: 26, name: "สมุทรปราการ" },
  { id: 27, name: "นนทบุรี" },
  { id: 28, name: "ประตูน้ำ" },
];

const ROLES = [
  { id: 1, name: "User" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Manager" },
  { id: 4, name: "Full admin" },
];

const STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

export default function EditProfileDialog() {

const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    branch: "",
    role: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        branch: Number(form.branch),
        role: Number(form.role),
        status: form.status,
      };

      const res = await registerUser(payload);
      setMessage(res.message || "สมัครสมาชิกสำเร็จ");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Add User</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px" className="p-6 bg-white rounded shadow">
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            required
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
            className="w-full p-2 border rounded"
            required
          >
            <option value="">เลือก</option>
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
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">เลือก</option>
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
            className="w-full p-2 border rounded"
            required
          >
            <option value="">เลือก</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </Flex>

      {message && (
        <Text color="gray" mt="3">
          {message}
        </Text>
      )}

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="soft" color="gray" type="button">
            Cancel
          </Button>
        </Dialog.Close>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Flex>
    </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
