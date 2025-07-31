"use client";

import { useState, useEffect } from "react";
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
import { Users, FileText, Mail, Briefcase } from "lucide-react";
import { updateUser } from "@/lib/auth-service";
import { getMenuBranches } from "@/lib/api";
import { showUpdateSuccess, showError, showWarning } from "@/lib/sweetalert";
import type { User, Branch } from "@/types/auth";
import type { Role } from "@/types/role";
import type { UserStatus } from "@/types/common";

interface UpdateUserData {
  email: string;
  fullName: string;
  phoneNumber?: string;
  roleId: number;
  branchId: number | null;
  status: UserStatus;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  availableRoles: Role[];
  onUserUpdated: (updatedUser: User) => Promise<void>;
}

export function EditUserDialog({
  open,
  onOpenChange,
  selectedUser,
  availableRoles,
  onUserUpdated,
}: EditUserDialogProps) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [specifyBranch, setSpecifyBranch] = useState(false);
  const [editUserData, setEditUserData] = useState<UpdateUserData>({
    email: "",
    fullName: "",
    phoneNumber: "",
    roleId: 0,
    branchId: null,
    status: "ACTIVE",
  });

  // Load branches when dialog opens
  useEffect(() => {
    if (open) {
      const loadBranches = async () => {
        setLoadingBranches(true);
        try {
          const branchData = await getMenuBranches();
          setBranches(branchData);
        } catch (error) {
          console.error("Failed to load branches:", error);
          showError("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลสาขาได้");
        } finally {
          setLoadingBranches(false);
        }
      };
      loadBranches();
    }
  }, [open]);

  // Update form data when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      const hasBranch = !!(selectedUser.branchId && selectedUser.branchId > 0);
      setSpecifyBranch(hasBranch);
      setEditUserData({
        email: selectedUser.email,
        fullName: selectedUser.fullName,
        phoneNumber: selectedUser.phoneNumber || "",
        roleId: selectedUser.roleId,
        branchId: hasBranch ? selectedUser.branchId : null,
        status: selectedUser.status,
      });
    }
  }, [selectedUser]);

  const handleEditUser = async () => {
    if (!selectedUser) return;

    // Validation
    if (!editUserData.email.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกอีเมล");
      return;
    }

    if (!editUserData.fullName.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อผู้ใช้");
      return;
    }

    if (editUserData.roleId === 0) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณาเลือกตำแหน่ง");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUserData.email)) {
      showWarning("รูปแบบไม่ถูกต้อง", "กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }

    setIsUpdating(true);
    try {
      // เตรียมข้อมูลสำหรับส่ง API โดยแปลง null เป็น undefined
      const dataToSend = {
        ...editUserData,
        branchId: editUserData.branchId ?? undefined,
      };

      console.log("Updating user with data:", dataToSend);

      // เรียก API อัปเดต user
      const updatedUserData = (await updateUser(
        selectedUser.id.toString(),
        dataToSend
      )) as User;

      // เรียก callback function
      await onUserUpdated(updatedUserData);

      // ปิด dialog
      onOpenChange(false);

      // แสดง SweetAlert2 success
      showUpdateSuccess(
        "อัปเดตผู้ใช้สำเร็จ!",
        `ข้อมูลผู้ใช้ "${editUserData.fullName}" ถูกอัปเดตเรียบร้อยแล้ว`
      );
    } catch (error) {
      console.error("Error updating user:", error);
      showError(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถอัปเดตผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Don't reset form data here, let parent component handle it
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-600" />
            <span>แก้ไขผู้ใช้: {selectedUser?.fullName}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            แก้ไขข้อมูลผู้ใช้และตำแหน่ง
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>ข้อมูลพื้นฐาน</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="edit-fullName"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="edit-fullName"
                  value={editUserData.fullName}
                  onChange={(e) =>
                    setEditUserData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="เช่น นายสมชาย ใจดี"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-status"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  สถานะ
                </Label>
                <Select
                  value={editUserData.status}
                  onValueChange={(value: UserStatus) =>
                    setEditUserData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ใช้งาน</SelectItem>
                    <SelectItem value="INACTIVE">ไม่ใช้งาน</SelectItem>
                    <SelectItem value="SUSPENDED">ถูกระงับ</SelectItem>
                  </SelectContent>
                </Select>
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
                  htmlFor="edit-email"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  อีเมล
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData((prev) => ({
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
                  htmlFor="edit-phoneNumber"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  เบอร์โทร (ไม่บังคับ)
                </Label>
                <Input
                  id="edit-phoneNumber"
                  value={editUserData.phoneNumber}
                  onChange={(e) =>
                    setEditUserData((prev) => ({
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

          {/* Role Assignment */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>ตำแหน่งและสาขา</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <Label
                  htmlFor="edit-roleId"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  ตำแหน่ง
                </Label>
                <Select
                  value={
                    editUserData.roleId > 0
                      ? editUserData.roleId.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setEditUserData((prev) => ({
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
                  htmlFor="edit-specifyBranch"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  สาขา
                </Label>
                <Select
                  value={specifyBranch ? "specify" : "not-specify"}
                  onValueChange={(value) => {
                    const shouldSpecify = value === "specify";
                    setSpecifyBranch(shouldSpecify);
                    if (!shouldSpecify) {
                      setEditUserData((prev) => ({
                        ...prev,
                        branchId: null,
                      }));
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                    <SelectValue placeholder="เลือกการระบุสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-specify">ไม่ระบุสาขา</SelectItem>
                    <SelectItem value="specify">ระบุสาขา</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Branch selection - only show when specifyBranch is true */}
            {specifyBranch && (
              <div className="mt-4">
                <Label
                  htmlFor="edit-branchId"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  เลือกสาขา
                </Label>
                <Select
                  value={
                    editUserData.branchId && editUserData.branchId > 0
                      ? editUserData.branchId.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setEditUserData((prev) => ({
                      ...prev,
                      branchId: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500">
                    <SelectValue placeholder="เลือกสาขา" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingBranches ? (
                      <SelectItem value="loading" disabled>
                        กำลังโหลดข้อมูลสาขา...
                      </SelectItem>
                    ) : branches.length > 0 ? (
                      branches.map((branch) => (
                        <SelectItem
                          key={branch.id}
                          value={branch.id.toString()}
                        >
                          {branch.location} ({branch.shortName})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        ไม่พบข้อมูลสาขา
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleEditUser}
            disabled={
              !editUserData.fullName.trim() ||
              !editUserData.email.trim() ||
              isUpdating
            }
            className="bg-[#308AC7] hover:bg-[#3F99D8] text-white"
          >
            {isUpdating ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
