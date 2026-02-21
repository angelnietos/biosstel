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
import { UserEntity } from '../../libs/backend/api-usuarios/src/infrastructure/persistence/UserEntity';
import { DashboardObjectiveEntity } from '../../libs/backend/api-objetivos/src/infrastructure/persistence/DashboardObjectiveEntity';
import { DashboardAlertEntity } from '../../libs/backend/api-objetivos/src/infrastructure/persistence/DashboardAlertEntity';
import { TerminalObjectiveEntity } from '../../libs/backend/api-objetivos/src/infrastructure/persistence/TerminalObjectiveEntity';
import { TerminalAssignmentEntity } from '../../libs/backend/api-objetivos/src/infrastructure/persistence/TerminalAssignmentEntity';
import { FichajeEntity } from '../../libs/backend/api-fichajes/src/infrastructure/persistence/FichajeEntity';
import { TaskEntity } from '../../libs/backend/api-fichajes/src/infrastructure/persistence/TaskEntity';
import { ClientEntity } from '../../libs/backend/api-usuarios/src/infrastructure/persistence/ClientEntity';

// Load .env from workspace root (env vars already set take precedence)
dotenv.config({ path: resolve(__dirname, '../../.env'), override: false });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const port = parseInt(process.env.DB_PORT || '5434', 10);
  const password = process.env.DB_PASSWORD || 'biosstel123';

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port,
    username: process.env.DB_USER || 'biosstel',
    password,
    database: process.env.DB_NAME || 'biosstel',
    entities: [
      UserEntity,
      DashboardObjectiveEntity,
      DashboardAlertEntity,
      TerminalObjectiveEntity,
      TerminalAssignmentEntity,
      FichajeEntity,
      TaskEntity,
    ],
    synchronize: true,
    extra: { ssl: false },
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
    const fichajeRepo = dataSource.getRepository(FichajeEntity);
    const taskRepo = dataSource.getRepository(TaskEntity);
    const clientRepo = dataSource.getRepository(ClientEntity);

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
        role: 'ADMIN',
      },
      {
        email: 'coordinador@biosstel.com',
        password: 'coord123',
        firstName: 'Coordinador',
        lastName: 'Test',
        isActive: true,
        role: 'COORDINADOR',
      },
      {
        email: 'telemarketing@biosstel.com',
        password: 'tm123',
        firstName: 'Telemarketing',
        lastName: 'User',
        isActive: true,
        role: 'TELEMARKETING',
      },
      {
        email: 'tienda@biosstel.com',
        password: 'tienda123',
        firstName: 'Tienda',
        lastName: 'User',
        isActive: true,
        role: 'TIENDA',
      },
      {
        email: 'comercial@biosstel.com',
        password: 'comercial123',
        firstName: 'Comercial',
        lastName: 'User',
        isActive: true,
        role: 'COMERCIAL',
      },
      {
        email: 'backoffice@biosstel.com',
        password: 'bo123',
        firstName: 'Backoffice',
        lastName: 'User',
        isActive: true,
        role: 'BACKOFFICE',
      },
      {
        email: 'usuario@biosstel.com',
        password: 'user123',
        firstName: 'Usuario',
        lastName: 'Prueba',
        isActive: true,
        role: 'COMERCIAL',
      },
    ];

    let adminUser: UserEntity | null = null;

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
          role: userData.role,
        });

        const savedUser = await userRepository.save(user);
        if (userData.email === 'admin@biosstel.com') {
          adminUser = savedUser;
        }
        console.log(`✅ Created user: ${userData.email} (Password: ${userData.password})`);
      }
    } else {
      console.log(`ℹ️  Users already exist (${existingUsers}). Ensuring admin password is correct...\n`);
      adminUser = await userRepository.findOne({ where: { email: 'admin@biosstel.com' } });
      if (adminUser) {
        const correctHash = await bcrypt.hash('admin123', 10);
        await userRepository.update(adminUser.id, { password: correctHash } as Partial<UserEntity>);
        console.log('✅ Updated admin@biosstel.com password to admin123');
      }
    }

    // ------------------------------
    // Seed Clients (idempotent)
    // ------------------------------
    const existingClients = await clientRepo.count();
    if (existingClients === 0) {
      console.log('📋 Seeding clients...\n');
      await clientRepo.save(
        clientRepo.create([
          { name: 'Cliente A', email: 'cliente.a@example.com', phone: '+34 600 111 222' },
          { name: 'Cliente B', email: 'cliente.b@example.com', phone: '+34 600 333 444' },
          { name: 'Cliente C', email: 'cliente.c@example.com' },
        ])
      );
      console.log('✅ Seeded 3 clients\n');
    } else {
      console.log(`ℹ️  Clients already exist (${existingClients}). Skipping.\n`);
    }

    // ------------------------------
    // Seed Fichajes (idempotent)
    // ------------------------------
    const existingFichajes = await fichajeRepo.count();
    if (existingFichajes === 0 && adminUser) {
        console.log('⏱️ Seeding fichajes...\n');
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        await fichajeRepo.save([
            fichajeRepo.create({
                userId: adminUser.id,
                date: today,
                startTime: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
                status: 'working',
                pauses: [],
                location: { lat: 40.4168, lng: -3.7038, address: 'Madrid, Spain' },
            })
        ]);
        console.log('✅ Seeded fichajes\n');
    }

    // ------------------------------
    // Seed Tasks (idempotent) – varios usuarios con tareas
    // ------------------------------
    const existingTasks = await taskRepo.count();
    if (existingTasks === 0) {
        console.log('✅ Seeding tasks...\n');
        const allUsers = await userRepository.find({ where: { isActive: true } });
        const taskTemplates: { title: string; description?: string; completed: boolean }[] = [
            { title: 'Revisar documentación', description: 'Verificar los requisitos del proyecto', completed: false },
            { title: 'Reunión de equipo', description: 'Daily standup', completed: true },
            { title: 'Llamada de seguimiento', description: 'Cliente potencial', completed: false },
            { title: 'Enviar propuesta comercial', completed: false },
            { title: 'Visita a tienda', description: 'Revisión de stock', completed: true },
            { title: 'Cierre de venta pendiente', completed: false },
            { title: 'Preparar informe semanal', completed: false },
            { title: 'Formación nuevo producto', completed: true },
        ];
        const tasksToInsert: Partial<TaskEntity>[] = [];
        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];
            const numTasks = 2 + (i % 4);
            for (let t = 0; t < numTasks; t++) {
                const tmpl = taskTemplates[(i + t) % taskTemplates.length];
                tasksToInsert.push({
                    userId: user.id,
                    title: tmpl.title,
                    description: tmpl.description,
                    completed: tmpl.completed,
                    ...(tmpl.completed ? { endTime: new Date() } : {}),
                });
            }
        }
        for (const t of tasksToInsert) {
            await taskRepo.save(taskRepo.create(t));
        }
        console.log(`✅ Seeded ${tasksToInsert.length} tasks for ${allUsers.length} users\n`);
    } else {
        console.log(`ℹ️  Tasks already seeded (${existingTasks}). Skipping.\n`);
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
          {
            title: 'Producto X',
            achieved: 57112,
            objective: 76110,
            accent: 'purple',
            isActive: true,
          },
        ])
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
        ])
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
      console.log('🎯 Seeding terminal objectives (contratos + puntos)...\n');

      const mk = (
        ob: { id: string },
        groupType: 'department' | 'person',
        groupTitle: string,
        sortOrder: number,
        label: string,
        value: number,
        total: number,
        ok: boolean
      ) =>
        assignmentRepo.create({
          terminalObjective: ob as any,
          groupType,
          groupTitle,
          sortOrder,
          label,
          value,
          total,
          ok,
        });

      const objContratos = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Objetivos Terminales (Contratos)',
          rangeLabel: 'Mes en curso 1 Enero - 27 Enero',
          achieved: 20000,
          objective: 89988,
          pct: 22,
          isActive: true,
          objectiveType: 'contratos',
          period: null,
        })
      );

      await assignmentRepo.save([
        mk(objContratos, 'department', 'Comercial', 1, 'Centro de trabajo 1', 120, 500, true),
        mk(objContratos, 'department', 'Comercial', 2, 'Centro de trabajo 2', 437, 500, true),
        mk(objContratos, 'department', 'Comercial', 3, 'Centro de trabajo 3', 757, 800, true),
        mk(objContratos, 'department', 'Comercial', 4, 'Centro de trabajo 4', 344, 500, false),
        mk(objContratos, 'department', 'Comercial', 5, 'Centro de trabajo 5', 419, 500, true),
        mk(objContratos, 'department', 'Departamento 2', 1, 'Centro de trabajo 1', 120, 500, true),
        mk(objContratos, 'department', 'Departamento 2', 2, 'Centro de trabajo 2', 437, 500, true),
        mk(objContratos, 'department', 'Tienda', 1, 'Centro de trabajo 1', 120, 500, true),
        mk(objContratos, 'department', 'Tienda', 2, 'Centro de trabajo 2', 437, 500, true),
        mk(objContratos, 'person', 'Comercial', 1, 'Isabella Torres', 12, 50, true),
        mk(objContratos, 'person', 'Comercial', 2, 'Maria Robledo', 37, 50, true),
        mk(objContratos, 'person', 'Comercial', 3, 'Lucia Martinez', 57, 80, true),
        mk(objContratos, 'person', 'Telemarketing', 1, 'Isabella Torres', 22, 50, true),
        mk(objContratos, 'person', 'Telemarketing', 2, 'Maria Robledo', 41, 50, true),
        mk(objContratos, 'person', 'Tienda', 1, 'Isabella Torres', 29, 50, true),
        mk(objContratos, 'person', 'Tienda', 2, 'Maria Robledo', 25, 50, true),
      ]);

      const objPuntos = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Objetivos Terminales (Puntos)',
          rangeLabel: 'Mes actual Febrero 2026',
          achieved: 18450,
          objective: 72000,
          pct: 26,
          isActive: true,
          objectiveType: 'puntos',
          period: null,
        })
      );

      await assignmentRepo.save([
        mk(objPuntos, 'department', 'Comercial', 1, 'Centro de trabajo 1', 2100, 8000, true),
        mk(objPuntos, 'department', 'Comercial', 2, 'Centro de trabajo 2', 5200, 8000, true),
        mk(objPuntos, 'department', 'Comercial', 3, 'Centro de trabajo 3', 6100, 9000, true),
        mk(objPuntos, 'department', 'Departamento 2', 1, 'Centro de trabajo 1', 2100, 8000, true),
        mk(objPuntos, 'department', 'Departamento 2', 2, 'Centro de trabajo 2', 5050, 8000, true),
        mk(objPuntos, 'department', 'Tienda', 1, 'Centro de trabajo 1', 2000, 7000, true),
        mk(objPuntos, 'department', 'Tienda', 2, 'Centro de trabajo 2', 5000, 7000, true),
        mk(objPuntos, 'person', 'Comercial', 1, 'Isabella Torres', 420, 600, true),
        mk(objPuntos, 'person', 'Comercial', 2, 'Maria Robledo', 380, 600, true),
        mk(objPuntos, 'person', 'Telemarketing', 1, 'Isabella Torres', 350, 500, true),
        mk(objPuntos, 'person', 'Tienda', 1, 'Isabella Torres', 290, 500, true),
      ]);

      // Histórico: Nov, Oct, Sep 2025 (period 0-indexed: 2025-10, 2025-09, 2025-08)
      const histContratosNov = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Contratos Nov 2025',
          rangeLabel: 'Noviembre 2025',
          achieved: 85000,
          objective: 89988,
          pct: 94,
          isActive: false,
          objectiveType: 'contratos',
          period: '2025-10',
        })
      );
      await assignmentRepo.save([
        mk(histContratosNov, 'department', 'Comercial', 1, 'Centro de trabajo 1', 500, 500, true),
        mk(histContratosNov, 'department', 'Comercial', 2, 'Centro de trabajo 2', 500, 500, true),
        mk(histContratosNov, 'department', 'Tienda', 1, 'Centro de trabajo 1', 480, 500, true),
      ]);
      const histPuntosNov = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Puntos Nov 2025',
          rangeLabel: 'Noviembre 2025',
          achieved: 68200,
          objective: 72000,
          pct: 95,
          isActive: false,
          objectiveType: 'puntos',
          period: '2025-10',
        })
      );
      await assignmentRepo.save([
        mk(histPuntosNov, 'department', 'Comercial', 1, 'Centro de trabajo 1', 8000, 8000, true),
        mk(histPuntosNov, 'department', 'Tienda', 1, 'Centro de trabajo 1', 7200, 7500, true),
      ]);
      const histContratosOct = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Contratos Oct 2025',
          rangeLabel: 'Octubre 2025',
          achieved: 78000,
          objective: 85000,
          pct: 92,
          isActive: false,
          objectiveType: 'contratos',
          period: '2025-09',
        })
      );
      await assignmentRepo.save([
        mk(histContratosOct, 'department', 'Comercial', 1, 'Centro de trabajo 1', 42000, 45000, true),
        mk(histContratosOct, 'department', 'Tienda', 1, 'Centro de trabajo 1', 36000, 40000, true),
      ]);
      const histPuntosOct = await terminalObjectiveRepo.save(
        terminalObjectiveRepo.create({
          title: 'Puntos Oct 2025',
          rangeLabel: 'Octubre 2025',
          achieved: 65100,
          objective: 70000,
          pct: 93,
          isActive: false,
          objectiveType: 'puntos',
          period: '2025-09',
        })
      );
      await assignmentRepo.save([
        mk(histPuntosOct, 'department', 'Comercial', 1, 'Centro de trabajo 1', 32000, 35000, true),
      ]);

      console.log('✅ Seeded terminal objectives + assignments (contratos + puntos + histórico)\n');
    } else {
      console.log(
        `ℹ️  Terminal objectives already seeded (${existingTerminalObjectives}). Skipping.\n`
      );
    }

    console.log('\n🎉 Seed completed successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run seed
seed().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
