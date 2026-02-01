import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

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

app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

app.register(fastifyStatic, {
  root: join(__dirname, '..', 'public'),
  prefix: '/public/',
});

// ===== AUTH MIDDLEWARE =====
app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
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

// ===== FILE UPLOAD =====
app.post('/api/upload', { preHandler: [app.authenticate] }, async (request, reply) => {
  try {
    const data = await request.file();
    
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.status(400).send({ error: 'Invalid file type. Only images are allowed.' });
    }

    // Generate unique filename
    const ext = data.filename.split('.').pop();
    const filename = `${randomBytes(16).toString('hex')}.${ext}`;
    const filepath = join(__dirname, '..', 'public', 'uploads', filename);

    // Save file
    await pipeline(data.file, createWriteStream(filepath));

    // Return URL
    const url = `http://localhost:${process.env.PORT || 4000}/public/uploads/${filename}`;
    return { url };
  } catch (error: unknown) {
    const err = error as { message?: string };
    app.log.error(err);
    return reply.status(500).send({ error: 'File upload failed', details: err.message });
  }
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
        avatar: user.avatar,
        subscription: user.subscription,
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
  const average = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length;
  
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

// ===== FOODS ROUTES =====
app.get('/api/foods', async (request) => {
  const { category, search } = request.query as any;
  
  const where: any = {};
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }
  
  const foods = await prisma.food.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return { foods, total: foods.length };
});

app.get('/api/foods/:id', async (request, reply) => {
  const { id } = request.params as any;
  
  const food = await prisma.food.findUnique({
    where: { id },
  });

  if (!food) {
    return reply.status(404).send({ error: 'Food not found' });
  }

  return { food };
});

app.post('/api/admin/foods', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const data = request.body as any;
  
  const food = await prisma.food.create({
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      location: data.location,
      image: data.image,
      description: data.description,
      ingredients: data.ingredients || [],
    },
  });

  return { food };
});

app.put('/api/admin/foods/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const { id } = request.params as any;
  const data = request.body as any;
  
  const food = await prisma.food.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      location: data.location,
      image: data.image,
      description: data.description,
      ingredients: data.ingredients || [],
    },
  });

  return { food };
});

app.delete('/api/admin/foods/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { role } = request.user as any;
  
  if (role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Admin access required' });
  }

  const { id } = request.params as any;
  
  await prisma.food.delete({ where: { id } });

  return { success: true };
});

export default app;
