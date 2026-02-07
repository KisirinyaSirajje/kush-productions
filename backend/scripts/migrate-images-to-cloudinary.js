require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configure Cloudinary
console.log('Loading Cloudinary config...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localPath) {
  try {
    console.log(`  Uploading ${localPath}...`);
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'kush-films',
      resource_type: 'image',
    });
    console.log(`  ✓ Uploaded to: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`  ✗ Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

async function migrateMovieImages() {
  console.log('\n📽️  Migrating Movie Images...');
  
  const movies = await prisma.movie.findMany({
    where: {
      thumbnailUrl: {
        contains: 'localhost',
      },
    },
  });

  console.log(`Found ${movies.length} movies with localhost URLs\n`);

  for (const movie of movies) {
    console.log(`Processing: ${movie.title}`);
    
    // Extract filename from localhost URL
    const filename = movie.thumbnailUrl.split('/').pop();
    const localPath = path.join(__dirname, '../public/uploads', filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  File not found: ${localPath}`);
      continue;
    }

    const cloudinaryUrl = await uploadToCloudinary(localPath);
    
    if (cloudinaryUrl) {
      await prisma.movie.update({
        where: { id: movie.id },
        data: { thumbnailUrl: cloudinaryUrl },
      });
      console.log(`  ✓ Database updated\n`);
    }
  }
}

async function migrateFoodImages() {
  console.log('\n🍔 Migrating Food Images...');
  
  const foods = await prisma.food.findMany({
    where: {
      image: {
        contains: 'localhost',
      },
    },
  });

  console.log(`Found ${foods.length} foods with localhost URLs\n`);

  for (const food of foods) {
    console.log(`Processing: ${food.name}`);
    
    // Extract filename from localhost URL
    const filename = food.image.split('/').pop();
    const localPath = path.join(__dirname, '../public/uploads', filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  File not found: ${localPath}`);
      continue;
    }

    const cloudinaryUrl = await uploadToCloudinary(localPath);
    
    if (cloudinaryUrl) {
      await prisma.food.update({
        where: { id: food.id },
        data: { image: cloudinaryUrl },
      });
      console.log(`  ✓ Database updated\n`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Image Migration to Cloudinary...');
  console.log('===============================================');
  
  try {
    await migrateMovieImages();
    await migrateFoodImages();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
