import BasePageLayout from "@/components/layouts/base-page-layout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasePageLayout page="user-management" pageTitle="จัดการผู้ใช้งาน">
      {children}
    </BasePageLayout>
  );
}
