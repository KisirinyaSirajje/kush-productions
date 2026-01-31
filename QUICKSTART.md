# 🚀 Setup Instructions - Kush Films Free Tier MVP

Follow these steps to get your project running locally.

---

## ✅ Prerequisites Installation

### 1. Install Node.js (Required)

**Download Node.js 20 LTS**:
- Go to: https://nodejs.org/
- Download: **20.x LTS** version (Recommended for most users)
- Run installer and follow prompts
- Restart your terminal after installation

**Verify installation**:
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

---

### 2. Sign Up for Free Services

#### A. Supabase (Database)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)
4. Create new project:
   - **Name**: kush-films
   - **Database Password**: Create strong password (save this!)
   - **Region**: Choose closest to Uganda (eu-west-1 or ap-southeast-1)
5. Wait 2-3 minutes for provisioning
6. Go to **Settings → Database**
7. Copy **Connection String** (URI format)
8. Save it - you'll need this!

#### B. Cloudinary (Video Storage)
1. Go to https://cloudinary.com
2. Click "Sign Up" → Sign up for FREE
3. After signup, go to **Dashboard**
4. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
5. Go to **Settings → Upload**
6. Click "Add upload preset"
   - **Preset name**: kush-films-unsigned
   - **Signing Mode**: Unsigned
   - **Folder**: kush-films
   - Click **Save**

---

## 🛠️ Project Setup

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies (will take 2-3 minutes)
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your credentials
notepad .env
```

**Edit .env with your values**:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="any-random-string-here-change-this-123456789"
JWT_REFRESH_SECRET="another-random-string-for-refresh-987654321"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Setup Database**:
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed with sample data (3 movies + admin account)
npm run prisma:seed
```

**Start Backend Server**:
```bash
npm run dev
```

You should see:
```
🚀 Kush Films API Server Started!
📡 URL: http://localhost:4000
🏥 Health: http://localhost:4000/health
```

**Test it**: Open http://localhost:4000/health in your browser

✅ **Backend is running!**

---

### Step 2: Setup Frontend

**Open a NEW terminal** (keep backend running in first terminal)

```bash
# Navigate to frontend folder
cd frontend

# Create Next.js app (this will ask questions)
npx create-next-app@latest .
```

**Answer the prompts**:
```
✔ Would you like to use TypeScript? › Yes
✔ Would you like to use ESLint? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › No
✔ Would you like to use App Router? › Yes
✔ Would you like to use Turbopack for next dev? › No
✔ Would you like to customize the import alias? › No
```

**Install additional dependencies**:
```bash
npm install axios zustand
```

**Create .env.local**:
```bash
copy .env.example .env.local
notepad .env.local
```

**Add this content**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
```

**Start Frontend**:
```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x
- Local: http://localhost:3000
```

**Open in browser**: http://localhost:3000

✅ **Frontend is running!**

---

## 🎯 You're All Set!

**Two terminals running**:
1. **Terminal 1** (Backend): `cd backend; npm run dev` → http://localhost:4000
2. **Terminal 2** (Frontend): `cd frontend; npm run dev` → http://localhost:3000

**Test Admin Login**:
- Email: admin@kushfilms.com
- Password: admin123

---

## 🆘 Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org and restart terminal

### "Database connection failed"
→ Check your DATABASE_URL in backend/.env
→ Ensure Supabase project is active (doesn't pause after 7 days of inactivity)

### "Port 4000 already in use"
→ Change PORT in backend/.env to 4001
→ Update NEXT_PUBLIC_API_URL in frontend/.env.local

### Prisma errors
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # Warning: deletes all data
npm run prisma:seed
```

---

## 📚 Next Steps

1. **Browse sample movies**: http://localhost:3000
2. **Test API**: http://localhost:4000/api/movies
3. **View database**: `cd backend; npx prisma studio` (opens DB GUI)
4. **Start building features** from FREE_TIER_MVP.md

---

## 🚀 Deploy (When Ready)

### Backend → Render.com
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repo, add env vars
4. Deploy!

### Frontend → Vercel
1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import repo
4. Deploy!

**Full deployment guide**: See DEPLOYMENT.md

---

## 📖 Documentation

- **Backend API**: See backend/README.md
- **Free Tier Guide**: See FREE_TIER_MVP.md
- **Full Architecture**: See ARCHITECTURE.md

---

Need help? Check the troubleshooting section in FREE_TIER_MVP.md
