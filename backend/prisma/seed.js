import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);
  const ownerPassword = await bcrypt.hash('Owner@123', 10);

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ratestore.com' },
    update: {},
    create: {
      fullName: 'System Administrator User Account',
      email: 'admin@ratestore.com',
      password: adminPassword,
      role: 'ADMIN',
      address: '123 Admin Street, Tech City'
    }
  });

  const storeOwner1 = await prisma.user.upsert({
    where: { email: 'owner1@ratestore.com' },
    update: {},
    create: {
      fullName: 'John Michael Store Owner Executive',
      email: 'owner1@ratestore.com',
      password: ownerPassword,
      role: 'STORE_OWNER',
      address: '456 Business Ave, Commerce District'
    }
  });

  const storeOwner2 = await prisma.user.upsert({
    where: { email: 'owner2@ratestore.com' },
    update: {},
    create: {
      fullName: 'Sarah Elizabeth Retail Manager Director',
      email: 'owner2@ratestore.com',
      password: ownerPassword,
      role: 'STORE_OWNER',
      address: '789 Market Street, Retail Park'
    }
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@ratestore.com' },
    update: {},
    create: {
      fullName: 'Alex James Thompson Regular Customer',
      email: 'user1@ratestore.com',
      password: userPassword,
      role: 'USER',
      address: '321 Residential Lane, Suburb Area'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@ratestore.com' },
    update: {},
    create: {
      fullName: 'Emily Rose Davis Shopping Enthusiast',
      email: 'user2@ratestore.com',
      password: userPassword,
      role: 'USER',
      address: '654 Home Boulevard, Family Zone'
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user3@ratestore.com' },
    update: {},
    create: {
      fullName: 'Michael Robert Johnson Consumer Advocate',
      email: 'user3@ratestore.com',
      password: userPassword,
      role: 'USER',
      address: '987 Apartment Complex, Urban Center'
    }
  });

  console.log('✅ Users created');

  // Create stores
  const store1 = await prisma.store.create({
    data: {
      storeName: 'Fresh Mart Supermarket',
      email: 'freshmart@ratestore.com',
      address: '100 Main Street, Downtown District',
      ownerId: storeOwner1.id
    }
  });

  const store2 = await prisma.store.create({
    data: {
      storeName: 'Tech Haven Electronics',
      email: 'techhaven@ratestore.com',
      address: '200 Innovation Drive, Tech Park',
      ownerId: storeOwner1.id
    }
  });

  const store3 = await prisma.store.create({
    data: {
      storeName: 'Bookworm Paradise',
      email: 'bookworm@ratestore.com',
      address: '300 Library Road, Education Quarter',
      ownerId: storeOwner2.id
    }
  });

  const store4 = await prisma.store.create({
    data: {
      storeName: 'Green Leaf Pharmacy',
      email: 'greenleaf@ratestore.com',
      address: '400 Health Avenue, Medical Center',
      ownerId: storeOwner2.id
    }
  });

  const store5 = await prisma.store.create({
    data: {
      storeName: 'Coffee Corner Café',
      email: 'coffeecorner@ratestore.com',
      address: '500 Brew Street, Coffee District',
      ownerId: storeOwner1.id
    }
  });

  console.log('✅ Stores created');

  // Create ratings
  const ratings = [
    { userId: user1.id, storeId: store1.id, rating: 5 },
    { userId: user1.id, storeId: store2.id, rating: 4 },
    { userId: user1.id, storeId: store3.id, rating: 5 },
    { userId: user2.id, storeId: store1.id, rating: 4 },
    { userId: user2.id, storeId: store4.id, rating: 5 },
    { userId: user2.id, storeId: store5.id, rating: 4 },
    { userId: user3.id, storeId: store1.id, rating: 5 },
    { userId: user3.id, storeId: store2.id, rating: 5 },
    { userId: user3.id, storeId: store3.id, rating: 4 },
    { userId: user3.id, storeId: store4.id, rating: 5 },
    { userId: user3.id, storeId: store5.id, rating: 5 },
  ];

  for (const rating of ratings) {
    await prisma.rating.create({
      data: rating
    });
  }

  console.log('✅ Ratings created');
  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('Admin: admin@ratestore.com / Admin@123');
  console.log('Store Owner: owner1@ratestore.com / Owner@123');
  console.log('User: user1@ratestore.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
