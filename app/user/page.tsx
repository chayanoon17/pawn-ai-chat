"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { UserTable } from "@/components/features/users";

export default function UserPage() {
  return (
    <BasePageLayout
      page="user-management"
      pageTitle="จัดการผู้ใช้"
      showFilter={false}
    >
      <div className="space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            👥 จัดการข้อมูลผู้ใช้
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            เพิ่ม แก้ไข และจัดการข้อมูลผู้ใช้งานในระบบ
          </p>
        </div>

        {/* User Management Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <UserTable />
          </div>
        </div>
      </div>
    </BasePageLayout>
  );
}
