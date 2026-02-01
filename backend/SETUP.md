# 🚀 Backend Setup Instructions

## Step 1: Setup Free PostgreSQL Database

### Option A: Neon.tech (RECOMMENDED - Easiest)
1. Go to **https://neon.tech/**
2. Click "Sign Up" (use GitHub login)
3. Create a new project:
   - Name: `kushfilms`
   - Region: Choose closest to you
4. Copy the **Connection String** (looks like):
   ```
   postgresql://username:password@ep-xxx.aws.neon.tech/kushfilms?sslmode=require
   ```
5. Open `backend/.env` file
6. Replace the `DATABASE_URL` value with your connection string

### Option B: Supabase
1. Go to **https://supabase.com/**
2. Create account → New Project
3. Get connection string from Settings → Database
4. Use the "Connection Pooling" string

### Option C: Railway
1. Go to **https://railway.app/**
2. Add PostgreSQL service
3. Copy connection string

---

## Step 2: Run Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

---

## Step 3: Seed Database (Optional - adds demo data)

```bash
npm run prisma:seed
```

---

## Step 4: Start Backend Server

```bash
npm run dev
```

Server will start on **http://localhost:4000**

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires token)

### Movies
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/admin/movies` - Create movie (admin only)
- `PUT /api/admin/movies/:id` - Update movie (admin only)
- `DELETE /api/admin/movies/:id` - Delete movie (admin only)

### Foods
- `GET /api/foods` - List all foods
- `GET /api/foods/:id` - Get food details
- `POST /api/admin/foods` - Create food (admin only)
- `PUT /api/admin/foods/:id` - Update food (admin only)
- `DELETE /api/admin/foods/:id` - Delete food (admin only)

### Test
- `GET /health` - Health check

---

## Next Steps

1. Get PostgreSQL connection string from Neon.tech
2. Update `.env` file
3. Run migrations
4. Start server
5. Test with: `http://localhost:4000/health`
