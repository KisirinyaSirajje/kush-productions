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
  const ugandanCategory = await prisma.category.findUnique({ where: { slug: 'ugandan-films' } });

  const channelVideos = [
    { id: '2FsOCsG9sI4', title: "Memories### from Kush films. A must watch u shouldn't miss." },
    { id: '4olip0cT3n0', title: '#SMAU MEMBER DOWN. Coming soon' },
    { id: '5SirTVKli4E', title: 'The Scar' },
    { id: '5wT0tYU8RtA', title: 'TILL DARK, dropping soon from Kushfilms and HBC Media Company' },
    { id: 'aggTXP-4qLw', title: 'Character building Kush cover Chris Evans maama wange.' },
    { id: 'b0RNjn5J2s0', title: '#THE MILK MAN OFICIAL MOVIE# Obulema Sibuteesobola. OWAMATA ASUBIDWA EBINTU. #KUSH FILMS UGANDA#' },
    { id: 'BB_GtSF5NJo', title: 'April 28, 2020' },
    { id: 'BPUT6I9SF8M', title: 'SINGLE AND STRUGGLING@KUSH FILMS UGANDA. MAAMA' },
    { id: 'CvPIZjgQewA', title: '"DADDY\'S DOLL" a must watch. @ kushfilms Uganda. kano kapya share, subscribe for more' },
    { id: 'dfpL0wVXblk', title: 'Tragic. AKATUBAGIRO. coming soon.' },
    { id: 'e3SQIoEKA8M', title: 'QUNUT PRAYER FROM MASJID JAMIA NDEJJE LUBUGUMU' },
    { id: 'Ext_l0Nv4Rg', title: 'Lwaki? movie (WHY?) dropping soon,,  don\'t Miss' },
    { id: 'fbH4-u60lQw', title: 'Just I like the improvement compared to the beginning.' },
    { id: 'fn0fCHb9a48', title: 'Laba omuzimu wegusse abantu in one night. Omuzimu caught on camera killing people. LAST NIGHT MOTAGE' },
    { id: 'GMsGQcCDfJ4', title: 'Behind the scenes new project (Trapped) don\'t miss' },
    { id: 'GoMHoO0wYe0', title: 'BE SILENT. Girl has been used by the uncle @Kush films Uganda. LABAKO' },
    { id: 'KHJ1he1KRJI', title: '#THE MILK MAN# MESSAGE DELIVERED #Ugandan skits. A must watch this so interesting coming soon.' },
    { id: 'QkKJWN_e4Wk', title: '#SMAU MEMBER DOWN#. STINGY MEN ASSOCIATION UGANDA IN TROUBLE A MUST WATCH' },
    { id: 'ruiLUhzXM2s', title: 'AM A VICTIM @ KUSH FILMS UGANDA. A must watch. uganda olemwa, see how a partraped his girl friend' },
    { id: 'SAbCit7NmwY', title: 'WITH YOU MOVIE# Kush films Uganda new movie. lover zone' },
    { id: 'Wxr06cNzb-I', title: '#SPEAK OUT# NEW KUSH BEST UGANDAN FILM' },
    { id: 'xIQjBNYAXKg', title: 'Think before you act. A must watch' },
    { id: 'xz6wFyNLhEQ', title: 'U don\'t need to miss this, watch, subscribe and share.' },
  ];

  const sampleMovies = channelVideos.map((video, index) => ({
    title: video.title,
    description: `Official video from the KUSH FILMS UGANDA YouTube channel: ${video.title}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
    duration: 600 + ((index % 4) * 60),
    releaseYear: 2020 + (index % 7),
    director: 'Kush Films Uganda',
    cast: [],
    language: 'Luganda',
    isFeatured: index < 8,
    categoryId: ugandanCategory?.id,
  }));

  for (const movieData of sampleMovies) {
    const { categoryId, ...data } = movieData;
    
    const existing = await prisma.movie.findFirst({
      where: { videoUrl: data.videoUrl },
    });

    if (existing) {
      const movie = await prisma.movie.update({
        where: { id: existing.id },
        data,
      });
      console.log('✅ Movie updated:', movie.title);
      continue;
    }

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

  // Create sample Foods
  const foods = [
    {
      name: 'Rolex',
      category: 'Street Food',
      price: 'UGX 3,000',
      location: 'Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      description: 'A popular Ugandan street food made with eggs and vegetables rolled in a chapati.',
      ingredients: ['Eggs', 'Chapati', 'Cabbage', 'Tomatoes', 'Onions'],
    },
    {
      name: 'Matooke',
      category: 'Traditional',
      price: 'UGX 5,000',
      location: 'Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      description: 'A traditional Ugandan dish made from steamed green bananas, often served with groundnut sauce.',
      ingredients: ['Green bananas', 'Groundnut sauce', 'Spices'],
    },
    {
      name: 'Luwombo',
      category: 'Main Course',
      price: 'UGX 15,000',
      location: 'Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      description: 'A royal delicacy of meat, chicken, or fish steamed in banana leaves with vegetables.',
      ingredients: ['Chicken', 'Banana leaves', 'Mushrooms', 'Peanut sauce', 'Vegetables'],
    },
    {
      name: 'Muchomo',
      category: 'Street Food',
      price: 'UGX 10,000',
      location: 'Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      description: 'Grilled meat skewers, a popular street food in Uganda often served with roasted plantains.',
      ingredients: ['Beef', 'Goat meat', 'Spices', 'Salt'],
    },
    {
      name: 'Kikomando',
      category: 'Street Food',
      price: 'UGX 2,500',
      location: 'Kampala, Uganda',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
      description: 'A beloved Ugandan dish consisting of beans and chapati, simple yet satisfying.',
      ingredients: ['Beans', 'Chapati', 'Onions', 'Tomatoes'],
    },
  ];

  for (const food of foods) {
    await prisma.food.create({
      data: food,
    });
    console.log('✅ Food created:', food.name);
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
