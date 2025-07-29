import BasePageLayout from "@/components/layouts/base-page-layout";

export default function RoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasePageLayout page="role-management" pageTitle="จัดการตำแหน่ง">
      {children}
    </BasePageLayout>
  );
}
