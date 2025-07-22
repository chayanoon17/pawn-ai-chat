"use client";

import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  // 🎣 ใช้ Auth Context
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 📝 Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔄 Redirect ถ้า login แล้ว
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  /**
   * Handle Login Form Submit
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error
    setError("");

    // Validation
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setIsSubmitting(true);

      // เรียก login function จาก Auth Context
      await login(email, password);

      // หลัง login สำเร็จ จะ redirect อัตโนมัติใน useEffect
      console.log("🎉 Login successful!");
    } catch (error) {
      // แสดง error message
      const errorMessage =
        error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ";
      setError(errorMessage);
      console.error("❌ Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔄 แสดง Loading หรือ Checking Auth Status
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - ข้อมูลระบบ */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 flex-col justify-center items-center text-white p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-bold text-center">
            Pawn Shop Management
          </h1>
          <p className="text-lg text-center opacity-90">ระบบจัดการร้านจำนำ</p>
          <div className="text-sm text-center opacity-75">
            <p>🔐 ระบบยืนยันตัวตนด้วย httpOnly Cookies</p>
            <p>🛡️ ความปลอดภัยระดับสูง</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div className="w-full max-w-md space-y-6">
          {/* หัวข้อ */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">เข้าสู่ระบบ</h2>
            <p className="text-gray-600 mt-2">กรุณาใส่ข้อมูลเพื่อเข้าสู่ระบบ</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="กรุณากรอกอีเมล"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <span>เข้าสู่ระบบ</span>
              )}
            </button>
          </form>

          {/* Development Info */}
          {process.env.NEXT_PUBLIC_DEBUG_AUTH === "true" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                🛠️ Development Mode
              </h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>
                  <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}
                </p>
                <p>
                  <strong>Test Account:</strong> admin@pawnshop.com /
                  admin123456
                </p>
                <p>ตรวจสอบ Console สำหรับ debug logs</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
