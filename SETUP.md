# ⚙️ Kush Films - Complete Setup & Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 7.x or higher ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))
- **Code Editor** (VS Code recommended)

---

## 🚀 Quick Start (Copy-Paste Ready)

### 1. Create Project Directory

```bash
mkdir kush-films
cd kush-films
```

### 2. Backend Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install fastify @fastify/cors @fastify/helmet @fastify/rate-limit @fastify/jwt
npm install @prisma/client stripe bcryptjs jsonwebtoken ioredis
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install zod dotenv

# Install dev dependencies
npm install -D typescript @types/node @types/bcryptjs @types/jsonwebtoken
npm install -D prisma tsx nodemon

# Install Prisma CLI globally (optional)
npm install -g prisma

# Initialize TypeScript
npx tsc --init

# Initialize Prisma
npx prisma init
```

### 3. Configure TypeScript

Create or update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Update package.json Scripts

Add these scripts to `backend/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

### 5. Create Prisma Schema

Copy the complete schema from `DATABASE.md` into `backend/prisma/schema.prisma`

### 6. Create Environment File

Create `backend/.env`:

```env
# Application
NODE_ENV=development
PORT=4000
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kush_films?schema=public"

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=change-this-to-a-random-secret-key-at-least-32-characters
JWT_REFRESH_SECRET=change-this-to-another-random-secret-key-different-from-access

# Redis
REDIS_URL=redis://localhost:6379

# Cloudflare R2 (Sign up at cloudflare.com)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=kush-films-videos
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CDN_URL=https://cdn.kushfilms.com

# Stripe (Sign up at stripe.com)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...

# AWS SES (Optional for emails)
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=your-access-key
AWS_SES_SECRET_KEY=your-secret-key
FROM_EMAIL=noreply@kushfilms.com
```

### 7. Set Up Database

```bash
# Make sure PostgreSQL is running

# Create database
createdb kush_films

# Or using psql
psql -U postgres
CREATE DATABASE kush_films;
\q

# Run migrations
cd backend
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 8. Create Seed File

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kushfilms.com' },
    update: {},
    create: {
      email: 'admin@kushfilms.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true
    }
  });
  
  console.log('Created admin user:', admin.email);
  
  // Create categories
  const categories = [
    { name: 'Action', slug: 'action', description: 'High-octane action movies' },
    { name: 'Drama', slug: 'drama', description: 'Emotional storytelling' },
    { name: 'Comedy', slug: 'comedy', description: 'Laugh-out-loud comedies' },
    { name: 'Romance', slug: 'romance', description: 'Love stories' },
    { name: 'Thriller', slug: 'thriller', description: 'Edge-of-your-seat thrillers' }
  ];
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }
  
  console.log('Created categories');
  
  // Create sample movies
  const actionCategory = await prisma.category.findUnique({
    where: { slug: 'action' }
  });
  
  if (actionCategory) {
    await prisma.movie.create({
      data: {
        title: 'Sample Action Movie',
        slug: 'sample-action-movie',
        description: 'An exciting action-packed movie for testing',
        thumbnailUrl: 'https://via.placeholder.com/400x600',
        posterUrl: 'https://via.placeholder.com/1920x1080',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
        duration: 600,
        year: 2024,
        rating: 4.5,
        language: 'English',
        country: 'Uganda',
        genres: ['Action', 'Adventure'],
        accessLevel: 'FREE',
        published: true,
        publishedAt: new Date(),
        categoryId: actionCategory.id
      }
    });
  }
  
  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 9. Seed Database

```bash
npm run prisma:seed
```

### 10. Frontend Setup

Open a **new terminal** (keep backend terminal open):

```bash
# From project root
cd ..
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
cd frontend

# Install additional dependencies
npm install axios zustand next-auth hls.js
npm install @heroicons/react clsx tailwind-merge
npm install react-hook-form zod @hookform/resolvers

# Install dev dependencies
npm install -D @types/hls.js
```

### 11. Create Frontend Environment File

Create `frontend/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-to-random-string

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
```

### 12. Configure Next.js

Update `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'cdn.kushfilms.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif']
  },
  
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:4000/api/v1/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
```

---

## 🔧 Redis Setup

### macOS (Homebrew)
```bash
brew install redis
brew services start redis

# Test connection
redis-cli ping
# Should return: PONG
```

### Windows
```bash
# Using Chocolatey
choco install redis-64

# Or download from: https://github.com/tporadowski/redis/releases
# Then run: redis-server.exe

# Test connection
redis-cli ping
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test connection
redis-cli ping
```

---

## 💳 Stripe Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Verify your email

### 2. Get API Keys
1. Go to **Developers → API Keys**
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)
4. Add to `.env` files

### 3. Create Products & Prices
```bash
# Using Stripe CLI (optional but recommended)
stripe login

# Create products
stripe products create --name="Basic Plan" --description="Basic subscription"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=299 --recurring[interval]=month

stripe products create --name="Premium Plan" --description="Premium subscription"
stripe prices create --product=prod_xxx --currency=usd --unit-amount=499 --recurring[interval]=month
```

Or create via Dashboard:
1. Go to **Products**
2. Click **+ Add product**
3. Enter details and price
4. Save and copy **Price ID** to `.env`

### 4. Set Up Webhooks (for local testing)
```bash
# Install Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
choco install stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:4000/api/v1/webhooks/stripe

# Copy webhook signing secret to .env
```

---

## 🗄️ Cloudflare R2 Setup

### 1. Create Cloudflare Account
1. Go to [cloudflare.com](https://www.cloudflare.com)
2. Sign up and verify email

### 2. Create R2 Bucket
1. Go to **R2** in dashboard
2. Click **Create bucket**
3. Name it `kush-films-videos`
4. Click **Create bucket**

### 3. Get API Credentials
1. Go to **R2 → Manage R2 API Tokens**
2. Click **Create API token**
3. Permissions: **Object Read & Write**
4. Copy:
   - Access Key ID
   - Secret Access Key
   - Endpoint URL
5. Add to `.env`

### 4. Configure CORS (Optional)
```bash
# Using AWS CLI with R2
aws s3api put-bucket-cors \
  --bucket kush-films-videos \
  --endpoint-url https://[account-id].r2.cloudflarestorage.com \
  --cors-configuration file://cors.json
```

`cors.json`:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd backend
npm run dev

# Should see:
# Server running on http://localhost:4000
# Database connected
```

### Start Frontend (New Terminal)
```bash
cd frontend
npm run dev

# Should see:
# - ready started server on 0.0.0.0:3000
```

### Open in Browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: Run `npm run prisma:studio` (http://localhost:5555)

---

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:4000/health
# Expected: {"status":"ok"}
```

### 2. Test Database Connection
```bash
curl http://localhost:4000/health/ready
# Expected: {"status":"ready","checks":{"database":"ok","redis":"ok"}}
```

### 3. Test Admin Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kushfilms.com",
    "password": "admin123"
  }'

# Should return JWT token
```

### 4. Test Frontend
1. Open http://localhost:3000
2. Click **Login**
3. Enter admin credentials
4. Should redirect to home page

---

## 📦 Project Structure Verification

After setup, your structure should look like:

```
kush-films/
├── backend/
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── modules/
│   │   └── middleware/
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── node_modules/
    ├── app/
    │   ├── (main)/
    │   ├── (auth)/
    │   ├── admin/
    │   └── layout.tsx
    ├── components/
    ├── lib/
    ├── hooks/
    ├── .env.local
    ├── package.json
    └── next.config.js
```

---

## 🐛 Common Issues & Solutions

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Check connection string in .env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/kush_films"

# Test connection
psql -U postgres -d kush_films
```

### Issue: Redis connection failed
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG

# Start Redis if not running
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

### Issue: Prisma migration fails
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Run migrations again
npx prisma migrate dev

# Generate client
npx prisma generate
```

### Issue: Port already in use
```bash
# Find process using port 4000
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=4001
```

### Issue: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Update Stripe keys to production keys
- [ ] Set up proper CORS configuration
- [ ] Enable HTTPS
- [ ] Set up environment variables in production
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Back up database regularly
- [ ] Test webhook security

---

## 📚 Additional Tools

### Recommended VS Code Extensions
```bash
# Install via VS Code
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- REST Client
```

### Database GUI Tools
- **Prisma Studio**: `npm run prisma:studio`
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/

### API Testing Tools
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code extension)

---

## 🎯 Next Steps

1. ✅ **Complete setup** using commands above
2. 📖 **Review architecture**: See `ARCHITECTURE.md`
3. 🔧 **Build features**: Follow `DEVELOPMENT_PHASES.md`
4. 🚀 **Deploy**: See `DEPLOYMENT.md`
5. 🔒 **Security**: Review `SECURITY.md`

---

## 💡 Quick Commands Reference

```bash
# Backend
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:studio    # Open database GUI
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client

# Frontend
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code

# Database
psql -U postgres         # Open PostgreSQL CLI
createdb kush_films      # Create database
dropdb kush_films        # Delete database

# Redis
redis-cli                # Open Redis CLI
redis-cli ping           # Test connection
redis-cli flushall       # Clear all data (dangerous!)
```

---

## 📞 Support

If you encounter any issues:

1. Check the **Common Issues** section above
2. Review error messages carefully
3. Check environment variables
4. Ensure all services are running
5. Clear caches and reinstall dependencies

---

**Installation Complete!** 🎉

Your Kush Films development environment is ready. Start building by following the development phases in `DEVELOPMENT_PHASES.md`.
