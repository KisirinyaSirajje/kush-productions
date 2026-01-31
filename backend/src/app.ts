import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const prisma = new PrismaClient();
const app = Fastify({ logger: true });

// ===== PLUGINS =====
app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
});

// ===== AUTH MIDDLEWARE =====
app.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// ===== VALIDATION SCHEMAS =====
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// ===== ROUTES =====

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (request, reply) => {
  try {
    const { email, password, name } = registerSchema.parse(request.body);
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(400).send({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });

    // Generate token
    const token = app.jwt.sign({ userId: user.id, role: user.role });
    
    return { user, token };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Invalid input', details: error.errors });
    }
    app.log.error(error);
    return reply.status(500).send({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (request, reply) => {
  try {
    const { email, password } = loginSchema.parse(request.body);
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = app.jwt.sign({ userId: user.id, role: user.role });
    
    return {
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        avatar: user.avatar 
      },
      token,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Invalid input', details: error.errors });
    }
    app.log.error(error);
    return reply.status(500).send({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, avatar: true },
  });

  return { user };
});

// ===== MOVIES ROUTES =====
app.get('/api/movies', async (request) => {
  const { category, search, featured } = request.query as any;
  
  const where: any = {};
  
  if (category) {
    where.categories = {
      some: {
        category: { slug: category },
      },
    };
  }
  
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }
  
  if (featured === 'true') {
    where.isFeatured = true;
  }
  
  const movies = await prisma.movie.findMany({
    where,
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return { movies, total: movies.length };
});

app.get('/api/movies/:id', async (request, reply) => {
  const { id } = request.params as any;
  
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      comments: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      ratings: true,
    },
  });

  if (!movie) {
    return reply.status(404).send({ error: 'Movie not found' });
  }

  // Increment view count
  await prisma.movie.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return { movie };
});

// ===== CATEGORIES ROUTES =====
app.get('/api/categories', async () => {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { movies: true },
      },
    },
  });

  return { categories };
});

// ===== FAVORITES ROUTES =====
app.post('/api/favorites', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { userId } = request.user as any;
  const { movieId } = request.body as any;

  try {
    const favorite = await prisma.favorite.create({
      data: { userId, movieId },
    });
    return { favorite };
  } catch (error) {
    return reply.status(400).send({ error: 'Already in favorites' });
  }
});

app.delete('/api/favorites/:movieId', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;
  const { movieId } = request.params as any;

  await prisma.favorite.deleteMany({
    where: { userId, movieId },
  });

  return { success: true };
});

app.get('/api/favorites', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { favorites };
});

// ===== WATCH HISTORY ROUTES =====
app.post('/api/watch-history', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;
  const { movieId, progress, completed } = request.body as any;

  const history = await prisma.watchHistory.upsert({
    where: {
      userId_movieId: { userId, movieId },
    },
    update: { progress, completed, watchedAt: new Date() },
    create: { userId, movieId, progress, completed },
  });

  return { history };
});

app.get('/api/watch-history', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;

  const history = await prisma.watchHistory.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { watchedAt: 'desc' },
    take: 50,
  });

  return { history };
});

// ===== RATINGS & COMMENTS =====
app.post('/api/ratings', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { userId } = request.user as any;
  const { movieId, rating } = request.body as any;

  if (rating < 1 || rating > 5) {
    return reply.status(400).send({ error: 'Rating must be between 1 and 5' });
  }

  const userRating = await prisma.rating.upsert({
    where: {
      userId_movieId: { userId, movieId },
    },
    update: { rating },
    create: { userId, movieId, rating },
  });

  // Update movie average rating
  const ratings = await prisma.rating.findMany({ where: { movieId } });
  const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  
  await prisma.movie.update({
    where: { id: movieId },
    data: { averageRating: average, ratingCount: ratings.length },
  });

  return { rating: userRating };
});

app.post('/api/comments', { preHandler: [app.authenticate] }, async (request) => {
  const { userId } = request.user as any;
  const { movieId, content } = request.body as any;

  const comment = await prisma.comment.create({
    data: { userId, movieId, content },
    include: {
      user: { select: { name: true, avatar: true } },
    },
  });

  return { comment };
});

// ===== ADMIN ROUTES =====
app.post('/api/admin/movies', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const data = request.body as any;
  
  const movie = await prisma.movie.create({
    data: {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: data.videoUrl,
      duration: data.duration,
      releaseYear: data.releaseYear,
      director: data.director,
      cast: data.cast || [],
      language: data.language || 'English',
      isFeatured: data.isFeatured || false,
      categories: {
        create: data.categoryIds?.map((id: string) => ({
          category: { connect: { id } },
        })) || [],
      },
    },
    include: {
      categories: { include: { category: true } },
    },
  });

  return { movie };
});

app.put('/api/admin/movies/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const { id } = request.params as any;
  const data = request.body as any;
  
  const movie = await prisma.movie.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: data.videoUrl,
      duration: data.duration,
      releaseYear: data.releaseYear,
      director: data.director,
      cast: data.cast,
      language: data.language,
      isFeatured: data.isFeatured,
    },
    include: {
      categories: { include: { category: true } },
    },
  });

  return { movie };
});

app.delete('/api/admin/movies/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const { id } = request.params as any;
  
  await prisma.movie.delete({ where: { id } });

  return { success: true };
});

app.post('/api/admin/categories', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const { name, slug, description, imageUrl, order } = request.body as any;
  
  const category = await prisma.category.create({
    data: { name, slug, description, imageUrl, order },
  });

  return { category };
});

export default app;
