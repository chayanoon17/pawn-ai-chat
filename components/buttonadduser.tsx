"use client";

import { Dialog, Button, TextField, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";

const BRANCHES = [
  "ทั้งหมด",
  "สะพานขาว",
  "หนองจอก",
  "บางซื่อ",
  "บางแค",
  "สาธุประดิษฐ์",
  "บางขุนเทียน",
  "หลักสี่",
  "ม.เกษตร",
  "ธนบุรี-ปากท่อ",
  "ห้วยขวาง",
  "บางกะปิ",
  "สะพานพุทธ",
  "อุดมสุข",
  "ดอนเมือง",
  "สุวินทวงศ์",
  "ปากเกร็ด",
  "บางบอน",
  "หนองแขม",
  "ทุ่งสองห้อง",
  "รามอินทรา",
  "ระยอง",
  "พัฒนาการ",
  "ลาดกระบัง",
  "สายไหม",
  "ทุ่งครุ",
  "สมุทรปราการ",
  "นนทบุรี",
  "ประตูน้ำ",
];
const STATUSES = ["ทั้งหมด", "กำลังดำเนินการ", "เสร็จสิ้น"];

export default function EditProfileDialog() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectFilter, setSelectFilter] = useState("");
  const [showSelect, setShowSelect] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

  const handleFilter = () => {
    console.log("🟢 Filtered values:", {
      branch: selectedBranch,
      status: selectedStatus,
    });
  }

  return (
    <div className="flex">
       <Dialog.Root>
      <Dialog.Trigger>
        <Button>Filter</Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">กรองข้อมูล</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">สาขา</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สถานะ</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

<Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleFilter}>Save</Button>
            </Dialog.Close>
          </Flex>

      </Dialog.Content>
    </Dialog.Root>
      <Dialog.Root>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                   rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                   w-full p-2 dark:bg-gray-700 dark:border-gray-600 
                   dark:placeholder-gray-400 dark:text-white 
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Oidest">Oidest</option>
          <option value="Newest">Newest</option>
        </select>
        <Dialog.Trigger>
          <Button>Add User</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>เพิ่มผู้ใช้งาน</Dialog.Title>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                ชื่อผู้ใช้งาน
              </Text>
              <TextField.Root
                defaultValue="Freja Johnsen"
                placeholder="Enter your full name"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                defaultValue="freja@example.com"
                placeholder="Enter your email"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                เลือกสาขา
              </Text>
              <div>
                <select
                  id="branch"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                   rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                   w-full p-2 dark:bg-gray-700 dark:border-gray-600 
                   dark:placeholder-gray-400 dark:text-white 
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role
              </Text>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                   rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                   w-full p-2 dark:bg-gray-700 dark:border-gray-600 
                   dark:placeholder-gray-400 dark:text-white 
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option defaultValue="">เลือก</option>
                <option value="US">User</option>
                <option value="CA">Admin</option>
                <option value="FR">Manager</option>
                <option value="DE">Full admin</option>
              </select>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                   rounded-lg focus:ring-blue-500 focus:border-blue-500 block 
                   w-full p-2 dark:bg-gray-700 dark:border-gray-600 
                   dark:placeholder-gray-400 dark:text-white 
                   dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option defaultValue="">เลือก</option>
                <option value="US">Active</option>
                <option value="CA">inavtive</option>
              </select>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
