# 🚀 Kush Films - Deployment & DevOps Guide

## Deployment Overview

This guide covers complete production deployment for Kush Films with CI/CD, monitoring, and scaling strategies.

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE CDN                            │
│              (DDoS Protection + SSL + Caching)               │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌───────────────┐
│   VERCEL      │      │   AWS / DO    │
│   (Frontend)  │      │   (Backend)   │
│   Next.js     │◄────►│   Node.js     │
└───────────────┘      └───────┬───────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌─────────┐ ┌──────┐ ┌──────────┐
              │   RDS   │ │Redis │ │    R2    │
              │Postgres │ │Cache │ │ Storage  │
              └─────────┘ └──────┘ └──────────┘
```

---

## 📦 Phase 1: Production Environment Setup

### 1.1 Domain & DNS Configuration

#### Buy Domain
```bash
# Recommended registrars:
- Namecheap: namecheap.com
- Google Domains: domains.google
- Cloudflare: cloudflare.com
```

#### Configure Cloudflare DNS
1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers at registrar
4. Add DNS records:

```
Type    Name        Value                   Proxy
A       @           <your-server-ip>        Yes
A       www         <your-server-ip>        Yes
CNAME   api         <backend-url>           Yes
CNAME   cdn         <r2-url>                Yes
CNAME   admin       <frontend-url>          Yes
```

#### Enable Cloudflare Features
- SSL/TLS: **Full (strict)**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**
- Brotli Compression: **On**
- HTTP/3 (QUIC): **On**

---

### 1.2 Frontend Deployment (Vercel)

#### Option A: Automatic Deployment (Recommended)

**Step 1: Push to GitHub**
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kush-films-frontend.git
git push -u origin main
```

**Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import from GitHub
4. Select `kush-films-frontend` repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Step 3: Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://api.kushfilms.com
NEXTAUTH_URL=https://kushfilms.com
NEXTAUTH_SECRET=<generate-secure-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Step 4: Custom Domain**
1. Go to **Settings** → **Domains**
2. Add `kushfilms.com` and `www.kushfilms.com`
3. Update DNS records as instructed

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXTAUTH_SECRET production
```

---

### 1.3 Backend Deployment (AWS EC2 + Docker)

#### Step 1: Prepare Backend for Production

**Create Dockerfile**
```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 4000

CMD ["node", "dist/server.js"]
```

**Create .dockerignore**
```
node_modules
dist
.env
.env.local
*.log
.git
```

#### Step 2: Create AWS EC2 Instance

```bash
# 1. Go to AWS Console → EC2
# 2. Click "Launch Instance"
# 3. Configure:
#    - Name: kush-films-api
#    - AMI: Ubuntu Server 22.04 LTS
#    - Instance Type: t3.medium (2 vCPU, 4GB RAM)
#    - Key Pair: Create or select existing
#    - Security Group: Allow ports 22 (SSH), 80, 443, 4000
# 4. Launch Instance
```

#### Step 3: Connect & Setup Server

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@<your-ec2-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt install docker-compose -y

# Install Node.js (for migrations)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx (reverse proxy)
sudo apt install nginx -y
```

#### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/kush-films
```

```nginx
server {
    listen 80;
    server_name api.kushfilms.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kush-films /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Deploy Backend

```bash
# On EC2, create project directory
mkdir ~/kush-films-backend
cd ~/kush-films-backend

# Clone repository (or use git)
git clone https://github.com/yourusername/kush-films-backend.git .

# Or manually copy files using scp
# scp -i your-key.pem -r ./backend ubuntu@<your-ec2-ip>:~/kush-films-backend

# Create .env file
nano .env
```

```env
NODE_ENV=production
PORT=4000
API_VERSION=v1
FRONTEND_URL=https://kushfilms.com

DATABASE_URL=<your-rds-connection-string>
REDIS_URL=<your-elasticache-url>

JWT_ACCESS_SECRET=<secure-secret>
JWT_REFRESH_SECRET=<secure-secret>

R2_ACCOUNT_ID=<your-account-id>
R2_ACCESS_KEY_ID=<your-access-key>
R2_SECRET_ACCESS_KEY=<your-secret-key>
R2_BUCKET_NAME=kush-films-videos
R2_ENDPOINT=<your-r2-endpoint>
CDN_URL=https://cdn.kushfilms.com

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
```

```bash
# Build Docker image
docker build -t kush-films-api .

# Run container
docker run -d \
  --name kush-films-api \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file .env \
  kush-films-api

# Check logs
docker logs -f kush-films-api

# Run database migrations
docker exec kush-films-api npx prisma migrate deploy
```

#### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d api.kushfilms.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

### 1.4 Database Deployment (AWS RDS)

#### Create RDS PostgreSQL Instance

```bash
# 1. Go to AWS Console → RDS
# 2. Click "Create database"
# 3. Configure:
#    - Engine: PostgreSQL 15.x
#    - Template: Production
#    - DB Instance: db.t3.medium
#    - Storage: 100GB SSD (gp3)
#    - Enable auto-scaling: 100GB → 1000GB
#    - Multi-AZ: Yes (for high availability)
#    - VPC: Same as EC2
#    - Public access: No
#    - DB name: kush_films
#    - Master username: kush_admin
#    - Master password: <secure-password>
# 4. Create database
```

#### Configure Security Group
```bash
# Allow EC2 to connect to RDS
# Add inbound rule:
Type: PostgreSQL
Port: 5432
Source: <EC2-security-group>
```

#### Run Migrations
```bash
# On EC2 instance
cd ~/kush-films-backend

# Set DATABASE_URL
export DATABASE_URL="postgresql://kush_admin:<password>@<rds-endpoint>:5432/kush_films"

# Run migrations
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

---

### 1.5 Redis Deployment (AWS ElastiCache)

#### Create ElastiCache Redis Cluster

```bash
# 1. Go to AWS Console → ElastiCache
# 2. Click "Create"
# 3. Choose: Redis
# 4. Configure:
#    - Name: kush-films-cache
#    - Engine version: 7.x
#    - Node type: cache.t3.medium
#    - Number of replicas: 2
#    - Multi-AZ: Yes
#    - VPC: Same as EC2
# 5. Create
```

#### Update Backend .env
```env
REDIS_URL=redis://<elasticache-endpoint>:6379
```

---

### 1.6 Storage Deployment (Cloudflare R2)

Already covered in SETUP.md. Ensure:
- Bucket created: `kush-films-videos`
- CORS configured
- API tokens added to .env
- CDN domain configured

---

## 🔄 Phase 2: CI/CD Pipeline (GitHub Actions)

### 2.1 Backend CI/CD

Create `.github/workflows/backend-deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run tests
        working-directory: ./backend
        run: npm test
      
      - name: Build Docker image
        working-directory: ./backend
        run: docker build -t kush-films-api .
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Push Docker image
        run: |
          docker tag kush-films-api ${{ secrets.DOCKER_USERNAME }}/kush-films-api:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/kush-films-api:latest
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/kush-films-backend
            docker pull ${{ secrets.DOCKER_USERNAME }}/kush-films-api:latest
            docker stop kush-films-api || true
            docker rm kush-films-api || true
            docker run -d \
              --name kush-films-api \
              --restart unless-stopped \
              -p 4000:4000 \
              --env-file .env \
              ${{ secrets.DOCKER_USERNAME }}/kush-films-api:latest
            docker exec kush-films-api npx prisma migrate deploy
      
      - name: Notify deployment
        run: echo "Backend deployed successfully!"
```

### 2.2 Frontend CI/CD

Vercel automatically deploys on git push. To customize:

Create `.github/workflows/frontend-deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        working-directory: ./frontend
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2.3 Database Migrations Pipeline

Create `.github/workflows/db-migrate.yml`:

```yaml
name: Database Migration

on:
  push:
    branches: [main]
    paths:
      - 'backend/prisma/schema.prisma'

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run migrations
        working-directory: ./backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy
```

### 2.4 GitHub Secrets Configuration

Add these secrets in GitHub:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `EC2_HOST`
- `EC2_SSH_KEY`
- `DATABASE_URL`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 📊 Phase 3: Monitoring & Logging

### 3.1 Application Monitoring (Datadog)

**Setup Datadog**
```bash
# On EC2
DD_API_KEY=<your-api-key> DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

**Configure Datadog Agent**
```yaml
# /etc/datadog-agent/conf.d/docker.d/conf.yaml
init_config:

instances:
  - url: "unix://var/run/docker.sock"
    collect_container_size: true
```

**Add to Backend Code**
```typescript
// backend/src/config/monitoring.ts
import { StatsD } from 'hot-shots';

export const statsd = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'kush_films.'
});

// Track metrics
statsd.increment('api.request');
statsd.timing('api.response_time', duration);
```

### 3.2 Error Tracking (Sentry)

**Install Sentry**
```bash
cd backend
npm install @sentry/node @sentry/profiling-node
```

**Configure Sentry**
```typescript
// backend/src/config/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

export { Sentry };
```

### 3.3 Log Aggregation (CloudWatch)

**Install CloudWatch Agent**
```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

**Configure Log Collection**
```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/aws/ec2/kush-films/nginx",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/aws/ec2/kush-films/nginx-error",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

### 3.4 Uptime Monitoring

**UptimeRobot Setup**
1. Go to uptimerobot.com
2. Add monitors:
   - `https://kushfilms.com` (HTTP, 5-min interval)
   - `https://api.kushfilms.com/health` (HTTP, 5-min interval)
3. Configure alerts:
   - Email notifications
   - Slack integration

---

## 🔧 Phase 4: Scaling Strategy

### 4.1 Auto-Scaling Configuration

**Create Auto Scaling Group**
```bash
# 1. Create AMI from current EC2 instance
# 2. Create Launch Template with:
#    - AMI ID
#    - Instance type: t3.medium
#    - User data script for Docker startup
# 3. Create Auto Scaling Group:
#    - Min: 2, Desired: 3, Max: 20
#    - Target tracking: CPU 70%
#    - Health check: ELB
```

**User Data Script**
```bash
#!/bin/bash
cd /home/ubuntu/kush-films-backend
docker pull yourusername/kush-films-api:latest
docker run -d \
  --name kush-films-api \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file .env \
  yourusername/kush-films-api:latest
```

### 4.2 Load Balancer Setup

**Create Application Load Balancer**
```bash
# 1. Go to EC2 → Load Balancers
# 2. Create ALB:
#    - Name: kush-films-alb
#    - Scheme: Internet-facing
#    - Listeners: HTTP (80), HTTPS (443)
#    - Availability Zones: Select 2+
# 3. Target Group:
#    - Protocol: HTTP
#    - Port: 4000
#    - Health check: /health
# 4. Register EC2 instances
```

### 4.3 Database Read Replicas

```bash
# 1. Go to RDS → Select database
# 2. Actions → Create read replica
# 3. Configure:
#    - Replica: db.t3.medium
#    - Multi-AZ: Yes
#    - Region: Same or different
# 4. Update backend to use read replica
```

```typescript
// backend/src/config/database.ts
export const prismaRead = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_READ_URL
    }
  }
});
```

### 4.4 Redis Clustering

Already configured in ElastiCache setup with 2 replicas.

---

## 💰 Phase 5: Cost Optimization

### Monthly Cost Breakdown (100K Users)

```
Service                    Monthly Cost
─────────────────────────────────────
Vercel Pro                  $20
AWS EC2 (3x t3.medium)      $300
AWS RDS (db.t3.large)       $400
AWS ElastiCache             $200
Cloudflare R2 (100TB)       $1,500
AWS ALB                     $20
AWS CloudWatch              $50
Datadog                     $100
Sentry                      $50
Domain & SSL                $15
─────────────────────────────────────
Total                       $2,655/month
```

### Cost Optimization Tips

1. **Use Reserved Instances**
   - Save 30-50% on EC2/RDS
   - Commit to 1-year term

2. **Optimize Storage**
   - Archive old videos to Glacier
   - Compress images before upload
   - Use CDN caching aggressively

3. **Right-Size Instances**
   - Monitor CPU/memory usage
   - Scale down during off-peak hours

4. **Batch Processing**
   - Schedule transcoding jobs during low traffic
   - Use spot instances for batch jobs

---

## 🔒 Phase 6: Security Hardening

### 6.1 Security Checklist

- [ ] All traffic over HTTPS
- [ ] Firewall configured (only necessary ports)
- [ ] Database not publicly accessible
- [ ] Redis password protected
- [ ] SSH key-based authentication only
- [ ] Regular security updates
- [ ] Rate limiting enabled
- [ ] DDoS protection (Cloudflare)
- [ ] WAF rules configured
- [ ] Secrets in environment variables
- [ ] No credentials in code
- [ ] Regular backups configured

### 6.2 Backup Strategy

**Automated Backups**
```bash
# Database: AWS RDS Automated Backups (enabled by default)
# Retention: 30 days
# Daily snapshots at 3 AM UTC

# Application: GitHub
# Code repository backed up
# Docker images on Docker Hub

# Media: Cloudflare R2
# Versioning enabled
# Cross-region replication to S3
```

**Disaster Recovery Plan**
- RTO: 4 hours
- RPO: 5 minutes
- Backup testing: Monthly
- Incident response plan documented

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates valid
- [ ] DNS configured correctly
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrated
- [ ] Health checks passing
- [ ] CDN working
- [ ] Payment processing working
- [ ] Email sending working

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Monitoring dashboards showing data
- [ ] Alerts configured
- [ ] Performance metrics acceptable
- [ ] Security scan completed
- [ ] Team notified
- [ ] Documentation updated

---

## 🎯 Summary

Your Kush Films platform is now production-ready with:

✅ Scalable infrastructure (100K+ users)
✅ High availability (99.9% uptime)
✅ Automated CI/CD
✅ Comprehensive monitoring
✅ Cost-optimized architecture
✅ Enterprise-grade security

**Estimated Setup Time**: 1-2 days
**Monthly Operating Cost**: ~$2,655
**Scalability**: Up to 1M+ users with minimal changes

---

**Next**: Review [SECURITY.md](SECURITY.md) for detailed security practices
