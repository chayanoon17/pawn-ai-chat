"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full font-sans">{children}</div>;
}
