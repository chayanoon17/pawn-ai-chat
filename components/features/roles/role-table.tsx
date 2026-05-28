"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Briefcase,
  LayoutGrid,
  KeyRound,
  Users,
} from "lucide-react";
import { deleteRole } from "@/services/role-service";
import {
  showDeleteConfirmation,
  showDeleteSuccess,
  showError,
} from "@/lib/sweetalert";
import type { Role, Permission, MenuPermission } from "@/types/role";

interface RoleTableProps {
  roles: Role[];
  availablePermissions: Permission[];
  availableMenuPermissions: MenuPermission[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onRoleDeleted: (roleId: number) => void;
}

export function RoleTable({
  roles,
  availablePermissions,
  availableMenuPermissions,
  searchTerm,
  onSearchChange,
  onCreateRole,
  onEditRole,
  onRoleDeleted,
}: RoleTableProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete role
  const handleDeleteRole = async (roleId: number, roleName: string) => {
    const result = await showDeleteConfirmation(
      "ลบตำแหน่งนี้?",
      `คุณแน่ใจหรือไม่ที่จะลบตำแหน่ง "${roleName}"?`,
      "ใช่, ลบเลย!",
      "ยกเลิก"
    );

    if (result.isConfirmed) {
      try {
        // เรียก API ลบ role
        await deleteRole(roleId);

        // เรียก callback function
        onRoleDeleted(roleId);

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

  return (
    <>
      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Card 1: ตำแหน่งทั้งหมด */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                ตำแหน่งทั้งหมด
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {roles.length}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">ตำแหน่งที่ใช้งานอยู่</p>
        </div>

        {/* Card 2: ผู้ใช้ทั้งหมด */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                ผู้ใช้ทั้งหมด
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {roles.reduce((sum, role) => sum + (role.userCount ?? 0), 0)}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">ผู้ใช้ที่มีตำแหน่งในระบบ</p>
        </div>

        {/* Card 3: สิทธิ์การเข้าถึงเมนู */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-full">
              <LayoutGrid className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                สิทธิ์เมนู
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {availableMenuPermissions.length}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            สิทธิ์การเข้าถึงเมนูที่มีในระบบ
          </p>
        </div>

        {/* Card 4: สิทธิ์การจัดการ */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <KeyRound className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                สิทธิ์จัดการ
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {availablePermissions.length}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">สิทธิ์การจัดการที่มีในระบบ</p>
        </div>
      </div>

      {/* 🔍 Search and Filter Section */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        {/* 📊 Header Section */}
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-80">
                  รายการตำแหน่ง
                </CardTitle>
                <span className="text-sm text-slate-500">
                  ค้นหาและจัดการตำแหน่งในระบบ
                </span>
              </div>
            </div>
            {/* Create Role Button */}
            <Button
              onClick={onCreateRole}
              className="bg-[#308AC7] hover:bg-[#3F99D8] text-white border-slate-200 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มตำแหน่งใหม่
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาตำแหน่ง..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* 📋 Roles Table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    ชื่อตำแหน่ง
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    คำอธิบาย
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    จำนวนผู้ใช้
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    วันที่อัปเดต
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">
                    จัดการ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7} // ปรับตามจำนวนคอลัมน์ของตาราง
                      className="text-center py-8 text-slate-500"
                    >
                      ไม่พบข้อมูลตำแหน่ง
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">
                        {role.name}
                      </TableCell>
                      <TableCell className="text-slate-600 max-w-md truncate">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {role.userCount ?? 0} คน
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {new Date(role.updatedAt).toLocaleDateString("th-TH")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRole(role);
                              setIsViewDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditRole(role)}
                            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 👁️ View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-slate-600" />
              <span>รายละเอียดตำแหน่ง: {selectedRole?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              ข้อมูลและสิทธิ์ของตำแหน่งนี้
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-4">
              {/* ข้อมูลพื้นฐาน */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>ข้อมูลพื้นฐาน</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ชื่อตำแหน่ง
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-medium">
                      {selectedRole.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      จำนวนผู้ใช้
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedRole.userCount ?? 0} คน
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      คำอธิบาย
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedRole.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* สิทธิ์การเข้าถึงเมนู */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-slate-500" />
                  <span>สิทธิ์การเข้าถึงเมนู</span>
                </h3>
                <div className="space-y-2">
                  {selectedRole.menuPermissions.length > 0 ? (
                    selectedRole.menuPermissions.map((menuPermission) => (
                      <div
                        key={menuPermission.id}
                        className="flex items-center space-x-2"
                      >
                        <span className="inline-flex items-center px-2 py-1 border border-green-500 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {menuPermission.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      ไม่มีสิทธิ์การเข้าถึงเมนู
                    </p>
                  )}
                </div>
              </div>

              {/* สิทธิ์การใช้งาน */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  <span>สิทธิ์การใช้งาน</span>
                </h3>
                <div className="space-y-2">
                  {selectedRole.permissions.length > 0 ? (
                    selectedRole.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <span className="inline-flex items-center px-2 py-1 border border-slate-400 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {permission.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      ไม่มีสิทธิ์การใช้งาน
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
