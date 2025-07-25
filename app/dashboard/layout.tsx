import { Toaster } from "@/components/ui/sonner";
import { Sarabun } from "next/font/google";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${sarabun.variable} font-sans antialiased`}>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "rounded-lg border bg-white text-black shadow-md dark:bg-zinc-800 dark:text-white",
            title: "font-semibold text-sm",
            description: "text-xs text-gray-500",
            actionButton: "text-sm text-blue-600 hover:underline",
            cancelButton: "text-sm text-gray-400 hover:text-red-500",
          },
        }}
      />
      {children}
    </div>
  );
}
