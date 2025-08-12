# API Testing Guide

## 🧪 การทดสอบ API

### Quick Start

```bash
# ทดสอบพื้นฐาน (Health Check เท่านั้น)
npm run test:api

# ทดสอบรวม Authentication
npm run test:api:auth

# ทดสอบแบบ verbose (แสดงรายละเอียดการ request)
npm run test:api:verbose
```

### Manual Testing

```bash
# ทดสอบพื้นฐาน
node scripts/test-api.js

# ทดสอบพร้อม Authentication
node scripts/test-api.js --auth

# ทดสอบแบบ verbose
node scripts/test-api.js --auth --verbose

# แสดงคำแนะนำ
node scripts/test-api.js --help
```

## 🔐 Test Credentials

สำหรับการทดสอบ Authentication:

```json
{
  "email": "superadmin@pawnshop.com",
  "password": "superadmin123456"
}
```

## 📍 Available Endpoints

### Public Endpoints

- `GET /api/health` - Health check

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

## 📊 Expected Results

### Success Rate

- **Basic Tests**: ~50% (1/2 success - health check works, status 404 is expected)
- **With Auth Tests**: ~80% (4/5 success - all auth endpoints working)

### Performance Benchmarks

- Health Check: < 500ms
- Login: < 600ms
- User Info: < 100ms
- Logout: < 150ms

## 🔧 Troubleshooting

### Common Issues

1. **Connection Refused**

   - Check if API server is running
   - Verify API URL in environment variables

2. **401 Unauthorized**

   - Check test credentials
   - Verify token expiration

3. **Slow Response Times**
   - API server might be cold starting
   - Network latency issues

### Environment Variables

Make sure these are set correctly:

```bash
# .env.local (Development)
NEXT_PUBLIC_API_URL=https://pawn-api.azurewebsites.net

# .env.production (Production)
NEXT_PUBLIC_API_URL=https://pawn-api.azurewebsites.net
```

## 📝 Adding New Tests

To add new endpoint tests, modify `scripts/test-api.js`:

1. Add endpoint to the test array
2. For authenticated endpoints, make sure `ACCESS_TOKEN` is available
3. Handle different response formats appropriately

Example:

```javascript
// Add to runBasicTests() or create new test function
const newTest = await testEndpoint("/api/new-endpoint", "New Feature Test");
```
