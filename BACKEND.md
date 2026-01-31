# 🔧 Kush Films - Backend Architecture & API Design

## Production-Ready Backend Structure

```
backend/
├── src/
│   ├── app.ts                    # Main application entry
│   ├── server.ts                 # Server configuration
│   │
│   ├── config/                   # Configuration files
│   │   ├── index.ts
│   │   ├── database.ts           # Prisma client setup
│   │   ├── redis.ts              # Redis client setup
│   │   ├── stripe.ts             # Stripe configuration
│   │   └── storage.ts            # R2/S3 configuration
│   │
│   ├── modules/                  # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schema.ts    # Zod validation schemas
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.schema.ts
│   │   │   └── users.types.ts
│   │   │
│   │   ├── movies/
│   │   │   ├── movies.controller.ts
│   │   │   ├── movies.service.ts
│   │   │   ├── movies.routes.ts
│   │   │   ├── movies.schema.ts
│   │   │   └── movies.types.ts
│   │   │
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.controller.ts
│   │   │   ├── subscriptions.service.ts
│   │   │   ├── subscriptions.routes.ts
│   │   │   └── subscriptions.schema.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── payments.routes.ts
│   │   │   └── webhooks.controller.ts
│   │   │
│   │   ├── videos/
│   │   │   ├── videos.controller.ts
│   │   │   ├── videos.service.ts
│   │   │   ├── videos.routes.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── ads/
│   │   │   ├── ads.controller.ts
│   │   │   ├── ads.service.ts
│   │   │   ├── ads.routes.ts
│   │   │   └── ad-engine.service.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── tracking.service.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── admin.routes.ts
│   │       └── dashboard.service.ts
│   │
│   ├── middleware/               # Express/Fastify middleware
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── rate-limit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── subscription.middleware.ts
│   │   ├── cors.middleware.ts
│   │   └── logging.middleware.ts
│   │
│   ├── services/                 # Shared services
│   │   ├── email.service.ts
│   │   ├── cache.service.ts
│   │   ├── queue.service.ts
│   │   ├── notification.service.ts
│   │   └── monitoring.service.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── express.d.ts
│   │   ├── models.ts
│   │   └── api.ts
│   │
│   └── workers/                  # Background jobs
│       ├── transcode.worker.ts
│       ├── analytics.worker.ts
│       └── email.worker.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

---

## 🚀 Complete API Endpoints

### Authentication Module
```
POST   /api/v1/auth/register          # Create new user account
POST   /api/v1/auth/login             # Login with email/password
POST   /api/v1/auth/logout            # Logout (invalidate token)
POST   /api/v1/auth/refresh           # Refresh access token
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password with token
POST   /api/v1/auth/verify-email      # Verify email address
GET    /api/v1/auth/me                # Get current user (protected)
```

### Users Module
```
GET    /api/v1/users/profile          # Get user profile
PUT    /api/v1/users/profile          # Update user profile
PUT    /api/v1/users/password         # Change password
DELETE /api/v1/users/account          # Delete account
GET    /api/v1/users/history          # Get watch history
GET    /api/v1/users/favorites        # Get favorite movies
POST   /api/v1/users/favorites/:id    # Add to favorites
DELETE /api/v1/users/favorites/:id    # Remove from favorites
GET    /api/v1/users/notifications    # Get notifications
PUT    /api/v1/users/notifications/:id/read  # Mark as read
```

### Movies Module
```
GET    /api/v1/movies                 # List all movies (with filters)
GET    /api/v1/movies/featured        # Get featured movies
GET    /api/v1/movies/trending        # Get trending movies
GET    /api/v1/movies/recent          # Get recently added
GET    /api/v1/movies/:id             # Get movie details
GET    /api/v1/movies/:id/stream      # Get streaming URL (protected)
POST   /api/v1/movies/:id/watch       # Track watch progress
POST   /api/v1/movies/:id/rate        # Rate movie
GET    /api/v1/movies/:id/comments    # Get comments
POST   /api/v1/movies/:id/comments    # Add comment
GET    /api/v1/movies/search          # Search movies
```

### Categories Module
```
GET    /api/v1/categories             # List all categories
GET    /api/v1/categories/:slug       # Get category details
GET    /api/v1/categories/:slug/movies # Get movies by category
```

### Subscriptions Module
```
GET    /api/v1/subscriptions/plans    # Get available plans
GET    /api/v1/subscriptions/status   # Get user subscription status
POST   /api/v1/subscriptions/checkout # Create Stripe checkout session
POST   /api/v1/subscriptions/cancel   # Cancel subscription
POST   /api/v1/subscriptions/reactivate # Reactivate canceled subscription
GET    /api/v1/subscriptions/portal   # Get Stripe customer portal URL
```

### Payments Module
```
GET    /api/v1/payments/history       # Get payment history
GET    /api/v1/payments/:id           # Get payment details
POST   /api/webhooks/stripe           # Stripe webhook handler (public)
```

### Ads Module
```
GET    /api/v1/ads/get                # Get ad to display
POST   /api/v1/ads/impression         # Track ad impression
POST   /api/v1/ads/click              # Track ad click
POST   /api/v1/ads/complete           # Track ad completion
```

### Analytics Module (Protected)
```
POST   /api/v1/analytics/track        # Track custom event
GET    /api/v1/analytics/movie/:id    # Get movie analytics
```

### Admin Module (Admin only)
```
# Movies Management
GET    /api/v1/admin/movies           # List all movies (admin view)
POST   /api/v1/admin/movies           # Create new movie
PUT    /api/v1/admin/movies/:id       # Update movie
DELETE /api/v1/admin/movies/:id       # Delete movie
POST   /api/v1/admin/movies/:id/publish   # Publish movie
POST   /api/v1/admin/movies/:id/unpublish # Unpublish movie

# Video Upload
POST   /api/v1/admin/videos/upload-url     # Get presigned URL
POST   /api/v1/admin/videos/:id/transcode  # Trigger transcoding

# Categories Management
GET    /api/v1/admin/categories       # List categories
POST   /api/v1/admin/categories       # Create category
PUT    /api/v1/admin/categories/:id   # Update category
DELETE /api/v1/admin/categories/:id   # Delete category

# Ads Management
GET    /api/v1/admin/ads              # List all ads
POST   /api/v1/admin/ads              # Create ad
PUT    /api/v1/admin/ads/:id          # Update ad
DELETE /api/v1/admin/ads/:id          # Delete ad
POST   /api/v1/admin/ads/:id/approve  # Approve ad

# Users Management
GET    /api/v1/admin/users            # List all users
GET    /api/v1/admin/users/:id        # Get user details
PUT    /api/v1/admin/users/:id        # Update user
DELETE /api/v1/admin/users/:id        # Delete user
POST   /api/v1/admin/users/:id/ban    # Ban user
POST   /api/v1/admin/users/:id/unban  # Unban user

# Analytics Dashboard
GET    /api/v1/admin/analytics/overview      # Dashboard overview
GET    /api/v1/admin/analytics/users         # User analytics
GET    /api/v1/admin/analytics/content       # Content performance
GET    /api/v1/admin/analytics/revenue       # Revenue analytics
GET    /api/v1/admin/analytics/ads           # Ad performance
```

---

## 🔐 Authentication & Authorization Implementation

### JWT Authentication Strategy

```typescript
// utils/jwt.ts
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  subscription: string;
}

export function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      subscription: user.subscription?.plan || 'FREE'
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(user: User): string {
  return jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
}
```

### Auth Middleware

```typescript
// middleware/auth.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { redis } from '../config/redis';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Token has been revoked'
      });
    }
    
    // Verify token
    const payload = verifyAccessToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        subscription: true
      }
    });
    
    if (!user) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }
    
    // Attach user to request
    request.user = user;
    
  } catch (error) {
    return reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
  };
}
```

### Subscription Middleware

```typescript
// middleware/subscription.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AccessLevel, SubscriptionPlan } from '@prisma/client';

const PLAN_HIERARCHY = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2
};

export function requireSubscription(requiredLevel: AccessLevel) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    
    if (!user) {
      return reply.code(401).send({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    // Check if subscription is active
    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      if (requiredLevel !== 'FREE') {
        return reply.code(403).send({
          error: 'Subscription Required',
          message: 'This content requires an active subscription',
          upgradeUrl: '/subscribe'
        });
      }
    }
    
    // Check subscription level
    const userPlan = user.subscription?.plan || 'FREE';
    const requiredPlan = requiredLevel as SubscriptionPlan;
    
    if (PLAN_HIERARCHY[userPlan] < PLAN_HIERARCHY[requiredPlan]) {
      return reply.code(403).send({
        error: 'Upgrade Required',
        message: `This content requires a ${requiredPlan} subscription`,
        currentPlan: userPlan,
        requiredPlan: requiredPlan,
        upgradeUrl: '/subscribe'
      });
    }
  };
}
```

---

## 🎬 Video Upload & Streaming Implementation

### Presigned URL Generation

```typescript
// modules/videos/upload.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
});

export class UploadService {
  async generateUploadUrl(
    filename: string,
    contentType: string,
    userId: string
  ): Promise<{ uploadUrl: string; key: string; videoId: string }> {
    
    const videoId = crypto.randomUUID();
    const extension = filename.split('.').pop();
    const key = `videos/${videoId}/original.${extension}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
      Metadata: {
        userId: userId,
        originalFilename: filename
      }
    });
    
    // Generate presigned URL (valid for 1 hour)
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600
    });
    
    return {
      uploadUrl,
      key,
      videoId
    };
  }
  
  async generateStreamUrl(
    videoKey: string,
    userId: string
  ): Promise<string> {
    // For HLS streaming, we typically serve directly from CDN
    // The CDN URL is public but obscured
    const cdnUrl = `${process.env.CDN_URL}/${videoKey}`;
    
    // Optional: Generate signed CDN URL for extra security
    // This prevents hotlinking and unauthorized access
    const signedUrl = this.signCDNUrl(cdnUrl, userId);
    
    return signedUrl;
  }
  
  private signCDNUrl(url: string, userId: string): string {
    const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const secret = process.env.CDN_SIGN_SECRET!;
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${url}${expiry}${userId}`)
      .digest('hex');
    
    return `${url}?expires=${expiry}&signature=${signature}&user=${userId}`;
  }
}
```

### Video Upload Controller

```typescript
// modules/videos/videos.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadService } from './upload.service';
import { prisma } from '../../config/database';

const uploadService = new UploadService();

export class VideosController {
  async getUploadUrl(request: FastifyRequest, reply: FastifyReply) {
    const { filename, contentType } = request.body as {
      filename: string;
      contentType: string;
    };
    
    const userId = request.user.id;
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(contentType)) {
      return reply.code(400).send({
        error: 'Invalid file type',
        message: 'Only MP4, MOV, and AVI files are supported'
      });
    }
    
    // Generate upload URL
    const { uploadUrl, key, videoId } = await uploadService.generateUploadUrl(
      filename,
      contentType,
      userId
    );
    
    // Create database record
    await prisma.movie.create({
      data: {
        id: videoId,
        title: filename.replace(/\.[^/.]+$/, ''), // Remove extension
        slug: `temp-${videoId}`,
        videoUrl: key,
        thumbnailUrl: '', // To be added later
        duration: 0,
        published: false
      }
    });
    
    return reply.send({
      uploadUrl,
      videoId,
      expiresIn: 3600
    });
  }
  
  async getStreamUrl(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const userId = request.user.id;
    
    // Get movie details
    const movie = await prisma.movie.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        hlsManifestUrl: true,
        accessLevel: true,
        published: true
      }
    });
    
    if (!movie || !movie.published) {
      return reply.code(404).send({
        error: 'Movie not found'
      });
    }
    
    // Check subscription access
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });
    
    const hasAccess = this.checkAccess(
      movie.accessLevel,
      user?.subscription?.plan
    );
    
    if (!hasAccess) {
      return reply.code(403).send({
        error: 'Subscription required',
        requiredLevel: movie.accessLevel,
        upgradeUrl: '/subscribe'
      });
    }
    
    // Generate streaming URL
    const streamUrl = await uploadService.generateStreamUrl(
      movie.hlsManifestUrl || movie.videoUrl,
      userId
    );
    
    // Track view
    await this.trackView(movie.id, userId);
    
    return reply.send({
      streamUrl,
      movie: {
        id: movie.id,
        title: movie.title
      }
    });
  }
  
  private checkAccess(
    accessLevel: string,
    userPlan?: string
  ): boolean {
    const PLAN_HIERARCHY = { FREE: 0, BASIC: 1, PREMIUM: 2 };
    const plan = userPlan || 'FREE';
    return PLAN_HIERARCHY[plan] >= PLAN_HIERARCHY[accessLevel];
  }
  
  private async trackView(movieId: string, userId: string) {
    // Increment view count
    await prisma.movie.update({
      where: { id: movieId },
      data: { viewCount: { increment: 1 } }
    });
    
    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'video_start',
        userId,
        sessionId: 'session-id', // Get from request
        movieId
      }
    });
  }
}
```

---

## 💳 Stripe Subscription Integration

### Subscription Service

```typescript
// modules/subscriptions/subscriptions.service.ts
import Stripe from 'stripe';
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    priceId: process.env.STRIPE_PRICE_BASIC!,
    amount: 299, // $2.99
    name: 'Basic Plan'
  },
  PREMIUM: {
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    amount: 499, // $4.99
    name: 'Premium Plan'
  }
};

export class SubscriptionService {
  async createCheckoutSession(
    userId: string,
    plan: 'BASIC' | 'PREMIUM'
  ): Promise<{ sessionUrl: string }> {
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      
      stripeCustomerId = customer.id;
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId }
      });
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: SUBSCRIPTION_PLANS[plan].priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscribe/cancel`,
      metadata: {
        userId: user.id,
        plan
      }
    });
    
    return {
      sessionUrl: session.url!
    };
  }
  
  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }
    
    // Cancel at period end (don't cancel immediately)
    await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );
    
    await prisma.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date()
      }
    });
    
    // Clear cache
    await redis.del(`user:${userId}:subscription`);
  }
  
  async reactivateSubscription(userId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    });
    
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No subscription found');
    }
    
    // Reactivate subscription
    await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false
      }
    );
    
    await prisma.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd: false,
        canceledAt: null
      }
    });
    
    // Clear cache
    await redis.del(`user:${userId}:subscription`);
  }
}
```

### Webhook Handler

```typescript
// modules/payments/webhooks.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import { prisma } from '../../config/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export class WebhooksController {
  async handleStripeWebhook(request: FastifyRequest, reply: FastifyReply) {
    const signature = request.headers['stripe-signature'] as string;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return reply.code(400).send({ error: 'Invalid signature' });
    }
    
    console.log(`Processing webhook: ${event.type}`);
    
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutComplete(event.data.object);
          break;
        
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      return reply.send({ received: true });
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      return reply.code(500).send({ error: 'Webhook processing failed' });
    }
  }
  
  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as 'BASIC' | 'PREMIUM';
    
    if (!userId || !plan) {
      console.error('Missing metadata in checkout session');
      return;
    }
    
    // Subscription will be created by subscription.created event
    // Here we just record the successful checkout
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'subscription_checkout_complete',
        userId,
        sessionId: session.id,
        properties: { plan }
      }
    });
  }
  
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      // Find user by Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: subscription.customer as string }
      });
      
      if (!user) {
        console.error('User not found for subscription');
        return;
      }
    }
    
    const plan = this.getPlanFromPriceId(subscription.items.data[0].price.id);
    
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        status: subscription.status.toUpperCase() as any,
        plan,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      },
      update: {
        status: subscription.status.toUpperCase() as any,
        plan,
        stripePriceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });
  }
  
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date()
      }
    });
  }
  
  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const userId = invoice.metadata?.userId;
    
    if (userId) {
      await prisma.payment.create({
        data: {
          userId,
          amount: invoice.amount_paid,
          currency: invoice.currency.toUpperCase(),
          status: 'SUCCEEDED',
          stripePaymentId: invoice.payment_intent as string,
          stripeInvoiceId: invoice.id,
          description: invoice.lines.data[0]?.description || 'Subscription payment',
          receiptUrl: invoice.hosted_invoice_url
        }
      });
    }
  }
  
  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Handle failed payment - send email notification
    // Update subscription status to PAST_DUE
  }
  
  private getPlanFromPriceId(priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' {
    if (priceId === process.env.STRIPE_PRICE_BASIC) return 'BASIC';
    if (priceId === process.env.STRIPE_PRICE_PREMIUM) return 'PREMIUM';
    return 'FREE';
  }
}
```

---

## 📺 Ads Serving Engine

```typescript
// modules/ads/ad-engine.service.ts
import { prisma } from '../../config/database';
import { redis } from '../../config/redis';

export class AdEngineService {
  async getAd(params: {
    type: 'VIDEO_PREROLL' | 'BANNER';
    userId?: string;
    userPlan?: string;
    movieId?: string;
    country?: string;
  }) {
    // Don't show ads to premium users
    if (params.userPlan === 'PREMIUM' || params.userPlan === 'BASIC') {
      return null;
    }
    
    const cacheKey = `ad:${params.type}:${params.country || 'default'}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      const ads = JSON.parse(cached);
      return this.selectAd(ads, params.userId);
    }
    
    // Query available ads
    const ads = await prisma.ad.findMany({
      where: {
        type: params.type,
        active: true,
        approved: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ],
        targetPlans: {
          has: params.userPlan || 'FREE'
        }
      }
    });
    
    if (ads.length === 0) return null;
    
    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(ads));
    
    return this.selectAd(ads, params.userId);
  }
  
  private async selectAd(ads: any[], userId?: string) {
    if (userId) {
      // Frequency capping: Check recent impressions
      const recentImpressions = await prisma.adImpression.findMany({
        where: {
          userId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
          }
        },
        select: {
          adId: true
        }
      });
      
      const impressionCounts = recentImpressions.reduce((acc, imp) => {
        acc[imp.adId] = (acc[imp.adId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Filter out ads shown more than 3 times
      const eligibleAds = ads.filter(
        ad => (impressionCounts[ad.id] || 0) < 3
      );
      
      if (eligibleAds.length > 0) {
        return eligibleAds[Math.floor(Math.random() * eligibleAds.length)];
      }
    }
    
    // Random selection
    return ads[Math.floor(Math.random() * ads.length)];
  }
  
  async trackImpression(params: {
    adId: string;
    userId?: string;
    sessionId: string;
    movieId?: string;
    ipAddress?: string;
    userAgent?: string;
    country?: string;
  }) {
    await prisma.adImpression.create({
      data: params
    });
    
    // Increment ad impression count in cache
    await redis.incr(`ad:${params.adId}:impressions`);
  }
  
  async trackClick(params: {
    adId: string;
    userId?: string;
    sessionId: string;
    movieId?: string;
    ipAddress?: string;
    country?: string;
  }) {
    await prisma.adClick.create({
      data: params
    });
    
    // Increment click count
    await redis.incr(`ad:${params.adId}:clicks`);
  }
}
```

---

## 🗃️ Redis Caching Strategy

```typescript
// services/cache.service.ts
import { redis } from '../config/redis';

export class CacheService {
  // Cache movie details
  async getMovie(movieId: string) {
    const key = `movie:${movieId}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async setMovie(movieId: string, data: any, ttl: number = 3600) {
    const key = `movie:${movieId}`;
    await redis.setex(key, ttl, JSON.stringify(data));
  }
  
  // Cache trending movies
  async getTrending() {
    const key = 'movies:trending';
    const cached = await redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async setTrending(movies: any[]) {
    const key = 'movies:trending';
    await redis.setex(key, 300, JSON.stringify(movies)); // 5 minutes
  }
  
  // Invalidate cache
  async invalidateMovie(movieId: string) {
    const keys = [
      `movie:${movieId}`,
      'movies:trending',
      'movies:featured'
    ];
    
    await Promise.all(keys.map(key => redis.del(key)));
  }
  
  // Rate limiting
  async checkRateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<boolean> {
    const count = await redis.incr(key);
    
    if (count === 1) {
      await redis.expire(key, window);
    }
    
    return count <= limit;
  }
}
```

---

## 📋 Environment Variables

```env
# .env.example

# Application
NODE_ENV=development
PORT=4000
API_VERSION=v1
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kush_films
DATABASE_READ_URL=postgresql://user:password@localhost:5432/kush_films_read

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=kush-films-videos
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
CDN_URL=https://cdn.kushfilms.com

# CDN Signing
CDN_SIGN_SECRET=your-cdn-signing-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...

# Email (AWS SES)
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=your-access-key
AWS_SES_SECRET_KEY=your-secret-key
FROM_EMAIL=noreply@kushfilms.com

# Monitoring
SENTRY_DSN=https://...
DATADOG_API_KEY=your-datadog-key
```

---

## 🚀 Getting Started Commands

See `SETUP.md` for complete installation guide.

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma generate

# Seed database
npm run seed

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

---

**Next**: See [FRONTEND.md](FRONTEND.md) for Next.js implementation
