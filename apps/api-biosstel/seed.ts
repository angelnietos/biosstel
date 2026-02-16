/**
 * Database Seed Script
 * Creates initial users for development/testing
 * 
 * Run with: tsx seed.ts
 */

import 'reflect-metadata';
import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@lib/api-users';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // Create DataSource
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'biosstel',
    password: process.env.DB_PASSWORD || 'biosstel123',
    database: process.env.DB_NAME || 'biosstel',
    entities: [UserEntity],
    synchronize: false,
    extra: {
      // Use md5 authentication method
      ssl: false,
    },
  });

  try {
    // Initialize connection
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    const userRepository = dataSource.getRepository(UserEntity);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log(`⚠️  Database already has ${existingUsers} users.`);
      console.log('   To reset, delete all users first.\n');
      await dataSource.destroy();
      return;
    }

    // Define seed users
    const seedUsers = [
      {
        email: 'admin@biosstel.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      },
      {
        email: 'coordinador@biosstel.com',
        password: 'coord123',
        firstName: 'Coordinador',
        lastName: 'Test',
        isActive: true,
      },
      {
        email: 'usuario@biosstel.com',
        password: 'user123',
        firstName: 'Usuario',
        lastName: 'Prueba',
        isActive: true,
      },
    ];

    console.log('📝 Creating seed users...\n');

    // Create users
    for (const userData of seedUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = userRepository.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: userData.isActive,
      });

      await userRepository.save(user);
      console.log(`✅ Created user: ${userData.email} (Password: ${userData.password})`);
    }

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📋 Users created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    seedUsers.forEach((user) => {
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Password: ${user.password}`);
      console.log(`   👤 Name: ${user.firstName} ${user.lastName}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

// Run seed
seed().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
