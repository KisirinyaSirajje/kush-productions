# Kush Films - Backend API

Free Tier MVP Backend built with Fastify + Prisma + PostgreSQL

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL from Supabase
# - JWT secrets (generate random strings)
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on http://localhost:4000

## 📡 API Endpoints

### Health
- `GET /health` - Server health check

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Movies
- `GET /api/movies` - List all movies (with filters)
- `GET /api/movies/:id` - Get movie details

### Categories
- `GET /api/categories` - List all categories

### Favorites (Auth Required)
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:movieId` - Remove from favorites
- `GET /api/favorites` - Get user favorites

### Watch History (Auth Required)
- `POST /api/watch-history` - Update watch progress
- `GET /api/watch-history` - Get watch history

### Ratings & Comments (Auth Required)
- `POST /api/ratings` - Rate a movie
- `POST /api/comments` - Comment on movie

### Admin (Admin Role Required)
- `POST /api/admin/movies` - Create movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie
- `POST /api/admin/categories` - Create category

## 🧪 Test Accounts

After seeding:
- **Admin**: admin@kushfilms.com / admin123

## 📦 Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

## 🚀 Deploy to Render.com

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect GitHub repo
4. Build Command: `npm install && npm run prisma:generate`
5. Start Command: `npm run prisma:deploy && npm start`
6. Add environment variables from .env
7. Deploy!

## 🗄️ Database Schema

- **User** - User accounts and authentication
- **Movie** - Movie content and metadata
- **Category** - Movie categories
- **MovieCategory** - Many-to-many relationship
- **WatchHistory** - User viewing history
- **Favorite** - User favorites
- **Comment** - Movie comments
- **Rating** - Movie ratings (1-5 stars)
