"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, FileText, Mail, Lock, Briefcase } from "lucide-react";
import { createUser } from "@/lib/auth-service";
import { showCreateSuccess, showError, showWarning } from "@/lib/sweetalert";
import type { User } from "@/types/auth";
import type { Role } from "@/types/role";

interface CreateUserData {
  email: string;
  fullName: string;
  phoneNumber?: string;
  password: string;
  roleId: number;
  branchId: number;
  status: "ACTIVE" | "INACTIVE";
}

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRoles: Role[];
  onUserCreated: (newUser: User) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  availableRoles,
  onUserCreated,
}: CreateUserDialogProps) {
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    roleId: 0,
    branchId: 1, // Default branch ID
    status: "ACTIVE",
  });

  const handleCreateUser = async () => {
    // Validation
    if (!createUserData.email.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกอีเมล");
      return;
    }

    if (!createUserData.fullName.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (!createUserData.password.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกรหัสผ่าน");
      return;
    }

    if (createUserData.roleId === 0) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณาเลือกตำแหน่ง");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserData.email)) {
      showWarning("รูปแบบไม่ถูกต้อง", "กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    // Password validation
    if (createUserData.password.length < 6) {
      showWarning("รหัสผ่านไม่ปลอดภัย", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      // เรียก API สร้าง user
      const newUserData = (await createUser(createUserData)) as User;

      // เรียก callback function
      onUserCreated(newUserData);

      // ปิด dialog และรีเซ็ตฟอร์ม
      onOpenChange(false);
      setCreateUserData({
        email: "",
        fullName: "",
        phoneNumber: "",
        password: "",
        roleId: 0,
        branchId: 1,
        status: "ACTIVE",
      });

      // แสดง SweetAlert2 success
      showCreateSuccess(
        "สร้างผู้ใช้สำเร็จ!",
        `ผู้ใช้ "${createUserData.fullName}" ถูกสร้างเรียบร้อยแล้ว`
      );
    } catch (error) {
      console.error("Error creating user:", error);
      showError(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถสร้างผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCreateUserData({
      email: "",
      fullName: "",
      phoneNumber: "",
      password: "",
      roleId: 0,
      branchId: 1,
      status: "ACTIVE",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-600" />
            <span>เพิ่มผู้ใช้ใหม่</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            กรอกข้อมูลผู้ใช้ใหม่และเลือกตำแหน่ง
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>ข้อมูลพื้นฐาน</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="fullName"
                  value={createUserData.fullName}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="เช่น นายสมชาย ใจดี"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>ข้อมูลติดต่อ</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={createUserData.email}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="example@company.com"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  เบอร์โทร (ไม่บังคับ)
                </Label>
                <Input
                  id="phoneNumber"
                  value={createUserData.phoneNumber}
                  onChange={(e) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="0812345678"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>ความปลอดภัย</span>
            </h3>
            <div>
              <Label
                htmlFor="password"
                className="text-xs font-medium text-slate-500 uppercase tracking-wide"
              >
                รหัสผ่าน
              </Label>
              <Input
                id="password"
                type="password"
                value={createUserData.password}
                onChange={(e) =>
                  setCreateUserData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* Role Assignment */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>ตำแหน่งและสาขา</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <Label
                  htmlFor="roleId"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  ตำแหน่ง
                </Label>
                <Select
                  value={
                    createUserData.roleId > 0
                      ? createUserData.roleId.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      roleId: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                    <SelectValue placeholder="เลือกตำแหน่ง" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="branchId"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  สาขา
                </Label>
                <Select
                  value={createUserData.branchId.toString()}
                  onValueChange={(value) =>
                    setCreateUserData((prev) => ({
                      ...prev,
                      branchId: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">สาขาหลัก</SelectItem>
                    {/* Add more branches as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreateUser}
            disabled={
              !createUserData.fullName.trim() || !createUserData.email.trim()
            }
            className="bg-[#308AC7] hover:bg-[#3F99D8] text-white"
          >
            สร้างผู้ใช้
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
