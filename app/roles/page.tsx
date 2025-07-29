"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { MenuPermissionGuard } from "@/components/core/permission-guard";
import { RoleManagement } from "@/components/features/roles";

export default function RolesPage() {
  return (
    <MenuPermissionGuard
      requiredMenuPermission="Roles Management"
      fallback={
        <BasePageLayout
          page="role-management"
          pageTitle="จัดการตำแหน่ง"
          showFilter={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                ไม่มีสิทธิ์เข้าถึง
              </h2>
              <p className="text-gray-600">
                คุณไม่มีสิทธิ์ในการเข้าถึงหน้าจัดการตำแหน่ง
              </p>
            </div>
          </div>
        </BasePageLayout>
      }
    >
      <BasePageLayout
        page="role-management"
        pageTitle="จัดการตำแหน่ง"
        showFilter={false}
      >
        <RoleManagement />
      </BasePageLayout>
    </MenuPermissionGuard>
  );
}
