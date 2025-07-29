/**
 * Role Management Component
 */

"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { RoleTable } from "./role-table";
import { CreateRoleDialog } from "./create-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";
import type { Role } from "@/types/role-management";

export function RoleManagement() {
  const { user } = useMenuPermissions();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check user permissions
  const isAdmin = user?.role?.name === "Admin";
  const isSuperAdmin = user?.role?.name === "Super Admin";
  const canManagePermissions = isSuperAdmin; // เฉพาะ Super Admin เท่านั้นจึงจัดการ permissions ได้
  const canManageMenuPermissions = isAdmin || isSuperAdmin; // Admin และ Super Admin จัดการ menu permissions ได้

  // Load roles
  useEffect(() => {
    loadRoles();
  }, [refreshTrigger]);

  const loadRoles = async () => {
    try {
      setIsLoading(true);

      // Call actual API
      const response = await fetch("/api/v1/menu/roles");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Assuming API returns { roles: Role[] } or just Role[]
      const rolesData = data.roles || data;
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to load roles:", error);

      // Fallback to empty array or show error message
      setRoles([]);

      // Optional: Show error notification
      // You can use your notification system here
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowCreateDialog(false);
  };

  const handleRoleUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setEditingRole(null);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
  };

  const handleDeleteRole = async (roleId: number) => {
    // TODO: Implement delete role
    console.log("Delete role:", roleId);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการตำแหน่ง</h1>
          <p className="text-gray-600 mt-2">
            จัดการตำแหน่งและสิทธิ์การใช้งานระบบ
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มตำแหน่งใหม่</span>
        </Button>
      </div>

      {/* Permission Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card
          className={`border-2 ${
            canManagePermissions
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`text-sm ${
                canManagePermissions ? "text-green-900" : "text-gray-600"
              }`}
            >
              Permission Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-sm ${
                canManagePermissions ? "text-green-800" : "text-gray-600"
              }`}
            >
              {canManagePermissions
                ? "✅ คุณสามารถกำหนด Permissions ให้กับ Role ได้"
                : "❌ เฉพาะ Super Admin เท่านั้นที่สามารถกำหนด Permissions ได้"}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-2 ${
            canManageMenuPermissions
              ? "border-blue-200 bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`text-sm ${
                canManageMenuPermissions ? "text-blue-900" : "text-gray-600"
              }`}
            >
              Menu Permission Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-sm ${
                canManageMenuPermissions ? "text-blue-800" : "text-gray-600"
              }`}
            >
              {canManageMenuPermissions
                ? "✅ คุณสามารถกำหนด Menu Permissions ให้กับ Role ได้"
                : "❌ เฉพาะ Admin และ Super Admin เท่านั้นที่สามารถกำหนด Menu Permissions ได้"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการตำแหน่งทั้งหมด</CardTitle>
          <CardDescription>
            จัดการตำแหน่งและสิทธิ์ของผู้ใช้ในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleTable
            roles={roles}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
            canManagePermissions={canManagePermissions}
            canManageMenuPermissions={canManageMenuPermissions}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateRoleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onRoleCreated={handleRoleCreated}
        canManagePermissions={canManagePermissions}
        canManageMenuPermissions={canManageMenuPermissions}
      />

      {editingRole && (
        <EditRoleDialog
          open={!!editingRole}
          onOpenChange={() => setEditingRole(null)}
          role={editingRole}
          onRoleUpdated={handleRoleUpdated}
          canManagePermissions={canManagePermissions}
          canManageMenuPermissions={canManageMenuPermissions}
        />
      )}
    </div>
  );
}
