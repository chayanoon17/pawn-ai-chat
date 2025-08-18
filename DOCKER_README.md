# Docker Deployment Guide

This guide explains how to deploy the Pawn AI Chat application using Docker.

## คู่มือการใช้งาน Docker (ภาษาไทย)

### ข้อกำหนดเบื้องต้น

- Docker ติดตั้งในระบบของคุณ
- Docker Compose ติดตั้งแล้ว
- Port 3001 ว่าง (หรือปรับแต่ง port อื่น)

## 🎯 วิธีการรัน Docker (2 แบบ)

### **วิธีที่ 1: ใช้ npm scripts (แนะนำ)**

```bash
# หยุด containers เก่า
npm run docker:stop

# รัน development environment
npm run docker:dev

# ดู logs
npm run docker:logs

# Build image ใหม่
npm run docker:build
```

### **วิธีที่ 2: ใช้ docker commands โดยตรง**

```bash
# หยุด containers
docker-compose down

# รัน development environment
docker-compose up -d

# ดู logs แบบ real-time
docker-compose logs -f

# Build และรัน
docker-compose up --build -d

# ดูสถานะ containers
docker ps
```

## 🔄 Workflow แนะนำ

### **สำหรับการพัฒนาประจำวัน:**

```bash
# เริ่มงาน
npm run docker:stop    # หยุดของเก่า
npm run docker:dev     # รันใหม่

# ดูผลลัพธ์
# เปิดเบราว์เซอร์ไปที่: http://localhost:3001

# ดู logs หากมีปัญหา
npm run docker:logs

# เลิกงาน
npm run docker:stop
```

### **สำหรับการแก้ไขโค้ด:**

```bash
# 1. แก้โค้ดใน VSCode
# 2. Build image ใหม่
npm run docker:build

# 3. รัน container ใหม่
npm run docker:stop
npm run docker:dev

# 4. ทดสอบที่ http://localhost:3001
```

## 🎭 เปรียบเทียบ npm scripts vs docker commands

| คำสั่ง | npm scripts | docker commands |
|--------|-------------|-----------------|
| **รัน** | `npm run docker:dev` | `docker-compose up -d` |
| **หยุด** | `npm run docker:stop` | `docker-compose down` |
| **ดู logs** | `npm run docker:logs` | `docker-compose logs -f` |
| **Build** | `npm run docker:build` | `docker build -t pawn-ai-chat:latest .` |
| **ดูสถานะ** | `docker ps` | `docker ps` |

### **ข้อดีของแต่ละวิธี:**

#### **npm scripts:**
- ✅ จำง่าย
- ✅ สั้นกว่า
- ✅ มี configuration พร้อมใช้

#### **docker commands:**
- ✅ ควบคุมได้มากกว่า
- ✅ เข้าใจ Docker มากขึ้น
- ✅ ใช้ได้ทุกโปรเจ็กต์

## 💡 Tips การใช้งาน

### **เมื่อมีปัญหา:**
```bash
# ดู logs เพื่อหาสาเหตุ
npm run docker:logs
# หรือ
docker-compose logs -f

# ลบ containers และรันใหม่
docker-compose down --remove-orphans
npm run docker:dev
```

### **เมื่อต้องการทดสอบ production:**
```bash
# ใช้ production configuration
docker-compose -f docker-compose.prod.yml up -d
```

### **เมื่อต้องการเข้าไปใน container:**
```bash
# เข้าไปใน running container
docker exec -it pawn-ai-chat-app sh
```

## 🌐 URLs และ Port

### **การเข้าถึง:**
- **เว็บไซต์**: http://localhost:3001
- **API (อนาคต)**: http://localhost:3002
- **Database (อนาคต)**: localhost:5432

### **Port mapping:**
```
Host (เครื่องคุณ) → Container
Port 3001 → Port 8080 (Next.js app)
```

## 🤝 การทำงานร่วมกับทีม

### **สำหรับเพื่อนร่วมงาน:**

```bash
# เมื่อได้รับโค้ดใหม่
git pull
npm run docker:stop
npm run docker:dev

# หรือใช้ docker commands
git pull  
docker-compose down
docker-compose up -d
```

### **สำหรับ Demo:**

```bash
# เตรียม Demo
npm run docker:stop
npm run docker:build    # Build version ล่าสุด
npm run docker:dev      # รัน production-like

# แชร์ลิงก์: http://localhost:3001
```

### **ก่อนส่งงาน:**

```bash
# ทดสอบก่อน push code
npm run docker:stop
npm run docker:build
npm run docker:dev

# ทดสอบทุกฟีเจอร์ที่ http://localhost:3001
# ถ้าผ่าน → push code
git add .
git commit -m "Add new feature"
git push
```

## 🎯 Quick Reference (อ้างอิงด่วน)

```bash
# รัน Docker
npm run docker:dev          # → http://localhost:3001

# หยุด Docker  
npm run docker:stop         # หยุด containers

# ดู logs
npm run docker:logs         # ดู application logs

# Build ใหม่
npm run docker:build        # Build Docker image

# ดูสถานะ
docker ps                   # ดู running containers

# รีสตาร์ท (วิธีเร็ว)
npm run docker:stop && npm run docker:dev
```

## ⚡ คำสั่งทางเลือก (Alternative Commands)

### **ใช้ docker-compose โดยตรง:**
```bash
docker-compose down         # = npm run docker:stop
docker-compose up -d        # = npm run docker:dev  
docker-compose logs -f      # = npm run docker:logs
docker-compose up --build  # = build + run
```

### **ใช้ docker โดยตรง:**
```bash
# หยุดและลบ container
docker stop pawn-ai-chat-app
docker rm pawn-ai-chat-app

# รัน container ใหม่
docker run -d \
  --name pawn-ai-chat-app \
  -p 3001:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  pawn-ai-chat:latest
```

Port 3001 → Port 8080 (Next.js app)
```

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Port 3000 available (or configure a different port)

## Quick Start

### Method 1: Using the deploy script (Recommended)

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Method 2: Using Docker Compose directly

#### Development Deployment
```bash
# Build and start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Production Deployment
```bash
# Build and start the application
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop the application
docker-compose -f docker-compose.prod.yml down
```

### Method 3: Using npm scripts

```bash
# Build Docker image
npm run docker:build

# Start development environment
npm run docker:dev

# Start production environment
npm run docker:prod

# View logs
npm run docker:logs

# Stop containers
npm run docker:stop
```

## Configuration

### Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local  # for development
   # or
   cp .env.example .env.production  # for production
   ```

2. Update the environment variables in the copied file according to your needs.

### Production Configuration

For production deployment, you need to:

1. Update `docker-compose.prod.yml`:
   - Replace `your-domain.com` with your actual domain
   - Replace `your-email@example.com` with your email for SSL certificates
   - Configure any additional environment variables

2. Set up DNS to point your domain to your server

3. Ensure ports 80 and 443 are open and available

## File Structure

```
├── Dockerfile                 # Main Docker configuration
├── .dockerignore             # Files to exclude from Docker build
├── docker-compose.yml        # Development environment
├── docker-compose.prod.yml   # Production environment with Traefik
├── deploy.sh                 # Automated deployment script
├── .env.example              # Environment variables template
└── DOCKER_README.md          # This file
```

## URLs and Access

### Development
- Application: http://localhost:3000

### Production (with Traefik)
- Application: https://your-domain.com
- Traefik Dashboard: http://your-server-ip:8080

## Useful Commands

### Docker Commands
```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove unused images
docker image prune

# View container logs
docker logs pawn-ai-chat-app

# Execute command in running container
docker exec -it pawn-ai-chat-app sh
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Pull updated images
docker-compose pull

# Rebuild and start
docker-compose up --build -d
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process (replace PID with actual process ID)
   kill -9 PID
   ```

2. **Docker build fails**
   ```bash
   # Clear Docker cache
   docker builder prune -a
   
   # Rebuild without cache
   docker build --no-cache -t pawn-ai-chat:latest .
   ```

3. **Permission issues**
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER .
   ```

### Logs and Monitoring

```bash
# View application logs
docker-compose logs pawn-ai-chat

# View all service logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

## Security Considerations

For production deployment:

1. **Use HTTPS**: The production configuration includes SSL/TLS with Let's Encrypt
2. **Environment Variables**: Never commit sensitive data to version control
3. **Firewall**: Configure firewall to only allow necessary ports
4. **Updates**: Regularly update Docker images and dependencies
5. **Monitoring**: Set up monitoring and alerting for your application

## Scaling

To scale your application:

```bash
# Scale to 3 instances
docker-compose up -d --scale pawn-ai-chat=3

# With production configuration
docker-compose -f docker-compose.prod.yml up -d --scale pawn-ai-chat=3
```

## Backup and Restore

### Backup
```bash
# Create backup directory
mkdir backups

# Backup application data (if you have volumes)
docker run --rm -v $(pwd):/backup alpine tar czf /backup/backups/app-backup-$(date +%Y%m%d-%H%M%S).tar.gz /path/to/data
```

### Restore
```bash
# Restore from backup
docker run --rm -v $(pwd)/backups:/backup -v app-data:/data alpine tar xzf /backup/app-backup-YYYYMMDD-HHMMSS.tar.gz -C /
```

## Support

If you encounter issues:

1. Check the application logs
2. Verify environment variables
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions
5. Review this documentation

For additional help, check the main project README or create an issue in the repository.
