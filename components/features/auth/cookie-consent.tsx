"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function CookieConsent({
  onAccept,
  onDecline,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้เคยให้ consent แล้วหรือไม่
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <p>
                <strong>เว็บไซต์นี้ใช้คุกกี้</strong>{" "}
                เพื่อการยืนยันตัวตนและปรับปรุงประสบการณ์การใช้งาน
              </p>
              <p className="text-xs text-gray-500 mt-1">
                เราใช้ httpOnly cookies
                เพื่อความปลอดภัยในการจัดเก็บข้อมูลการเข้าสู่ระบบ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-gray-600 hover:text-gray-800"
            >
              ปฏิเสธ
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              ยอมรับ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook สำหรับตรวจสอบ Cookie Consent
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    setHasConsent(consent === "accepted");
  }, []);

  return hasConsent;
}
