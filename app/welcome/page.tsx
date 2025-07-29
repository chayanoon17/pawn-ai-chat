"use client";

import BasePageLayout from "@/components/layouts/base-page-layout";
import { useMenuPermissions } from "@/hooks/use-permissions";
import { Shield, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const { user, userMenuPermissions, isAuthenticated } = useMenuPermissions();

  if (!isAuthenticated) {
    return (
      <BasePageLayout page="welcome" pageTitle="ยินดีต้อนรับ">
        {() => (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                กรุณาเข้าสู่ระบบ
              </h2>
              <p className="text-gray-600">
                เพื่อเข้าใช้งานระบบสำนักงานธนานุเคราะห์
              </p>
            </div>
          </div>
        )}
      </BasePageLayout>
    );
  }

  if (userMenuPermissions.length === 0) {
    return (
      <BasePageLayout page="welcome" pageTitle="ยินดีต้อนรับ">
        {() => (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ยินดีต้อนรับ, {user?.fullName || "ผู้ใช้งาน"}
                </h1>
                <p className="text-lg text-gray-600">
                  สู่ระบบจัดการสำนักงานธนานุเคราะห์
                </p>
              </div>
            </div>

            {/* Access Status Card */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-amber-900">
                  รอการกำหนดสิทธิ์เข้าถึง
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-amber-800">
                  บัญชีของคุณได้รับการสร้างเรียบร้อยแล้ว
                  แต่ยังไม่ได้รับสิทธิ์ในการเข้าถึงเมนูต่างๆ ในระบบ
                </p>
                <div className="bg-white p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    ขั้นตอนถัดไป:
                  </h3>
                  <ul className="text-sm text-amber-800 space-y-1 text-left">
                    <li>
                      • รอให้ผู้ดูแลระบบกำหนดบทบาทและสิทธิ์ให้กับบัญชีของคุณ
                    </li>
                    <li>• ติดต่อผู้ดูแลระบบหากต้องการเร่งรัดการดำเนินการ</li>
                    <li>
                      • เมื่อได้รับสิทธิ์แล้ว ให้ออกจากระบบและเข้าใหม่อีกครั้ง
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>ติดต่อผู้ดูแลระบบ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">อีเมล</p>
                    <p className="font-medium">admin@pawnshop.com</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    ส่งอีเมลติดต่อ
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>โทรศัพท์ติดต่อ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">เบอร์ติดต่อ</p>
                    <p className="font-medium">02-xxx-xxxx</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    โทรติดต่อ
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลบัญชีของคุณ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">อีเมล</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ชื่อ-นามสกุล</p>
                    <p className="font-medium">
                      {user?.fullName || "ไม่ได้ระบุ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">บทบาท</p>
                    <p className="font-medium">
                      {user?.role?.name || "ยังไม่ได้กำหนด"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">สาขา</p>
                    <p className="font-medium">
                      {user?.branch?.name || "ไม่ได้กำหนด"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </BasePageLayout>
    );
  }

  // หากมีสิทธิ์เข้าถึงเมนู ให้ redirect ไปหน้าแรกที่มีสิทธิ์
  const firstMenu = userMenuPermissions[0];
  const redirectPath =
    firstMenu === "Dashboard"
      ? "/dashboard"
      : firstMenu === "Asset Types"
      ? "/asset-types"
      : firstMenu === "Users Management"
      ? "/users"
      : firstMenu === "Roles Management"
      ? "/roles"
      : firstMenu === "Activity Logs"
      ? "/logs"
      : "/dashboard";

  // Redirect to first accessible menu
  if (typeof window !== "undefined") {
    window.location.href = redirectPath;
  }

  return (
    <BasePageLayout page="welcome" pageTitle="กำลังเปลี่ยนหน้า...">
      {() => (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังนำทางไปยังหน้าแรก...</p>
          </div>
        </div>
      )}
    </BasePageLayout>
  );
}
