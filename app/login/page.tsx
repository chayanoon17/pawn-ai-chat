"use client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CookieConsent } from "@/components/features/auth";
import { showLoginError, showSuccess, showError } from "@/lib/sweetalert";
import { ButtonLoading } from "@/components/ui/loading";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // แยก effect สำหรับการ redirect เมื่อ authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setIsRedirecting(true);
      // เพิ่ม delay เล็กน้อยเพื่อให้ loading state แสดง
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  }, [isAuthenticated, isLoading, router]);

  // โหลดข้อมูล remember me จาก localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberMe_email");
    const savedRememberMe = localStorage.getItem("rememberMe_enabled");

    if (savedEmail && savedRememberMe === "true") {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      showError("ข้อมูลไม่ครบถ้วน", "กรุณากรอกอีเมลและรหัสผ่าน", false);
      return;
    }

    try {
      setIsSubmitting(true);

      // บันทึกหรือลบข้อมูล remember me
      if (rememberMe) {
        localStorage.setItem("rememberMe_email", email);
        localStorage.setItem("rememberMe_enabled", "true");
      } else {
        localStorage.removeItem("rememberMe_email");
        localStorage.removeItem("rememberMe_enabled");
      }

      await login(email, password);
      // หลัง login สำเร็จ ให้แสดง loading state
      showSuccess("เข้าสู่ระบบสำเร็จ!", "กำลังนำทางไปยังหน้าหลัก...", 2000);
      setIsRedirecting(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ";

      // ใช้ SweetAlert2 แทน state error
      showLoginError(errorMessage);
      setIsRedirecting(false); // รีเซ็ต redirecting state เมื่อเกิด error
    } finally {
      setIsSubmitting(false);
    }
  };

  // แสดง loading state เมื่อกำลังตรวจสอบสถานะหรือ redirecting
  if (isLoading || isRedirecting) {
    return (
      <LoadingScreen
        message={isRedirecting ? "กำลังเข้าสู่ระบบ..." : "กำลังตรวจสอบสถานะ..."}
        size="lg"
        className="bg-gradient-to-br from-blue-50 to-indigo-100"
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-400 to-blue-800 items-center justify-center text-white flex-col px-6">
        <div className="flex flex-col items-start w-full max-w-sm px-8 space-y-2">
          {/* Logo + Text aligned left */}
          <div className="bg-white p-6 rounded-md self-start">
            <Image
              src="/logo 1.png"
              width={100}
              height={100}
              alt="logo"
              className="h-24"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-left">
            สำนักงานธนานุเคราะห์
          </h1>
          <p className="text-sm text-white/80 text-left">โรงรับจำนำรัฐบาล</p>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-semibold text-left text-gray-800 mb-1">
            สำนักงานธนานุเคราะห์
          </h2>
          <p className="text-left text-base text-gray-500 mt-0">เข้าสู่ระบบ</p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-sm font-medium transition-colors flex justify-center"
            >
              {isSubmitting ? (
                <ButtonLoading message="กำลังเข้าสู่ระบบ..." size="sm" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          {/* Remember Me and Forgot Password - Below Login Button */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-gray-600 cursor-pointer"
              >
                จดจำฉัน
              </label>
            </div>
            <a href="#" className="text-gray-500 hover:underline">
              ลืมรหัสผ่าน?
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Consent Popup */}
      <CookieConsent
        onAccept={() => console.log("🍪 Cookies accepted")}
        onDecline={() => console.log("🚫 Cookies declined")}
      />
    </div>
  );
}
