This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

🚀 Scripts ที่เพิ่มเข้าไป:

1. npm run deploy:prepare
   Build แอปพลิเคชัน และสร้าง deployment package
   รวม 2 ขั้นตอนเป็นหนึ่งเดียว
2. npm run deploy:package
   สร้าง deployment package ใน deploy folder
   Copy ไฟล์ที่จำเป็นทั้งหมด (standalone build, static files, server.js, web.config)
3. npm run deploy:zip
   สร้างไฟล์ zip พร้อม timestamp สำหรับ deployment
   ได้ไฟล์ deploy-YYYYMMDD-HHMMSS.zip

📋 วิธีใช้งาน:

# สร้าง deployment package

npm run deploy:prepare

# หรือถ้า build แล้ว ก็สร้าง package อย่างเดียว

npm run deploy:package

# สร้างไฟล์ zip สำหรับ upload

npm run deploy:zip

📁 โครงสร้างในโฟลเดอร์ deploy:
server.js - Custom server
web.config - IIS configuration
package.json - Dependencies
standalone - Next.js build files
static - Static assets
public - Public files
