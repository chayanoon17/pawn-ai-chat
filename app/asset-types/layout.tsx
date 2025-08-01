import BasePageLayout from "@/components/layouts/base-page-layout";

export default function AssetTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BasePageLayout
      page="asset-types"
      pageTitle="ประเภททรัพย์สิน"
      showFilter={true}
    >
      {children}
    </BasePageLayout>
  );
}
