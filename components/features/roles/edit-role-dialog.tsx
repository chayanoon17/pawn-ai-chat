/**
 * Edit Role Dialog Component
 */

"use client";

import { useState, useEffect } from "react";
import { Shield, Menu as MenuIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import apiRequest from "@/lib/api";
import { toast } from "sonner";
import type {
  EditRoleDialogProps,
  Permission,
  MenuPermission,
  Branch,
} from "@/types";
import type { Role } from "@/types/role-management";

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  onRoleUpdated,
  canManagePermissions,
  canManageMenuPermissions,
}: EditRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // API Data
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [availableMenuPermissions, setAvailableMenuPermissions] = useState<
    MenuPermission[]
  >([]);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as number[],
    menuPermissions: [] as number[],
    branches: [] as number[],
  });

  // Load data from API when dialog opens
  useEffect(() => {
    if (open) {
      loadApiData();
      initializeFormData();
    }
  }, [open, role]);

  const loadApiData = async () => {
    setIsLoadingData(true);
    try {
      // Load permissions (if Super Admin)
      if (canManagePermissions) {
        const permissionsResponse = await apiRequest.get(
          "/api/v1/menu/permissions"
        );
        if (permissionsResponse.success) {
          setAvailablePermissions(permissionsResponse.data as Permission[]);
        }
      }

      // Load menu permissions (if Admin or Super Admin)
      if (canManageMenuPermissions) {
        const menuPermissionsResponse = await apiRequest.get(
          "/api/v1/menu/menu-permissions"
        );
        if (menuPermissionsResponse.success) {
          setAvailableMenuPermissions(
            menuPermissionsResponse.data as MenuPermission[]
          );
        }
      }

      // Load branches
      const branchesResponse = await apiRequest.get("/api/v1/menu/branches");
      if (branchesResponse.success) {
        setAvailableBranches(branchesResponse.data as Branch[]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoadingData(false);
    }
  };

  const initializeFormData = () => {
    setFormData({
      name: role.name || "",
      description: role.description || "",
      permissions: role.permissions?.map((p) => p.id) || [],
      menuPermissions: role.menuPermissions?.map((mp) => mp.id) || [],
      branches: [], // Role doesn't have branches property, will be loaded from API
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter((id) => id !== permissionId),
    }));
  };

  const handleMenuPermissionChange = (
    menuPermissionId: number,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      menuPermissions: checked
        ? [...prev.menuPermissions, menuPermissionId]
        : prev.menuPermissions.filter((id) => id !== menuPermissionId),
    }));
  };

  const handleBranchChange = (branchId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      branches: checked
        ? [...prev.branches, branchId]
        : prev.branches.filter((id) => id !== branchId),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("กรุณากรอกชื่อตำแหน่ง");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest.put(
        `/api/v1/menu/roles/${role.id}`,
        formData
      );

      if (response.success) {
        toast.success("อัปเดตตำแหน่งสำเร็จ");
        onRoleUpdated();
        onOpenChange(false);
      } else {
        toast.error(response.message || "เกิดข้อผิดพลาดในการอัปเดตตำแหน่ง");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตตำแหน่ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Group permissions by analyzing name content
  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const groups: Record<string, Permission[]> = {};

    permissions.forEach((permission) => {
      // Simple categorization based on permission name
      let category = "อื่นๆ";

      if (
        permission.name.includes("user") ||
        permission.name.includes("ผู้ใช้")
      ) {
        category = "จัดการผู้ใช้";
      } else if (
        permission.name.includes("role") ||
        permission.name.includes("ตำแหน่ง")
      ) {
        category = "จัดการตำแหน่ง";
      } else if (
        permission.name.includes("report") ||
        permission.name.includes("รายงาน")
      ) {
        category = "รายงาน";
      } else if (
        permission.name.includes("setting") ||
        permission.name.includes("ตั้งค่า")
      ) {
        category = "ตั้งค่าระบบ";
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  };

  if (isLoadingData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const permissionGroups = groupPermissionsByCategory(availablePermissions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>แก้ไขตำแหน่ง: {role.name}</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลตำแหน่งและสิทธิ์การเข้าถึง
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ข้อมูลพื้นฐาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อตำแหน่ง *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="กรอกชื่อตำแหน่ง"
                />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="กรอกคำอธิบายตำแหน่ง"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permissions Section - Only show if user can manage permissions */}
          {canManagePermissions && availablePermissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  สิทธิ์การใช้งาน
                </CardTitle>
                <CardDescription>
                  เลือกสิทธิ์ที่ต้องการให้กับตำแหน่งนี้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(permissionGroups).map(
                    ([category, permissions]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">{category}</Badge>
                          <span className="text-sm text-gray-500">
                            ({permissions.length} รายการ)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                            >
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={formData.permissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    permission.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={`permission-${permission.id}`}
                                  className="text-sm font-medium text-gray-900 cursor-pointer"
                                >
                                  {permission.name}
                                </label>
                                {permission.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {category !==
                          Object.keys(permissionGroups)[
                            Object.keys(permissionGroups).length - 1
                          ] && <Separator className="mt-4" />}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Permissions Section - Only show if user can manage menu permissions */}
          {canManageMenuPermissions && availableMenuPermissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MenuIcon className="w-4 h-4" />
                  สิทธิ์เมนู
                </CardTitle>
                <CardDescription>
                  เลือกเมนูที่ต้องการให้ตำแหน่งนี้เข้าถึงได้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableMenuPermissions.map((menuPermission) => (
                    <div
                      key={menuPermission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`menu-permission-${menuPermission.id}`}
                        checked={formData.menuPermissions.includes(
                          menuPermission.id
                        )}
                        onCheckedChange={(checked) =>
                          handleMenuPermissionChange(
                            menuPermission.id,
                            checked as boolean
                          )
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`menu-permission-${menuPermission.id}`}
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {menuPermission.name}
                        </label>
                        {menuPermission.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {menuPermission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Branches Section */}
          {availableBranches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>สาขาที่เข้าถึงได้</CardTitle>
                <CardDescription>
                  เลือกสาขาที่ตำแหน่งนี้สามารถเข้าถึงได้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableBranches.map((branch) => (
                    <div
                      key={branch.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`branch-${branch.id}`}
                        checked={formData.branches.includes(branch.id)}
                        onCheckedChange={(checked) =>
                          handleBranchChange(branch.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`branch-${branch.id}`}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {branch.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            ยกเลิก
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                กำลังอัปเดต...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                อัปเดตตำแหน่ง
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
