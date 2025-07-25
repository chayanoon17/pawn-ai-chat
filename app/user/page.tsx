"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { UserTable } from "@/components/usertable";

export default function UserPage() {
  return (
    <BasePageLayout page="user-management" showFilter={false}>
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <UserTable />
        </div>
      </div>
    </BasePageLayout>
  );
}
