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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, FileText, LayoutGrid, KeyRound } from "lucide-react";
import { createRole } from "@/services/role-service";
import { usePermissions } from "@/hooks/use-permissions";
import { showCreateSuccess, showError, showWarning } from "@/lib/sweetalert";
import type {
  Permission,
  MenuPermission,
  CreateRoleData,
  Role,
} from "@/types/role";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePermissions: Permission[];
  availableMenuPermissions: MenuPermission[];
  onRoleCreated: (newRole: Role) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  availablePermissions,
  availableMenuPermissions,
  onRoleCreated,
}: CreateRoleDialogProps) {
  const { isSuperAdmin, isAdmin } = usePermissions();

  const [createRoleData, setCreateRoleData] = useState<CreateRoleData>({
    name: "",
    description: "",
    permissionIds: [],
    menuPermissionIds: [],
  });

  const handleCreateRole = async () => {
    // Validation
    if (!createRoleData.name.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อตำแหน่ง");
      return;
    }

    if (!createRoleData.description.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกคำอธิบายตำแหน่ง");
      return;
    }

    try {
      // เรียก API สร้าง role
      const newRoleData = await createRole(createRoleData);

      // เรียก callback function
      onRoleCreated(newRoleData);

      // ปิด dialog และรีเซ็ตฟอร์ม
      onOpenChange(false);
      setCreateRoleData({
        name: "",
        description: "",
        permissionIds: [],
        menuPermissionIds: [],
      });

      // แสดง SweetAlert2 success
      showCreateSuccess(
        "สร้างตำแหน่งสำเร็จ!",
        `ตำแหน่ง "${createRoleData.name}" ถูกสร้างเรียบร้อยแล้ว`
      );
    } catch (error) {
      console.error("Error creating role:", error);
      showError(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถสร้างตำแหน่งได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setCreateRoleData({
      name: "",
      description: "",
      permissionIds: [],
      menuPermissionIds: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-slate-600" />
            <span>เพิ่มตำแหน่งใหม่</span>
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            กรอกข้อมูลตำแหน่งใหม่และเลือกสิทธิ์การใช้งาน
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>ข้อมูลพื้นฐาน</span>
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  ชื่อตำแหน่ง
                </Label>
                <Input
                  id="name"
                  value={createRoleData.name}
                  onChange={(e) =>
                    setCreateRoleData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="เช่น ผู้ดูแลระบบ"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-xs font-medium text-slate-500 uppercase tracking-wide"
                >
                  คำอธิบาย
                </Label>
                <Textarea
                  id="description"
                  value={createRoleData.description}
                  onChange={(e) =>
                    setCreateRoleData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="อธิบายหน้าที่และความรับผิดชอบ"
                  className="bg-white mt-1 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Menu Permissions - Super Admin และ Admin */}
          {(isSuperAdmin() || isAdmin()) && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4 text-slate-500" />
                <span>สิทธิ์การเข้าถึงเมนู</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                เลือกเมนูที่ตำแหน่งนี้สามารถเข้าถึงได้ (Super Admin และ Admin)
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-white">
                {availableMenuPermissions.map((menuPermission) => (
                  <div
                    key={menuPermission.id}
                    className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded"
                  >
                    <Checkbox
                      id={`menu-${menuPermission.id}`}
                      checked={(
                        createRoleData.menuPermissionIds || []
                      ).includes(menuPermission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCreateRoleData((prev) => ({
                            ...prev,
                            menuPermissionIds: [
                              ...(prev.menuPermissionIds || []),
                              menuPermission.id,
                            ],
                          }));
                        } else {
                          setCreateRoleData((prev) => ({
                            ...prev,
                            menuPermissionIds: (
                              prev.menuPermissionIds || []
                            ).filter((id) => id !== menuPermission.id),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`menu-${menuPermission.id}`}
                        className="text-sm font-medium text-slate-700"
                      >
                        {menuPermission.name}
                      </Label>
                      <p className="text-xs text-slate-500">
                        {menuPermission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Permissions - เฉพาะ Super Admin เท่านั้น */}
          {isSuperAdmin() && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-slate-500" />
                <span>สิทธิ์การใช้งาน</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                เลือกสิทธิ์ที่ตำแหน่งนี้จะมี (เฉพาะ Super Admin)
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-white">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded"
                  >
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={(createRoleData.permissionIds || []).includes(
                        permission.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCreateRoleData((prev) => ({
                            ...prev,
                            permissionIds: [
                              ...(prev.permissionIds || []),
                              permission.id,
                            ],
                          }));
                        } else {
                          setCreateRoleData((prev) => ({
                            ...prev,
                            permissionIds: (prev.permissionIds || []).filter(
                              (id) => id !== permission.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-medium text-slate-700"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-xs text-slate-500">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            onClick={handleCreateRole}
            disabled={!createRoleData.name.trim()}
            className="bg-[#308AC7] hover:bg-[#3F99D8] text-white"
          >
            สร้างตำแหน่ง
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
