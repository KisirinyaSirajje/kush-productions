# 🗄️ Kush Films - Complete Database Design

## Prisma Schema (Production-Ready)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id               String            @id @default(uuid())
  email            String            @unique
  password         String            // Hashed with bcrypt
  name             String
  avatar           String?
  role             UserRole          @default(USER)
  emailVerified    Boolean           @default(false)
  emailVerificationToken String?     @unique
  passwordResetToken     String?     @unique
  passwordResetExpires   DateTime?
  stripeCustomerId String?           @unique
  
  // Relations
  subscription     Subscription?
  payments         Payment[]
  watchHistory     WatchHistory[]
  favorites        Favorite[]
  comments         Comment[]
  ratings          Rating[]
  notifications    Notification[]
  sessions         Session[]
  
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  lastLoginAt      DateTime?
  
  @@index([email])
  @@index([role])
  @@map("users")
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String   @unique
  refreshToken String?  @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}

// ============================================
// SUBSCRIPTION & PAYMENTS
// ============================================

model Subscription {
  id                   String             @id @default(uuid())
  userId               String             @unique
  user                 User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  status               SubscriptionStatus @default(ACTIVE)
  plan                 SubscriptionPlan   @default(FREE)
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  currentPeriodStart   DateTime           @default(now())
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean            @default(false)
  canceledAt           DateTime?
  trialEndsAt          DateTime?
  
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
  
  @@index([userId])
  @@index([status, plan])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  TRIALING
  PAST_DUE
  CANCELED
  UNPAID
  INCOMPLETE
}

enum SubscriptionPlan {
  FREE
  BASIC
  PREMIUM
}

model Payment {
  id                String        @id @default(uuid())
  userId            String
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount            Int           // Amount in cents
  currency          String        @default("USD")
  status            PaymentStatus @default(PENDING)
  stripePaymentId   String?       @unique
  stripeInvoiceId   String?
  description       String?
  receiptUrl        String?
  failureMessage    String?
  refundedAmount    Int?          @default(0)
  
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?
  image       String?
  order       Int      @default(0)
  active      Boolean  @default(true)
  
  movies      Movie[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([active, order])
  @@map("categories")
}

model Movie {
  id               String       @id @default(uuid())
  title            String
  slug             String       @unique
  description      String?      @db.Text
  plot             String?      @db.Text
  year             Int?
  duration         Int          // Duration in seconds
  rating           Float?       @default(0)
  imdbRating       Float?
  language         String       @default("English")
  country          String       @default("Uganda")
  director         String?
  cast             String[]     // Array of actor names
  genres           String[]     // Array of genre names
  
  // Media URLs
  thumbnailUrl     String
  posterUrl        String?
  backdropUrl      String?
  trailerUrl       String?
  
  // Video files (different qualities)
  videoUrl         String       // Original or highest quality
  video720pUrl     String?
  video480pUrl     String?
  video360pUrl     String?
  hlsManifestUrl   String?      // HLS manifest for adaptive streaming
  
  // Access control
  accessLevel      AccessLevel  @default(FREE)
  published        Boolean      @default(false)
  publishedAt      DateTime?
  featured         Boolean      @default(false)
  trending         Boolean      @default(false)
  
  // Category
  categoryId       String?
  category         Category?    @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  
  // Stats (denormalized for performance)
  viewCount        Int          @default(0)
  favoriteCount    Int          @default(0)
  commentCount     Int          @default(0)
  shareCount       Int          @default(0)
  
  // Relations
  watchHistory     WatchHistory[]
  favorites        Favorite[]
  comments         Comment[]
  ratings          Rating[]
  analytics        MovieAnalytics?
  
  // Metadata
  metadata         Json?        // Flexible field for additional data
  
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
  
  @@index([slug])
  @@index([published, publishedAt])
  @@index([categoryId])
  @@index([accessLevel])
  @@index([featured, trending])
  @@fulltext([title, description])
  @@map("movies")
}

enum AccessLevel {
  FREE
  BASIC      // Requires Basic or Premium subscription
  PREMIUM    // Requires Premium subscription only
}

model WatchHistory {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  movieId    String
  movie      Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  
  progress   Int      @default(0) // Seconds watched
  completed  Boolean  @default(false)
  watchedAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@unique([userId, movieId])
  @@index([userId, watchedAt])
  @@index([movieId])
  @@map("watch_history")
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  movieId   String
  movie     Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, movieId])
  @@index([userId])
  @@map("favorites")
}

model Rating {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  movieId   String
  movie     Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  
  rating    Int      // 1-5 stars
  review    String?  @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, movieId])
  @@index([movieId])
  @@map("ratings")
}

model Comment {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  movieId   String
  movie     Movie     @relation(fields: [movieId], references: [id], onDelete: Cascade)
  
  content   String    @db.Text
  parentId  String?   // For nested comments
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  
  likes     Int       @default(0)
  reported  Boolean   @default(false)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@index([movieId, createdAt])
  @@index([userId])
  @@map("comments")
}

// ============================================
// ANALYTICS
// ============================================

model MovieAnalytics {
  id                 String   @id @default(uuid())
  movieId            String   @unique
  movie              Movie    @relation(fields: [movieId], references: [id], onDelete: Cascade)
  
  // View metrics
  totalViews         Int      @default(0)
  uniqueViews        Int      @default(0)
  viewsToday         Int      @default(0)
  viewsThisWeek      Int      @default(0)
  viewsThisMonth     Int      @default(0)
  
  // Engagement metrics
  avgWatchTime       Int      @default(0) // Seconds
  avgCompletionRate  Float    @default(0) // Percentage
  totalWatchTime     BigInt   @default(0) // Total seconds watched
  
  // Interaction metrics
  totalLikes         Int      @default(0)
  totalComments      Int      @default(0)
  totalShares        Int      @default(0)
  totalFavorites     Int      @default(0)
  
  // Rating metrics
  avgRating          Float    @default(0)
  totalRatings       Int      @default(0)
  
  lastCalculated     DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  @@index([movieId])
  @@map("movie_analytics")
}

model AnalyticsEvent {
  id         String   @id @default(uuid())
  eventType  String   // page_view, video_start, video_pause, video_complete, etc.
  userId     String?
  sessionId  String
  
  // Event properties
  movieId    String?
  adId       String?
  properties Json?    // Flexible JSON field for additional data
  
  // Context
  ipAddress  String?
  userAgent  String?
  referer    String?
  country    String?
  city       String?
  
  timestamp  DateTime @default(now())
  
  @@index([eventType, timestamp])
  @@index([userId, timestamp])
  @@index([movieId, timestamp])
  @@index([timestamp])
  @@map("analytics_events")
}

// ============================================
// ADVERTISING
// ============================================

model Ad {
  id              String         @id @default(uuid())
  title           String
  type            AdType
  format          AdFormat?
  
  // Creative assets
  videoUrl        String?        // For video ads
  imageUrl        String?        // For banner ads
  clickUrl        String         // Destination URL
  
  // Ad properties
  duration        Int?           // Seconds (for video ads)
  width           Int?           // For banner ads
  height          Int?           // For banner ads
  
  // Targeting
  targetCountries String[]       // Empty = all countries
  targetRegions   String[]       // Specific regions/cities
  targetPlans     SubscriptionPlan[] // Which subscription tiers see this ad
  
  // Scheduling
  startDate       DateTime?
  endDate         DateTime?
  
  // Status
  active          Boolean        @default(true)
  approved        Boolean        @default(false)
  
  // Budget & pricing (for future advertiser portal)
  budget          Int?           // In cents
  bidAmount       Int?           // CPM in cents
  
  // Advertiser info
  advertiserName  String?
  advertiserEmail String?
  
  // Relations
  impressions     AdImpression[]
  clicks          AdClick[]
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@index([type, active])
  @@index([startDate, endDate])
  @@map("ads")
}

enum AdType {
  VIDEO_PREROLL
  VIDEO_MIDROLL
  BANNER
}

enum AdFormat {
  LEADERBOARD     // 728x90
  RECTANGLE       // 300x250
  SKYSCRAPER      // 160x600
  MOBILE_BANNER   // 320x50
  VIDEO_15S
  VIDEO_30S
  VIDEO_60S
}

model AdImpression {
  id         String   @id @default(uuid())
  adId       String
  ad         Ad       @relation(fields: [adId], references: [id], onDelete: Cascade)
  
  userId     String?
  sessionId  String
  
  // Context
  movieId    String?  // Which movie the ad was shown on
  ipAddress  String?
  userAgent  String?
  country    String?
  
  // Tracking
  watched    Boolean  @default(false) // Did user watch the full ad?
  skipped    Boolean  @default(false) // Did user skip?
  skipTime   Int?     // At what second did they skip?
  
  timestamp  DateTime @default(now())
  
  @@index([adId, timestamp])
  @@index([userId, timestamp])
  @@index([timestamp])
  @@map("ad_impressions")
}

model AdClick {
  id         String   @id @default(uuid())
  adId       String
  ad         Ad       @relation(fields: [adId], references: [id], onDelete: Cascade)
  
  userId     String?
  sessionId  String
  
  // Context
  movieId    String?
  ipAddress  String?
  country    String?
  
  timestamp  DateTime @default(now())
  
  @@index([adId, timestamp])
  @@index([timestamp])
  @@map("ad_clicks")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id        String           @id @default(uuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String
  actionUrl String?
  
  read      Boolean          @default(false)
  readAt    DateTime?
  
  metadata  Json?            // Additional data
  
  createdAt DateTime         @default(now())
  
  @@index([userId, read, createdAt])
  @@map("notifications")
}

enum NotificationType {
  NEW_CONTENT
  SUBSCRIPTION_RENEWAL
  SUBSCRIPTION_CANCELED
  PAYMENT_FAILED
  COMMENT_REPLY
  SYSTEM
}

// ============================================
// ADMIN & MODERATION
// ============================================

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  action    String   // create_movie, delete_user, update_subscription, etc.
  entity    String   // movie, user, subscription, etc.
  entityId  String?
  
  oldData   Json?
  newData   Json?
  
  ipAddress String?
  userAgent String?
  
  timestamp DateTime @default(now())
  
  @@index([userId, timestamp])
  @@index([entity, timestamp])
  @@index([timestamp])
  @@map("audit_logs")
}

model Report {
  id          String       @id @default(uuid())
  reporterId  String       // User who reported
  entityType  String       // comment, movie, user
  entityId    String
  reason      ReportReason
  description String?      @db.Text
  status      ReportStatus @default(PENDING)
  
  reviewedBy  String?
  reviewedAt  DateTime?
  resolution  String?      @db.Text
  
  createdAt   DateTime     @default(now())
  
  @@index([status, createdAt])
  @@index([entityType, entityId])
  @@map("reports")
}

enum ReportReason {
  SPAM
  INAPPROPRIATE
  COPYRIGHT
  HARASSMENT
  VIOLENCE
  OTHER
}

enum ReportStatus {
  PENDING
  REVIEWING
  RESOLVED
  DISMISSED
}

// ============================================
// SYSTEM & CONFIGURATION
// ============================================

model SystemConfig {
  id    String @id @default(uuid())
  key   String @unique
  value Json
  
  description String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("system_config")
}
```

---

## 🗂️ Database Indexes Explanation

### Performance-Critical Indexes

1. **User Queries**
   - `users.email` - Login lookups
   - `users.role` - Authorization checks

2. **Content Discovery**
   - `movies.published, publishedAt` - Homepage listings
   - `movies.featured, trending` - Featured content
   - `movies.categoryId` - Category filtering
   - Full-text on `title, description` - Search

3. **Watch History**
   - `watch_history.userId, watchedAt` - User's history timeline
   - `watch_history.movieId` - Movie popularity

4. **Analytics**
   - `analytics_events.timestamp` - Time-series queries
   - `analytics_events.eventType, timestamp` - Event filtering

5. **Ads**
   - `ads.type, active` - Ad selection
   - `ad_impressions.timestamp` - Reporting

---

## 📊 Database Relationships Diagram

```
User ──────┐
│          │
│          ├──< Subscription (1:1)
│          ├──< Payment (1:N)
│          ├──< WatchHistory (1:N)
│          ├──< Favorite (1:N)
│          ├──< Comment (1:N)
│          ├──< Rating (1:N)
│          └──< Notification (1:N)
│
Movie ─────┐
│          │
│          ├──> Category (N:1)
│          ├──< WatchHistory (1:N)
│          ├──< Favorite (1:N)
│          ├──< Comment (1:N)
│          ├──< Rating (1:N)
│          └──< MovieAnalytics (1:1)
│
Ad ────────┐
│          │
│          ├──< AdImpression (1:N)
│          └──< AdClick (1:N)
```

---

## 🔧 Database Migrations

### Initial Migration
```bash
# Create migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### Example Migration Commands
```bash
# Add new column
npx prisma migrate dev --name add_movie_trending

# Reset database (dev only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 🎯 Query Examples

### Common Queries

```typescript
// 1. Get user with subscription
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    subscription: true
  }
});

// 2. Get published movies with category
const movies = await prisma.movie.findMany({
  where: {
    published: true,
    accessLevel: user.subscription?.plan === 'FREE' 
      ? 'FREE' 
      : { in: ['FREE', 'BASIC', 'PREMIUM'] }
  },
  include: {
    category: true,
    analytics: {
      select: {
        totalViews: true,
        avgRating: true
      }
    }
  },
  orderBy: {
    publishedAt: 'desc'
  },
  take: 20
});

// 3. Get user's watch history
const history = await prisma.watchHistory.findMany({
  where: { userId },
  include: {
    movie: {
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        duration: true
      }
    }
  },
  orderBy: {
    watchedAt: 'desc'
  },
  take: 10
});

// 4. Update watch progress
await prisma.watchHistory.upsert({
  where: {
    userId_movieId: {
      userId,
      movieId
    }
  },
  update: {
    progress: currentTime,
    completed: currentTime >= duration * 0.9, // 90% completion
    updatedAt: new Date()
  },
  create: {
    userId,
    movieId,
    progress: currentTime,
    completed: false
  }
});

// 5. Get trending movies (last 7 days)
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const trending = await prisma.movie.findMany({
  where: {
    published: true,
    watchHistory: {
      some: {
        watchedAt: { gte: sevenDaysAgo }
      }
    }
  },
  include: {
    _count: {
      select: {
        watchHistory: {
          where: {
            watchedAt: { gte: sevenDaysAgo }
          }
        }
      }
    },
    category: true
  },
  orderBy: {
    viewCount: 'desc'
  },
  take: 10
});

// 6. Get ad for user
const ad = await prisma.ad.findFirst({
  where: {
    type: 'VIDEO_PREROLL',
    active: true,
    approved: true,
    OR: [
      { startDate: null },
      { startDate: { lte: new Date() } }
    ],
    OR: [
      { endDate: null },
      { endDate: { gte: new Date() } }
    ],
    targetPlans: {
      has: user.subscription?.plan || 'FREE'
    }
  },
  orderBy: {
    bidAmount: 'desc' // Highest bidder first
  }
});

// 7. Search movies
const searchResults = await prisma.movie.findMany({
  where: {
    published: true,
    OR: [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { cast: { has: searchQuery } },
      { genres: { has: searchQuery } }
    ]
  },
  include: {
    category: true
  },
  take: 20
});

// 8. Get user analytics (admin)
const userStats = await prisma.user.aggregate({
  _count: true,
  where: {
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  }
});

const subscriptionStats = await prisma.subscription.groupBy({
  by: ['plan', 'status'],
  _count: true
});

// 9. Track ad impression
await prisma.adImpression.create({
  data: {
    adId: ad.id,
    userId: user?.id,
    sessionId: sessionId,
    movieId: movieId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    country: 'UG'
  }
});

// 10. Get revenue analytics
const revenue = await prisma.payment.aggregate({
  where: {
    status: 'SUCCEEDED',
    createdAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  },
  _sum: {
    amount: true
  },
  _count: true
});
```

---

## 🚀 Performance Optimization

### Connection Pooling
```env
DATABASE_URL="postgresql://user:pass@host:5432/kush?
  connection_limit=20&
  pool_timeout=20&
  connect_timeout=10"
```

### Query Optimization Tips

1. **Always use `select` for large datasets**
```typescript
// Bad
const movies = await prisma.movie.findMany();

// Good
const movies = await prisma.movie.findMany({
  select: {
    id: true,
    title: true,
    thumbnailUrl: true,
    duration: true
  }
});
```

2. **Use cursor-based pagination**
```typescript
const movies = await prisma.movie.findMany({
  take: 20,
  skip: 1,
  cursor: {
    id: lastMovieId
  }
});
```

3. **Batch queries with `Promise.all`**
```typescript
const [movies, categories, trending] = await Promise.all([
  prisma.movie.findMany({ where: { published: true } }),
  prisma.category.findMany({ where: { active: true } }),
  getTrendingMovies()
]);
```

4. **Use transactions for data consistency**
```typescript
await prisma.$transaction(async (tx) => {
  // Create subscription
  const subscription = await tx.subscription.create({
    data: { userId, plan: 'PREMIUM' }
  });
  
  // Record payment
  await tx.payment.create({
    data: { userId, amount: 499, status: 'SUCCEEDED' }
  });
});
```

---

## 🔒 Data Security

### Row-Level Security (Future Enhancement)
```sql
-- Example PostgreSQL RLS policy
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY movies_published_policy ON movies
  FOR SELECT
  USING (published = true);
```

### Data Encryption
- Passwords: bcrypt (12 rounds)
- Tokens: crypto.randomBytes()
- PII: Database encryption at rest (AWS RDS)

### Backup Strategy
- Automated daily backups (AWS RDS)
- Point-in-time recovery (5-minute granularity)
- Cross-region backup replication
- 30-day retention period

---

## 📈 Scaling Considerations

### Read Replicas
```typescript
// Write operations → Primary
const movie = await prisma.movie.create({
  data: movieData
});

// Read operations → Replica
const movies = await prismaRead.movie.findMany({
  where: { published: true }
});
```

### Partitioning Strategy
```sql
-- Partition watch_history by month
CREATE TABLE watch_history_2024_01 PARTITION OF watch_history
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Denormalization
- `Movie.viewCount` - Updated via background job
- `Movie.rating` - Cached average of ratings
- `MovieAnalytics` - Aggregated statistics

---

## Next Steps

1. **Create Prisma schema file**: Copy the schema above
2. **Set up database**: `npx prisma migrate dev`
3. **Generate client**: `npx prisma generate`
4. **Seed data**: Create seed script for testing
5. **Review backend implementation**: See `BACKEND.md`
