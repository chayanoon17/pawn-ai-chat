"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Shield,
  Settings,
  Eye,
} from "lucide-react";
import { getPermissions, getMenuPermissions } from "@/lib/api";
import {
  showDeleteConfirmation,
  showDeleteSuccess,
  showCreateSuccess,
  showUpdateSuccess,
  showError,
  showNetworkError,
  showWarning,
} from "@/lib/sweetalert";

// 🎯 Types for Role Management
interface Permission {
  id: number;
  name: string;
  description: string;
}

interface MenuPermission {
  id: number;
  name: string;
  description: string;
  menu?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  menuPermissions: MenuPermission[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

interface CreateRoleData {
  name: string;
  description: string;
  permissionIds: number[];
  menuPermissionIds: number[];
}

export default function RoleManagementPage() {
  // 🎯 State Management
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [availableMenuPermissions, setAvailableMenuPermissions] = useState<
    MenuPermission[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // 🎯 Form State
  const [newRole, setNewRole] = useState<CreateRoleData>({
    name: "",
    description: "",
    permissionIds: [],
    menuPermissionIds: [],
  });

  // 🎯 Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load permissions and menu permissions from API
        const [permissionsData, menuPermissionsData] = await Promise.all([
          getPermissions(),
          getMenuPermissions(),
        ]);

        setAvailablePermissions(permissionsData);
        setAvailableMenuPermissions(menuPermissionsData);

        // Mock roles data (will be replaced with API later)
        setRoles([
          {
            id: 1,
            name: "ผู้ดูแลระบบ",
            description: "มีสิทธิ์เข้าถึงทุกฟังก์ชันในระบบ",
            userCount: 2,
            permissions: [],
            menuPermissions: [],
            status: "ACTIVE",
            createdAt: "2025-01-20T10:00:00Z",
            updatedAt: "2025-01-20T10:00:00Z",
          },
          {
            id: 2,
            name: "ผู้จัดการ",
            description: "สามารถจัดการข้อมูลและดูรายงานได้",
            userCount: 5,
            permissions: [],
            menuPermissions: [],
            status: "ACTIVE",
            createdAt: "2025-01-20T10:00:00Z",
            updatedAt: "2025-01-20T10:00:00Z",
          },
          {
            id: 3,
            name: "พนักงาน",
            description: "สามารถดูข้อมูลพื้นฐานได้เท่านั้น",
            userCount: 12,
            permissions: [],
            menuPermissions: [],
            status: "ACTIVE",
            createdAt: "2025-01-20T10:00:00Z",
            updatedAt: "2025-01-20T10:00:00Z",
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        showNetworkError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 🎯 Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎯 Handle form submission
  const handleCreateRole = async () => {
    // Validation
    if (!newRole.name.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อตำแหน่ง");
      return;
    }

    if (!newRole.description.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกคำอธิบายตำแหน่ง");
      return;
    }

    try {
      // Simulate API call
      const newRoleData: Role = {
        id: roles.length + 1,
        name: newRole.name,
        description: newRole.description,
        userCount: 0,
        permissions: availablePermissions.filter((p) =>
          newRole.permissionIds.includes(p.id)
        ),
        menuPermissions: availableMenuPermissions.filter((mp) =>
          newRole.menuPermissionIds.includes(mp.id)
        ),
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRoles((prev) => [...prev, newRoleData]);
      setIsCreateDialogOpen(false);
      setNewRole({
        name: "",
        description: "",
        permissionIds: [],
        menuPermissionIds: [],
      });

      // แสดง SweetAlert2 success
      showCreateSuccess(
        "สร้างตำแหน่งสำเร็จ!",
        `ตำแหน่ง "${newRole.name}" ถูกสร้างเรียบร้อยแล้ว`
      );
    } catch (error) {
      console.error("Error creating role:", error);
      showError(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถสร้างตำแหน่งได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  // 🎯 Handle edit role submission
  const handleEditRole = async () => {
    if (!selectedRole) return;

    // Validation
    if (!newRole.name.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อตำแหน่ง");
      return;
    }

    if (!newRole.description.trim()) {
      showWarning("ข้อมูลไม่ครบถ้วน", "กรุณากรอกคำอธิบายตำแหน่ง");
      return;
    }

    try {
      // Simulate API call
      const updatedRoleData: Role = {
        ...selectedRole,
        name: newRole.name,
        description: newRole.description,
        permissions: availablePermissions.filter((p) =>
          newRole.permissionIds.includes(p.id)
        ),
        menuPermissions: availableMenuPermissions.filter((mp) =>
          newRole.menuPermissionIds.includes(mp.id)
        ),
        updatedAt: new Date().toISOString(),
      };

      setRoles((prev) =>
        prev.map((role) =>
          role.id === selectedRole.id ? updatedRoleData : role
        )
      );
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      setNewRole({
        name: "",
        description: "",
        permissionIds: [],
        menuPermissionIds: [],
      });

      // แสดง SweetAlert2 success
      showUpdateSuccess(
        "อัปเดตตำแหน่งสำเร็จ!",
        `ตำแหน่ง "${newRole.name}" ถูกอัปเดตเรียบร้อยแล้ว`
      );
    } catch (error) {
      console.error("Error updating role:", error);
      showError(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถอัปเดตตำแหน่งได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  };

  // 🎯 Handle delete role
  const handleDeleteRole = async (roleId: number, roleName: string) => {
    const result = await showDeleteConfirmation(
      "ลบตำแหน่งนี้?",
      `คุณแน่ใจหรือไม่ที่จะลบตำแหน่ง "${roleName}"?`,
      "ใช่, ลบเลย!",
      "ยกเลิก"
    );

    if (result.isConfirmed) {
      try {
        // Simulate API call
        setRoles((prev) => prev.filter((role) => role.id !== roleId));
        showDeleteSuccess(
          "ลบตำแหน่งสำเร็จ!",
          `ตำแหน่ง "${roleName}" ถูกลบเรียบร้อยแล้ว`
        );
      } catch (error) {
        console.error("Error deleting role:", error);
        showError(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถลบตำแหน่งได้ กรุณาลองใหม่อีกครั้ง"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 📊 Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการตำแหน่ง</h1>
          <p className="text-gray-600 mt-2">
            จัดการตำแหน่งและสิทธิ์การใช้งานระบบ
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มตำแหน่งใหม่
        </Button>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              ตำแหน่งทั้งหมด
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {roles.length}
            </div>
            <p className="text-xs text-blue-700">ตำแหน่งที่ใช้งานอยู่</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              ผู้ใช้ทั้งหมด
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </div>
            <p className="text-xs text-green-700">ผู้ใช้ที่มีตำแหน่งในระบบ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              สิทธิ์ทั้งหมด
            </CardTitle>
            <Settings className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {availablePermissions.length}
            </div>
            <p className="text-xs text-purple-700">สิทธิ์ที่มีในระบบ</p>
          </CardContent>
        </Card>
      </div>

      {/* 🔍 Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>รายการตำแหน่ง</CardTitle>
          <CardDescription>ค้นหาและจัดการตำแหน่งในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาตำแหน่ง..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 📋 Roles Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">
                    ชื่อตำแหน่ง
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    คำอธิบาย
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    จำนวนผู้ใช้
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    สถานะ
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    วันที่อัปเดต
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">
                    การจัดการ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {role.name}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-md truncate">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {role.userCount} คน
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          role.status === "ACTIVE" ? "default" : "secondary"
                        }
                        className={
                          role.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {role.status === "ACTIVE" ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(role.updatedAt).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsViewDialogOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setNewRole({
                              name: role.name,
                              description: role.description,
                              permissionIds: role.permissions.map((p) => p.id),
                              menuPermissionIds: role.menuPermissions.map(
                                (mp) => mp.id
                              ),
                            });
                            setIsEditDialogOpen(true);
                          }}
                          className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id, role.name)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ➕ Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>เพิ่มตำแหน่งใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลตำแหน่งใหม่และเลือกสิทธิ์การใช้งาน
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อตำแหน่ง</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="เช่น ผู้ดูแลระบบ"
                />
              </div>
              <div>
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="อธิบายหน้าที่และความรับผิดชอบ"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <Label className="text-base font-semibold">สิทธิ์การใช้งาน</Label>
              <p className="text-sm text-gray-600 mb-3">
                เลือกสิทธิ์ที่ตำแหน่งนี้จะมี
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={newRole.permissionIds.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole((prev) => ({
                            ...prev,
                            permissionIds: [
                              ...prev.permissionIds,
                              permission.id,
                            ],
                          }));
                        } else {
                          setNewRole((prev) => ({
                            ...prev,
                            permissionIds: prev.permissionIds.filter(
                              (id) => id !== permission.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="font-medium"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Permissions */}
            <div>
              <Label className="text-base font-semibold">
                สิทธิ์การเข้าถึงเมนู
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                เลือกเมนูที่ตำแหน่งนี้สามารถเข้าถึงได้
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {availableMenuPermissions.map((menuPermission) => (
                  <div
                    key={menuPermission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`menu-${menuPermission.id}`}
                      checked={newRole.menuPermissionIds.includes(
                        menuPermission.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole((prev) => ({
                            ...prev,
                            menuPermissionIds: [
                              ...prev.menuPermissionIds,
                              menuPermission.id,
                            ],
                          }));
                        } else {
                          setNewRole((prev) => ({
                            ...prev,
                            menuPermissionIds: prev.menuPermissionIds.filter(
                              (id) => id !== menuPermission.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`menu-${menuPermission.id}`}
                        className="font-medium"
                      >
                        {menuPermission.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {menuPermission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={!newRole.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              สร้างตำแหน่ง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 👁️ View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดตำแหน่ง: {selectedRole?.name}</DialogTitle>
            <DialogDescription>ข้อมูลและสิทธิ์ของตำแหน่งนี้</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">ชื่อตำแหน่ง</Label>
                  <p className="text-gray-700">{selectedRole.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">จำนวนผู้ใช้</Label>
                  <p className="text-gray-700">{selectedRole.userCount} คน</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">คำอธิบาย</Label>
                <p className="text-gray-700">{selectedRole.description}</p>
              </div>
              <div>
                <Label className="font-semibold">สิทธิ์การใช้งาน</Label>
                <div className="mt-2 space-y-2">
                  {selectedRole.permissions.length > 0 ? (
                    selectedRole.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {permission.name}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">ไม่มีสิทธิ์การใช้งาน</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="font-semibold">สิทธิ์การเข้าถึงเมนู</Label>
                <div className="mt-2 space-y-2">
                  {selectedRole.menuPermissions.length > 0 ? (
                    selectedRole.menuPermissions.map((menuPermission) => (
                      <div
                        key={menuPermission.id}
                        className="flex items-center space-x-2"
                      >
                        <Badge
                          variant="outline"
                          className="border-green-200 text-green-800"
                        >
                          {menuPermission.name}
                          {menuPermission.menu && ` (${menuPermission.menu})`}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">ไม่มีสิทธิ์การเข้าถึงเมนู</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✏️ Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขตำแหน่ง: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลตำแหน่งและสิทธิ์การใช้งาน
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">ชื่อตำแหน่ง</Label>
                <Input
                  id="edit-name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="เช่น ผู้ดูแลระบบ"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">คำอธิบาย</Label>
                <Textarea
                  id="edit-description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="อธิบายหน้าที่และความรับผิดชอบ"
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <Label className="text-base font-semibold">สิทธิ์การใช้งาน</Label>
              <p className="text-sm text-gray-600 mb-3">
                เลือกสิทธิ์ที่ตำแหน่งนี้จะมี
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`edit-permission-${permission.id}`}
                      checked={newRole.permissionIds.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole((prev) => ({
                            ...prev,
                            permissionIds: [
                              ...prev.permissionIds,
                              permission.id,
                            ],
                          }));
                        } else {
                          setNewRole((prev) => ({
                            ...prev,
                            permissionIds: prev.permissionIds.filter(
                              (id) => id !== permission.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`edit-permission-${permission.id}`}
                        className="font-medium"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Permissions */}
            <div>
              <Label className="text-base font-semibold">
                สิทธิ์การเข้าถึงเมนู
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                เลือกเมนูที่ตำแหน่งนี้สามารถเข้าถึงได้
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
                {availableMenuPermissions.map((menuPermission) => (
                  <div
                    key={menuPermission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`edit-menu-${menuPermission.id}`}
                      checked={newRole.menuPermissionIds.includes(
                        menuPermission.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole((prev) => ({
                            ...prev,
                            menuPermissionIds: [
                              ...prev.menuPermissionIds,
                              menuPermission.id,
                            ],
                          }));
                        } else {
                          setNewRole((prev) => ({
                            ...prev,
                            menuPermissionIds: prev.menuPermissionIds.filter(
                              (id) => id !== menuPermission.id
                            ),
                          }));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`edit-menu-${menuPermission.id}`}
                        className="font-medium"
                      >
                        {menuPermission.name}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {menuPermission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedRole(null);
                setNewRole({
                  name: "",
                  description: "",
                  permissionIds: [],
                  menuPermissionIds: [],
                });
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleEditRole}
              disabled={!newRole.name.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              บันทึกการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
