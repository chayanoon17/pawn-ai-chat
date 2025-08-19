"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getAllUsers } from "@/services/user-service";
import { getRoles } from "@/lib/api-service";
import type { User } from "@/types/auth";
import type { Role } from "@/types/role";
import { showNetworkError } from "@/lib/sweetalert";
import {
  UserTable,
  CreateUserDialog,
  EditUserDialog,
} from "@/components/features/users";
import { MenuPermissionGuard } from "@/components/core/permission-guard";

// 📝 API Response Interface
interface UsersResponse {
  users: User[];
  stats: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export default function UserManagementPage() {
  // 🎯 State Management
  const [users, setUsers] = useState<User[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 🎯 Load data from API
  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      // Load users and roles from API
      const [usersResponse, rolesData] = await Promise.all([
        getAllUsers({ page: 1, limit: 100 }) as Promise<UsersResponse>,
        getRoles(),
      ]);

      setUsers(usersResponse.users);
      setAvailableRoles(rolesData.roles);

      if (showLoading) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showNetworkError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🎯 Handle user creation
  const handleUserCreated = async () => {
    // Refresh ข้อมูลจาก API เพื่อให้แน่ใจว่าได้ข้อมูลที่ครบถ้วน
    await loadData(false); // ไม่แสดง loading state
  };

  // 🎯 Handle user update
  const handleUserUpdated = async () => {
    // Refresh ข้อมูลจาก API เพื่อให้แน่ใจว่าได้ข้อมูลที่ครบถ้วน
    await loadData(false); // ไม่แสดง loading state
  };

  // 🎯 Handle user deletion
  const handleUserDeleted = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  // 🎯 Handle user status change (สำหรับการลบที่เป็นการเปลี่ยนสถานะ)
  const handleUserStatusChanged = (userId: number, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: newStatus as User["status"] }
          : user
      )
    );
  };

  // 🎯 Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  // 🎯 Handle edit user dialog close
  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedUser(null);
    }
  };

  return (
    <MenuPermissionGuard
      requiredMenuPermission="User Management"
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-gray-600">
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้าจัดการผู้ใช้
            </p>
          </div>
        </div>
      }
    >
      <div>
        {isLoading ? (
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 space-y-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </Card>
              ))}
            </div>

            {/* User Table Skeleton */}
            <Card>
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <UserTable
              users={users}
              availableRoles={availableRoles}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onCreateUser={() => setIsCreateDialogOpen(true)}
              onEditUser={handleEditUser}
              onUserDeleted={handleUserDeleted}
              onUserStatusChanged={handleUserStatusChanged}
            />

            <CreateUserDialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              availableRoles={availableRoles}
              onUserCreated={handleUserCreated}
            />

            <EditUserDialog
              open={isEditDialogOpen}
              onOpenChange={handleEditDialogClose}
              selectedUser={selectedUser}
              availableRoles={availableRoles}
              onUserUpdated={handleUserUpdated}
            />
          </div>
        )}
      </div>
    </MenuPermissionGuard>
  );
}
