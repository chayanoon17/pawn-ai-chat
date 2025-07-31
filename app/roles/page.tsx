"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { getPermissions, getMenuPermissions, getRoles } from "@/lib/api";
import type { Role as RoleManagement } from "@/types/role";
import { showNetworkError } from "@/lib/sweetalert";
import type { Permission, MenuPermission } from "@/types/role";
import {
  RoleTable,
  CreateRoleDialog,
  EditRoleDialog,
} from "@/components/features/roles";

export default function RoleManagementPage() {
  // 🎯 State Management
  const [roles, setRoles] = useState<RoleManagement[]>([]);
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
  const [selectedRole, setSelectedRole] = useState<RoleManagement | null>(null);

  // 🎯 Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load permissions and menu permissions from API
        const [permissionsData, menuPermissionsData, rolesData] =
          await Promise.all([
            getPermissions(),
            getMenuPermissions(),
            getRoles(),
          ]);

        setAvailablePermissions(permissionsData);
        setAvailableMenuPermissions(menuPermissionsData);
        setRoles(rolesData.roles);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        showNetworkError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 🎯 Handle role creation
  const handleRoleCreated = (newRole: RoleManagement) => {
    setRoles((prev) => [...prev, newRole]);
  };

  // 🎯 Handle role update
  const handleRoleUpdated = (updatedRole: RoleManagement) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === updatedRole.id ? updatedRole : role))
    );
  };

  // 🎯 Handle role deletion
  const handleRoleDeleted = (roleId: number) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId));
  };

  // 🎯 Handle edit role
  const handleEditRole = (role: RoleManagement) => {
    setSelectedRole(role);
    setIsEditDialogOpen(true);
  };

  // 🎯 Handle edit role dialog close
  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedRole(null);
    }
  };

  return (
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
          <RoleTable
            roles={roles}
            availablePermissions={availablePermissions}
            availableMenuPermissions={availableMenuPermissions}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onCreateRole={() => setIsCreateDialogOpen(true)}
            onEditRole={handleEditRole}
            onRoleDeleted={handleRoleDeleted}
          />

          <CreateRoleDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            availablePermissions={availablePermissions}
            availableMenuPermissions={availableMenuPermissions}
            onRoleCreated={handleRoleCreated}
          />

          <EditRoleDialog
            open={isEditDialogOpen}
            onOpenChange={handleEditDialogClose}
            selectedRole={selectedRole}
            availablePermissions={availablePermissions}
            availableMenuPermissions={availableMenuPermissions}
            onRoleUpdated={handleRoleUpdated}
          />
        </div>
      )}
    </div>
  );
}
