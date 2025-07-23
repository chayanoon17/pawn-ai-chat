import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import AuthProvider from "../context/auth-context";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Pawn Shop Management",
  description:
    "Pawn Shop Management with AI Chatbot - ระบบจัดการร้านรับจำนำด้วย AI Chatbot",
};

/**
 * Root Layout Component
 * ครอบ App ทั้งหมดด้วย AuthProvider และจัดการ Global Styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} antialiased`}>
        <AuthProvider>
          <Theme>{children}</Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
