import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

import AuthProvider from "../context/auth-context";
import ErrorBoundary from "../components/error-boundary";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
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
    <html lang="th" className={prompt.variable}>
      <body className="antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <Theme>{children}</Theme>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
