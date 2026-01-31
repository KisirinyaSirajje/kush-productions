import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kushfilms.com' },
    update: {},
    create: {
      email: 'admin@kushfilms.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Action', slug: 'action', order: 1 },
    { name: 'Comedy', slug: 'comedy', order: 2 },
    { name: 'Drama', slug: 'drama', order: 3 },
    { name: 'Romance', slug: 'romance', order: 4 },
    { name: 'Thriller', slug: 'thriller', order: 5 },
    { name: 'Horror', slug: 'horror', order: 6 },
    { name: 'Documentary', slug: 'documentary', order: 7 },
    { name: 'Ugandan Films', slug: 'ugandan-films', order: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created:', categories.length);

  // Create sample movies
  const actionCategory = await prisma.category.findUnique({ where: { slug: 'action' } });
  const comedyCategory = await prisma.category.findUnique({ where: { slug: 'comedy' } });
  const ugandanCategory = await prisma.category.findUnique({ where: { slug: 'ugandan-films' } });

  const sampleMovies = [
    {
      title: 'The Quest for Kampala',
      description: 'An epic action adventure set in modern-day Kampala, following a hero on a mission to save the city.',
      thumbnailUrl: 'https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Quest+for+Kampala',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 596,
      releaseYear: 2024,
      director: 'John Ssempa',
      cast: ['Actor One', 'Actor Two'],
      language: 'English',
      isFeatured: true,
      categoryId: actionCategory?.id,
    },
    {
      title: 'Laughter in Entebbe',
      description: 'A hilarious comedy about a group of friends navigating life in Entebbe with humor and heart.',
      thumbnailUrl: 'https://via.placeholder.com/300x450/4ECDC4/FFFFFF?text=Laughter+Entebbe',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 654,
      releaseYear: 2024,
      director: 'Mary Nakato',
      cast: ['Comic One', 'Comic Two'],
      language: 'Luganda',
      isFeatured: true,
      categoryId: comedyCategory?.id,
    },
    {
      title: 'Heart of Uganda',
      description: 'A touching documentary exploring the rich culture and traditions of Uganda.',
      thumbnailUrl: 'https://via.placeholder.com/300x450/95E1D3/FFFFFF?text=Heart+of+Uganda',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 15,
      releaseYear: 2023,
      director: 'Peter Mukasa',
      cast: [],
      language: 'English',
      isFeatured: false,
      categoryId: ugandanCategory?.id,
    },
  ];

  for (const movieData of sampleMovies) {
    const { categoryId, ...data } = movieData;
    
    const movie = await prisma.movie.create({
      data: {
        ...data,
        categories: categoryId ? {
          create: {
            category: { connect: { id: categoryId } },
          },
        } : undefined,
      },
    });
    console.log('✅ Movie created:', movie.title);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
