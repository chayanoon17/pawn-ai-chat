import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import AuthProvider from "../context/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>
        {children}

        </Theme>

        {/*  AuthProvider ครอบ App ทั้งหมด เพื่อให้ทุก Component เข้าถึง Auth Context */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
