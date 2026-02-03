# 🚀 Quick Deployment Guide

## Step 1: Run Pre-Deployment Check

**Windows (PowerShell):**
```powershell
.\pre-deploy-check.ps1
```

**Mac/Linux:**
```bash
chmod +x pre-deploy-check.sh
./pre-deploy-check.sh
```

If all checks pass ✅, continue to Step 2.

---

## Step 2: Setup Database (Choose One)

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up & create project
3. Copy connection string
4. Save as `DATABASE_URL`

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. New project
3. Copy postgres connection string
4. Save as `DATABASE_URL`

---

## Step 3: Generate Secrets

Run in terminal:
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save both secrets for environment variables.

---

## Step 4: Setup Cloudinary (Image Hosting)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free)
3. Get from dashboard:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 5: Deploy Backend to Render

1. **Push to GitHub:**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Service:**
   - Go to [render.com](https://render.com)
   - New Web Service
   - Connect GitHub repo
   - Settings:
     - Name: `kush-films-api`
     - Root Directory: `backend`
     - Build Command: `npm install && npx prisma generate && npm run build`
     - Start Command: `npm start`

3. **Add Environment Variables:**
   ```
   DATABASE_URL=your-neon-url
   JWT_SECRET=your-generated-secret
   JWT_REFRESH_SECRET=your-other-secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   CLOUDINARY_CLOUD_NAME=your-name
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

4. **Deploy** - Click "Create Web Service"

5. **Run Migration:**
   - Wait for deployment
   - Go to Shell tab
   - Run: `npx prisma migrate deploy`

---

## Step 6: Deploy Frontend to Vercel

1. **Push to GitHub** (if not already):
   ```bash
   cd frontend
   git push origin main
   ```

2. **Create Vercel Project:**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Settings:
     - Root Directory: `frontend`
     - Framework: Next.js

3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://kush-films-api.onrender.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

4. **Deploy** - Click "Deploy"

---

## Step 7: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Environment tab
3. Update `FRONTEND_URL` with your Vercel URL
4. Click "Save"
5. Redeploy

---

## Step 8: Test Your Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.onrender.com/health
   # Should return: {"status":"ok",...}
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try sign up
   - Try login
   - Browse movies
   - Add favorites

---

## 🎉 You're Live!

**Frontend:** `https://kush-films.vercel.app`
**Backend:** `https://kush-films-api.onrender.com`

---

## ⚠️ Important Notes

1. **Render Free Tier:**
   - Sleeps after 15 min inactivity
   - First request takes 30-60 sec
   - Consider upgrading for production

2. **Neon Free Tier:**
   - Sleeps after 5 min inactivity
   - May need keep-alive ping

3. **Automatic Deploys:**
   - Push to GitHub = auto deploy
   - `git push origin main`

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check environment variables
- Verify DATABASE_URL is correct
- Check Render logs

**Frontend API errors:**
- Verify NEXT_PUBLIC_API_URL
- Check backend CORS settings
- Inspect browser console

**Database connection fails:**
- Confirm DATABASE_URL format
- Run migrations: `npx prisma migrate deploy`
- Check database is active

---

## 📚 Full Documentation

See `DEPLOYMENT_CHECKLIST.md` for comprehensive guide.

---

## 🆘 Need Help?

Check the logs:
- **Render:** Dashboard → Logs
- **Vercel:** Dashboard → Deployments → Function Logs
