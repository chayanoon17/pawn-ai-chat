import BasePageLayout from "@/components/layouts/base-page-layout";

export default function LogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasePageLayout page="logs" pageTitle="ประวัติการใช้งาน" showFilter={false}>
      {children}
    </BasePageLayout>
  );
}
