# 📚 Pawn Shop Management API Documentation

## 📋 ภาพรวมของระบบ

**Pawn Shop Management API** เป็นระบบจัดการร้านจำนำแบบครบวงจร ที่พัฒนาด้วย **Node.js**, **TypeScript**, **Express.js**, และ **Prisma ORM** โดยออกแบบมาเพื่อรองรับการดำเนินงานของร้านจำนำหลายสาขาอย่างมีประสิทธิภาพ

### ฟีเจอร์หลัก

- 🔐 **ระบบยืนยันตัวตนและการอนุญาต** (JWT + httpOnly Cookies + Role-based Access Control พร้อม Token Blacklist)
- 👥 **การจัดการผู้ใช้งานและบทบาท** (Users, Roles, Permissions พร้อม Menu-level Security)
- 💎 **การจัดการข้อมูลจำนำ** (Contracts, Assets, Transactions พร้อม Branch Management)
- 📊 **รายงานและวิเคราะห์ข้อมูล** (Daily/Weekly Operations, Contract Analytics)
- 🏷️ **การวิเคราะห์ประเภททรัพย์** (Asset Type Analytics, Rankings, Period Comparisons)
- 🏅 **ราคาทองคำแบบเรียลไทม์** (Auto-sync จาก External API พร้อม Cron Jobs)
- 💬 **ระบบแชทบอท AI** (OpenAI Integration พร้อม streaming responses และ conversation history)
- 🔄 **ซิงค์ข้อมูลอัตโนมัติ** (Pawn Shop API, Gold Price API, Batch Processing)
- 📝 **การตรวจสอบและบันทึกกิจกรรม** (Activity & Change Logs พร้อม comprehensive audit trail)
- 📈 **ระบบติดตามประสิทธิภาพ** (Real-time metrics, Health monitoring, Performance analytics)
- 📋 **การส่งออกข้อมูล** (CSV export พร้อม UTF-8 BOM, Excel compatibility และ Thai language support)

### 🏗️ สถาปัตยกรรมระบบ

- **Backend**: Node.js + TypeScript + Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: Dual-method JWT Authentication (httpOnly Cookies + Authorization Header) พร้อม Token Blacklist System
- **Security**: Role-based Access Control (RBAC) แบบละเอียดพร้อม Menu Permissions และ XSS/CSRF Protection
- **API**: RESTful API Design พร้อม comprehensive error handling และ validation
- **Monitoring**: Built-in Performance Monitoring & Real-time Health Checks
- **AI Integration**: OpenAI Chat API พร้อม streaming responses และ conversation management
- **External APIs**: Gold Price API และ Pawn Shop API integration พร้อม rate limiting

---

## 📖 Table of Contents

1. [🌟 Overview](#-overview)
2. [🔐 Authentication](#-authentication)
3. [🛡️ Authorization](#️-authorization)
4. [📡 API Endpoints](#-api-endpoints)
5. [🔓 Authentication Routes](#-authentication-routes)
6. [🎯 Branch Management](#-branch-management)
7. [👥 User Management](#-user-management)
8. [🛡️ Role Management](#️-role-management)
9. [🔑 Permission Management](#-permission-management)
10. [🧭 Menu Permission Management](#-menu-permission-management)
11. [🧭 Menu Endpoints](#-menu-endpoints)
12. [💰 Gold Price Management](#-gold-price-management)
13. [🏪 Pawn Shop Operations](#-pawn-shop-operations)
14. [🏷️ Asset Type Reports](#️-asset-type-reports)
15. [🔄 Data Synchronization](#-data-synchronization)
16. [📤 Export Operations](#-export-operations)
17. [💬 Chat Management](#-chat-management)
18. [📊 Activity Tracking & Logs](#-activity-tracking--logs)
19. [📝 Change Logs](#-change-logs)
20. [📈 Metrics & Monitoring](#-metrics--monitoring)
21. [🛡️ Protected Routes](#️-protected-routes)
22. [📊 Response Format](#-response-format)
23. [⚠️ Error Handling](#️-error-handling)
24. [📞 Support & Documentation](#-support--documentation)

---

## 🌟 Overview

### 🎯 API Features

- **Authentication**: JWT + httpOnly Cookies with Token Blacklist
- **Authorization**: Role-based Access Control (RBAC) with Menu-level Security
- **Data Management**: Branch, User, Role, Permission comprehensive CRUD operations
- **Reporting**: Real-time analytics และ historical data reporting
- **AI Integration**: OpenAI Chat พร้อม streaming responses
- **Monitoring**: Performance metrics และ health checks
- **Export**: CSV export พร้อม UTF-8 BOM และ Thai language support
- **Middleware**: Security, Authentication, Permission, Audit, Error Handling, Rate Limiting

### 🔗 Base URL

```
http://localhost:3000/api
```

---

## 🔐 Authentication

ระบบใช้ **JWT Authentication** แบบ dual-method:

### Authentication Methods

1. **httpOnly Cookies** (Recommended for web browsers)
2. **Authorization Header** (For API clients)

### Token Storage & Security

- **httpOnly Cookies**: Secure, cannot be accessed by JavaScript (XSS protection)
- **Token Blacklist**: Revoked tokens are blacklisted for enhanced security
- **CSRF Protection**: SameSite cookie attribute
- **Rate Limiting**: Login attempts limited to prevent brute force

### Request Headers

```http
# Method 1: Authorization Header (for API clients)
Authorization: Bearer your_jwt_token_here

# Method 2: httpOnly Cookie (automatically sent by browser)
Cookie: accessToken=your_jwt_token_here
```

---

## 🛡️ Authorization

### Role-Based Access Control (RBAC)

ระบบใช้ **RBAC** แบบละเอียดที่ประกอบด้วย:

1. **User** - ผู้ใช้งาน
2. **Role** - บทบาท (Admin, Manager, Employee)
3. **Permission** - สิทธิ์การใช้งาน (CREATE, READ, UPDATE, DELETE)
4. **Menu Permission** - สิทธิ์การเข้าถึงเมนู

### Permission Actions

```typescript
enum PermissionActions {
  // User Management
  CREATE_USER = "CREATE:User",
  READ_USER = "READ:User",
  UPDATE_USER = "UPDATE:User",
  DELETE_USER = "DELETE:User",

  // Role Management
  CREATE_ROLE = "CREATE:Role",
  READ_ROLE = "READ:Role",
  UPDATE_ROLE = "UPDATE:Role",
  DELETE_ROLE = "DELETE:Role",

  // Permission Management
  CREATE_PERMISSION = "CREATE:Permission",
  READ_PERMISSION = "READ:Permission",
  UPDATE_PERMISSION = "UPDATE:Permission",
  DELETE_PERMISSION = "DELETE:Permission",

  // Reports & Analytics
  READ_REPORT = "READ:Report",
  EXPORT_REPORT = "EXPORT:Report",

  // Data Management
  SYNC_DATA = "SYNC:Data",
  READ_ACTIVITY_LOG = "READ:ActivityLog",
  READ_CHANGE_LOG = "READ:ChangeLog",
}
```

### Menu Names

```typescript
enum MenuNames {
  DASHBOARD = "Dashboard",
  USER_MANAGEMENT = "User Management",
  ROLE_MANAGEMENT = "Role Management",
  REPORTS = "Reports",
  EXPORT = "Export",
  CHAT = "Chat",
  SYNC_DATA = "Sync Data",
  LOG = "Logs",
  METRICS = "Metrics & Monitoring",
}
```

---

## 📡 API Endpoints

### 🏗️ API Structure Overview

```
/api/auth/*           - Authentication endpoints (Public/Private)
/api/health           - System health endpoints (Public)
/api/protected        - Protected test endpoints (Private)
/api/metrics/*        - System metrics endpoints (Private)

/api/v1/activity/*    - Activity tracking & logs (Private)
/api/v1/users/*       - User management (Private)
/api/v1/roles/*       - Role management (Private)
/api/v1/permissions/* - Permission management (Private)
/api/v1/menu-permissions/* - Menu permission management (Private)
/api/v1/menu/*        - Menu data endpoints (Private)
/api/v1/branches/*    - Branch management (Private)
/api/v1/asset-types/* - Asset type data (Private)
/api/v1/change-logs/* - Change tracking logs (Private)
/api/v1/chat/*        - AI Chat functionality (Private)
/api/v1/export/*      - Data export operations (Private)
/api/v1/gold-price/*  - Gold price data (Private)
/api/v1/branches/*    - Pawn shop operations & reports (Private)
/api/v1/contracts/*   - Contract & transaction data (Private)
/api/v1/sync-pawn-data/* - Data synchronization (Private)
```

### Standard Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "stats": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔓 Authentication Routes

### POST `/api/auth/login`

**Description:** User login with email and password  
**Access:** Public  
**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": 1,
    "accessToken": "jwt_token_here"
  },
  "message": "Login successful"
}
```

**Activity Log:** Automatically creates LOGIN activity log

### POST `/api/auth/logout`

**Description:** User logout and invalidate token  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>` or httpOnly cookie

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

**Activity Log:** Automatically creates LOGOUT activity log

### GET `/api/auth/me`

**Description:** Get current user information from token  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>` or httpOnly cookie

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0123456789",
    "status": "ACTIVE",
    "branch": {
      "id": 1,
      "name": "สาขาหลัก"
    },
    "role": {
      "id": 1,
      "name": "Admin"
    }
  },
  "message": "User data retrieved successfully"
}
```

---

## 🎯 Branch Management

### GET `/api/v1/branches`

**Description:** Get all branches with optional filtering  
**Access:** Private  
**Permissions:** Branch menu access

**Query Parameters:**

```
?page=1&limit=10&search=สาขา&sortBy=name&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "id": 1,
        "name": "สาขาหลัก",
        "shortName": "HQ",
        "location": "กรุงเทพ",
        "centerName": "ศูนย์กลาง"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### GET `/api/v1/branches/:id`

**Description:** Get specific branch by ID  
**Access:** Private  
**Permissions:** Branch menu access

### GET `/api/v1/branches/:id/stats`

**Description:** Get branch statistics  
**Access:** Private  
**Permissions:** Branch menu access, Report read permission

---

## 👥 User Management

### POST `/api/v1/users`

**Description:** Create new user  
**Access:** Private (Admin Only)  
**Permissions:** User Management menu, CREATE_USER permission  
**Audit:** Creates audit log entry

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "fullName": "Jane Doe",
  "phoneNumber": "0987654321",
  "branchId": 1,
  "roleId": 2
}
```

### GET `/api/v1/users`

**Description:** Get all users with pagination and filtering  
**Access:** Private  
**Permissions:** User Management menu, READ_USER permission

**Query Parameters:**

```
?page=1&limit=10&search=john&status=ACTIVE&roleId=1&branchId=1
```

### GET `/api/v1/users/:id`

**Description:** Get user by ID  
**Access:** Private (Self or Admin)

### PUT `/api/v1/users/:id`

**Description:** Update user information  
**Access:** Private (Self for basic info, Admin for role/status)  
**Audit:** Creates audit log entry

### DELETE `/api/v1/users/:id`

**Description:** Delete user (Soft Delete)  
**Access:** Private (Admin Only)  
**Permissions:** User Management menu, DELETE_USER permission  
**Audit:** Creates audit log entry

### GET `/api/v1/users/:id/permissions`

**Description:** Get user permissions  
**Access:** Private (Self or Admin)

### PUT `/api/v1/users/:id/role`

**Description:** Change user role  
**Access:** Private (Admin Only)  
**Permissions:** User Management menu, UPDATE_USER permission  
**Audit:** Creates audit log entry

---

## 🛡️ Role Management

### POST `/api/v1/roles`

**Description:** Create new role  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, CREATE_ROLE permission  
**Audit:** Creates audit log entry

### GET `/api/v1/roles`

**Description:** Get all roles with pagination and filtering  
**Access:** Private  
**Permissions:** Role Management menu, READ_ROLE permission

### GET `/api/v1/roles/:id`

**Description:** Get role by ID  
**Access:** Private  
**Permissions:** Role Management menu, READ_ROLE permission

### PUT `/api/v1/roles/:id`

**Description:** Update role  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, UPDATE_ROLE permission  
**Audit:** Creates audit log entry

### DELETE `/api/v1/roles/:id`

**Description:** Delete role  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, DELETE_ROLE permission  
**Audit:** Creates audit log entry

---

## 🔑 Permission Management

### POST `/api/v1/permissions`

**Description:** Create new permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, CREATE_PERMISSION permission  
**Audit:** Creates audit log entry

### GET `/api/v1/permissions`

**Description:** Get all permissions with pagination and filtering  
**Access:** Private  
**Permissions:** Role Management menu, READ_PERMISSION permission

### GET `/api/v1/permissions/:id`

**Description:** Get permission by ID  
**Access:** Private  
**Permissions:** Role Management menu, READ_PERMISSION permission

### PUT `/api/v1/permissions/:id`

**Description:** Update permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, UPDATE_PERMISSION permission  
**Audit:** Creates audit log entry

### DELETE `/api/v1/permissions/:id`

**Description:** Delete permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, DELETE_PERMISSION permission  
**Audit:** Creates audit log entry

### DELETE `/api/v1/permissions/bulk`

**Description:** Bulk delete permissions  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, DELETE_PERMISSION permission

---

## 🧭 Menu Permission Management

### POST `/api/v1/menu-permissions`

**Description:** Create new menu permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, CREATE_PERMISSION permission  
**Audit:** Creates audit log entry

### GET `/api/v1/menu-permissions`

**Description:** Get all menu permissions with pagination and filtering  
**Access:** Private  
**Permissions:** Role Management menu, READ_PERMISSION permission

### GET `/api/v1/menu-permissions/:id`

**Description:** Get menu permission by ID  
**Access:** Private  
**Permissions:** Role Management menu, READ_PERMISSION permission

### PUT `/api/v1/menu-permissions/:id`

**Description:** Update menu permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, UPDATE_PERMISSION permission  
**Audit:** Creates audit log entry

### DELETE `/api/v1/menu-permissions/:id`

**Description:** Delete menu permission  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, DELETE_PERMISSION permission  
**Audit:** Creates audit log entry

### DELETE `/api/v1/menu-permissions/bulk`

**Description:** Bulk delete menu permissions  
**Access:** Private (Admin Only)  
**Permissions:** Role Management menu, DELETE_PERMISSION permission

---

## 🧭 Menu Endpoints

### GET `/api/v1/menu/branches`

**Description:** Get branches for menu/dropdown  
**Access:** Private

### GET `/api/v1/menu/roles`

**Description:** Get roles for menu/dropdown  
**Access:** Private

### GET `/api/v1/menu/permissions`

**Description:** Get permissions for menu/dropdown  
**Access:** Private

---

## 💰 Gold Price Management

### GET `/api/v1/gold-price/history`

**Description:** Get gold price history with optional date filtering  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

**Query Parameters:**

```
?startDate=2025-01-01&endDate=2025-01-31&limit=100
```

### GET `/api/v1/gold-price/latest`

**Description:** Get the latest gold price  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

**Response:**

```json
{
  "success": true,
  "data": {
    "goldBarBuy": 32500.0,
    "goldBarSell": 32600.0,
    "goldJewelryBuy": 32200.0,
    "goldJewelrySell": 32700.0,
    "comparePrevious": "+50",
    "compareYesterday": "-200",
    "createdAt": "2025-01-22T10:30:00Z"
  }
}
```

---

## 🏪 Pawn Shop Operations

### GET `/api/v1/branches/daily-operation/summary`

**Description:** Get daily operations summary for all branches  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

**Query Parameters:**

```
?date=2025-01-22&branchId=1
```

### GET `/api/v1/branches/weekly-operation/summary`

**Description:** Get weekly operations summary for all branches  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

### GET `/api/v1/contracts/transactions/details`

**Description:** Get detailed contract transactions with filtering options  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

### GET `/api/v1/contracts/transactions/summary`

**Description:** Get contract transactions summary with aggregated data  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

---

## 🏷️ Asset Type Reports

### GET `/api/v1/asset-types`

**Description:** Get all asset types with optional filtering  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

### GET `/api/v1/asset-types/analytics`

**Description:** Get asset type analytics and statistics  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

### GET `/api/v1/asset-types/:id/contracts`

**Description:** Get contracts for specific asset type  
**Access:** Private  
**Permissions:** Reports menu, READ_REPORT permission

---

## 🔄 Data Synchronization

### POST `/api/v1/sync-pawn-data/pawn-shops`

**Description:** Sync pawn shop data from external API  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

### POST `/api/v1/sync-pawn-data/gold-prices`

**Description:** Sync gold price data from external API  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

### POST `/api/v1/sync-pawn-data/daily-operations`

**Description:** Sync daily operations data  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

### POST `/api/v1/sync-pawn-data/contract-transactions`

**Description:** Sync contract transactions data  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

### POST `/api/v1/sync-pawn-data/customers`

**Description:** Sync customer data  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

### POST `/api/v1/sync-pawn-data/assets`

**Description:** Sync asset data  
**Access:** Private  
**Permissions:** Sync Data menu, SYNC_DATA permission

---

## 📤 Export Operations

### GET `/api/v1/export/contracts/transactions/export/csv`

**Description:** Export contract transactions to CSV file  
**Access:** Private  
**Permissions:** Export menu, EXPORT_REPORT permission  
**Activity:** Automatically logs EXPORT_REPORT activity

**Query Parameters:**

```
?branchId=1&date=2025-01-22
```

**Response:** CSV file download with UTF-8 BOM for Thai language support

---

## 💬 Chat Management

### POST `/api/v1/chat`

**Description:** Send message to AI Chat  
**Access:** Private  
**Permissions:** Chat menu access

**Request Body:**

```json
{
  "message": "สวัสดี ช่วยอธิบายเรื่องการจำนำได้ไหม",
  "conversationId": "optional-conversation-id"
}
```

**Response:** Stream response with chat completion

### GET `/api/v1/chat/conversations`

**Description:** Get user conversations with pagination  
**Access:** Private  
**Permissions:** Chat menu access

**Query Parameters:**

```
?page=1&limit=10&search=keyword
```

### DELETE `/api/v1/chat/conversations/:conversationId`

**Description:** Delete specific conversation  
**Access:** Private  
**Permissions:** Chat menu access

---

## 📊 Activity Tracking & Logs

### Activity Tracking Endpoints (For Frontend)

### POST `/api/v1/activity/menu-access`

**Description:** Track menu access activity  
**Access:** Private

**Request Body:**

```json
{
  "menuName": "Dashboard",
  "menuPath": "/dashboard",
  "menuId": 1,
  "parentMenu": "Main Navigation"
}
```

### POST `/api/v1/activity/search`

**Description:** Track search activity  
**Access:** Private

**Request Body:**

```json
{
  "query": "customer name",
  "searchType": "customer",
  "category": "name",
  "filters": {
    "branchId": 1,
    "status": "active"
  },
  "resultsCount": 25
}
```

### POST `/api/v1/activity/batch`

**Description:** Batch track multiple activities  
**Access:** Private

**Request Body:**

```json
{
  "activities": [
    {
      "type": "menu",
      "menuName": "Users",
      "timestamp": "2025-01-22T10:30:00Z"
    },
    {
      "type": "search",
      "query": "john",
      "searchType": "user",
      "timestamp": "2025-01-22T10:31:00Z"
    }
  ]
}
```

### Activity Log Viewing Endpoints (For Admin)

### GET `/api/v1/activity/logs`

**Description:** Get all activity logs with pagination and filtering  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_ACTIVITY_LOG permission

**Query Parameters:**

```
?page=1&limit=10&userId=1&activity=LOGIN&success=true&startDate=2025-01-01&endDate=2025-01-31&search=keyword
```

### GET `/api/v1/activity/logs/stats`

**Description:** Get activity statistics  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_ACTIVITY_LOG permission

### DELETE `/api/v1/activity/logs/cleanup`

**Description:** Cleanup old activity logs (maintenance)  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_ACTIVITY_LOG permission

**Query Parameters:**

```
?days=90  // Keep logs for 90 days
```

### GET `/api/v1/activity/logs/user/:userId`

**Description:** Get activity logs for specific user  
**Access:** Private (Self or Admin)

### GET `/api/v1/activity/logs/:id`

**Description:** Get specific activity log by ID  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_ACTIVITY_LOG permission

---

## 📝 Change Logs

### GET `/api/v1/change-logs`

**Description:** Get all change logs with pagination and filtering  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_CHANGE_LOG permission

### GET `/api/v1/change-logs/stats`

**Description:** Get change log statistics  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_CHANGE_LOG permission

### GET `/api/v1/change-logs/table/:tableName`

**Description:** Get change logs for specific table  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_CHANGE_LOG permission

### GET `/api/v1/change-logs/:id`

**Description:** Get specific change log by ID  
**Access:** Private (Admin Only)  
**Permissions:** Log menu, READ_CHANGE_LOG permission

---

## 📈 Metrics & Monitoring

### GET `/api/metrics`

**Description:** Get basic system metrics  
**Access:** Private

### GET `/api/metrics/performance`

**Description:** Get detailed performance metrics  
**Access:** Private

### GET `/api/metrics/health`

**Description:** Get system health metrics  
**Access:** Private

### DELETE `/api/metrics/reset`

**Description:** Reset metrics data  
**Access:** Private

---

## 🛡️ Protected Routes

### GET `/api/protected`

**Description:** Test protected route endpoint  
**Access:** Private

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- **200 OK** - Success
- **201 Created** - Resource created
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

### Error Types

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

---

## 📞 Support & Documentation

### Health Checks

- **Basic Health**: `GET /api/health`
- **Detailed Health**: `GET /api/health/detailed`

### System Information

- **API Version**: v1.0.0
- **Node.js Version**: 18+
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + httpOnly Cookies

### Development Tools

- **Test Script**: `test-activity-tracking.js`
- **API Documentation**: This file
- **Activity Tracking Guide**: `ACTIVITY_TRACKING_API.md`

---

_Last Updated: July 23, 2025_  
_API Version: 1.0.0_

```bash
# Method 1: Authorization Header
Authorization: Bearer <your-jwt-token>

# Method 2: httpOnly Cookie (automatic)
Cookie: token=<your-jwt-token>
```

---

## 🛡️ Authorization

### Role-Based Access Control (RBAC)

ระบบใช้ RBAC แบบละเอียด:

1. **Users** → มี Role
2. **Roles** → มี Permissions และ Menu Permissions
3. **Permissions** → ควบคุมการทำงาน (CRUD operations)
4. **Menu Permissions** → ควบคุมการเข้าถึงเมนู

### Permission Actions

```typescript
enum PermissionActions {
  // User Management
  CREATE_USER = "CREATE:User",
  READ_USER = "READ:User",
  UPDATE_USER = "UPDATE:User",
  DELETE_USER = "DELETE:User",

  // Role Management
  CREATE_ROLE = "CREATE:Role",
  READ_ROLE = "READ:Role",
  UPDATE_ROLE = "UPDATE:Role",
  DELETE_ROLE = "DELETE:Role",

  // Permission Management
  CREATE_PERMISSION = "CREATE:Permission",
  READ_PERMISSION = "READ:Permission",
  UPDATE_PERMISSION = "UPDATE:Permission",
  DELETE_PERMISSION = "DELETE:Permission",

  // Menu Permission Management
  CREATE_MENU_PERMISSION = "CREATE:MenuPermission",
  READ_MENU_PERMISSION = "READ:MenuPermission",
  UPDATE_MENU_PERMISSION = "UPDATE:MenuPermission",
  DELETE_MENU_PERMISSION = "DELETE:MenuPermission",

  // Report & Analytics
  READ_REPORT = "READ:Report",
  EXPORT_REPORT = "EXPORT:Report",

  // Activity & Change Logs
  READ_ACTIVITY_LOG = "READ:ActivityLog",
  READ_CHANGE_LOG = "READ:ChangeLog",

  // Data Synchronization
  SYNC_DATA = "SYNC:Data",
}
```

### Menu Names

```typescript
enum MenuNames {
  USER_MANAGEMENT = "User Management",
  ROLE_MANAGEMENT = "Role Management",
  PERMISSION_MANAGEMENT = "Permission Management",
  REPORTS = "Reports",
  EXPORT = "Export",
  CHAT = "Chat",
  LOG = "Activity & Change Logs",
  METRICS = "Metrics & Monitoring",
}
```

---

## 📡 API Endpoints

### Standard Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "stats": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

#### Error Response

## 🎯 Branch Management

### GET /api/v1/branches

ดึงรายการสาขาทั้งหมดพร้อม pagination และการค้นหา

**Access**: Private (Authenticated + READ_REPORT permission)

#### Query Parameters

```
page?: number = 1
limit?: number = 10
search?: string
```

#### Response

```json
{
  "success": true,
  "message": "Branches retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "สาขาหลัก",
        "shortName": "HQ",
        "location": "กรุงเทพฯ",
        "phone": "02-123-4567",
        "address": "123 ถนนสุขุมวิท",
        "managerId": 1,
        "isActive": true,
        "createdAt": "2025-01-21T10:00:00.000Z"
      }
    ],
    "stats": {
      "totalItems": 5,
      "totalPages": 1,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### GET /api/v1/branches/:id

ดึงข้อมูลสาขาตาม ID

**Access**: Private (Authenticated + READ_REPORT permission)

#### Response

```json
{
  "success": true,
  "message": "Branch retrieved successfully",
  "data": {
    "branch": {
      "id": 1,
      "name": "สาขาหลัก",
      "shortName": "HQ",
      "location": "กรุงเทพฯ"
      // ... complete branch data
    }
  }
}
```

### GET /api/v1/branches/:id/stats

ดึงสถิติสรุปของสาขา

**Access**: Private (Authenticated + READ_REPORT permission)

#### Response

```json
{
  "success": true,
  "message": "Branch statistics retrieved successfully",
  "data": {
    "stats": {
      "totalContracts": 150,
      "activeContracts": 120,
      "totalValue": 5000000,
      "averageValue": 33333.33
    }
  }
}
```

---

## 👥 User Management

### POST /api/v1/users

สร้าง User ใหม่

**Access**: Private (USER_MANAGEMENT menu + CREATE_USER permission)

#### Request Body

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "081-234-5678",
  "profileUrl": "https://example.com/profile.jpg",
  "branchId": 1,
  "roleId": 2,
  "status": "ACTIVE"
}
```

#### Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 5,
      "email": "newuser@example.com",
      "fullName": "John Doe",
      "phoneNumber": "081-234-5678",
      "profileUrl": "https://example.com/profile.jpg",
      "status": "ACTIVE",
      "role": {
        "id": 2,
        "name": "Manager",
        "permissions": [...],
        "menuPermissions": [...]
      },
      "branch": {
        "id": 1,
        "name": "สาขาหลัก"
      },
      "createdAt": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

### GET /api/v1/users

ดึงรายการ Users ทั้งหมดพร้อม pagination และ filtering

**Access**: Private (USER_MANAGEMENT menu + READ_USER permission)

#### Query Parameters

```
page?: number = 1
limit?: number = 10
search?: string
status?: "ACTIVE" | "INACTIVE"
branchId?: number
roleId?: number
```

#### Response

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "email": "admin@example.com",
        "fullName": "Admin User",
        "phoneNumber": "081-111-1111",
        "status": "ACTIVE",
        "role": {
          "id": 1,
          "name": "Admin"
        },
        "branch": {
          "id": 1,
          "name": "สาขาหลัก"
        },
        "createdAt": "2025-01-21T10:00:00.000Z"
      }
    ],
    "stats": {
      "totalItems": 10,
      "totalPages": 1,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### GET /api/v1/users/:id

ดึงข้อมูล User ตาม ID

**Access**: Private (Self หรือ Admin)

#### Response

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "fullName": "Admin User",
      "phoneNumber": "081-111-1111",
      "profileUrl": null,
      "status": "ACTIVE",
      "role": {
        "id": 1,
        "name": "Admin",
        "description": "Full system access",
        "permissions": [...],
        "menuPermissions": [...]
      },
      "branch": {
        "id": 1,
        "name": "สาขาหลัก",
        "shortName": "HQ",
        "location": "กรุงเทพฯ"
      },
      "createdAt": "2025-01-21T10:00:00.000Z",
      "updatedAt": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

### PUT /api/v1/users/:id

อัพเดทข้อมูล User

**Access**: Private (Self for basic info, Admin for role/status)

#### Request Body

```json
{
  "fullName": "Updated Name",
  "phoneNumber": "081-999-9999",
  "profileUrl": "https://example.com/new-profile.jpg",
  "password": "newpassword123", // Optional
  "branchId": 2, // Admin only
  "roleId": 3, // Admin only
  "status": "INACTIVE" // Admin only
}
```

#### Response

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### DELETE /api/v1/users/:id

ลบ User (Soft Delete)

**Access**: Private (USER_MANAGEMENT menu + DELETE_USER permission)

#### Response

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### GET /api/v1/users/:id/permissions

ดึงข้อมูลสิทธิ์ของ User

**Access**: Private (Self หรือ Admin)

#### Response

```json
{
  "success": true,
  "message": "User permissions retrieved successfully",
  "data": {
    "permissions": {
      "role": {
        "id": 1,
        "name": "Admin"
      },
      "permissions": [
        {
          "id": 1,
          "name": "CREATE:User",
          "description": "Create new users"
        }
      ],
      "menuPermissions": [
        {
          "id": 1,
          "name": "User Management",
          "description": "Access user management module"
        }
      ]
    }
  }
}
```

### PUT /api/v1/users/:id/role

เปลี่ยน Role ของ User

**Access**: Private (USER_MANAGEMENT menu + UPDATE_USER permission)

#### Request Body

```json
{
  "roleId": 3
}
```

#### Response

```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      // Updated user with new role
    }
  }
}
```

---

## 🛡️ Role Management

### POST /api/v1/roles

สร้าง Role ใหม่

**Access**: Private (ROLE_MANAGEMENT menu + CREATE_ROLE permission)

#### Request Body

```json
{
  "name": "Branch Manager",
  "description": "Branch level management access",
  "permissionIds": [1, 2, 3],
  "menuPermissionIds": [1, 2]
}
```

#### Response

```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role": {
      "id": 4,
      "name": "Branch Manager",
      "description": "Branch level management access",
      "permissions": [
        {
          "id": 1,
          "name": "READ:User",
          "description": "Read user information"
        }
      ],
      "menuPermissions": [
        {
          "id": 1,
          "name": "User Management",
          "description": "Access user management"
        }
      ],
      "createdAt": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

### GET /api/v1/roles

ดึงรายการ Roles ทั้งหมดพร้อม pagination และ filtering

**Access**: Private (ROLE_MANAGEMENT menu + READ_ROLE permission)

#### Query Parameters

```
page?: number = 1
limit?: number = 10
search?: string
```

#### Response

```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Admin",
        "description": "Full system access",
        "permissions": [...],
        "menuPermissions": [...],
        "userCount": 2,
        "createdAt": "2025-01-21T10:00:00.000Z"
      }
    ],
    "stats": {
      "totalItems": 5,
      "totalPages": 1,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### GET /api/v1/roles/:id

ดึงข้อมูล Role ตาม ID

**Access**: Private (ROLE_MANAGEMENT menu + READ_ROLE permission)

### PUT /api/v1/roles/:id

อัพเดทข้อมูล Role

**Access**: Private (ROLE_MANAGEMENT menu + UPDATE_ROLE permission)

### DELETE /api/v1/roles/:id

ลบ Role

**Access**: Private (ROLE_MANAGEMENT menu + DELETE_ROLE permission)

---

## 🔑 Permission Management

### POST /api/v1/permissions

สร้าง Permission ใหม่

**Access**: Private (PERMISSION_MANAGEMENT menu + CREATE_PERMISSION permission)

### GET /api/v1/permissions

ดึงรายการ Permissions ทั้งหมด

**Access**: Private (PERMISSION_MANAGEMENT menu + READ_PERMISSION permission)

### GET /api/v1/permissions/:id

ดึงข้อมูล Permission ตาม ID

**Access**: Private (PERMISSION_MANAGEMENT menu + READ_PERMISSION permission)

### PUT /api/v1/permissions/:id

อัพเดทข้อมูล Permission

**Access**: Private (PERMISSION_MANAGEMENT menu + UPDATE_PERMISSION permission)

### DELETE /api/v1/permissions/:id

ลบ Permission

**Access**: Private (PERMISSION_MANAGEMENT menu + DELETE_PERMISSION permission)

---

## 🧭 Menu Permission Management

### POST /api/v1/menu-permissions

สร้าง Menu Permission ใหม่

**Access**: Private (PERMISSION_MANAGEMENT menu + CREATE_MENU_PERMISSION permission)

### GET /api/v1/menu-permissions

ดึงรายการ Menu Permissions ทั้งหมด

**Access**: Private (PERMISSION_MANAGEMENT menu + READ_MENU_PERMISSION permission)

### GET /api/v1/menu-permissions/:id

ดึงข้อมูล Menu Permission ตาม ID

**Access**: Private (PERMISSION_MANAGEMENT menu + READ_MENU_PERMISSION permission)

### PUT /api/v1/menu-permissions/:id

อัพเดทข้อมูล Menu Permission

**Access**: Private (PERMISSION_MANAGEMENT menu + UPDATE_MENU_PERMISSION permission)

### DELETE /api/v1/menu-permissions/:id

ลบ Menu Permission

**Access**: Private (PERMISSION_MANAGEMENT menu + DELETE_MENU_PERMISSION permission)

---

## 🧭 Menu Endpoints

### GET /api/v1/menu/branches

ดึงรายการสาขาสำหรับ dropdown/menu

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Menu branches retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "สาขาหลัก",
      "shortName": "HQ",
      "location": "กรุงเทพฯ"
    }
  ]
}
```

### GET /api/v1/menu/roles

ดึงรายการ roles สำหรับ dropdown/menu

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Menu roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Full system access"
    }
  ]
}
```

### GET /api/v1/menu/permissions

ดึงรายการ permissions สำหรับ dropdown/menu

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Menu permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "CREATE:User",
      "description": "Create new users"
    }
  ]
}
```

### GET /api/v1/menu/menu-permissions

ดึงรายการ menu permissions สำหรับ dropdown/menu

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Menu menu permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "dashboard_view",
      "description": "View dashboard",
      "menu": "Dashboard"
    }
  ]
}
```

---

## 💰 Gold Price Management

### GET /api/v1/gold-price/history

ดึงประวัติราคาทองคำพร้อม filtering ตามวันที่

**Access**: Private (REPORTS menu + READ_REPORT permission)

#### Query Parameters

```
startDate?: string (YYYY-MM-DD)
endDate?: string (YYYY-MM-DD)
limit?: number = 100
```

#### Response

```json
{
  "success": true,
  "message": "Gold price history retrieved successfully",
  "data": [
    {
      "id": 1,
      "buyPrice": 28500.0,
      "sellPrice": 28600.0,
      "date": "2025-01-21",
      "source": "EXTERNAL_API",
      "createdAt": "2025-01-21T10:00:00.000Z"
    }
  ]
}
```

### GET /api/v1/gold-price/latest

ดึงราคาทองคำล่าสุด

**Access**: Private (REPORTS menu + READ_REPORT permission)

#### Response

```json
{
  "success": true,
  "message": "Latest gold price retrieved successfully",
  "data": {
    "goldPrice": {
      "id": 1,
      "buyPrice": 28500.0,
      "sellPrice": 28600.0,
      "date": "2025-01-21",
      "source": "EXTERNAL_API",
      "createdAt": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

---

## 🏪 Pawn Shop Operations

### GET /api/v1/branches/daily-operation/summary

ดึงสรุปการดำเนินงานรายวันของทุกสาขา

**Access**: Private (REPORTS menu + READ_REPORT permission)

#### Query Parameters

```
branchId?: number
date?: string (YYYY-MM-DD)
```

#### Response

```json
{
  "success": true,
  "message": "Daily operations summary retrieved successfully",
  "data": [
    {
      "branchId": 1,
      "branchName": "สาขาหลัก",
      "date": "2025-01-21",
      "totalContracts": 25,
      "totalAmount": 500000.0,
      "averageAmount": 20000.0
    }
  ]
}
```

### GET /api/v1/branches/weekly-operation/summary

ดึงสรุปการดำเนินงานรายสัปดาห์ของสาขา โดยเปรียบเทียบสัปดาห์นี้กับสัปดาห์ที่แล้ว (จันทร์-อาทิตย์)

**Access**: Private (REPORTS menu + READ_REPORT permission)

#### Query Parameters

```
branchId: number (required)
date: string (YYYY-MM-DD) (required) - วันที่อ้างอิงสำหรับคำนวณสัปดาห์
```

#### Response

```json
{
  "success": true,
  "message": "Branch weekly summary retrieved successfully",
  "data": {
    "branchId": 1,
    "cashIn": {
      "data": [...], // รวมทั้งสองสัปดาห์ (backward compatibility)
      "thisWeek": [ // ข้อมูลสัปดาห์นี้
        {
          "total": 100000,
          "date": "2025-01-21T10:00:00.000Z"
        }
      ],
      "lastWeek": [ // ข้อมูลสัปดาห์ที่แล้ว
        {
          "total": 80000,
          "date": "2025-01-14T10:00:00.000Z"
        }
      ],
      "total": 180000, // รวมทั้งสองสัปดาห์
      "last7Days": 100000, // ยอดรวมสัปดาห์นี้
      "prev7Days": 80000, // ยอดรวมสัปดาห์ที่แล้ว
      "percentChange": 25.0 // เปอร์เซ็นต์การเปลี่ยนแปลง
    },
    "cashOut": {
      "data": [...], // รวมทั้งสองสัปดาห์ (backward compatibility)
      "thisWeek": [...], // ข้อมูลสัปดาห์นี้
      "lastWeek": [...], // ข้อมูลสัปดาห์ที่แล้ว
      "total": 150000,
      "last7Days": 85000,
      "prev7Days": 65000,
      "percentChange": 30.77
    },
    "timestamp": "2025-01-21T10:00:00.000Z"
  }
}
```

### GET /api/v1/contracts/transactions/details

ดึงรายละเอียดธุรกรรมสัญญาพร้อม filtering

**Access**: Private (REPORTS menu + READ_REPORT permission)

### GET /api/v1/contracts/transactions/summary

ดึงสรุปธุรกรรมสัญญาพร้อมข้อมูลรวม

**Access**: Private (REPORTS menu + READ_REPORT permission)

---

## 🏷️ Asset Type Reports

### GET /api/v1/asset-types/summary

ดึงสรุปประเภททรัพย์สำหรับสาขาและวันที่ที่ระบุ พร้อมรองรับการแสดงผล Top N + อื่นๆ

**Access**: Private (REPORTS menu + READ_REPORT permission)

#### Query Parameters

```
branchId: number (required)
date: string (YYYY-MM-DD) (required)
top?: number (optional) - หากระบุจะแสดง Top N + "อื่นๆ"
```

#### Response (ไม่มี top parameter)

```json
{
  "success": true,
  "message": "Asset type summary retrieved successfully",
  "data": {
    "branchId": 1,
    "totalTransactions": 50,
    "totalAssetTypes": 8,
    "assetTypeSummaries": [
      {
        "assetType": "ทองคำ",
        "count": 15,
        "percentage": 30.0
      },
      {
        "assetType": "เครื่องประดับ",
        "count": 12,
        "percentage": 24.0
      }
      // ... รายการทั้งหมด
    ],
    "timestamp": "2025-01-21T10:00:00.000Z"
  }
}
```

#### Response (มี top parameter = 5)

```json
{
  "success": true,
  "message": "Asset type summary retrieved successfully",
  "data": {
    "branchId": 1,
    "totalTransactions": 50,
    "totalAssetTypes": 8,
    "top": 5,
    "assetTypeSummaries": [
      {
        "assetType": "ทองคำ",
        "count": 15,
        "percentage": 30.0
      },
      {
        "assetType": "เครื่องประดับ",
        "count": 12,
        "percentage": 24.0
      },
      {
        "assetType": "นาฬิกา",
        "count": 8,
        "percentage": 16.0
      },
      {
        "assetType": "แหวน",
        "count": 6,
        "percentage": 12.0
      },
      {
        "assetType": "สร้อยคอ",
        "count": 4,
        "percentage": 8.0
      },
      {
        "assetType": "อื่นๆ",
        "count": 5,
        "percentage": 10.0
      }
    ],
    "timestamp": "2025-01-21T10:00:00.000Z"
  }
}
```

### GET /api/v1/asset-types/top-ranking

ดึงอันดับประเภททรัพย์ยอดนิยมพร้อม count และมูลค่ารวม

**Access**: Private (REPORTS menu + READ_REPORT permission)

### GET /api/v1/asset-types/ranking-by-period

ดึงอันดับประเภททรัพย์ยอดนิยมในช่วง 7 วันจากวันที่ระบุ

**Access**: Private (REPORTS menu + READ_REPORT permission)

---

## 🔄 Data Synchronization

### POST /api/v1/asset-types/sync

ซิงค์ข้อมูลประเภททรัพย์จาก external source

**Access**: Private (Admin + SYNC_DATA permission)

### POST /api/v1/branches/sync

ซิงค์ข้อมูลสาขาจาก external source

**Access**: Private (Admin + SYNC_DATA permission)

### POST /api/v1/gold-price/sync

ซิงค์ข้อมูลราคาทองคำจาก external source

**Access**: Private (Admin + SYNC_DATA permission)

### POST /api/v1/officers/sync

ซิงค์ข้อมูลเจ้าหน้าที่จาก external source

**Access**: Private (Admin + SYNC_DATA permission)

### POST /api/v1/contracts/transactions/sync

ซิงค์ข้อมูลธุรกรรมสัญญาจาก external source

**Access**: Private (Admin + SYNC_DATA permission)

#### Request Body

```json
{
  "branchId": 1,
  "startDate": "2025-01-01",
  "endDate": "2025-01-21"
}
```

### POST /api/v1/daily-operations/sync

ซิงค์ข้อมูลการดำเนินงานรายวันจาก external source

**Access**: Private (Admin + SYNC_DATA permission)

#### Request Body

```json
{
  "branchId": 1,
  "date": "2025-01-21"
}
```

---

## 📤 Export Operations

### GET /api/v1/contracts/transactions/export/csv

ส่งออกข้อมูลธุรกรรมสัญญาเป็นไฟล์ CSV

**Access**: Private (EXPORT menu + EXPORT_REPORT permission)

#### Query Parameters

```
branchId?: number
startDate?: string (YYYY-MM-DD)
endDate?: string (YYYY-MM-DD)
assetTypeId?: number
```

#### Response

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="contract_transactions_YYYYMMDD.csv"

CSV file with UTF-8 BOM for Thai language support
```

---

## 💬 Chat Management

### POST /api/v1/chat

ส่งข้อความไปยัง AI Chat

**Access**: Private (CHAT menu)

#### Request Body

```json
{
  "message": "สวัสดีครับ ช่วยอธิบายระบบจำนำหน่อย"
}
```

#### Response (Streaming)

```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "conversationId": "conv_12345",
    "response": "สวัสดีครับ! ระบบจำนำนี้เป็น...",
    "isComplete": true
  }
}
```

### GET /api/v1/chat/conversations

ดึงรายการ conversations ของ User พร้อม pagination

**Access**: Private (CHAT menu)

#### Query Parameters

```
page?: number = 1
limit?: number = 10
```

#### Response

```json
{
  "success": true,
  "message": "Conversations retrieved successfully",
  "data": {
    "items": [
      {
        "id": "conv_12345",
        "title": "คำถามเกี่ยวกับระบบจำนำ",
        "lastMessage": "ขอบคุณสำหรับข้อมูลครับ",
        "messageCount": 5,
        "createdAt": "2025-01-21T10:00:00.000Z",
        "updatedAt": "2025-01-21T10:30:00.000Z"
      }
    ],
    "stats": {
      "totalItems": 15,
      "totalPages": 2,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### DELETE /api/v1/chat/conversations/:conversationId

ลบ conversation ที่ระบุ

**Access**: Private (CHAT menu)

#### Response

```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

---

## 📊 Activity Logs

### GET /api/v1/activity-logs

ดึงรายการ Activity Logs ทั้งหมดพร้อม pagination และ filtering

**Access**: Private (Admin + LOG menu + READ_ACTIVITY_LOG permission)

#### Query Parameters

```
page?: number = 1
limit?: number = 10
userId?: number
action?: string
entityType?: string
startDate?: string (YYYY-MM-DD)
endDate?: string (YYYY-MM-DD)
```

#### Response

```json
{
  "success": true,
  "message": "Activity logs retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "userId": 1,
        "action": "CREATE",
        "entityType": "User",
        "entityId": 5,
        "details": {
          "email": "newuser@example.com",
          "role": "Manager"
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "user": {
          "id": 1,
          "fullName": "Admin User",
          "email": "admin@example.com"
        },
        "createdAt": "2025-01-21T10:00:00.000Z"
      }
    ],
    "stats": {
      "totalItems": 500,
      "totalPages": 50,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### GET /api/v1/activity-logs/stats

ดึงสถิติกิจกรรมของผู้ใช้

**Access**: Private (Admin + LOG menu + READ_ACTIVITY_LOG permission)

### GET /api/v1/activity-logs/user/:userId

ดึงกิจกรรมของ User ที่ระบุ

**Access**: Private (Self หรือ Admin)

### GET /api/v1/activity-logs/:id

ดึงข้อมูล Activity Log ตาม ID

**Access**: Private (Admin + LOG menu + READ_ACTIVITY_LOG permission)

### DELETE /api/v1/activity-logs/cleanup

ลบ Activity Logs เก่าที่เกินกำหนด (สำหรับ maintenance)

**Access**: Private (Admin + LOG menu + READ_ACTIVITY_LOG permission)

#### Query Parameters

```
days?: number = 90
```

---

## 📝 Change Logs

### GET /api/v1/change-logs

ดึงรายการ Change Logs ทั้งหมดพร้อม pagination และ filtering

**Access**: Private (Admin + LOG menu + READ_CHANGE_LOG permission)

### GET /api/v1/change-logs/stats

ดึงสถิติการเปลี่ยนแปลงข้อมูล

**Access**: Private (Admin + LOG menu + READ_CHANGE_LOG permission)

### GET /api/v1/change-logs/entity/:tableName/:recordId

ดึงประวัติการเปลี่ยนแปลงของ entity ที่ระบุ

**Access**: Private (Admin + LOG menu + READ_CHANGE_LOG permission)

### GET /api/v1/change-logs/:id

ดึงข้อมูล Change Log ตาม ID

**Access**: Private (Admin + LOG menu + READ_CHANGE_LOG permission)

---

## 📈 Metrics & Monitoring

### GET /api/metrics

ดึงข้อมูล API metrics และสถิติการใช้งาน

**Access**: Private (Admin + METRICS menu)

#### Response

```json
{
  "success": true,
  "message": "API metrics retrieved successfully",
  "data": {
    "totalRequests": 15420,
    "requestsToday": 1250,
    "averageResponseTime": 125.5,
    "errorRate": 0.02,
    "popularEndpoints": [
      {
        "endpoint": "/api/v1/users",
        "count": 2340,
        "averageTime": 95.2
      }
    ]
  }
}
```

### GET /api/metrics/requests

ดึงรายการ API requests ล่าสุด

**Access**: Private (Admin + METRICS menu)

### GET /api/metrics/performance

ดึงสรุปประสิทธิภาพ API

**Access**: Private (Admin + METRICS menu)

### DELETE /api/metrics

ลบข้อมูล metrics ทั้งหมด (development/testing เท่านั้น)

**Access**: Private (Admin + METRICS menu)

---

## 🛡️ Protected Routes

### GET /api/protected

ทดสอบ protected route เพื่อตรวจสอบ authentication

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Welcome to protected route",
  "data": {
    "user": {
      // Current user information
    }
  }
}
```

---

## 📊 Response Format

### Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "stats": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Description           | Use Case                                   |
| ----------- | --------------------- | ------------------------------------------ |
| 200         | OK                    | Successful GET, PUT operations             |
| 201         | Created               | Successful POST operations                 |
| 400         | Bad Request           | Invalid input, validation errors           |
| 401         | Unauthorized          | Missing or invalid authentication token    |
| 403         | Forbidden             | Insufficient permissions                   |
| 404         | Not Found             | Resource not found                         |
| 409         | Conflict              | Duplicate data, constraint violations      |
| 422         | Unprocessable Entity  | Validation errors with specific field info |
| 429         | Too Many Requests     | Rate limit exceeded                        |
| 500         | Internal Server Error | Server-side errors                         |

### Common Error Codes

```typescript
enum ErrorCodes {
  // Authentication Errors
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_BLACKLISTED = "TOKEN_BLACKLISTED",

  // Authorization Errors
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  MENU_ACCESS_DENIED = "MENU_ACCESS_DENIED",

  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  REQUIRED_FIELD_MISSING = "REQUIRED_FIELD_MISSING",
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  PASSWORD_TOO_WEAK = "PASSWORD_TOO_WEAK",

  // Business Logic Errors
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  ROLE_IN_USE = "ROLE_IN_USE",
  BRANCH_NOT_FOUND = "BRANCH_NOT_FOUND",

  // System Errors
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  FILE_UPLOAD_ERROR = "FILE_UPLOAD_ERROR",
}
```

### Error Response Examples

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

#### Permission Error

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "details": "You need 'CREATE:User' permission to perform this action"
  }
}
```

#### Rate Limit Error

```json
{
  "success": false,
  "message": "Too many requests",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "details": "Maximum 100 requests per 15 minutes allowed"
  }
}
```

---

## 🔓 Authentication Routes

### POST /api/auth/login

Login with email and password

**Access**: Public  
**Rate Limit**: Strict (prevent brute force)

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": {
        "id": 1,
        "name": "Admin",
        "permissions": [...],
        "menuPermissions": [...]
      },
      "branch": {
        "id": 1,
        "name": "Main Branch"
      }
    }
  }
}
```

### POST /api/auth/logout

Logout and invalidate token

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/auth/me

Get current user information

**Access**: Private (Authenticated)

#### Response

```json
{
  "success": true,
  "message": "User information retrieved successfully",
  "data": {
    "user": {
      // Complete user object with role and permissions
    }
  }
}
```

---

```json
{
  "success": false,
  "error": "Error message description",
  "details": {
    // Additional error details (optional)
  }
}
```

#### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    // Array of data items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔐 การยืนยันตัวตน (Authentication)

ระบบรองรับการยืนยันตัวตนด้วย **2 วิธี** เพื่อความยืดหยุ่นและความปลอดภัย:

1. **httpOnly Cookies** (แนะนำสำหรับ Web Apps) - ป้องกัน XSS attacks
2. **Authorization Header** (สำหรับ Mobile Apps, API Clients) - ควบคุมได้ง่าย

### 1. เข้าสู่ระบบ (Login)

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**🍪 httpOnly Cookie:**
เมื่อ login สำเร็จ ระบบจะตั้งค่า httpOnly cookie อัตโนมัติ:

```http
Set-Cookie: accessToken=eyJhbGciOiJIUzI1NiIs...;
            HttpOnly;
            Secure;
            SameSite=Strict;
            Path=/;
            Max-Age=86400
```

**Cookie Properties:**

- `httpOnly: true` - ป้องกัน XSS (JavaScript ไม่สามารถเข้าถึงได้)
- `secure: true` - HTTPS only (ใน production)
- `sameSite: "strict"` - ป้องกัน CSRF attacks
- `maxAge: 86400000` - อายุ 24 ชั่วโมง (configurable via environment)
- `path: "/"` - ใช้ได้ทั้งเว็บไซต์

**Rate Limiting:**

- 5 attempts per 15 minutes per IP + email combination

### 2. ออกจากระบบ (Logout)

**POST** `/auth/logout`

**Authentication Methods:**

```http
# Option 1: Authorization Header
Authorization: Bearer <access_token>

# Option 2: httpOnly Cookie (automatic)
Cookie: accessToken=<access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

**Features:**

- ✅ Automatically adds token to blacklist
- ✅ Clears httpOnly cookie
- ✅ Prevents reuse of logged-out tokens
- ✅ Works with both authentication methods

### 3. การใช้งาน Authentication

#### 🌐 **Web Applications (แนะนำ):**

```javascript
// Login - Cookie จะถูกตั้งค่าอัตโนมัติ
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
  credentials: "include", // สำคัญ! เพื่อรับ/ส่ง cookies
});

// API Calls - Cookie จะถูกส่งอัตโนมัติ
const users = await fetch("/api/v1/users", {
  credentials: "include", // Cookie จะถูกส่งไปด้วย
});

// Logout
await fetch("/api/auth/logout", {
  method: "POST",
  credentials: "include",
});
```

#### 📱 **Mobile Apps / API Clients:**

```javascript
// Login และเก็บ token
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { accessToken } = loginResponse.data;

// เก็บ token ใน secure storage
await SecureStore.setItemAsync("accessToken", accessToken);

// API Calls พร้อม Authorization Header
const users = await fetch("/api/v1/users", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

// Logout
await fetch("/api/auth/logout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

#### 🔧 **API Testing (Postman, curl):**

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 4. ความปลอดภัย (Security Features)

#### 🛡️ **httpOnly Cookie Security:**

- **XSS Protection**: JavaScript ไม่สามารถเข้าถึง cookie ได้
- **CSRF Protection**: `SameSite=Strict` ป้องกัน cross-site requests
- **Transport Security**: `Secure` flag ใช้งานได้เฉพาะ HTTPS
- **Automatic Management**: Browser จัดการ cookie อัตโนมัติ

#### 🔐 **Token Blacklist System:**

- Token ที่ logout จะถูกเพิ่มใน blacklist ทันที
- Blacklist มี TTL ตาม token expiration
- ป้องกันการใช้ token ซ้ำหลัง logout

#### ⏱️ **Configurable Expiration:**

- JWT expiration และ Cookie maxAge sync กัน
- ปรับได้ผ่าน environment variables
- Default: 24 ชั่วโมง

### 3. ดึงข้อมูลผู้ใช้ปัจจุบัน

**GET** `/auth/me`

**Authentication Methods:**

```http
# Option 1: Authorization Header
Authorization: Bearer <access_token>

# Option 2: httpOnly Cookie (automatic)
Cookie: accessToken=<access_token>
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0812345678",
    "profileUrl": "https://example.com/avatar.jpg",
    "status": "ACTIVE",
    "lastLoginAt": "2025-07-22T10:30:00.000Z",
    "branchId": 1,
    "branch": {
      "id": 1,
      "name": "สาขาลาดพร้าว",
      "shortName": "LPR",
      "location": "ลาดพร้าว กรุงเทพฯ",
      "centerName": "ศูนย์กลางลาดพร้าว"
    },
    "role": {
      "id": 2,
      "name": "Manager",
      "description": "Branch Manager Role",
      "permissions": [
        {
          "id": 1,
          "name": "READ_USER",
          "description": "Read user information"
        },
        {
          "id": 2,
          "name": "WRITE_USER",
          "description": "Create and update users"
        }
      ],
      "menuPermissions": [
        {
          "id": 1,
          "menu": "USER_MANAGEMENT",
          "name": "User Management Menu",
          "description": "Access to user management features"
        },
        {
          "id": 2,
          "menu": "REPORTS",
          "name": "Reports Menu",
          "description": "Access to reports and analytics"
        }
      ]
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-07-22T10:30:00.000Z"
  }
}
```

**Response (Error - Unauthorized):**

```json
{
  "success": false,
  "error": "Access denied: No token provided"
}
```

**Use Cases:**

- ✅ ตรวจสอบสถานะการ login
- ✅ ดึงข้อมูล user profile
- ✅ ตรวจสอบ permissions
- ✅ แสดงข้อมูล branch และ role
- ✅ Validate session หลัง page refresh

**Frontend Implementation:**

```javascript
// ตรวจสอบ user ปัจจุบัน
const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data; // User object
  } catch (error) {
    // User ไม่ได้ login หรือ token หมดอายุ
    console.log("User not authenticated");
    return null;
  }
};

// ใช้งานใน component
useEffect(() => {
  getCurrentUser().then((user) => {
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    } else {
      // Redirect to login
      router.push("/login");
    }
  });
}, []);
```

### 4. Environment Configuration

```env
# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Cookie Settings
COOKIE_MAX_AGE=86400000  # 24 hours in milliseconds
COOKIE_SECURE=true       # HTTPS only in production
COOKIE_SAME_SITE=strict  # CSRF protection
```

---

## 👥 การจัดการผู้ใช้งาน (User Management)

### 1. ดึงรายการผู้ใช้งาน

**GET** `/users`

**Permissions Required:**

- Menu: `User Management`
- Action: `READ:User`

**Query Parameters:**

```
?page=1&limit=10&search=john&status=ACTIVE&sortBy=fullName&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "0812345678",
      "status": "ACTIVE",
      "role": {
        "id": 1,
        "name": "Admin"
      },
      "branch": {
        "id": 1,
        "name": "Bangkok Branch"
      },
      "lastLoginAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. ดึงข้อมูลผู้ใช้งานตาม ID

**GET** `/users/:id`

**Access:** Self or Admin only

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0812345678",
    "profileUrl": "https://example.com/profiles/john.jpg",
    "status": "ACTIVE",
    "branchId": 1,
    "roleId": 1,
    "role": {
      "id": 1,
      "name": "Admin",
      "permissions": [...],
      "menuPermissions": [...]
    },
    "branch": {
      "id": 1,
      "name": "Bangkok Branch"
    },
    "lastLoginAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. สร้างผู้ใช้งานใหม่

**POST** `/users`

**Permissions Required:**

- Menu: `User Management`
- Action: `CREATE:User`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "fullName": "New User",
  "phoneNumber": "0812345678",
  "profileUrl": "https://example.com/profile.jpg",
  "branchId": 1,
  "roleId": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 25,
    "email": "newuser@example.com",
    "fullName": "New User",
    "status": "ACTIVE"
  }
}
```

### 4. อัพเดทข้อมูลผู้ใช้งาน

**PUT** `/users/:id`

**Access:** Self for basic info, Admin for role/status

**Request Body:**

```json
{
  "fullName": "Updated Name",
  "phoneNumber": "0887654321",
  "profileUrl": "https://example.com/new-profile.jpg"
}
```

### 5. ลบผู้ใช้งาน (Soft Delete)

**DELETE** `/users/:id`

**Permissions Required:**

- Menu: `User Management`
- Action: `DELETE:User`

### 6. ดึงสิทธิ์ของผู้ใช้งาน

**GET** `/users/:id/permissions`

**Access:** Self or Admin only

**Response:**

```json
{
  "success": true,
  "message": "User permissions retrieved successfully",
  "data": {
    "userId": 1,
    "role": {
      "id": 1,
      "name": "Admin"
    },
    "permissions": [
      {
        "id": 1,
        "action": "CREATE:User",
        "description": "Can create new users"
      }
    ],
    "menuPermissions": [
      {
        "id": 1,
        "menuName": "User Management",
        "description": "Access to user management"
      }
    ]
  }
}
```

### 7. เปลี่ยน Role ของผู้ใช้งาน

**PUT** `/users/:id/role`

**Permissions Required:**

- Menu: `User Management`
- Action: `UPDATE:User`

**Request Body:**

```json
{
  "roleId": 3
}
```

---

## 🎭 การจัดการบทบาทและสิทธิ์ (Roles & Permissions)

### บทบาท (Roles)

#### 1. ดึงรายการบทบาททั้งหมด

**GET** `/roles`

**Permissions Required:**

- Menu: `Role Management`
- Action: `READ:Role`

**Response:**

```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "description": "System administrator with full access",
      "permissions": [
        {
          "id": 1,
          "action": "CREATE:User",
          "description": "Can create new users"
        }
      ],
      "menuPermissions": [
        {
          "id": 1,
          "menuName": "User Management"
        }
      ],
      "userCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. ดึงข้อมูลบทบาทตาม ID

**GET** `/roles/:id`

#### 3. สร้างบทบาทใหม่

**POST** `/roles`

**Request Body:**

```json
{
  "name": "Branch Manager",
  "description": "Manager role for branch operations",
  "permissionIds": [1, 2, 3, 5],
  "menuPermissionIds": [1, 2, 4]
}
```

#### 4. อัปเดตบทบาท

**PUT** `/roles/:id`

#### 5. ลบบทบาท

**DELETE** `/roles/:id`

### สิทธิ์ (Permissions)

#### 1. ดึงรายการสิทธิ์ทั้งหมด

**GET** `/permissions`

**Response:**

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "id": 1,
      "action": "CREATE:User",
      "description": "Can create new users",
      "category": "User Management",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. สร้างสิทธิ์ใหม่

**POST** `/permissions`

**Request Body:**

```json
{
  "action": "UPDATE:Contract",
  "description": "Can update contract information",
  "category": "Contract Management"
}
```

### สิทธิ์เมนู (Menu Permissions)

#### 1. ดึงรายการสิทธิ์เมนูทั้งหมด

**GET** `/menu-permissions`

#### 2. สร้างสิทธิ์เมนูใหม่

**POST** `/menu-permissions`

**Request Body:**

```json
{
  "menuName": "Reports",
  "description": "Access to reporting system",
  "icon": "chart-bar",
  "url": "/reports"
}
```

---

## 💎 ข้อมูลร้านจำนำ (Pawn Shop Data)

### 1. สรุปการดำเนินงานรายวัน

**GET** `/branches/daily-operation/summary`

**Permissions Required:**

- Menu: `Reports`
- Action: `READ:Report`

**Query Parameters:**

```
?branchId=1&date=2024-01-15
```

**Response:**

```json
{
  "success": true,
  "message": "Daily operation summary retrieved successfully",
  "data": {
    "branchId": 1,
    "branchName": "Bangkok Branch",
    "date": "2024-01-15",
    "summary": {
      "totalContracts": 45,
      "totalAmount": 2500000,
      "newContracts": 12,
      "renewedContracts": 8,
      "redeemedContracts": 5,
      "interestCollected": 85000
    },
    "assetTypes": [
      {
        "type": "Gold",
        "count": 25,
        "amount": 1800000
      }
    ]
  }
}
```

### 2. สรุปการดำเนินงานรายสัปดาห์

**GET** `/branches/weekly-operation/summary`

**Query Parameters:**

```
?branchId=1&date=2024-01-15
```

### 3. รายละเอียดธุรกรรมสัญญา

**GET** `/contracts/transactions/details`

**Query Parameters:**

```
?branchId=1&date=2024-01-15&page=1&limit=20&contractNumber=C240115001
```

**Response:**

```json
{
  "success": true,
  "message": "Contract transaction details retrieved successfully",
  "data": [
    {
      "contractNumber": "C240115001",
      "transactionDate": "2024-01-15T10:30:00.000Z",
      "transactionType": "NEW_CONTRACT",
      "branchId": 1,
      "customerName": "นาย สมชาย ใจดี",
      "customerPhone": "0812345678",
      "assetType": "ทองคำแผ่น",
      "assetDetail": "ทองคำแผ่น 1 บาท 96.5%",
      "pawnPrice": 45000,
      "monthlyInterest": 900,
      "remainingAmount": 45000,
      "interestAmount": 0,
      "overdueDays": 0,
      "ticketStatus": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 4. สรุปธุรกรรมสัญญา

**GET** `/contracts/transactions/summary`

**Response:**

```json
{
  "success": true,
  "message": "Contract transaction summary retrieved successfully",
  "data": {
    "totalTransactions": 150,
    "totalAmount": 6750000,
    "averageContractValue": 45000,
    "transactionTypes": {
      "NEW_CONTRACT": 45,
      "RENEWAL": 32,
      "REDEMPTION": 28,
      "INTEREST_PAYMENT": 45
    },
    "statusSummary": {
      "ACTIVE": 89,
      "REDEEMED": 28,
      "OVERDUE": 12,
      "AUCTION": 3
    }
  }
}
```

---

## � การจัดการสาขา (Branch Management)

### 1. ดึงรายการสาขาทั้งหมด

**GET** `/branches`

ดึงรายการสาขาทั้งหมดพร้อม pagination และการค้นหา

**Query Parameters:**

- `page` (number, optional): หมายเลขหน้า (default: 1)
- `limit` (number, optional): จำนวนรายการต่อหน้า (default: 10)
- `search` (string, optional): คำค้นหาในชื่อสาขา ชื่อย่อ หรือชื่อศูนย์
- `location` (string, optional): กรองตามที่ตั้ง

**Response:**

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "สาขาเซ็นทรัลลาดพร้าว",
        "shortName": "CLD",
        "location": "กรุงเทพมหานคร",
        "centerName": "เซ็นทรัลลาดพร้าว",
        "createdAt": "2025-01-15T08:00:00.000Z",
        "updatedAt": "2025-07-22T10:30:00.000Z",
        "_count": {
          "contracts": 1250,
          "dailyOperations": 365,
          "officers": 12,
          "users": 8
        }
      },
      {
        "id": 2,
        "name": "สาขาสยามพารากอน",
        "shortName": "SP",
        "location": "กรุงเทพมหานคร",
        "centerName": "สยามพารากอน",
        "createdAt": "2025-01-15T08:00:00.000Z",
        "updatedAt": "2025-07-22T10:30:00.000Z",
        "_count": {
          "contracts": 980,
          "dailyOperations": 365,
          "officers": 10,
          "users": 6
        }
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  },
  "message": "Branches retrieved successfully"
}
```

### 2. ดึงข้อมูลสาขาตาม ID

**GET** `/branches/:id`

ดึงข้อมูลสาขาเดี่ยวพร้อมรายละเอียดความสัมพันธ์

**Path Parameters:**

- `id` (number): ID ของสาขา

**Response:**

```json
{
  "status": "success",
  "data": {
    "data": {
      "id": 1,
      "name": "สาขาเซ็นทรัลลาดพร้าว",
      "shortName": "CLD",
      "location": "กรุงเทพมหานคร",
      "centerName": "เซ็นทรัลลาดพร้าว",
      "createdAt": "2025-01-15T08:00:00.000Z",
      "updatedAt": "2025-07-22T10:30:00.000Z",
      "_count": {
        "contracts": 1250,
        "dailyOperations": 365,
        "officers": 12,
        "users": 8
      }
    }
  },
  "message": "Branch details retrieved successfully"
}
```

### 3. ดึงข้อมูลสาขาตามชื่อ

**GET** `/branches/name/:name`

ดึงข้อมูลสาขาโดยค้นหาจากชื่อ (exact match)

**Path Parameters:**

- `name` (string): ชื่อของสาขา

**Response:**

```json
{
  "status": "success",
  "data": {
    "data": {
      "id": 1,
      "name": "สาขาเซ็นทรัลลาดพร้าว",
      "shortName": "CLD",
      "location": "กรุงเทพมหานคร",
      "centerName": "เซ็นทรัลลาดพร้าว",
      "createdAt": "2025-01-15T08:00:00.000Z",
      "updatedAt": "2025-07-22T10:30:00.000Z",
      "_count": {
        "contracts": 1250,
        "dailyOperations": 365,
        "officers": 12,
        "users": 8
      }
    }
  },
  "message": "Branch details retrieved successfully"
}
```

### 4. ดึงสถิติสรุปของสาขา

**GET** `/branches/:id/stats`

ดึงข้อมูลสถิติรวมของสาขา เช่น จำนวนสัญญา ผู้ใช้งาน เป็นต้น

**Path Parameters:**

- `id` (number): ID ของสาขา

**Response:**

```json
{
  "status": "success",
  "data": {
    "data": {
      "branchId": 1,
      "branchName": "สาขาเซ็นทรัลลาดพร้าว",
      "contracts": {
        "total": 1250,
        "active": 890,
        "inactive": 360
      },
      "users": {
        "total": 8,
        "active": 7,
        "inactive": 1
      },
      "officers": {
        "total": 12
      },
      "operations": {
        "recentDays": 7
      },
      "lastUpdated": "2025-07-22T10:30:00.000Z"
    }
  },
  "message": "Branch statistics retrieved successfully"
}
```

### 5. ดึงรายการสาขาแบบง่าย

**GET** `/branches/menu`

ดึงรายการสาขาแบบง่ายสำหรับใช้ใน dropdown หรือ select options

**Response:**

```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "สาขาเซ็นทรัลลาดพร้าว",
        "shortName": "CLD",
        "location": "กรุงเทพมหานคร"
      },
      {
        "id": 2,
        "name": "สาขาสยามพารากอน",
        "shortName": "SP",
        "location": "กรุงเทพมหานคร"
      },
      {
        "id": 3,
        "name": "สาขาเทอร์มินอล 21",
        "shortName": "T21",
        "location": "กรุงเทพมหานคร"
      }
    ]
  },
  "message": "Simple branch list retrieved successfully"
}
```

**ข้อกำหนดการเข้าถึง (Access Requirements):**

- 🔒 **Authentication Required**: ต้องมี JWT Token ที่ valid
- 👥 **Permission Required**: ต้องมีสิทธิ์ `READ_REPORT` (ยกเว้น `/menu` ที่ต้องมีการ login เท่านั้น)
- 📝 **Rate Limiting**: อยู่ภายใต้ general rate limiting (100 requests/15 minutes)

**ข้อควรทราบ:**

- สำหรับ endpoint `/menu` ไม่ต้องการ permission พิเศษ เหมาะสำหรับใช้ใน dropdown
- การค้นหาใน endpoint หลักรองรับการค้นหาแบบ case-insensitive
- ข้อมูล `_count` จะแสดงจำนวนความสัมพันธ์ที่เกี่ยวข้องกับสาขา
- สถิติใน `/stats` endpoint จะคำนวณข้อมูลแบบ real-time

---

## �🏅 ราคาทองคำ (Gold Price)

### 1. ดึงราคาทองคำปัจจุบัน

**GET** `/gold-price/current`

**Response:**

```json
{
  "success": true,
  "message": "Current gold price retrieved successfully",
  "data": {
    "id": 1,
    "buyPrice": 32500,
    "sellPrice": 32700,
    "lastUpdated": "2024-01-15T10:30:00.000Z",
    "source": "External API",
    "isActive": true
  }
}
```

### 2. ดึงประวัติราคาทองคำ

**GET** `/gold-price/history`

**Query Parameters:**

```
?page=1&limit=10&dateFrom=2024-01-01&dateTo=2024-01-15&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "message": "Gold price history retrieved successfully",
  "data": [
    {
      "id": 25,
      "buyPrice": 32500,
      "sellPrice": 32700,
      "priceChange": 150,
      "percentageChange": 0.46,
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "source": "External API"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 3. บังคับซิงค์ราคาทองคำ

**POST** `/gold-price/sync`

**Permissions Required:**

- Menu: `Gold Price`
- Action: `SYNC:Data`

**Response:**

```json
{
  "success": true,
  "message": "Gold price synchronized successfully",
  "data": {
    "previousPrice": {
      "buyPrice": 32350,
      "sellPrice": 32550
    },
    "currentPrice": {
      "buyPrice": 32500,
      "sellPrice": 32700
    },
    "change": {
      "amount": 150,
      "percentage": 0.46
    },
    "syncedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🏷️ ประเภททรัพย์ (Asset Type Analytics)

### 1. สรุปประเภททรัพย์

**GET** `/asset-types/summary`

**Permissions Required:**

- Menu: `REPORTS`
- Action: `READ_REPORT`

**Query Parameters:**

```typescript
{
  branchId: number; // รหัสสาขา (required)
  date: string; // วันที่ในรูปแบบ YYYY-MM-DD (required)
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "branchId": 1,
    "totalTransactions": 150,
    "assetTypeSummaries": [
      {
        "assetType": "แหวนทองคำ",
        "count": 45,
        "percentage": 30.0
      },
      {
        "assetType": "สร้อยคอทองคำ",
        "count": 35,
        "percentage": 23.33
      },
      {
        "assetType": "กำไลทองคำ",
        "count": 25,
        "percentage": 16.67
      }
    ],
    "timestamp": "2025-07-22T10:30:00.000Z"
  },
  "message": "Asset type summary retrieved successfully"
}
```

**คำอธิบาย:**

- ดึงข้อมูลสรุปประเภททรัพย์ตามสาขาและวันที่
- แสดงจำนวนและเปอร์เซ็นต์ของแต่ละประเภททรัพย์
- เรียงลำดับตามจำนวนมากที่สุด

### 2. อันดับประเภททรัพย์ยอดนิยม

**GET** `/asset-types/top-ranking`

**Permissions Required:**

- Menu: `REPORTS`
- Action: `READ_REPORT`

**Query Parameters:**

```typescript
{
  branchId: number;    // รหัสสาขา (required)
  date: string;        // วันที่ในรูปแบบ YYYY-MM-DD (required)
  top?: number;        // จำนวนอันดับที่ต้องการแสดง (default: 10, max: 100)
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "branchId": 1,
    "date": "2025-07-22",
    "top": 10,
    "totalAssetTypes": 15,
    "rankings": [
      {
        "rank": 1,
        "assetType": "แหวนทองคำ",
        "count": 25,
        "totalValue": 125000
      },
      {
        "rank": 2,
        "assetType": "สร้อยคอทองคำ",
        "count": 18,
        "totalValue": 95000
      },
      {
        "rank": 3,
        "assetType": "กำไลทองคำ",
        "count": 15,
        "totalValue": 78000
      }
    ],
    "timestamp": "2025-07-22T10:30:00.000Z"
  },
  "message": "Top asset type ranking retrieved successfully"
}
```

**คำอธิบาย:**

- ดึงข้อมูลอันดับประเภททรัพย์ยอดนิยมพร้อมรายการและมูลค่ารวม
- เรียงลำดับตามมูลค่ารวม (totalValue) จากมากไปน้อย
- สำหรับแสดงในรูปแบบตาราง: อันดับ, ประเภททรัพย์, รายการ, มูลค่ารวม

### 3. อันดับประเภททรัพย์ตามช่วงเวลา (7 วัน)

**GET** `/asset-types/ranking-by-period`

**Permissions Required:**

- Menu: `REPORTS`
- Action: `READ_REPORT`

**Query Parameters:**

```typescript
{
  branchId: number;    // รหัสสาขา (required)
  date: string;        // วันที่สิ้นสุดของช่วงเวลา 7 วัน YYYY-MM-DD (required)
  top?: number;        // จำนวนอันดับที่ต้องการแสดง (default: 10, max: 100)
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "branchId": 1,
    "startDate": "2025-07-16",
    "endDate": "2025-07-22",
    "periodDays": 7,
    "top": 10,
    "totalAssetTypes": 15,
    "rankings": [
      {
        "rank": 1,
        "assetType": "แหวนทองคำ",
        "count": 125,
        "totalValue": 625000,
        "averagePerDay": 89285.71,
        "dailyData": [
          {
            "date": "2025-07-16",
            "count": 15,
            "value": 75000
          },
          {
            "date": "2025-07-17",
            "count": 20,
            "value": 100000
          },
          {
            "date": "2025-07-18",
            "count": 18,
            "value": 90000
          },
          {
            "date": "2025-07-19",
            "count": 22,
            "value": 110000
          },
          {
            "date": "2025-07-20",
            "count": 16,
            "value": 80000
          },
          {
            "date": "2025-07-21",
            "count": 19,
            "value": 95000
          },
          {
            "date": "2025-07-22",
            "count": 15,
            "value": 75000
          }
        ]
      },
      {
        "rank": 2,
        "assetType": "สร้อยคอทองคำ",
        "count": 98,
        "totalValue": 490000,
        "averagePerDay": 70000.0,
        "dailyData": [
          {
            "date": "2025-07-16",
            "count": 12,
            "value": 60000
          }
          // ... ข้อมูลรายวันอื่นๆ
        ]
      }
    ],
    "timestamp": "2025-07-22T10:30:00.000Z"
  },
  "message": "Asset type ranking by period retrieved successfully"
}
```

**คำอธิบาย:**

- ดึงข้อมูลอันดับประเภททรัพย์ยอดนิยมตามช่วงเวลา 7 วัน
- นับย้อนหลัง 7 วันจากวันที่ที่ระบุ (รวมวันที่ที่ส่งมา)
- รวมข้อมูลจากทุกวันใน 7 วัน พร้อมรายละเอียดรายวัน
- เรียงลำดับตามมูลค่ารวม (totalValue) ของทั้ง 7 วัน
- แสดงค่าเฉลี่ยต่อวันและข้อมูลรายวันแยกต่างหาก

**ข้อมูลใน rankings แต่ละรายการ:**

- `rank`: อันดับตามมูลค่ารวม
- `assetType`: ชื่อประเภททรัพย์
- `count`: จำนวนรายการรวม 7 วัน
- `totalValue`: มูลค่ารวม 7 วัน
- `averagePerDay`: ค่าเฉลี่ยมูลค่าต่อวัน
- `dailyData`: ข้อมูลรายวันของประเภททรัพย์นี้

**Use Cases:**

- วิเคราะห์แนวโน้มประเภททรัพย์ที่นิยมในช่วงสัปดาห์
- ติดตามการเปลี่ยนแปลงของความนิยมในแต่ละวัน
- วางแผนการจัดซื้อและการตลาดตามแนวโน้ม
- สร้างรายงานประจำสัปดาห์สำหรับผู้บริหาร

---

## 💬 ระบบแชท AI (AI Chat System)

### 1. ส่งข้อความแชท

**POST** `/chat/send`

**Permissions Required:**

- Menu: `Chat`

**Request Body:**

```json
{
  "message": "สวัสดีครับ ช่วยอธิบายเรื่องการจำนำทองคำหน่อยครับ",
  "conversationId": "conv_123" // optional, for continuing conversation
}
```

**Response (Streaming):**

```
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked

สวัสดีครับ! การจำนำทองคำเป็นการใช้ทองคำเป็นหลักประกัน
เพื่อกู้เงินจากร้านจำนำ โดยมีขั้นตอนดังนี้:

1. นำทองคำมาประเมินราคา
2. รับเงินตามราคาที่ประเมิน
3. ชำระดอกเบี้ยรายเดือน
4. ไถ่ถอนทองคำภายในกำหนด

คุณมีคำถามเพิ่มเติมไหมครับ?
```

**Error Response:**

```json
{
  "success": false,
  "error": "Chat service temporarily unavailable"
}
```

### 2. ดึงประวัติการสนทนา

**GET** `/chat/history`

**Query Parameters:**

```
?conversationId=conv_123&page=1&limit=20
```

**Response:**

```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "data": {
    "conversationId": "conv_123",
    "messages": [
      {
        "id": "msg_1",
        "role": "user",
        "content": "สวัสดีครับ ช่วยอธิบายเรื่องการจำนำทองคำหน่อยครับ",
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "msg_2",
        "role": "assistant",
        "content": "สวัสดีครับ! การจำนำทองคำเป็นการใช้ทองคำเป็นหลักประกัน...",
        "timestamp": "2024-01-15T10:30:15.000Z"
      }
    ],
    "totalMessages": 8
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

### 3. ล้างประวัติการสนทนา

**DELETE** `/chat/history`

**Query Parameters:**

```
?conversationId=conv_123
```

---

## 🔄 การซิงค์ข้อมูล (Data Synchronization)

### 1. ซิงค์ข้อมูลสาขา

**POST** `/sync/branches`

**Permissions Required:**

- Action: `SYNC:Data`

**Response:**

```json
{
  "success": true,
  "message": "Branch data synchronized successfully",
  "data": {
    "total": 15,
    "fetched": 15,
    "processed": 15,
    "created": 2,
    "updated": 13,
    "synced": 15,
    "errors": 0,
    "syncedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. ซิงค์ข้อมูลประเภทสินทรัพย์

**POST** `/sync/asset-types`

### 3. ซิงค์ข้อมูลธุรกรรมสัญญา

**POST** `/sync/contract-transactions`

**Request Body:**

```json
{
  "branchId": 1,
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-15",
  "batchSize": 100
}
```

### 4. ดูสถานะการซิงค์

**GET** `/sync/status`

**Response:**

```json
{
  "success": true,
  "message": "Sync status retrieved successfully",
  "data": {
    "lastSync": {
      "branches": "2024-01-15T10:30:00.000Z",
      "assetTypes": "2024-01-15T09:15:00.000Z",
      "contractTransactions": "2024-01-15T10:45:00.000Z"
    },
    "isRunning": {
      "branches": false,
      "assetTypes": false,
      "contractTransactions": true
    },
    "nextScheduled": {
      "goldPrice": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

## 📋 การส่งออกข้อมูล (Data Export)

### 1. ส่งออกธุรกรรมสัญญาเป็น CSV

**GET** `/export/contract-transactions/csv`

**Permissions Required:**

- Menu: `Export`
- Action: `EXPORT:Report`

**Query Parameters:**

```
?branchId=1&date=2024-01-15
```

**Response:**

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="contract_transactions_20240115.csv"

เลขสัญญา,วันที่ทำธุรกรรม,วันที่จ่ายดอกเบี้ย,วันที่ค้างชำระ (วัน),...
C240115001,"15/01/2024","15/02/2024",0,...
C240115002,"15/01/2024","15/02/2024",0,...
```

**Features:**

- UTF-8 BOM for Excel compatibility
- Thai language support
- Automatic date formatting for Excel
- Phone number protection (prevents Excel auto-formatting)

---

## 📈 การติดตามประสิทธิภาพ (Monitoring & Metrics)

### 1. ดู Metrics ของ API

**GET** `/metrics/api`

**Response:**

```json
{
  "success": true,
  "message": "API metrics retrieved successfully",
  "data": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "environment": "production",
    "api": {
      "requests": {
        "total": 1250,
        "averageResponseTime": 142,
        "errorRate": 0.02
      },
      "statusCodes": {
        "200": 1180,
        "400": 15,
        "401": 8,
        "500": 2
      },
      "endpoints": {
        "GET /users": 325,
        "POST /auth/login": 45,
        "GET /gold-price/current": 180
      }
    },
    "system": {
      "memoryUsage": {
        "used": 125.5,
        "total": 512,
        "percentage": 24.5
      },
      "cpuUsage": 15.2,
      "uptime": 86400
    }
  }
}
```

### 2. ดู Requests ล่าสุด

**GET** `/metrics/requests`

**Query Parameters:**

```
?limit=50
```

### 3. ตรวจสอบสุขภาพระบบ

**GET** `/health`

**Response:**

```json
{
  "success": true,
  "message": "System health check completed",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 86400,
    "version": "1.0.0",
    "environment": "production",
    "services": {
      "database": {
        "status": "healthy",
        "responseTime": 15,
        "lastChecked": "2024-01-15T10:30:00.000Z"
      },
      "externalAPIs": {
        "goldPriceAPI": {
          "status": "healthy",
          "responseTime": 245,
          "lastChecked": "2024-01-15T10:29:45.000Z"
        },
        "pawnShopAPI": {
          "status": "healthy",
          "responseTime": 180,
          "lastChecked": "2024-01-15T10:29:30.000Z"
        },
        "openAI": {
          "status": "healthy",
          "responseTime": 892,
          "lastChecked": "2024-01-15T10:28:15.000Z"
        }
      }
    },
    "performance": {
      "score": 95,
      "recommendations": []
    }
  }
}
```

### 4. ล้าง Metrics (Development only)

**DELETE** `/metrics`

---

## 📝 การตรวจสอบและบันทึกกิจกรรม (Audit & Logging)

### 1. ดู Activity Logs

**GET** `/activity-logs`

**Permissions Required:**

- Menu: `Log`
- Action: `READ:ActivityLog`

**Query Parameters:**

```
?page=1&limit=20&userId=1&action=CREATE&tableName=User&dateFrom=2024-01-01&dateTo=2024-01-15
```

**Response:**

```json
{
  "success": true,
  "message": "Activity logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "action": "CREATE",
      "tableName": "User",
      "recordId": "25",
      "oldValues": null,
      "newValues": {
        "email": "newuser@example.com",
        "fullName": "New User"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "user": {
        "id": 1,
        "fullName": "Admin User",
        "email": "admin@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

### 2. ดู Change Logs

**GET** `/change-logs`

**Permissions Required:**

- Menu: `Log`
- Action: `READ:ChangeLog`

**Query Parameters:**

```
?page=1&limit=20&tableName=User&recordId=25&changeType=UPDATE
```

**Response:**

```json
{
  "success": true,
  "message": "Change logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "tableName": "User",
      "recordId": "25",
      "changeType": "UPDATE",
      "fieldName": "fullName",
      "oldValue": "Old Name",
      "newValue": "New Name",
      "changedBy": 1,
      "changedAt": "2024-01-15T10:30:00.000Z",
      "metadata": {
        "source": "web",
        "reason": "profile_update"
      },
      "user": {
        "id": 1,
        "fullName": "Admin User"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 3. ลบ Activity Logs (Admin only)

**DELETE** `/activity-logs`

**Permissions Required:**

- Action: `DELETE:ActivityLog`

**Query Parameters:**

```
?olderThan=30 // ลบ logs ที่เก่ากว่า 30 วัน
```

---

## 🔒 ระบบความปลอดภัย (Security)

### Authentication

- **JWT Token-based Authentication**
- **Token Blacklist System** - ป้องกันการใช้ token ที่ logout แล้ว
- **Rate Limiting** - จำกัดจำนวน requests
- **Password Hashing** - bcrypt สำหรับเข้ารหัสรหัสผ่าน

### Authorization

- **Role-based Access Control (RBAC)**
- **Menu-level Permissions** - ควบคุมการเข้าถึงเมนูต่างๆ
- **Action-level Permissions** - ควบคุมการทำงานแต่ละประเภท
- **Self-or-Admin Access Patterns** - ผู้ใช้เข้าถึงข้อมูลตนเองหรือ Admin เท่านั้น

### Security Middleware

- **Security Headers** - CORS, CSRF protection
- **Request Validation** - Zod schema validation
- **Input Sanitization** - ป้องกัน XSS และ SQL Injection
- **Audit Trail** - บันทึกทุกการเปลี่ยนแปลงข้อมูล

---

## 📊 Permission Actions & Menu Names

### Permission Actions

```typescript
{
  // User Management
  CREATE_USER: "CREATE:User",
  READ_USER: "READ:User",
  UPDATE_USER: "UPDATE:User",
  DELETE_USER: "DELETE:User",

  // Role Management
  CREATE_ROLE: "CREATE:Role",
  READ_ROLE: "READ:Role",
  UPDATE_ROLE: "UPDATE:Role",
  DELETE_ROLE: "DELETE:Role",

  // Permission Management
  CREATE_PERMISSION: "CREATE:Permission",
  READ_PERMISSION: "READ:Permission",
  UPDATE_PERMISSION: "UPDATE:Permission",
  DELETE_PERMISSION: "DELETE:Permission",

  // Menu Permission Management
  CREATE_MENU_PERMISSION: "CREATE:MenuPermission",
  READ_MENU_PERMISSION: "READ:MenuPermission",
  UPDATE_MENU_PERMISSION: "UPDATE:MenuPermission",
  DELETE_MENU_PERMISSION: "DELETE:MenuPermission",

  // Activity Log Management
  READ_ACTIVITY_LOG: "READ:ActivityLog",
  DELETE_ACTIVITY_LOG: "DELETE:ActivityLog",

  // Change Log Management
  READ_CHANGE_LOG: "READ:ChangeLog",

  // Reports
  READ_REPORT: "READ:Report",
  EXPORT_REPORT: "EXPORT:Report",

  // Sync Data
  SYNC_DATA: "SYNC:Data",

  // System
  SYSTEM_ADMIN: "SYSTEM:Admin"
}
```

### Menu Names

```typescript
{
  CHAT: "Chat",
  DASHBOARD: "Dashboard",
  EXPORT: "Export",
  GOLD_PRICE: "Gold Price",
  LOG: "Log",
  METRICS: "Metrics",
  PERMISSION_MANAGEMENT: "Permission Management",
  REPORTS: "Reports",
  ROLE_MANAGEMENT: "Role Management",
  USER_MANAGEMENT: "User Management"
}
```

---

## ⚡ Cron Jobs & Automation

### Gold Price Sync Job

- **Schedule**: ทุกชั่วโมงใหม่ (0 นาที) ตั้งแต่ 8:00-18:00, วันจันทร์-เสาร์
- **Cron Pattern**: `"0 8-18 * * 1-6"`
- **Timezone**: Asia/Bangkok
- **Features**:
  - Overlap protection
  - Error handling และ retry
  - Performance monitoring
  - Graceful shutdown support

### Automated Data Sync

- **External Pawn Shop API**: Real-time sync พร้อม batch processing
- **Rate Limiting**: ป้องกันการเรียก API มากเกินไป
- **Retry Mechanism**: จัดการกับ network errors
- **Data Validation**: ตรวจสอบข้อมูลก่อนบันทึก

---

## 🛠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description",
  "details": {
    "field": "validation error details",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes

| Status Code | Description           | Example                     |
| ----------- | --------------------- | --------------------------- |
| 200         | Success               | Data retrieved successfully |
| 201         | Created               | User created successfully   |
| 400         | Bad Request           | Invalid request data        |
| 401         | Unauthorized          | Invalid or missing token    |
| 403         | Forbidden             | Insufficient permissions    |
| 404         | Not Found             | Resource not found          |
| 429         | Too Many Requests     | Rate limit exceeded         |
| 500         | Internal Server Error | Server error occurred       |

### Error Categories

1. **Validation Errors** - ข้อมูล input ไม่ถูกต้อง
2. **Authentication Errors** - ปัญหาการยืนยันตัวตน
3. **Authorization Errors** - ไม่มีสิทธิ์เข้าถึง
4. **External API Errors** - ปัญหาจาก External API
5. **Database Errors** - ปัญหาฐานข้อมูล
6. **System Errors** - ปัญหาระบบภายใน

---

## 📈 Performance & Monitoring

### Performance Metrics

- **Response Time**: เฉลี่ย < 200ms สำหรับ API calls ทั่วไป
- **Throughput**: รองรับ 100+ concurrent requests
- **Error Rate**: < 0.1% สำหรับ production
- **Uptime**: 99.9% availability target

### Monitoring Features

- **Real-time API Metrics** - ติดตาม performance แบบ real-time
- **Health Checks** - ตรวจสอบสุขภาพระบบและ external services
- **Resource Monitoring** - CPU, Memory, Database connection pool
- **Alert System** - แจ้งเตือนเมื่อมีปัญหา (planned feature)

### Optimization Strategies

- **Database Indexing** - Optimized queries สำหรับ pagination และ search
- **Connection Pooling** - Efficient database connection management
- **Caching Strategy** - Cache frequently accessed data (planned)
- **Rate Limiting** - ป้องกัน abuse และ maintain performance

---

## 🔧 Development & Testing

### Scripts Available

```bash
# Development
npm run dev          # Start development server
npm run build        # Build production version
npm start           # Start production server

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:seed     # Seed initial data
npm run db:reset    # Reset database

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm run type-check  # TypeScript type checking
```

### API Testing

- **Postman Collection** - Complete API collection for testing
- **Jest Tests** - Unit และ integration tests
- **Test Database** - Separate database for testing
- **Mock Services** - Mock external APIs for testing

---

## 📝 Changelog & Version History

### Version 1.0.0 (Current)

#### ✅ Authentication & Authorization

- ✅ JWT Token-based Authentication พร้อม Blacklist System
- ✅ Role-based Access Control (RBAC) พร้อม Menu Permissions
- ✅ Self-or-Admin Access Patterns
- ✅ Rate Limiting สำหรับ Login และ API calls
- ✅ Comprehensive User Management System

#### ✅ Core Features

- ✅ Complete User Management (CRUD, Permissions, Role Assignment)
- ✅ Role & Permission Management System
- ✅ Menu Permission System
- ✅ Pawn Shop Data Integration (Branches, Contracts, Transactions)
- ✅ Real-time Gold Price Tracking พร้อม Auto-sync
- ✅ External API Integration (Pawn Shop API, Gold Price API)

#### ✅ AI & Chat Features

- ✅ OpenAI Chat Integration
- ✅ Streaming Response Support
- ✅ Conversation History Management
- ✅ Error Recovery และ Fallback Mechanisms

#### ✅ Export & Reporting

- ✅ CSV Export พร้อม UTF-8 BOM
- ✅ Thai Language Support ใน Excel
- ✅ Date Formatting สำหรับ Excel
- ✅ Phone Number Protection
- ✅ Contract Transaction Reports

#### ✅ Monitoring & Analytics

- ✅ Real-time Performance Metrics
- ✅ API Usage Statistics
- ✅ System Health Monitoring
- ✅ External API Health Checks
- ✅ Performance Score Calculation
- ✅ Resource Usage Tracking

#### ✅ Audit & Logging

- ✅ Comprehensive Activity Logging
- ✅ Change Tracking System
- ✅ Detailed Audit Trail
- ✅ Advanced Filtering และ Search
- ✅ User Action Tracking
- ✅ IP Address และ User Agent Logging

#### ✅ Data Synchronization

- ✅ Automated Gold Price Sync (Cron Jobs)
- ✅ Pawn Shop API Data Sync
- ✅ Batch Processing สำหรับ Large Datasets
- ✅ Error Handling และ Retry Mechanisms
- ✅ Sync Status Tracking

#### ✅ Technical Improvements

- ✅ TypeScript Type Safety ทุก Component
- ✅ Prisma ORM Integration
- ✅ MySQL Database Compatibility
- ✅ Comprehensive Error Handling & Validation
- ✅ Request/Response Standardization
- ✅ Pagination System
- ✅ Advanced Search Functionality
- ✅ Security Middleware (CORS, Rate Limiting, Input Validation)

### Known Issues

- None reported in current version

### Upcoming Features (Roadmap v1.1.0)

- 📊 Advanced Analytics Dashboard
- 🔔 Real-time Notifications System
- 📱 Mobile API Enhancements
- 🔐 Two-Factor Authentication (2FA)
- 📈 Advanced Reporting Engine
- 🔄 Webhook System สำหรับ External Integrations
- 💾 Data Backup และ Recovery System
- 🌐 Multi-language Support
- 📊 Data Visualization Components
- 🔍 Advanced Search และ Filtering

---

## 📞 Support & Documentation

### API Documentation

- **Total Endpoints**: 50+ RESTful endpoints
- **Controllers**: 15 main controller files
- **Middleware**: 6 comprehensive middleware modules
- **Services**: 5 external service integrations
- **Job Schedulers**: 2 automated cron jobs

### Endpoint Summary

| Category                       | Count | Description                           |
| ------------------------------ | ----- | ------------------------------------- |
| **Authentication**             | 3     | Login, logout, current user           |
| **User Management**            | 7     | Complete user CRUD with permissions   |
| **Role Management**            | 5     | Role creation, assignment, management |
| **Permission Management**      | 5     | Granular permission control           |
| **Menu Permission Management** | 5     | Menu-level access control             |
| **Branch Management**          | 3     | Branch data retrieval and statistics  |
| **Menu Endpoints**             | 3     | Dropdown/select data for UI           |
| **Gold Price**                 | 2     | Real-time gold price data             |
| **Pawn Shop Operations**       | 4     | Branch operations and reporting       |
| **Asset Type Reports**         | 3     | Asset analytics and rankings          |
| **Data Synchronization**       | 6     | External API data sync                |
| **Export Operations**          | 1     | CSV export functionality              |
| **Chat Management**            | 3     | AI chat integration                   |
| **Activity Logs**              | 5     | User activity tracking                |
| **Change Logs**                | 4     | Data change audit trail               |
| **Metrics & Monitoring**       | 4     | Performance and health monitoring     |
| **Protected Routes**           | 1     | Authentication testing                |

### Technical Specifications

- **API Design**: RESTful principles
- **Authentication**: Dual-method JWT (httpOnly Cookies + Authorization Header)
- **Authorization**: Role-based Access Control (RBAC) with Menu Permissions
- **Validation**: Comprehensive request/response validation using Zod schemas
- **Error Handling**: Standardized error codes and messages
- **Rate Limiting**: Configurable rate limiting per endpoint
- **Monitoring**: Built-in performance metrics and health checks
- **Logging**: Comprehensive audit trail with activity and change logs
- **Security**: XSS/CSRF protection, helmet middleware, secure cookies

### Development Tools

- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Database schema management and type-safe queries
- **Express.js**: Fast, unopinionated web framework
- **Middleware**: Custom authentication, authorization, and audit middleware
- **Validation**: Zod schema validation for all endpoints
- **Testing**: Comprehensive API testing support

### Deployment Considerations

- **Environment**: Development, staging, production configurations
- **Database**: MySQL 8.0+ with Prisma migrations
- **Security**: Environment-based security configurations
- **Performance**: Built-in monitoring and optimization
- **Scalability**: Horizontal scaling support with proper session management

### Contact Information

- **API Version**: 1.0.0
- **Documentation Version**: 1.0.0
- **Last Updated**: 21 มกราคม 2025
- **Maintained By**: Development Team

### Additional Resources

- **GitHub Repository**: [Repository URL]
- **API Testing**: Postman Collection available
- **Development Guide**: Available in `/docs/development.md`
- **Deployment Guide**: Available in `/docs/deployment.md`

---

_© 2025 Pawn Shop Management API - Built with ❤️ using Node.js, TypeScript, Express.js, and Prisma ORM_
