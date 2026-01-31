# 🎬 Kush Films - System Architecture Documentation

## Executive Summary

Kush Films is a production-ready video streaming platform designed for the Ugandan market, optimized for African internet conditions and scalable to 100k+ concurrent users.

---

## 1. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE CDN                               │
│              (Static Assets + Video Streaming)                       │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
┌──────────────────┴───────────────────────────────────────────────────┐
│                                                                        │
│  ┌─────────────────────┐         ┌─────────────────────┐            │
│  │   VERCEL/AWS        │         │   AWS S3 /          │            │
│  │   Next.js Frontend  │◄───────►│   Cloudflare R2     │            │
│  │   (App Router)      │         │   (Video Storage)   │            │
│  └──────────┬──────────┘         └─────────────────────┘            │
│             │                                                         │
│             │ API Calls (HTTPS)                                      │
│             ▼                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐            │
│  │   AWS EC2/ECS       │◄───────►│   Redis Cache       │            │
│  │   Node.js Backend   │         │   (Session/Data)    │            │
│  │   (Express/Fastify) │         └─────────────────────┘            │
│  └──────────┬──────────┘                                             │
│             │                                                         │
│             │ Prisma ORM                                             │
│             ▼                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐            │
│  │   AWS RDS           │         │   Stripe API        │            │
│  │   PostgreSQL        │         │   (Payments)        │            │
│  │   (Primary DB)      │         └─────────────────────┘            │
│  └─────────────────────┘                                             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

External Services:
├── Cloudflare (CDN + DDoS Protection)
├── Stripe (Subscription Payments)
├── AWS SES (Email Notifications)
└── Analytics (Google Analytics / Mixpanel)
```

---

## 2. SYSTEM COMPONENTS

### 2.1 Frontend (Next.js)
**Technology**: Next.js 14+ (App Router), TypeScript, Tailwind CSS

**Responsibilities**:
- Server-Side Rendering (SSR) for SEO
- Static Site Generation (SSG) for landing pages
- Client-side interactivity
- Video player integration
- Ads rendering
- Payment flow UI

**Key Features**:
- Optimized images with Next.js Image
- Route prefetching
- Incremental Static Regeneration (ISR)
- Edge caching with Vercel

**Communication**:
- REST API calls to backend
- WebSocket for real-time notifications (optional)
- Direct CDN access for video streaming

---

### 2.2 Backend (Node.js)
**Technology**: Node.js 20+ with Fastify (chosen for performance)

**Responsibilities**:
- Business logic
- Authentication & authorization
- Database operations via Prisma
- Video upload orchestration
- Subscription management
- Ads serving engine
- Analytics tracking

**Why Fastify over Express**:
- **2x faster** request handling
- Built-in schema validation
- Lower latency (critical for African networks)
- Better TypeScript support
- Async/await optimized

**Communication**:
- REST API endpoints
- JWT-based authentication
- Redis for session storage
- Event-driven architecture for async tasks

---

### 2.3 Database (PostgreSQL + Prisma)
**Technology**: PostgreSQL 15+ with Prisma ORM

**Why PostgreSQL**:
- ACID compliance for payments
- JSON support for flexible metadata
- Full-text search capabilities
- Proven scalability
- Read replicas support

**Prisma Benefits**:
- Type-safe database queries
- Automatic migrations
- Excellent TypeScript integration
- Built-in connection pooling
- Query optimization

**Data Organization**:
- User management
- Content metadata
- Subscriptions & payments
- Watch history & analytics
- Ads inventory & tracking

---

### 2.4 Storage (Cloudflare R2)
**Technology**: Cloudflare R2 (S3-compatible)

**Why R2 over S3**:
- **Zero egress fees** (critical for video streaming)
- S3-compatible API (easy migration)
- Better performance in Africa via Cloudflare network
- Integrated CDN
- 10x cheaper than AWS S3

**Storage Strategy**:
```
/videos/
  /{videoId}/
    /original.mp4
    /720p.mp4
    /480p.mp4
    /360p.mp4
    /thumbnail.jpg
    /preview.gif

/images/
  /posters/
  /banners/
  /thumbnails/

/ads/
  /video/
  /banner/
```

---

### 2.5 CDN (Cloudflare)
**Technology**: Cloudflare CDN

**Why Cloudflare**:
- 200+ edge locations (including Africa)
- Integrated DDoS protection
- Free SSL certificates
- Rate limiting
- Web Application Firewall (WAF)
- Bandwidth optimization

**Caching Strategy**:
- Static assets: Cache for 1 year
- Video chunks: Cache for 30 days
- API responses: Cache selectively with Redis
- HTML pages: ISR with 60s revalidation

---

### 2.6 Cache (Redis)
**Technology**: Redis 7+ (AWS ElastiCache or Upstash)

**Use Cases**:
- Session storage (JWT blacklist)
- API response caching
- Video metadata caching
- Rate limiting counters
- Real-time analytics
- Trending content cache

**Cache Strategy**:
```
user:session:{userId}      → 24h TTL
movie:metadata:{movieId}   → 1h TTL
trending:movies            → 5min TTL
ads:inventory              → 10min TTL
rate:limit:{ip}            → 1h TTL
```

---

### 2.7 Payments (Stripe)
**Technology**: Stripe Subscriptions + Webhooks

**Plans**:
- Free Tier (ads-supported)
- Basic Plan ($2.99/month)
- Premium Plan ($4.99/month)

**Integration Points**:
- Checkout Sessions API
- Webhook handlers for events
- Customer Portal for management
- Payment Method updates
- Failed payment recovery

---

### 2.8 Ads System
**Technology**: Custom ads engine + optional Google AdSense

**Ad Types**:
1. **Pre-roll Video Ads** (15-30s)
2. **Banner Ads** (728x90, 300x250)
3. **Mid-roll Ads** (for longer content)

**Ad Serving Logic**:
```javascript
// Simplified flow
if (user.subscription === 'free') {
  const ad = await getTargetedAd({
    userId,
    contentType: 'video',
    duration: 15,
    region: 'Uganda'
  });
  
  // Track impression
  await trackAdImpression(ad.id, userId);
  
  return ad;
}
```

---

## 3. SCALING STRATEGY FOR 100K+ USERS

### 3.1 Horizontal Scaling
```
Load Balancer (AWS ALB)
    ┌────────┼────────┐
    ▼        ▼        ▼
  API-1   API-2   API-3   (Auto-scaling group)
    └────────┼────────┘
             ▼
     PostgreSQL (Read Replicas)
```

**Backend Scaling**:
- Stateless API servers (no session storage on servers)
- Auto-scaling based on CPU/memory metrics
- Min: 2 instances, Max: 20 instances
- Health checks every 30 seconds

**Database Scaling**:
- Primary-Replica setup (1 write, 3+ read replicas)
- Connection pooling (max 100 connections per instance)
- Read queries go to replicas
- Writes go to primary

---

### 3.2 Caching Strategy
**Multi-Layer Caching**:
1. **CDN Layer** (Cloudflare): Static assets, video chunks
2. **Redis Layer**: API responses, session data
3. **Application Layer**: In-memory caching for hot data
4. **Database Layer**: Query result caching

**Cache Hit Ratios**:
- Target: 90%+ for video content
- Target: 80%+ for API responses
- Target: 95%+ for static assets

---

### 3.3 Database Optimization
**Indexing Strategy**:
```sql
-- Critical indexes
CREATE INDEX idx_movies_category ON movies(category_id);
CREATE INDEX idx_movies_published ON movies(published_at);
CREATE INDEX idx_watch_history_user ON watch_history(user_id, watched_at);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, status);
```

**Query Optimization**:
- Use `SELECT` with specific columns (avoid `SELECT *`)
- Implement pagination (cursor-based for infinite scroll)
- Use prepared statements
- Database connection pooling

**Partitioning**:
- Partition `watch_history` by date (monthly)
- Partition `analytics_events` by date (weekly)

---

### 3.4 Video Delivery Optimization
**Adaptive Bitrate Streaming**:
```
Original → Transcode to:
  - 1080p @ 5Mbps
  - 720p @ 2.5Mbps
  - 480p @ 1Mbps
  - 360p @ 500Kbps (for slow connections)
```

**Format**: HLS (HTTP Live Streaming)
- Works on all devices
- Adaptive bitrate switching
- CDN-friendly (chunked delivery)

**Optimization for Africa**:
- Default to 480p quality
- Aggressive buffering (30s ahead)
- Allow manual quality selection
- Progressive download option
- Offline download for premium users

---

### 3.5 Monitoring & Alerting
**Key Metrics**:
- API response time (target: <200ms)
- Error rate (target: <0.1%)
- Database query time (target: <50ms)
- Video start time (target: <3s)
- CDN cache hit ratio (target: >90%)

**Tools**:
- **Application**: Datadog / New Relic
- **Logs**: AWS CloudWatch / Elasticsearch
- **Uptime**: UptimeRobot
- **Error Tracking**: Sentry

**Alerts**:
- Email + Slack for critical errors
- Auto-scaling triggers
- Payment failures
- High error rates

---

## 4. DATA FLOW DIAGRAMS

### 4.1 User Authentication Flow
```
User → Next.js → Backend API → Database
                      ↓
                  JWT Token
                      ↓
                  Redis (Session)
                      ↓
              Return to Client
                      ↓
              Store in Cookie (httpOnly)
```

### 4.2 Video Upload Flow
```
Admin Dashboard
    ↓
Request Signed URL (POST /api/admin/videos/upload-url)
    ↓
Backend generates presigned URL (R2)
    ↓
Direct Upload to R2 (client → R2)
    ↓
Upload Complete Webhook
    ↓
Backend triggers transcoding job
    ↓
Video processed → Multiple qualities
    ↓
Update database with video URLs
    ↓
Notify admin (upload complete)
```

### 4.3 Video Playback Flow
```
User clicks Play
    ↓
Check subscription status (Backend API)
    ↓
If authorized → Generate signed CDN URL
    ↓
Return video manifest (HLS .m3u8)
    ↓
Player requests video chunks from CDN
    ↓
CDN serves from cache (or pulls from R2)
    ↓
Track watch progress every 30s
    ↓
Update watch history in database
```

### 4.4 Subscription Payment Flow
```
User clicks "Subscribe"
    ↓
Redirect to Stripe Checkout
    ↓
User completes payment
    ↓
Stripe webhook → Backend
    ↓
Verify webhook signature
    ↓
Update user subscription in DB
    ↓
Send confirmation email
    ↓
Update Redis cache
    ↓
User gains premium access
```

---

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication & Authorization
**Strategy**: JWT-based authentication

**Token Structure**:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user|admin|moderator",
  "subscription": "free|basic|premium",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Storage**:
- **Access Token**: httpOnly cookie (15min expiry)
- **Refresh Token**: httpOnly cookie (7 days expiry)
- **Blacklist**: Redis (for logout/revocation)

**Authorization Levels**:
```
Public Routes: /, /movies, /login, /register
User Routes: /dashboard, /watch/:id (with subscription check)
Admin Routes: /admin/* (role-based check)
```

---

### 5.2 Video Content Protection
**Multi-Layer Security**:

1. **URL Signing**: Time-limited signed URLs
```javascript
// Expires in 1 hour
const signedUrl = generateSignedUrl(videoId, {
  expiresIn: 3600,
  userId: user.id
});
```

2. **Token Validation**: Check subscription on every video request
3. **DRM (Optional)**: Widevine/FairPlay for premium content
4. **Hotlinking Prevention**: Referer header check
5. **Geographic Restrictions**: IP-based blocking (if needed)

---

### 5.3 API Security
**Rate Limiting**:
```javascript
// Per endpoint limits
POST /api/auth/login       → 5 req/min per IP
GET /api/movies            → 100 req/min per user
POST /api/admin/videos     → 20 req/min per admin
```

**Security Headers**:
```javascript
// Helmet.js configuration
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "cdn.example.com"],
      mediaSrc: ["'self'", "cdn.example.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}
```

**Input Validation**:
- Zod schemas for all inputs
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (sanitize user inputs)
- CSRF tokens for state-changing operations

---

### 5.4 Payment Security
**Stripe Integration**:
- Never store credit card data
- Webhook signature verification
- Idempotency keys for retries
- PCI DSS compliance (handled by Stripe)

**Webhook Verification**:
```javascript
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

---

## 6. PERFORMANCE OPTIMIZATION

### 6.1 Frontend Performance
**Techniques**:
- Code splitting (dynamic imports)
- Image optimization (Next.js Image)
- Font optimization (next/font)
- Tree shaking (automatic with Next.js)
- Bundle size monitoring

**Metrics Targets**:
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

---

### 6.2 Backend Performance
**Optimizations**:
- Connection pooling (Prisma: 10 connections per instance)
- Query batching (DataLoader pattern)
- N+1 query prevention (Prisma `include`)
- Async/await for I/O operations
- Worker threads for CPU-intensive tasks

**API Response Times**:
```
GET /api/movies              → Target: 50ms
GET /api/movies/:id          → Target: 30ms
POST /api/watch/progress     → Target: 100ms
GET /api/user/dashboard      → Target: 150ms
```

---

### 6.3 Database Performance
**Query Optimization**:
```javascript
// Bad: N+1 query
const movies = await prisma.movie.findMany();
for (const movie of movies) {
  const category = await prisma.category.findUnique({
    where: { id: movie.categoryId }
  });
}

// Good: Single query with join
const movies = await prisma.movie.findMany({
  include: {
    category: true,
    _count: {
      select: { watchHistory: true }
    }
  }
});
```

**Connection Pooling**:
```env
DATABASE_URL="postgresql://user:pass@host:5432/kush?
  connection_limit=10&
  pool_timeout=20&
  connect_timeout=10"
```

---

### 6.4 CDN & Caching
**Cloudflare Configuration**:
```javascript
// Cache rules
{
  "/*.js": "cache-control: public, max-age=31536000, immutable",
  "/*.css": "cache-control: public, max-age=31536000, immutable",
  "/*.jpg": "cache-control: public, max-age=2592000",
  "/api/*": "cache-control: no-cache",
  "/videos/*": "cache-control: public, max-age=2592000"
}
```

**Redis Caching Pattern**:
```javascript
async function getMovie(id: string) {
  // Try cache first
  const cached = await redis.get(`movie:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss: fetch from DB
  const movie = await prisma.movie.findUnique({ where: { id } });
  
  // Store in cache (1 hour)
  await redis.setex(`movie:${id}`, 3600, JSON.stringify(movie));
  
  return movie;
}
```

---

## 7. TECHNOLOGY JUSTIFICATION

### Frontend: Next.js 14 (App Router)
**Why**:
✅ Server-Side Rendering for SEO (critical for content discovery)
✅ Built-in image optimization (saves bandwidth)
✅ Edge runtime support (faster global performance)
✅ File-based routing (developer experience)
✅ API routes for BFF pattern
✅ Vercel deployment optimization

**Alternatives Considered**:
- React + Vite: Lacks SSR, worse SEO
- Nuxt.js: Vue ecosystem smaller, less Africa adoption

---

### Backend: Fastify
**Why**:
✅ 2x faster than Express (critical for low-bandwidth areas)
✅ Schema validation built-in (Zod/JSON Schema)
✅ Better TypeScript support
✅ Lower latency (20-30ms vs 50-60ms Express)
✅ Plugin ecosystem

**Benchmarks**:
```
Fastify: 30,000 req/sec
Express: 15,000 req/sec
(on same hardware)
```

---

### Database: PostgreSQL
**Why**:
✅ ACID compliance (payment data integrity)
✅ JSON support (flexible metadata)
✅ Full-text search (movie search)
✅ Mature ecosystem
✅ Read replicas for scaling
✅ Battle-tested at scale

**Alternatives Considered**:
- MongoDB: Weak consistency, payment risk
- MySQL: Less feature-rich than PostgreSQL

---

### ORM: Prisma
**Why**:
✅ Type-safe queries (catch errors at compile time)
✅ Automatic migrations
✅ Excellent TypeScript integration
✅ Built-in connection pooling
✅ Schema-first approach

**Alternatives Considered**:
- TypeORM: Less type-safe, more boilerplate
- Drizzle: Younger ecosystem

---

### Storage: Cloudflare R2
**Why**:
✅ **Zero egress fees** (massive cost savings for streaming)
✅ S3-compatible (easy migration path)
✅ Better Africa latency (Cloudflare network)
✅ 10x cheaper than AWS S3
✅ Integrated CDN

**Cost Comparison (100TB/month)**:
```
AWS S3 + CloudFront: ~$8,500/month
Cloudflare R2: ~$1,500/month
Savings: $7,000/month = $84,000/year
```

---

### Cache: Redis
**Why**:
✅ In-memory speed (<1ms latency)
✅ Rich data structures (sets, sorted sets)
✅ TTL support (automatic expiration)
✅ Pub/Sub for real-time features
✅ Persistence options

---

### Payments: Stripe
**Why**:
✅ Africa support (mobile money coming)
✅ PCI DSS compliant
✅ Subscription management built-in
✅ Webhook system for automation
✅ Customer portal

---

## 8. COST ESTIMATION (100K Users)

### Monthly Cost Breakdown
```
┌──────────────────────────────┬──────────┐
│ Service                      │ Cost     │
├──────────────────────────────┼──────────┤
│ Vercel (Frontend)            │ $20      │
│ AWS EC2 (3x t3.medium)       │ $150     │
│ AWS RDS (PostgreSQL)         │ $200     │
│ AWS ElastiCache (Redis)      │ $100     │
│ Cloudflare R2 (50TB storage) │ $750     │
│ Cloudflare CDN (bandwidth)   │ $0       │
│ Stripe fees (3.4% + $0.30)   │ Variable │
│ AWS SES (emails)             │ $10      │
│ Monitoring (Datadog)         │ $50      │
├──────────────────────────────┼──────────┤
│ Total (excl. Stripe fees)    │ ~$1,280  │
└──────────────────────────────┴──────────┘

Per-user cost: $0.013/month
```

---

## 9. DISASTER RECOVERY

### Backup Strategy
**Database**:
- Automated daily backups (AWS RDS)
- 30-day retention
- Point-in-time recovery (5-minute granularity)

**Video Storage**:
- Cross-region replication (R2 → S3 backup)
- Lifecycle policies (30-day retention for deleted content)

**Recovery Time Objective (RTO)**: 4 hours
**Recovery Point Objective (RPO)**: 5 minutes

---

## 10. COMPLIANCE & LEGAL

### Data Protection
- GDPR compliance for EU users
- User data export functionality
- Right to deletion (GDPR Article 17)
- Cookie consent banner

### Content Licensing
- Content ownership verification
- DMCA takedown process
- Age-restricted content flags
- Geographic content restrictions

---

## 11. FUTURE ENHANCEMENTS

### Phase 6-12 Months
- Mobile apps (React Native)
- Live streaming capability
- User-generated content
- Social features (comments, likes)
- Recommendation engine (ML-based)
- Multi-language support
- Offline viewing (PWA/mobile)

### Scaling Beyond 1M Users
- Migrate to Kubernetes (EKS)
- Implement GraphQL for mobile apps
- Multi-region deployment
- Edge computing for personalization
- Real-time analytics with Kafka

---

## CONCLUSION

This architecture provides:
✅ **Scalability**: Horizontal scaling to 1M+ users
✅ **Performance**: <3s video start time, optimized for Africa
✅ **Security**: Multi-layer protection for content and payments
✅ **Cost-Efficiency**: $0.013 per user/month
✅ **Developer Experience**: Type-safe, modern stack
✅ **Reliability**: 99.9% uptime target

**Next Steps**: See `DEVELOPMENT_PHASES.md` for implementation roadmap.
