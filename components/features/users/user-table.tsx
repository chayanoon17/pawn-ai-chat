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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  Shield,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { deleteUser } from "@/services/user-service";
import {
  showDeleteConfirmation,
  showDeleteSuccess,
  showError,
} from "@/lib/sweetalert";
import type { User } from "@/types/auth";
import type { Role } from "@/types/role";

interface UserTableProps {
  users: User[];
  availableRoles: Role[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onUserDeleted: (userId: number) => void;
  onUserStatusChanged: (userId: number, newStatus: string) => void; // เพิ่ม callback สำหรับเปลี่ยนสถานะ
}

export function UserTable({
  users,
  availableRoles,
  searchTerm,
  onSearchChange,
  onCreateUser,
  onEditUser,
  onUserDeleted,
  onUserStatusChanged, // เพิ่ม callback สำหรับเปลี่ยนสถานะ
}: UserTableProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const totalRoles = availableRoles.length;

  // Handle delete user
  const handleDeleteUser = async (userId: number, userName: string) => {
    const result = await showDeleteConfirmation(
      "ลบผู้ใช้นี้?",
      `คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${userName}"?`,
      "ใช่, ลบเลย!",
      "ยกเลิก"
    );

    if (result.isConfirmed) {
      try {
        // เรียก API ลบ user (ซึ่งจริงๆ แล้วเป็นการเปลี่ยนสถานะเป็น DELETED)
        await deleteUser(userId.toString());

        // แทนที่จะลบออกจากหน้าจอ ให้อัปเดตสถานะเป็น DELETED แทน
        onUserStatusChanged(userId, "DELETED");

        showDeleteSuccess(
          "ลบผู้ใช้สำเร็จ!",
          `ผู้ใช้ "${userName}" ถูกลบเรียบร้อยแล้ว`
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        showError(
          "เกิดข้อผิดพลาด",
          "ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง"
        );
      }
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            ใช้งาน
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            ไม่ใช้งาน
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            ถูกระงับ
          </Badge>
        );
      case "DELETED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            ลบแล้ว
          </Badge>
        );
      case "PENDING_VERIFICATION":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            รอการยืนยัน
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            ไม่ระบุ
          </Badge>
        );
    }
  };

  return (
    <>
      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: ผู้ใช้ทั้งหมด */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                ผู้ใช้ทั้งหมด
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {users.length}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">ผู้ใช้ในระบบทั้งหมด</p>
        </div>

        {/* Card 2: ผู้ใช้ที่ใช้งาน */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                ผู้ใช้ที่ใช้งาน
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {activeUsers}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">ผู้ใช้ที่สามารถเข้าระบบได้</p>
        </div>

        {/* Card 3: ตำแหน่งทั้งหมด */}
        <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                ตำแหน่งทั้งหมด
              </p>
              <div className="text-xl font-semibold text-slate-800">
                {totalRoles}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">ตำแหน่งที่มีในระบบ</p>
        </div>
      </div>

      {/* 🔍 Search and Filter Section */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        {/* 📊 Header Section */}
        <CardHeader className="px-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-80">
                  รายการผู้ใช้
                </CardTitle>
                <span className="text-sm text-slate-500">
                  ค้นหาและจัดการผู้ใช้ในระบบ
                </span>
              </div>
            </div>
            {/* Create User Button */}
            <Button
              onClick={onCreateUser}
              className="bg-[#308AC7] hover:bg-[#3F99D8] text-white border-slate-200 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้ใหม่
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="ค้นหาผู้ใช้..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* 📋 Users Table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    ชื่อผู้ใช้
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    อีเมล
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    ตำแหน่ง
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    สาขา
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    สถานะ
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
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7} // ปรับตามจำนวนคอลัมน์ของตาราง
                      className="text-center py-8 text-slate-500"
                    >
                      ไม่พบข้อมูลผู้ใช้
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className="bg-slate-100 text-slate-600"
                        >
                          {user.role.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {user.branch
                          ? `${user.branch.location} (${user.branch.shortName})`
                          : "ไม่ระบุ"}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-slate-600 text-sm">
                        {new Date(user.updatedAt).toLocaleDateString("th-TH")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          {/* ปุ่ม Detail - แสดงเสมอ */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsViewDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* ปุ่ม Edit และ Delete - แสดงเฉพาะ user ที่ยังไม่ถูกลบ */}
                          {user.status !== "DELETED" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditUser(user)}
                                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteUser(user.id, user.fullName)
                                }
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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

      {/* 👁️ View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-slate-600" />
              <span>รายละเอียดผู้ใช้: {selectedUser?.fullName}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              ข้อมูลและสิทธิ์ของผู้ใช้นี้
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              {/* ข้อมูลพื้นฐาน */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>ข้อมูลพื้นฐาน</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ชื่อผู้ใช้
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-medium">
                      {selectedUser.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      สถานะ
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>อีเมล</span>
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>เบอร์โทร</span>
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedUser.phoneNumber || "ไม่ระบุ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลตำแหน่งและสาขา */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>ตำแหน่งและสาขา</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      ตำแหน่ง
                    </label>
                    <p className="text-sm text-slate-800 mt-1 font-medium">
                      {selectedUser.role.name}
                    </p>
                    {selectedUser.role.description && (
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedUser.role.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      สาขา
                    </label>
                    <p className="text-sm text-slate-800 mt-1">
                      {selectedUser.branch?.name || "ไม่ระบุ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* สิทธิ์การใช้งาน */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <h3 className="font-medium text-slate-700 mb-3 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>สิทธิ์การใช้งาน</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      สิทธิ์เข้าถึงเมนู
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUser.role.menuPermissions.length > 0 ? (
                        selectedUser.role.menuPermissions.map(
                          (menuPermission) => (
                            <span
                              key={menuPermission.id}
                              className="inline-flex items-center px-2 py-1 border border-green-500 rounded-full text-xs font-medium bg-green-100 text-green-700"
                            >
                              {menuPermission.name}
                            </span>
                          )
                        )
                      ) : (
                        <p className="text-sm text-slate-500">
                          ไม่มีสิทธิ์การเข้าถึงเมนู
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      สิทธิ์การจัดการ
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUser.role.permissions.length > 0 ? (
                        selectedUser.role.permissions.map((permission) => (
                          <span
                            key={permission.id}
                            className="inline-flex items-center px-2 py-1 border border-slate-400 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            {permission.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          ไม่มีสิทธิ์การจัดการ
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
