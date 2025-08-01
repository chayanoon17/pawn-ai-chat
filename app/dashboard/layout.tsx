import BasePageLayout from "@/components/layouts/base-page-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasePageLayout
      page="dashboard"
      pageTitle="ข้อมูลตั๋วรับจำนำ"
      showFilter={true}
    >
      {children}
    </BasePageLayout>
  );
}
