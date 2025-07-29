/**
 * Role Table Component
 */

"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Shield,
  Menu as MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Role } from "@/types/role-management";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
  canManagePermissions: boolean;
  canManageMenuPermissions: boolean;
}

export function RoleTable({
  roles,
  onEdit,
  onDelete,
  canManagePermissions,
  canManageMenuPermissions,
}: RoleTableProps) {
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);

  const handleDeleteClick = (roleId: number) => {
    setDeleteRoleId(roleId);
  };

  const handleDeleteConfirm = () => {
    if (deleteRoleId) {
      onDelete(deleteRoleId);
      setDeleteRoleId(null);
    }
  };

  const canEditRole = (role: Role) => {
    // สามารถแก้ไขได้ถ้ามีสิทธิ์อย่างใดอย่างหนึ่ง
    return canManagePermissions || canManageMenuPermissions;
  };

  const getPermissionSummary = (role: Role) => {
    const permissionCount = role.permissions?.length || 0;
    const menuPermissionCount = role.menuPermissions?.length || 0;
    return { permissionCount, menuPermissionCount };
  };

  if (roles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              ยังไม่มีตำแหน่ง
            </h3>
            <p className="text-gray-500 mt-1">
              เริ่มต้นด้วยการสร้างตำแหน่งแรกของคุณ
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อตำแหน่ง</TableHead>
              <TableHead>คำอธิบาย</TableHead>
              <TableHead className="text-center">Permissions</TableHead>
              <TableHead className="text-center">Menu Permissions</TableHead>
              <TableHead className="text-center">จำนวนผู้ใช้</TableHead>
              <TableHead className="text-center">การจัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
              const { permissionCount, menuPermissionCount } =
                getPermissionSummary(role);

              return (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{role.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600 max-w-xs truncate">
                      {role.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <Shield className="w-3 h-3" />
                            <span>{permissionCount}</span>
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium mb-2">
                            Permissions ({permissionCount})
                          </p>
                          {role.permissions?.length ? (
                            <ul className="text-xs space-y-1">
                              {role.permissions
                                .slice(0, 5)
                                .map((permission) => (
                                  <li
                                    key={permission.id}
                                    className="flex items-start space-x-2"
                                  >
                                    <span className="text-green-500">•</span>
                                    <span>{permission.name}</span>
                                  </li>
                                ))}
                              {role.permissions.length > 5 && (
                                <li className="text-gray-500">
                                  และอีก {role.permissions.length - 5} รายการ
                                </li>
                              )}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500">
                              ไม่มี Permissions
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <MenuIcon className="w-3 h-3" />
                            <span>{menuPermissionCount}</span>
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-medium mb-2">
                            Menu Permissions ({menuPermissionCount})
                          </p>
                          {role.menuPermissions?.length ? (
                            <ul className="text-xs space-y-1">
                              {role.menuPermissions
                                .slice(0, 5)
                                .map((menuPermission) => (
                                  <li
                                    key={menuPermission.id}
                                    className="flex items-start space-x-2"
                                  >
                                    <span className="text-blue-500">•</span>
                                    <span>{menuPermission.name}</span>
                                  </li>
                                ))}
                              {role.menuPermissions.length > 5 && (
                                <li className="text-gray-500">
                                  และอีก {role.menuPermissions.length - 5}{" "}
                                  รายการ
                                </li>
                              )}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500">
                              ไม่มี Menu Permissions
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1 w-fit mx-auto"
                    >
                      <Users className="w-3 h-3" />
                      <span>{role.userCount}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={!canEditRole(role)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit(role)}
                          disabled={!canEditRole(role)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(role.id)}
                          className="text-red-600"
                          disabled={role.userCount > 0}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Permission Legend */}
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Permissions</span>
            </div>
            <span className="text-xs text-gray-500">
              {canManagePermissions
                ? "(คุณสามารถจัดการได้)"
                : "(เฉพาะ Super Admin)"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <MenuIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Menu Permissions</span>
            </div>
            <span className="text-xs text-gray-500">
              {canManageMenuPermissions
                ? "(คุณสามารถจัดการได้)"
                : "(เฉพาะ Admin/Super Admin)"}
            </span>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteRoleId}
          onOpenChange={() => setDeleteRoleId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบตำแหน่ง</AlertDialogTitle>
              <AlertDialogDescription>
                คุณแน่ใจหรือไม่ที่จะลบตำแหน่งนี้?
                การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                ลบตำแหน่ง
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
