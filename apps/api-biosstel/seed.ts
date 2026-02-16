/**
 * Database Seed Script
 * Creates initial users for development/testing
 * 
 * Run with: pnpm db:seed
 */

import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../libs/backend/api-users/src/infrastructure/persistence/UserEntity';
import { DashboardObjectiveEntity } from '../../libs/backend/api-dashboard/src/infrastructure/persistence/DashboardObjectiveEntity';
import { DashboardAlertEntity } from '../../libs/backend/api-dashboard/src/infrastructure/persistence/DashboardAlertEntity';
import { TerminalObjectiveEntity } from '../../libs/backend/api-dashboard/src/infrastructure/persistence/TerminalObjectiveEntity';
import { TerminalAssignmentEntity } from '../../libs/backend/api-dashboard/src/infrastructure/persistence/TerminalAssignmentEntity';

// Load .env from workspace root
dotenv.config({ path: resolve(__dirname, '../../.env') });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // Create DataSource
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USER || 'biosstel',
    password: process.env.DB_PASSWORD || 'biosstel123',
    database: process.env.DB_NAME || 'biosstel',
    entities: [
      UserEntity,
      DashboardObjectiveEntity,
      DashboardAlertEntity,
      TerminalObjectiveEntity,
      TerminalAssignmentEntity,
    ],
    // Dev seed: ensure tables exist
    synchronize: true,
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
    const objectiveRepo = dataSource.getRepository(DashboardObjectiveEntity);
    const alertRepo = dataSource.getRepository(DashboardAlertEntity);
    const terminalObjectiveRepo = dataSource.getRepository(TerminalObjectiveEntity);
    const assignmentRepo = dataSource.getRepository(TerminalAssignmentEntity);

    // ------------------------------
    // Seed Users (idempotent)
    // ------------------------------
    const existingUsers = await userRepository.count();
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

    if (existingUsers === 0) {
      console.log('📝 Creating seed users...\n');

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
    } else {
      console.log(`ℹ️  Users already seeded (${existingUsers} users). Skipping users seed.\n`);
    }

    // ------------------------------
    // Seed Dashboard Objectives (idempotent)
    // ------------------------------
    const existingObjectives = await objectiveRepo.count();
    if (existingObjectives === 0) {
      console.log('🧩 Seeding dashboard objectives...\n');
      await objectiveRepo.save(
        objectiveRepo.create([
          {
            title: 'Terminales (Familia X)',
            achieved: 12867,
            objective: 34560,
            accent: 'maroon',
            href: '/objetivos-terminales',
            isActive: true,
          },
          { title: 'Familia Y', achieved: 10124, objective: 89988, accent: 'teal', isActive: true },
          { title: 'Familia', achieved: 37009, objective: 36134, accent: 'blue', isActive: true },
          { title: 'Producto X', achieved: 57112, objective: 76110, accent: 'purple', isActive: true },
        ]),
      );
      console.log('✅ Seeded dashboard objectives\n');
    } else {
      console.log(`ℹ️  Dashboard objectives already seeded (${existingObjectives}). Skipping.\n`);
    }

    // ------------------------------
    // Seed Dashboard Alerts (idempotent)
    // ------------------------------
    const existingAlerts = await alertRepo.count();
    if (existingAlerts === 0) {
      console.log('🚨 Seeding dashboard alerts...\n');
      await alertRepo.save(
        alertRepo.create([
          {
            usuario: 'Isabella Torres',
            departamento: 'Comercial',
            centroTrabajo: 'Barakaldo',
            rol: 'Tienda',
            estado: 'No ha fichado',
            statusType: 'no-fichado',
            sortOrder: 1,
            isActive: true,
          },
          {
            usuario: 'Maria Robledo',
            departamento: 'Comercial',
            centroTrabajo: 'Las Arenas',
            rol: 'Telemarketing',
            estado: 'No ha fichado',
            statusType: 'no-fichado',
            sortOrder: 2,
            isActive: true,
          },
          {
            usuario: 'Lucia Martinez',
            departamento: 'Comercial',
            centroTrabajo: 'Las Arenas',
            rol: 'Comercial',
            estado: 'No ha fichado',
            statusType: 'no-fichado',
            sortOrder: 3,
            isActive: true,
          },
          {
            usuario: 'Isabella Torres',
            departamento: 'Comercial',
            centroTrabajo: 'Barakaldo',
            rol: 'Comercial',
            estado: 'No ha fichado',
            statusType: 'no-fichado',
            sortOrder: 4,
            isActive: true,
          },
          {
            usuario: 'Maria Robledo',
            departamento: 'Comercial',
            centroTrabajo: 'Las Arenas',
            rol: 'Tienda',
            estado: 'No ha fichado',
            statusType: 'no-fichado',
            sortOrder: 5,
            isActive: true,
          },
          {
            usuario: 'Lucia Martinez',
            departamento: 'Comercial',
            centroTrabajo: 'Las Arenas',
            rol: 'Telemarketing',
            estado: 'Fichaje fuera de horario',
            statusType: 'fuera-horario',
            sortOrder: 6,
            isActive: true,
          },
          {
            usuario: 'Lucia Martinez',
            departamento: 'Comercial',
            centroTrabajo: 'Las Arenas',
            rol: 'Comercial',
            estado: 'Fichaje fuera de horario',
            statusType: 'fuera-horario',
            sortOrder: 7,
            isActive: true,
          },
        ]),
      );
      console.log('✅ Seeded dashboard alerts\n');
    } else {
      console.log(`ℹ️  Dashboard alerts already seeded (${existingAlerts}). Skipping.\n`);
    }

    // ------------------------------
    // Seed Terminal Objectives + Assignments (idempotent)
    // ------------------------------
    const existingTerminalObjectives = await terminalObjectiveRepo.count();
    if (existingTerminalObjectives === 0) {
      console.log('🎯 Seeding terminal objectives...\n');

      const terminalObjective = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Objetivos Terminales',
          rangeLabel: 'Mes en curso 1 Enero - 27 Enero',
          achieved: 20000,
          objective: 89988,
          pct: 15,
          isActive: true,
        }),
      );

      const mk = (
        groupType: 'department' | 'person',
        groupTitle: string,
        sortOrder: number,
        label: string,
        value: number,
        total: number,
        ok: boolean,
      ) =>
        assignmentRepo.create({
          terminalObjective,
          groupType,
          groupTitle,
          sortOrder,
          label,
          value,
          total,
          ok,
        });

      await assignmentRepo.save([
        // Departments
        mk('department', 'Comercial', 1, 'Centro de trabajo 1', 120, 500, true),
        mk('department', 'Comercial', 2, 'Centro de trabajo 2', 437, 500, true),
        mk('department', 'Comercial', 3, 'Centro de trabajo 3', 757, 800, true),
        mk('department', 'Comercial', 4, 'Centro de trabajo 4', 344, 500, false),
        mk('department', 'Comercial', 5, 'Centro de trabajo 5', 419, 500, true),

        mk('department', 'Departamento 2', 1, 'Centro de trabajo 1', 120, 500, true),
        mk('department', 'Departamento 2', 2, 'Centro de trabajo 2', 437, 500, true),
        mk('department', 'Departamento 2', 3, 'Centro de trabajo 3', 757, 800, true),
        mk('department', 'Departamento 2', 4, 'Centro de trabajo 4', 344, 500, false),
        mk('department', 'Departamento 2', 5, 'Centro de trabajo 5', 419, 500, true),

        mk('department', 'Tienda', 1, 'Centro de trabajo 1', 120, 500, true),
        mk('department', 'Tienda', 2, 'Centro de trabajo 2', 437, 500, true),
        mk('department', 'Tienda', 3, 'Centro de trabajo 3', 757, 800, true),
        mk('department', 'Tienda', 4, 'Centro de trabajo 4', 344, 500, false),
        mk('department', 'Tienda', 5, 'Centro de trabajo 5', 419, 500, true),

        // People
        mk('person', 'Comercial', 1, 'Isabella Torres', 12, 50, true),
        mk('person', 'Comercial', 2, 'Maria Robledo', 37, 50, true),
        mk('person', 'Comercial', 3, 'Lucia Martinez', 57, 80, true),
        mk('person', 'Comercial', 4, 'Sofia González', 44, 50, false),
        mk('person', 'Comercial', 5, 'Diego Rodríguez', 19, 50, true),

        mk('person', 'Telemarketing', 1, 'Isabella Torres', 22, 50, true),
        mk('person', 'Telemarketing', 2, 'Maria Robledo', 41, 50, true),
        mk('person', 'Telemarketing', 3, 'Lucia Martinez', 92, 150, true),

        mk('person', 'Tienda', 1, 'Isabella Torres', 29, 50, true),
        mk('person', 'Tienda', 2, 'Maria Robledo', 25, 50, true),
        mk('person', 'Tienda', 3, 'Lucia Martinez', 8, 50, false),
      ]);

      console.log('✅ Seeded terminal objectives + assignments\n');
    } else {
      console.log(`ℹ️  Terminal objectives already seeded (${existingTerminalObjectives}). Skipping.\n`);
    }

    console.log('\n🎉 Seed completed successfully!\n');

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
