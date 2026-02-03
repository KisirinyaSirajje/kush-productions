# 🚀 Kush Films - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] All lint errors fixed
- [x] Production build passes (`npm run build`)
- [x] No console.errors in production code
- [x] All TODO comments addressed

### ✅ Security
- [x] Admin credentials removed from UI
- [x] JWT secrets configured
- [x] Rate limiting enabled
- [x] CORS configured properly
- [x] Helmet security headers active
- [ ] Environment variables secured

### ✅ Database
- [ ] Production database created (Neon/Supabase)
- [ ] Database migrations run
- [ ] Seed data added (if needed)
- [ ] Connection pooling configured

### ✅ Environment Variables
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] API keys obtained (Cloudinary, etc.)
- [ ] JWT secrets generated

---

## 🎯 Quick Deployment (Free Tier)

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

#### Backend - Render.com (Free)

**1. Create Account & New Web Service**
```
1. Go to render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect GitHub repository
```

**2. Configure Service**
```yaml
Name: kush-films-api
Region: Choose closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npx prisma generate && npm run build
Start Command: npm start
```

**3. Add Environment Variables**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-long-random-secret-min-32-chars
JWT_REFRESH_SECRET=your-other-long-secret-min-32-chars
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

**4. Deploy**
- Click "Create Web Service"
- Wait for build to complete (~5 minutes)
- Get your backend URL: `https://kush-films-api.onrender.com`

**⚠️ Important:** Render free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds.

---

#### Frontend - Vercel (Free)

**1. Push to GitHub**
```bash
cd frontend
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/kush-films.git
git push -u origin main
```

**2. Deploy to Vercel**
```
1. Go to vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - Framework: Next.js
   - Root Directory: ./frontend
   - Build Command: npm run build
   - Output Directory: .next
```

**3. Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://kush-films-api.onrender.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

**4. Deploy**
- Click "Deploy"
- Wait for build (~3 minutes)
- Get your URL: `https://kush-films.vercel.app`

**5. Update Backend FRONTEND_URL**
- Go back to Render
- Update FRONTEND_URL environment variable
- Redeploy backend

---

### Option 2: Railway (Backend + Frontend)

**1. Create Account**
```
1. Go to railway.app
2. Sign up with GitHub
3. Click "New Project"
```

**2. Deploy Backend**
```
1. Select "Deploy from GitHub repo"
2. Choose repository
3. Add environment variables (same as Render)
4. Railway auto-detects Node.js
5. Set root directory: backend
```

**3. Deploy Frontend**
```
1. Click "New" → "GitHub Repo"
2. Select same repository
3. Add environment variables
4. Set root directory: frontend
5. Railway auto-deploys
```

---

## 📊 Database Setup (Production)

### Option 1: Neon (PostgreSQL - Free Tier)

**1. Create Database**
```
1. Go to neon.tech
2. Sign up
3. Create new project
4. Copy connection string
```

**2. Run Migrations**
```bash
cd backend
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

**3. Keep Alive (Free Tier)**
- Neon free tier sleeps after 5 minutes
- Use cron job or UptimeRobot to ping every 4 minutes

### Option 2: Supabase (PostgreSQL - Free Tier)

**1. Create Project**
```
1. Go to supabase.com
2. New project
3. Set strong password
4. Copy connection string
```

**2. Get Connection String**
```
Format: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

**3. Run Migrations**
```bash
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
```

---

## 🔑 Generate Secure Secrets

```bash
# Generate JWT secrets (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy these to your environment variables.

---

## 🎨 Cloudinary Setup (Image/Video Hosting)

**1. Create Account**
```
1. Go to cloudinary.com
2. Sign up (free tier)
3. Go to Dashboard
```

**2. Get Credentials**
```
Cloud Name: found on dashboard
API Key: found on dashboard
API Secret: click "reveal" to see
```

**3. Add to Environment Variables**
Both frontend and backend need these.

---

## ✅ Post-Deployment Checks

### Test Backend
```bash
# Health check
curl https://your-backend-url.com/health

# Should return:
{"status":"ok","timestamp":"..."}
```

### Test Frontend
```
1. Visit your Vercel URL
2. Try to sign up
3. Try to login
4. Browse movies
5. Add to favorites
6. Test admin panel (if admin user created)
```

### Check Logs
- **Render:** Dashboard → Logs tab
- **Vercel:** Dashboard → Deployments → View Function Logs
- **Railway:** Dashboard → Deployments → View Logs

---

## 🔄 CI/CD (Automatic Deployments)

Both Vercel and Render automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel and Render will automatically deploy
```

---

## 🚨 Troubleshooting

### Backend Issues

**"Cannot connect to database"**
```
- Check DATABASE_URL is correct
- Ensure IP is whitelisted (if required)
- Verify database is active
```

**"Port already in use"**
```
- Don't set PORT in .env for Render (they provide it)
- Use process.env.PORT || 4000
```

**"Build failed"**
```
- Check Node version (16+)
- Ensure all dependencies in package.json
- Run `npm install` locally first
```

### Frontend Issues

**"API calls failing"**
```
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend CORS allows your domain
- Check browser console for errors
```

**"Build timeout"**
```
- Remove large files
- Check for infinite loops in components
- Optimize images
```

**"Environment variables not working"**
```
- Must start with NEXT_PUBLIC_ for frontend
- Redeploy after adding variables
- Clear build cache
```

---

## 📈 Monitoring & Maintenance

### Free Monitoring Tools

**1. UptimeRobot (uptime monitoring)**
```
- Free: 50 monitors
- Check every 5 minutes
- Email alerts
```

**2. LogTail (log management)**
```
- Free: 1GB/month
- 3-day retention
```

**3. Sentry (error tracking)**
```
- Free: 5K errors/month
- Good for catching production bugs
```

### Database Backups

**Neon:** Automatic daily backups (paid plans)
**Supabase:** Daily backups on free tier

Export manually:
```bash
pg_dump $DATABASE_URL > backup.sql
```

---

## 💰 Cost Estimate

### Free Tier (Current Setup)
```
✅ Render Backend: $0/month (sleeps after 15min)
✅ Vercel Frontend: $0/month (100GB bandwidth)
✅ Neon Database: $0/month (3GB storage)
✅ Cloudinary: $0/month (25 credits)
✅ Domain: $10-15/year (optional)

Total: $0/month + domain
```

### Paid Tier (Recommended for Production)
```
💰 Render: $7/month (no sleep)
💰 Vercel: $20/month (commercial use)
💰 Neon: $19/month (always on + backups)
💰 Cloudinary: $0-89/month (based on usage)

Total: ~$46-135/month
```

---

## 🎯 Quick Start Commands

### Deploy Backend
```bash
cd backend
git push origin main  # Auto-deploys on Render
```

### Deploy Frontend
```bash
cd frontend
git push origin main  # Auto-deploys on Vercel
```

### Update Database
```bash
cd backend
npx prisma migrate deploy
```

### View Logs
```bash
# Render
Click "Logs" in dashboard

# Vercel
vercel logs your-app-url
```

---

## 📞 Support & Resources

- **Render Docs:** render.com/docs
- **Vercel Docs:** vercel.com/docs
- **Neon Docs:** neon.tech/docs
- **Prisma Deploy:** prisma.io/docs/guides/deployment

---

## ✨ Your App is Live!

Frontend: `https://kush-films.vercel.app`
Backend: `https://kush-films-api.onrender.com`

Share your link and enjoy! 🎉
