"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Send,
  Trash2,
  Save,
  Upload,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  Plus,
  Settings,
  History,
} from "lucide-react";
import { showSuccess, showError } from "@/lib/sweetalert";

interface ApiRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  createdAt: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
  size: number;
  requestConfig?: any; // เพิ่มฟิลด์สำหรับเก็บ request config
}

export default function ApiTesterPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [customHeaders, setCustomHeaders] = useState<Record<string, string>>(
    {}
  );
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRequests, setSavedRequests] = useState<ApiRequest[]>([]);
  const [requestName, setRequestName] = useState("");
  const [newHeaderKey, setNewHeaderKey] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

  const handleSendRequest = async () => {
    if (!url.trim()) {
      showError("เกิดข้อผิดพลาด", "กรุณาระบุ URL");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // สร้าง headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      // เพิ่ม Bearer Token ถ้ามี
      if (bearerToken.trim()) {
        headers["Authorization"] = `${bearerToken.trim()}`;
      }

      // สร้าง axios config
      const config: any = {
        method: method.toLowerCase(),
        url,
        headers,
        timeout: 30000, // 30 seconds timeout
      };

      // เพิ่ม data สำหรับ methods ที่ต้องการ
      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        try {
          config.data = JSON.parse(body.trim());
        } catch (jsonError) {
          // หากไม่ใช่ JSON ให้ส่งเป็น string
          config.data = body.trim();
          // เปลี่ยน Content-Type ถ้าไม่ใช่ JSON
          if (headers["Content-Type"] === "application/json") {
            headers["Content-Type"] = "text/plain";
          }
        }
      }

      // ส่ง request ด้วย axios
      const response = await axios(config);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // คำนวณขนาด response
      const responseText = JSON.stringify(response.data);
      const size = new Blob([responseText]).size;

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        responseTime,
        size,
        requestConfig: {
          method: config.method,
          url: config.url,
          headers: config.headers,
          data: config.data,
        },
      });

      showSuccess("สำเร็จ", "ส่ง API request สำเร็จ");
    } catch (error) {
      console.error("API Request Error:", error);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // ตรวจสอบประเภทของ error และแสดงรายละเอียดที่เหมาะสม
      let errorMessage = "ไม่สามารถส่ง request ได้";
      let errorDetails = "";
      let errorStatus = 0;
      let errorStatusText = "Error";

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.code === "ERR_NETWORK") {
          errorMessage = "การเชื่อมต่อล้มเหลว (Network Error)";
          errorDetails = `ปัญหาที่เป็นไปได้:
1. CORS Policy: Server ไม่อนุญาตให้เรียกจาก origin นี้
2. Network Error: ไม่สามารถเชื่อมต่อกับ server ได้
3. URL ไม่ถูกต้อง: ตรวจสอบ URL อีกครั้ง

รายละเอียด Error: ${axiosError.message}

💡 แนะนำ: หากเป็น CORS error ให้ใช้ browser extension หรือ proxy server สำหรับการทดสอบ`;
        } else if (axiosError.code === "ECONNABORTED") {
          errorMessage = "Request Timeout";
          errorDetails = `Request หมดเวลา (timeout 30 วินาที)
ปัญหาที่เป็นไปได้:
1. Server ตอบสนองช้าเกินไป
2. Network connection ช้า
3. Timeout ต่ำเกินไป`;
        } else if (axiosError.response) {
          // Server responded with error status
          errorStatus = axiosError.response.status;
          errorStatusText = axiosError.response.statusText;
          errorMessage = `HTTP Error ${errorStatus}`;
          errorDetails = `Status: ${errorStatus} ${errorStatusText}
Response: ${JSON.stringify(axiosError.response.data, null, 2)}`;
        } else if (axiosError.request) {
          errorMessage = "ไม่ได้รับ response จาก server";
          errorDetails = `Request ถูกส่งแล้วแต่ไม่ได้รับ response กลับมา
อาจเป็นปัญหา:
1. Server ไม่ตอบสนอง
2. Timeout
3. CORS หรือ Network issues

รายละเอียด: ${axiosError.message}`;
        } else {
          errorMessage = "เกิดข้อผิดพลาดในการตั้งค่า request";
          errorDetails = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = "เกิดข้อผิดพลาด";
        errorDetails = error.message;
      } else {
        errorDetails = String(error);
      }

      // สร้าง error response object
      const errorHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
      };
      if (bearerToken.trim()) {
        errorHeaders["Authorization"] = `Bearer ${bearerToken.trim()}`;
      }

      setResponse({
        status: errorStatus,
        statusText: errorStatusText,
        headers: {},
        data: errorDetails,
        responseTime,
        size: 0,
        requestConfig: {
          method: method.toLowerCase(),
          url,
          headers: errorHeaders,
          data: body.trim() || undefined,
        },
      });

      // แสดง error พร้อมรายละเอียด
      showError(errorMessage, errorDetails);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRequest = () => {
    if (!requestName.trim()) {
      showError("เกิดข้อผิดพลาด", "กรุณาระบุชื่อ request");
      return;
    }

    const newRequest: ApiRequest = {
      id: Date.now().toString(),
      name: requestName.trim(),
      method,
      url,
      headers: {
        ...customHeaders,
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      },
      body,
      createdAt: new Date().toISOString(),
    };

    setSavedRequests((prev) => [newRequest, ...prev]);
    setRequestName("");
    showSuccess("สำเร็จ", "บันทึก request สำเร็จ");
  };

  const handleLoadRequest = (request: ApiRequest) => {
    setMethod(request.method);
    setUrl(request.url);
    setBody(request.body);
    setCustomHeaders({ ...request.headers });

    // ตรวจสอบและแยก Bearer Token
    if (request.headers.Authorization?.startsWith("Bearer ")) {
      setBearerToken(request.headers.Authorization.replace("Bearer ", ""));
      const headersWithoutAuth = { ...request.headers };
      delete headersWithoutAuth.Authorization;
      setCustomHeaders(headersWithoutAuth);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setSavedRequests((prev) => prev.filter((req) => req.id !== id));
    showSuccess("สำเร็จ", "ลบ request สำเร็จ");
  };

  const handleAddHeader = () => {
    if (!newHeaderKey.trim() || !newHeaderValue.trim()) {
      showError("เกิดข้อผิดพลาด", "กรุณาระบุ Header key และ value");
      return;
    }

    setCustomHeaders((prev) => ({
      ...prev,
      [newHeaderKey.trim()]: newHeaderValue.trim(),
    }));
    setNewHeaderKey("");
    setNewHeaderValue("");
  };

  const handleRemoveHeader = (key: string) => {
    setCustomHeaders((prev) => {
      const newHeaders = { ...prev };
      delete newHeaders[key];
      return newHeaders;
    });
  };

  const handleClearAll = () => {
    setMethod("GET");
    setUrl("");
    setBearerToken("");
    setCustomHeaders({});
    setBody("");
    setResponse(null);
    setRequestName("");
  };

  const handleCopyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      showSuccess("สำเร็จ", "คัดลอก response แล้ว");
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 bg-green-50";
    if (status >= 300 && status < 400) return "text-yellow-600 bg-yellow-50";
    if (status >= 400 && status < 500) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300)
      return <CheckCircle className="w-4 h-4" />;
    if (status >= 300 && status < 400)
      return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filter saved requests based on search term
  const filteredRequests = savedRequests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const statsData = {
    totalRequests: savedRequests.length,
    successfulRequests:
      response?.status && response.status >= 200 && response.status < 300
        ? 1
        : 0,
    avgResponseTime: response?.responseTime || 0,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">API Tester</h1>
          <p className="text-sm text-gray-600">
            ทดสอบและดีบัก API endpoints แบบ Postman (สำหรับ Super Admin
            เท่านั้น)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="text-gray-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Saved Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.totalRequests}
                </p>
                <p className="text-xs text-gray-500 mt-1">บันทึกไว้ทั้งหมด</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Save className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Last Response
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {response?.status || "--"}
                </p>
                <p className="text-xs text-gray-500 mt-1">HTTP Status Code</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Response Time
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.avgResponseTime
                    ? `${statsData.avgResponseTime}ms`
                    : "--"}
                </p>
                <p className="text-xs text-gray-500 mt-1">ครั้งล่าสุด</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Request
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Saved ({savedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="response"
              className="flex items-center gap-2"
              disabled={!response}
            >
              <Eye className="w-4 h-4" />
              Response
            </TabsTrigger>
          </TabsList>

          {/* Request Tab */}
          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Request Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* URL and Method */}
                <div className="flex gap-3">
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {methods.map((m) => (
                        <SelectItem key={m} value={m}>
                          <Badge
                            variant={
                              m === "GET"
                                ? "default"
                                : m === "POST"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {m}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="https://api.example.com/endpoint"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendRequest}
                    disabled={isLoading || !url.trim()}
                    className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send
                  </Button>
                </div>

                {/* Bearer Token */}
                <div>
                  <Label htmlFor="bearerToken">Bearer Token</Label>
                  <Input
                    id="bearerToken"
                    type="password"
                    placeholder="ระบุ Bearer Token (ไม่จำเป็นต้องใส่ 'Bearer ' ข้างหน้า)"
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Custom Headers */}
                <div>
                  <Label>Custom Headers</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Header key"
                        value={newHeaderKey}
                        onChange={(e) => setNewHeaderKey(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Header value"
                        value={newHeaderValue}
                        onChange={(e) => setNewHeaderValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddHeader}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {Object.entries(customHeaders).length > 0 && (
                      <div className="border rounded-lg p-3 bg-gray-50">
                        <div className="space-y-2">
                          {Object.entries(customHeaders).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between py-2 px-3 bg-white rounded border"
                            >
                              <span className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {key}:
                                </span>{" "}
                                <span className="text-gray-600">{value}</span>
                              </span>
                              <Button
                                onClick={() => handleRemoveHeader(key)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Request Body */}
                {["POST", "PUT", "PATCH"].includes(method) && (
                  <div>
                    <Label htmlFor="requestBody">Request Body (JSON)</Label>
                    <Textarea
                      id="requestBody"
                      placeholder={`{\n  "key": "value"\n}`}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="mt-1 h-32 font-mono text-sm"
                    />
                  </div>
                )}

                {/* Save Request */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="ชื่อ request (สำหรับบันทึก)"
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSaveRequest}
                      variant="outline"
                      disabled={!requestName.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Requests Tab */}
          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <CardTitle>Saved Requests</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      จัดการ requests ที่บันทึกไว้
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="ค้นหา requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <History className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {savedRequests.length === 0
                        ? "ยังไม่มี request ที่บันทึกไว้"
                        : "ไม่พบ request ที่ค้นหา"}
                    </h3>
                    <p className="text-gray-600">
                      {savedRequests.length === 0
                        ? "สร้าง request ใหม่และบันทึกเพื่อใช้งานในอนาคต"
                        : "ลองใช้คำค้นหาอื่น"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRequests.map((req) => (
                      <div
                        key={req.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleLoadRequest(req)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 truncate">
                            {req.name}
                          </h4>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRequest(req.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {req.method}
                          </Badge>
                          <span className="truncate flex-1">{req.url}</span>
                          <span className="text-xs">
                            {new Date(req.createdAt).toLocaleDateString(
                              "th-TH"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Response Tab */}
          <TabsContent value="response" className="space-y-6">
            {response ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle>Response</CardTitle>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                          response.status
                        )}`}
                      >
                        {getStatusIcon(response.status)}
                        <span className="font-medium">
                          {response.status} {response.statusText}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{response.responseTime}ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatBytes(response.size)}</span>
                      </div>
                      <Button
                        onClick={handleCopyResponse}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="body" className="w-full">
                    <TabsList>
                      <TabsTrigger value="body">Response Body</TabsTrigger>
                      <TabsTrigger value="headers">
                        Headers ({Object.keys(response.headers).length})
                      </TabsTrigger>
                      <TabsTrigger value="request">Request Config</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body" className="mt-4">
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                          {typeof response.data === "string"
                            ? response.data
                            : JSON.stringify(response.data, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="headers" className="mt-4">
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="space-y-3">
                          {Object.entries(response.headers).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-start gap-3 text-sm"
                              >
                                <span className="font-medium text-gray-900 min-w-0 flex-shrink-0">
                                  {key}:
                                </span>
                                <span className="text-gray-600 break-all">
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="request" className="mt-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Request Configuration (Axios)
                        </h4>
                        <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap text-blue-800">
                          {response.requestConfig
                            ? JSON.stringify(response.requestConfig, null, 2)
                            : "No request config available"}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มี Response
                  </h3>
                  <p className="text-gray-600">
                    ส่ง request เพื่อดู response ที่นี่
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
